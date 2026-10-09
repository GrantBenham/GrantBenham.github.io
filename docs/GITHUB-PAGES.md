# Set up GitHub Pages

The owner has authorized uploading the review code. Enable and run deployment **only after reviewing the website and approving publication**. This guide describes future actions; the review code upload is authorized, but no website deployment has been performed.

## 1. Choose the repository name

There are two valid options:

| Repository | Site URL | `site.base` |
| --- | --- | --- |
| Existing `GrantBenham/github.io` | `https://grantbenham.github.io/github.io/` | `'/github.io'` |
| User site `GrantBenham/GrantBenham.github.io` | `https://grantbenham.github.io/` | `''` (current) |

The owner has completed the rename, and the website is configured for the shorter address. For reference, to rename a repository, open the existing repository's **Settings → General → Repository name** and rename it to `GrantBenham.github.io`. Update the `repository` and `base` fields in `src/config.ts`. If working from this checkout, update its Git origin to the renamed repository as well. The code does not need a custom domain or CNAME.

## 2. Review locally

Read `docs/CONTENT-REVIEW.md`, check the CV download, inspect all eight pages, and verify any migrated photos and presentation PDFs. Then run:

```sh
npm ci
npm run check
npm run build
npm test
```

Confirm the desired URL and resolve content review items before approving publication. Do not upload copyrighted article PDFs without permission. Presentation files and identifiable alumni photos also need permission to publish.

## 3. Upload reviewed code

This environment began with no commits and no remote branches. Once the initial implementation is approved, from the checkout:

```sh
git status --short
git add .
git commit -m "Build Grant Benham academic website"
git branch -M main
git push -u origin main
```

Inspect `git status` first: `.gitignore` excludes dependencies, built files, local migration archives, environment files, and browser-test output. Review files before staging. If the repository has since received work, fetch and reconcile it rather than overwriting remote history. Never force push as part of setup.

## 4. Enable Pages

On GitHub, open the repository → **Settings → Pages → Build and deployment → Source → GitHub Actions**. A public repository is the simplest route for a public academic site. Pages availability for private repositories depends on the GitHub plan.

Under **Settings → Environments → github-pages**, add a required reviewer if your GitHub plan permits it. Restrict deployment branches to `main`. These settings add another approval gate, beyond the workflow's manual trigger.

## 5. Publish only after approval

Open **Actions → Publish GitHub Pages (manual approval) → Run workflow**. Select `main`, enter exactly `PUBLISH`, and run it. The workflow validates and builds, uploads the static artifact, and deploys through the official GitHub Pages actions. An incorrect confirmation or another branch skips publication.

The successful deployment reports the actual Pages URL. Check the homepage, navigation, a DOI link, an archive filter, portrait, and CV download at that URL. This public-site check cannot be performed until deployment is approved and runs.

## Updating later

Edit structured content, validate, and push reviewed changes. Validation runs automatically. Repeat the manual deployment only when those changes are approved for the public site. Live R Shiny applications are hosted separately; this static site links to them and does not run R.
