# Grant Benham academic website

A responsive, static Astro website for Grant Benham, Ph.D. Built for GitHub Pages, with eight main pages, client-side publication and presentation archives, local fonts, and structured JSON content. No database, analytics, remote fonts, or runtime credentials are needed.

**Status:** initial implementation for review. A review copy is prepared for GitHub; the website has not been published. The CV is the academic source; six Weebly pages and 75 assets have been archived, and 47 alumni photos plus 16 presentation PDFs have been migrated. See [content review](docs/CONTENT-REVIEW.md).

## Review the design

Open [the screenshot preview](docs/PREVIEW.md) directly on GitHub to see all eight pages, including desktop/mobile homepage views. Screenshots do not publish the website.

## Run locally

Use Node.js 24 (see `.nvmrc`) and npm. In this checkout:

```sh
npm ci
npm run dev
```

The local server prints the site address; the site now serves at the root path. The npm scripts use POSIX environment-variable syntax, suitable for this cloud workspace, Linux, macOS, and Windows through WSL or Git Bash.

```sh
npm run check
npm run build
npm test
```

The build also checks every generated local link, asset reference, fragment, and duplicate ID. Browser tests check archives, keyboard/mobile navigation, responsive overflow, CV download, and automated WCAG accessibility rules. Tests use `/usr/bin/chromium` when available. Otherwise install Chromium with `npx playwright install chromium` (CI installs system prerequisites too).

`npm run preview` serves the built site. `.npmrc` puts npm's cache in `/tmp/benham-npm-cache`, and scripts disable optional Astro telemetry for the restricted cloud home directory.

## Identity and hosting

All identity, navigation, lab naming, professional links, portrait/CV paths, and hosting settings live in [`src/config.ts`](src/config.ts). Changing `labName` updates the homepage and lab page together.

The repository was renamed by the owner to **`GrantBenham/GrantBenham.github.io`**. Hosting is configured for `https://grantbenham.github.io/`, with an empty `site.base`. The local checkout folder remains `/workspace/github.io`; this folder name does not determine the public URL.

If you later use a project repository, set the appropriate base path in `src/config.ts`. All local links and asset paths use the centralized settings.

## Editing

See [content editing](docs/EDITING.md) for publications, presentations, software, alumni, and images. Data is validated with Zod during the build. Unpublished manuscripts and accepted-but-unpresented conference entries are not permitted in the public archive schemas.

- `src/data/publications.json`: published citations, DOI identifiers, topics, featured selection.
- `src/data/presentations.json`: conference entries, optional local PDF and thumbnail paths.
- `src/data/software.json`: verified software descriptions and links.
- `src/data/alumni.json`: 47 past members with caption-verified photographs.
- `src/data/academic.json`: education, appointments, selected awards, courses.
- `public/documents/`: downloadable CV.
- `public/images/`, `public/posters/`, `public/presentations/`: images and presentation assets.

The DOCX CV download is the original supplied document, including its separate unpublished-work section. No unpublished items have been imported into the website's publication archive. Review whether you want that section retained in the downloadable CV before publication.

## GitHub setup and publication

See [GitHub Pages guide](docs/GITHUB-PAGES.md). Validation runs on pushes to `main` and pull requests. **Deployment is manual only**, and requires the reviewer to run the workflow on `main` with the input `PUBLISH`. Merely pushing a commit does not trigger this deployment workflow.

This workspace initially had an unborn local `work` branch. No initial commit or remote branches existed at inspection. The owner authorized uploading the review copy to GitHub. Publishing requires explicit approval; neither build nor tests publish anything.

## Migrate the old website without recreating it

The source is `https://stresslab.weebly.com/`, without `www`. Cloud source access now works. To collect a fresh source archive:

```sh
python3 scripts/migrate-weebly.py
```

If access remains blocked, run that same script on a computer that can open the old website. It saves original HTML, readable page text, discoverable images/PDFs, metadata, checksums, and a ZIP archive for transfer. It does not modify or publish the new site. See [migration instructions](docs/MIGRATION.md). Source archives are ignored by Git and never automatically copied into public output.
