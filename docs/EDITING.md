# Edit website content

Run `npm run check` and `npm run build` after editing. Data schemas in `src/data/content.ts` reject missing fields, invalid publication states, unsupported types, malformed DOIs, and duplicate IDs. Keep IDs stable so links to individual entries survive edits.

## Site identity and lab name

Edit `src/config.ts`. Keep all site-wide identity and hosting settings there. Page-specific content belongs in the pages or data files. Change `labName` to rename the lab throughout the site. Local URLs use `localUrl()`; do not hard-code `/github.io/` in page markup.

## Add a publication

Add an object to `src/data/publications.json`, using the existing entries as the schema reference:

- `id`: a permanent, unique lowercase identifier.
- `year`, `authors`, `title`, `citation`: exact bibliographic information from the accepted published version. The full citation includes authors, year, title, journal/book, volume, issue where applicable, and pages/article number.
- `doi`: the identifier alone, such as the exact string after `https://doi.org/`, or `null` if absent or uncertain. Never invent a DOI.
- `type`: `Journal article`, `Book chapter`, or `Other scholarly publication`.
- `topics`: editorial tags; use existing topic strings for consistency. An empty array is allowed.
- `featured`: `true` only for the small manually curated selection shown on Research; ordinarily `false`.
- `status`: must be `published`.
- `source`: provenance for the citation.
- `reviewNote`: `null` normally; a concise public note if a bibliographic detail needs clarification. Internal review issues belong in `docs/CONTENT-REVIEW.md`.

Use `null` without quotes for missing optional fields. Entries sort by year automatically. The archive does not include article PDF fields. Do not add under-review or in-preparation manuscripts to this data.

## Add a presentation and upload its files

Add an object to `src/data/presentations.json` with `id`, `year`, `month`, `authors`, `title`, `conference`, `format`, `citation`, `topics`, `source`, and `status: "presented"`. `format` is `Poster`, `Paper`, or `Symposium`. Preserve faculty-advisor attribution for student presentations whose authors do not include Grant Benham.

`pdf` and `thumbnail` are `null` until files are available. Add PDFs to `public/presentations/` and thumbnails to `public/posters/`, then set paths beginning `/presentations/` and `/posters/`, without the hosting base. Use filenames with letters, numbers, hyphens, and extensions. For example, choose a filename derived from a **real** entry's stable ID. Do not create a fictitious entry to demonstrate the feature.

GitHub's browser editor can upload files through **Add file → Upload files** in those folders; update the corresponding JSON record afterward. This is an editorial upload workflow, not a public upload form or server.

The page automatically shows the thumbnail, a download link, and a collapsible in-browser PDF viewer. The viewer loads the file only when opened, and has a direct-link fallback for browsers without PDF support. Upload only files you have permission to distribute. The build checks that referenced files exist. Use reasonably compressed PDFs and thumbnails, and test the actual viewer once files are added.

## Add software

Edit `src/data/software.json`. Each record has `id`, `name`, `category`, `description`, `repository`, `documentation`, `application`, `source`, and `reviewNote`. Missing links are `null`; links must use HTTPS. Verify a hosted application's address and that it opens the intended application before adding it. Link to repositories or documentation without claiming that their capabilities were independently tested.

## Add alumni

Edit `src/data/alumni.json`. Each record needs:

- `id`, `name`, and `source`.
- `years`: verified lab years, or `null`.
- `photo`: a local `/images/…` path, or `null`.
- `photoAlt`: useful alt text, or `null` to use the person's name.
- `description`: a verified short biography, or `null`.
- `linkedin`: the matching HTTPS LinkedIn profile URL, or `null`.

The gallery never labels alumni as current members. Use approved names, photographs, and biographies. A missing photo displays a neutral “Photograph forthcoming” tile for the verified person. Never infer full names, lab dates, current jobs, or current membership from initials on conference citations.

## Portrait, CV, and image sizes

The current portrait is a verified 651 × 800 original recovered from Weebly, optimized into 600- and 320-pixel WebP variants. It differs from the newer portrait shown in chat. Replace it with that supplied portrait when its original becomes available as a file. Set `portrait`, `portraitSmall`, `portraitWidth`, and `portraitHeight` in `src/config.ts` to the actual output dimensions. A portrait around 640 pixels wide is sufficient for this modest homepage image. Compress it to WebP or AVIF and keep explicit dimensions; the CSS scales it to fit desktop/mobile layouts.

For alumni, create approximately 640 × 640 pixel WebP images, with approved crops. Poster thumbnails should keep the poster's aspect ratio and can be about 360 pixels wide; CSS fits them without cropping. Large original photos and research assets belong in a local source archive rather than the shipped website.

Replace the CV under `public/documents/`, and update its label and path in the site configuration. PDF is supported if an approved PDF is available; the initial download is the original DOCX supplied by the owner.

Alumni `linkedin` fields contain the HTTPS profile link, or `null` when no matching profile is known. Linked photos use this field. Home includes the academic biography and contact details; the old About address redirects to that section.

## Publication abstracts

`src/data/publication-abstracts.json` contains full supplied abstract/summary text linked by `publicationId`, the stable ID in `src/data/publications.json`. `abstract` holds the complete text; `text_type` distinguishes a published abstract, author Summary, or study summary. Import new text only after matching the DOI or confirming an exact title. Do not change publication years or citations from abstract-source metadata. Entries without supplied abstracts have no disclosure control. The Publications archive displays DOI and title-targeted Scholar links, with topic metadata retained for filtering but no topic badges.
