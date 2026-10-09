#!/usr/bin/env python3
"""Collect original Weebly pages/media for review. Never edits public website files."""
import argparse
from collections import deque
from datetime import datetime, timezone
from hashlib import sha256
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlsplit, urlunsplit, unquote
from urllib.request import Request, urlopen
import zipfile

SOURCE = 'https://stresslab.weebly.com/'
SITE_HOSTS = {'stresslab.weebly.com', 'www.stresslab.weebly.com'}
MEDIA_HOSTS = SITE_HOSTS | {'cdn2.editmysite.com', 'cdn1.editmysite.com', 'cdn11.weebly.com'}
EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg', '.pdf', '.doc', '.docx'}
MAX_BYTES = 40 * 1024 * 1024


def absolute(value, base):
    url = urlsplit(urljoin(base, value.strip()))
    if url.scheme not in {'http', 'https'} or not url.hostname or url.username or url.password:
        return None
    if url.hostname not in MEDIA_HOSTS or url.port not in {None, 80, 443}:
        return None
    # Original Weebly links may use HTTP. Always request HTTPS with TLS verification.
    return urlunsplit(('https', url.hostname, url.path or '/', url.query, ''))


def media_url(value, base):
    url = absolute(value, base)
    return url if url and Path(urlsplit(url).path).suffix.lower() in EXTENSIONS else None


class Page(HTMLParser):
    def __init__(self, base):
        super().__init__(convert_charrefs=True)
        self.base, self.links, self.assets, self.images, self.text = base, [], set(), [], []
        self.skip = 0

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag in {'script', 'style', 'noscript'}:
            self.skip += 1
        if tag == 'a' and attrs.get('href'):
            link = absolute(attrs['href'], self.base)
            if link:
                self.links.append(link)
                if media_url(link, self.base):
                    self.assets.add(link)
        if tag == 'img':
            source = attrs.get('src') or attrs.get('data-src') or attrs.get('data-original', '')
            image = media_url(source, self.base)
            if image:
                self.images.append({'url': image, 'alt': attrs.get('alt', ''), 'title': attrs.get('title', '')})
                self.assets.add(image)
        for key in ('src', 'data-src', 'data-original', 'data-image', 'href'):
            found = media_url(attrs.get(key, ''), self.base)
            if found:
                self.assets.add(found)
        for key in ('srcset', 'data-srcset'):
            for item in attrs.get(key, '').split(','):
                parts = item.strip().split()
                found = media_url(parts[0], self.base) if parts else None
                if found:
                    self.assets.add(found)
        for match in re.finditer(r'url\(\s*[\'"]?([^\)\'"\s]+)', attrs.get('style', '')):
            found = media_url(match.group(1), self.base)
            if found:
                self.assets.add(found)
        if tag in {'p', 'div', 'br', 'h1', 'h2', 'h3', 'li', 'figcaption'}:
            self.text.append('\n')

    def handle_endtag(self, tag):
        if tag in {'script', 'style', 'noscript'}:
            self.skip = max(0, self.skip - 1)
        if tag in {'p', 'div', 'h1', 'h2', 'h3', 'li', 'figcaption'}:
            self.text.append('\n')

    def handle_data(self, data):
        if not self.skip:
            self.text.append(data)

    def readable_text(self):
        return '\n'.join(line.strip() for line in ''.join(self.text).splitlines() if line.strip())


def fetch(url):
    request = Request(url, headers={'User-Agent': 'AcademicSiteMigration/1.0 (site-owner archival copy)'})
    with urlopen(request, timeout=25) as response:
        final = response.geturl()
        if urlsplit(final).scheme != 'https' or urlsplit(final).hostname not in MEDIA_HOSTS:
            raise ValueError(f'Unexpected redirect destination: {final}')
        data = response.read(MAX_BYTES + 1)
        if len(data) > MAX_BYTES:
            raise ValueError('File exceeds the 40 MiB archival limit')
        return data, response.headers.get_content_type(), final


def safe_name(url, default):
    name = unquote(Path(urlsplit(url).path).name) or default
    name = re.sub(r'[^A-Za-z0-9._-]', '-', name)[:150]
    return f'{sha256(url.encode()).hexdigest()[:12]}-{name}'


