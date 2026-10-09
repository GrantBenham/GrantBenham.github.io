# Content review before publication

## Source provenance

The October 2026 CV supplied by the owner is the primary source for academic and bibliographic content. Document contents were treated as source material, not instructions. There were no project instructions in the empty repository.

- Imported **32 published works** from the CV's Published section.
- Imported **122 presentations** from its Presentations section, plus **one 2007 conference teaching poster** found only in Teaching Presentations Given: **123 entries** total. Student presentations with Grant Benham as faculty advisor are retained with that attribution.
- Excluded all five manuscripts listed under In Preparation, including those labeled under review. No unpublished manuscripts are in the public publication archive.
- Copied the original supplied DOCX as the downloadable CV. That original still contains its own unpublished-work section. Decide whether to supply a public CV with that section removed; no edits to the original document were made.
- Recovered the original Weebly portrait (651 × 800 pixels) from its verified original-image URL and optimized it to 600- and 320-pixel WebP variants. It differs from the newer portrait shown in chat, whose original is not available as a file in this workspace. The CV portrait was used only during initial development, then replaced.
- Education, appointments, honors, and teaching experience derive from the CV. Awards are a selected list; the 2018 Regents' award **nomination** is not described as an award win.
- Undergraduate versus graduate classifications are explicit in the CV for Research Methods, Internship, and Research Design. Advanced Research Seminar's level is unspecified, so it is listed separately.
- Research-topic tags and featured selections are editorial organization, not supplied bibliographic metadata or an assertion of impact.

## Bibliographic questions

1. **2006 stimulant-use article:** the CV lists `10.1080/10550887.2010.509273`, which appears inconsistent with the cited 2006 Hispanic Health Care International article. Its DOI link is withheld pending authoritative verification. The full CV citation is preserved.
2. **Online versus issue publication years:** several entries use an earlier year than their issue volume suggests (e.g. Sleep Paralysis, 2020 / volume 70(5); stress and negative affect, 2018 / volume 35(1); crowdsourcing measures, 2016 / volume 49(1)). The archive preserves the CV's years rather than silently changing them. Review against publisher records before deciding on a consistent convention.
3. Other DOI identifiers are transcribed from the CV and normalized to HTTPS DOI links. They have **not all been independently resolved**. Do not describe them as publisher-verified until that review is done.
4. Conference citations are preserved in full, including awards and faculty-advisor notes. Titles and conferences are extracted into separate searchable fields. Review transcription against the CV, especially older entries and advisor-only student presentations.
5. Some 2020 conference entries are listed as presented in the CV; actual format/cancellation status was not independently checked. Confirm if they need annotation. Accepted-but-not-yet-presented entries should not be imported as presented.

## Weebly migration completed; specific review items remain

The network initially denied the Weebly address; after the domain configuration changed, a fresh request succeeded. The migration script collected **six pages and 75 discoverable assets with zero download errors**. Original HTML, text, files, URL mappings, and checksums are retained in `.migration/cloud-access-check/`, with a ZIP beside it. That source archive is ignored by Git and excluded from the public build.

- Migrated **47 alumni names and photographs**, using gallery captions and anchor titles rather than filename guesses. Their entries have no invented dates or current occupations. Three all-uppercase captions were converted to normal name capitalization.
- **Held out one ambiguous photo:** the old gallery repeats “Hoshi Perez” on an image named `karla-chapa-2023.jpg`. Kept the first, consistent Hoshi Perez record; withheld the second image rather than guessing that its subject is Karla Chapa. Please confirm the correct name/photo pairing.
- **Madison Rosas** is labeled as an undergraduate research assistant on the old page, outside the alumni gallery. Her source text/photo are archived, but she is not automatically labeled as either a current member or an alum in the new site. Confirm status if she should appear.
- Migrated **16 conference presentation PDFs** and generated real first-page thumbnails. Titles, authors, subjects, and source-page conference headings were checked against the CV mappings using extracted PDF text.
- The Cazares 2023 PDF filename/Weebly label says “moderates,” but its actual poster title says **“mediated”**, matching the CV. The website uses the CV/actual poster title.
- The 2025 familial-obligations slide deck has a slightly different title from the CV. The 2023 sensitivity/HRV poster places the last two authors in a different order from the CV. Bibliographic records preserve the CV; the linked files are the original source versions. Review whether citations should follow the final presentation files instead.
- Recovered the 651 × 800 original director portrait; the old 2025 CV was archived but not substituted for the supplied October 2026 CV.
- The old Research page supports the included stress-reactivity/recovery description and measures of HRV and pre-ejection period.
- The old relaxation-resource page is preserved in the local archive. Its full third-party audio/video directory is outside the requested eight-page structure and has not been duplicated into the new site.
- Institutional marks and old site slogans were not copied into the redesign.

See `docs/media-provenance.json` for the migrated file-to-source mapping. Check permission to republish photos and presentation files before publication. Nothing has been published.

## Verified software sources

Read the current public GitHub profile and these sources:

- `https://raw.githubusercontent.com/GrantBenham/gbMod/main/README.md`: identifies gbMod and gbMed, including `gbMed.R` in the same repository.
- `https://github.com/GrantBenham/gbMod/blob/main/gbMed.R`: confirmed the file link exists.
- `https://raw.githubusercontent.com/GrantBenham/gbEFA/main/README.md`: exploratory factor analysis and diagnostics.
- `https://github.com/GrantBenham/BioKubios`: repository description says it reads/transfers Biopac ACQ files to a Kubios samples file for batch processing. No README was found at the tested `main/README.md` URL, so no documentation link is invented.

No standalone gbMed repository was found at the tested URL. The site correctly links gbMed to its file within gbMod. The Weebly Programs page explicitly lists `https://grantbenham.shinyapps.io/gbMod/` and `https://grantbenham.shinyapps.io/gbEFA/`. After the host became accessible, gbEFA returned HTTP 200 and the expected Integrated gbEFA Application/Welcome page; its application link is included. The legacy gbMod application URL returned HTTP 404, so that broken link is omitted. The source repository/documentation remain linked. No analytical functions of either application were tested. No gbMed hosted URL has been guessed. These are descriptions from the repositories, not functional validation of the R software.

## Review checklist

- Repository naming is resolved: the owner renamed it to GrantBenham.github.io; the site is configured for the root URL.
- Confirm biography, research summaries, featured selections, and selected awards.
- Resolve the flagged DOI and any year conventions.
- Confirm migrated Weebly photo/file publication permissions and resolve the caption/status questions above.
- Decide whether to replace the recovered Weebly portrait with the newer supplied portrait; confirm the CV version and image quality.
- Confirm current contact information, lab name, and mentorship wording.
- Run build/type/browser checks; then explicitly approve pushing and publishing.
