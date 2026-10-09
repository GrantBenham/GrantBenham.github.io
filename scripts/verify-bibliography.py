"""Retrieve Crossref DOI records; preserve partial outcomes without changing site data."""
import json
from pathlib import Path
import time
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.request import Request, urlopen

entries = json.loads(Path('src/data/publications.json').read_text())
cache_path = Path('docs/bibliography-records.json')
cached = json.loads(cache_path.read_text()) if cache_path.exists() else []
cache = {r['id']: r for r in cached if r['status'] == 'retrieved'}
results = []
for entry in entries:
    if not entry['doi']:
        results.append({'id': entry['id'], 'status': 'no DOI supplied'})
        continue
    prior = cache.get(entry['id'])
    if prior and prior.get('doi', '').lower() == entry['doi'].lower():
        results.append(prior)
        continue
    time.sleep(1.5)
    for attempt in range(2):
        try:
            req = Request('https://api.crossref.org/works/' + quote(entry['doi'], safe=''),
                          headers={'User-Agent': 'GrantBenhamAcademicWebsite/1.0 (mailto:grant.benham@utrgv.edu)'})
            with urlopen(req, timeout=25) as response:
                data = json.load(response)['message']
            results.append({'id': entry['id'], 'status': 'retrieved', 'doi': data.get('DOI'),
                            'title': data.get('title'), 'journal': data.get('container-title'),
                            'print': data.get('published-print'), 'online': data.get('published-online'),
                            'issued': data.get('issued'), 'volume': data.get('volume'),
                            'issue': data.get('issue'), 'page': data.get('page')})
            break
        except HTTPError as error:
            if error.code == 429 and attempt == 0:
                time.sleep(5)
                continue
            results.append({'id': entry['id'], 'status': 'failed', 'error': str(error)})
            break
        except Exception as error:
            results.append({'id': entry['id'], 'status': 'failed', 'error': str(error)})
            break
Path('bibliography-report.json').write_text(json.dumps(results, indent=2) + '\n')
print('::notice title=Bibliography report::' + json.dumps(results).replace('%', '%25'))
print(f"Retrieved {sum(r['status'] == 'retrieved' for r in results)} DOI records; "
      f"{sum(r['status'] == 'failed' for r in results)} lookups failed.")