def self_test():
    page = Page(SOURCE)
    page.feed('<h1>Alumni</h1><p>Verified Name</p><img src="/uploads/1/name.jpg" alt="Verified Name"><a href="/conference.html">Conference</a><a href="/uploads/1/poster.pdf">Poster</a><div style="background-image:url(\'/uploads/1/background.png\')"></div><script>ignored()</script>')
    assert page.images[0]['alt'] == 'Verified Name'
    assert len(page.assets) == 3
    assert SOURCE+'conference.html' in page.links
    assert 'Verified Name' in page.readable_text() and 'ignored()' not in page.readable_text()
    assert absolute('javascript:alert(1)', SOURCE) is None
    assert absolute('https://other.example/photo.jpg', SOURCE) is None
    assert absolute('http://stresslab.weebly.com/uploads/a.jpg', SOURCE).startswith('https://')
    print('Migration parser, media discovery, source-host restrictions, and HTTPS normalization passed.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, help='New output directory (must not already exist)')
    parser.add_argument('--max-pages', type=int, default=150)
    parser.add_argument('--self-test', action='store_true')
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return 0
    if args.max_pages < 1:
        parser.error('--max-pages must be positive')
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    output = args.output or Path('.migration') / f'weebly-{stamp}'
    if output.exists() or output.with_suffix('.zip').exists():
        parser.error('Output already exists; choose a new directory to preserve earlier work')
    (output / 'pages').mkdir(parents=True)
    (output / 'assets').mkdir()
    manifest = {'source': SOURCE, 'collected_utc': stamp, 'pages': [], 'assets': [], 'errors': [], 'notes': ['Original source archive for review; not public website content.', 'Only discoverable public site pages and approved-host media are collected; JavaScript-only galleries or private files may require a Weebly export.']}
    queue, seen, assets = deque([SOURCE]), set(), set()
    while queue and len(seen) < args.max_pages:
        url = queue.popleft()
        if url in seen:
            continue
        seen.add(url)
        print(f'Page {len(seen)}: {url}', flush=True)
        try:
            data, content_type, final = fetch(url)
            if content_type != 'text/html':
                raise ValueError(f'Expected HTML, received {content_type}')
            html = data.decode('utf-8', errors='replace')
            page = Page(final)
            page.feed(html)
            name = safe_name(url, 'index.html')
            if not name.endswith('.html'):
                name += '.html'
            relative = Path('pages') / name
            (output / relative).write_bytes(data)
            (output / relative.with_suffix('.txt')).write_text(page.readable_text(), encoding='utf-8')
            manifest['pages'].append({'url': url, 'final_url': final, 'file': relative.as_posix(), 'sha256': sha256(data).hexdigest(), 'links': page.links, 'images': page.images})
            assets.update(page.assets)
            for link in page.links:
                parsed = urlsplit(link)
                if parsed.hostname not in SITE_HOSTS or parsed.query:
                    continue
                suffix = Path(parsed.path).suffix.lower()
                if suffix in {'', '.html', '.htm'} and link not in seen and link not in queue:
                    queue.append(link)
        except (HTTPError, URLError, OSError, ValueError) as error:
            print(f'  Failed: {error}', flush=True)
            manifest['errors'].append({'url': url, 'error': str(error)})
    if queue:
        manifest['errors'].append({'error': 'Page limit reached', 'remaining_urls': list(queue)})
    for number, url in enumerate(sorted(assets), 1):
        print(f'Asset {number}/{len(assets)}: {url}', flush=True)
        try:
            data, content_type, final = fetch(url)
            if content_type == 'text/html':
                raise ValueError('Expected media, received an HTML page')
            relative = Path('assets') / safe_name(url, 'asset')
            (output / relative).write_bytes(data)
            manifest['assets'].append({'url': url, 'final_url': final, 'file': relative.as_posix(), 'content_type': content_type, 'bytes': len(data), 'sha256': sha256(data).hexdigest()})
        except (HTTPError, URLError, OSError, ValueError) as error:
            manifest['errors'].append({'url': url, 'error': str(error)})
            print(f'  Failed: {error}', flush=True)
    (output / 'manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False)+'\n', encoding='utf-8')
    (output / 'README.txt').write_text('Original Weebly source archive. Review manifest.json for source URLs, captions/alt text, checksums, and any failed downloads. HTML is preserved as source, not copied into the new website. Do not publish this archive wholesale.\n', encoding='utf-8')
    archive = output.with_suffix('.zip')
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for file in sorted(output.rglob('*')):
            if file.is_file():
                zip_file.write(file, arcname=(Path(output.name) / file.relative_to(output)).as_posix())
    print(f"Collected {len(manifest['pages'])} pages and {len(manifest['assets'])} assets; {len(manifest['errors'])} errors.")
    print(f'Archive: {archive.resolve()}')
    return 2 if manifest['errors'] else 0


if __name__ == '__main__':
    sys.exit(main())
