# Recover the existing Weebly material

You do not need to recreate the old lab roster or type captions again. Preserve the source pages and files, then map them into the new website's structured data.

## Completed initial recovery

The initial recovery succeeded after network access changed: **six pages and 75 assets downloaded with no errors**. Source material is preserved at `.migration/cloud-access-check/` and `.migration/cloud-access-check.zip`. The site now contains 47 caption-verified alumni photographs and 16 presentation PDFs with generated thumbnails. One duplicate/mismatched alumni caption is held for review. See `CONTENT-REVIEW.md` and `media-provenance.json`.

The instructions below remain useful for refreshing the source or transferring an owner export.

## Cloud access

The cloud workspace and ChatGPT browsing use different network routes. A site visible in an earlier chat or your browser can still be denied by the cloud workspace's network proxy.

The required source address is **https://stresslab.weebly.com/** (without `www`). Domain additions were saved to the environment draft for `stresslab.weebly.com`, `www.stresslab.weebly.com`, `api.github.com`, and `grantbenham.shinyapps.io`. Review and save them in environment settings; a draft save alone does not apply runtime access. The API domain is optional for further software metadata; the site build does not depend on it.

After a runtime network update, retry the source. If HTML refers to assets on another host, inspect those exact URLs and add only the hosts needed for migration. Weebly often uses `cdn2.editmysite.com`; do not broaden the policy to arbitrary domains. No Weebly credentials are needed for public material.

## Download the source automatically

From the repository, using Python 3 with no extra packages:

```sh
python3 scripts/migrate-weebly.py
```

It creates a new timestamped directory under `.migration/` and a ZIP beside it. The directory is ignored by Git. The script:

- Crawls discoverable public pages on the lab's Weebly host.
- Preserves original HTML plus readable text, including names and captions.
- Downloads discoverable images, locally hosted PDFs, and document files.
- Records source URLs, image alt/title text, checksums, content types, and errors in `manifest.json`.
- Preserves existing archives; it never overwrites one, modifies the new site's content, pushes to GitHub, or publishes files.
- Uses verified HTTPS requests. It does not disable TLS, log in, or extract credentials.

A nonzero exit with a manifest means some pages/assets failed or the page limit was reached. That is an **incomplete archive**, not successful migration. Increase the page limit only if the manifest shows it is necessary. JavaScript-only galleries and private files may require an owner export.

## If cloud access stays blocked

Run the same script on a computer that can reach the Weebly site, then upload the generated ZIP to this conversation. If you have not downloaded the repository yet, download the `scripts/migrate-weebly.py` file alone and run it with Python 3. The script uses the site address already filled in.

Alternatively, sign into the Weebly editor and look for the site's **Settings → General → Archive** export option (availability and labels can vary). Download the owner archive and provide it here. If an archive lacks some uploaded PDFs or photo captions, the crawler can supplement it. No need to send account passwords or recreate the site manually.

If the prior ChatGPT session downloaded original photos or produced a detailed migration document, those files can also be transferred here. A chat summary without actual image files cannot substitute for the original photographs.

## Map collected content into Astro

Keep the source archive private/local. Use each page's `.txt`, original HTML, image metadata, and manifest to identify the correct name–photo pairing. Do not infer names from filenames alone.

1. Review biography/lab text against the CV; revise page prose only with supported facts.
2. Create alumni records in `src/data/alumni.json`; old research assistants are alumni unless current membership is explicitly confirmed.
3. Optimize approved photos into `public/images/`. Preserve the original source and permission notes in the private archive.
4. Match presentation PDFs to actual conference records, then copy approved files into `public/presentations/` and thumbnails into `public/posters/`.
5. Verify software application/documentation URLs before adding them to `software.json`.
6. Update `docs/CONTENT-REVIEW.md` with migrated sources and remaining questions.
7. Build and run browser checks, including the real PDF viewer and thumbnail once those files exist.

Do not upload all legacy assets automatically. The old site may include copyrighted article PDFs, outdated current-member claims, third-party logos, or photographs that need permission checks. Review before including them in the public website.
