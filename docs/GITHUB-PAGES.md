# Your website: a simple guide

You do **not** need to run code or use a terminal. The installation, build, and test commands mentioned in older instructions are checks Codex performs for you.

Your repository is:
https://github.com/GrantBenham/GrantBenham.github.io

Your public website address is:
https://grantbenham.github.io/

The repository is where the editable website files are stored. The public website is what visitors see.

## What is already done

- You renamed the repository correctly.
- You selected **GitHub Actions** under Settings → Pages.
- Codex built the website and uploaded the files.
- You approved publishing the corrected initial version.
- Codex ran the technical checks and successfully published the corrected initial version.

You do not need to repeat these setup steps.

## View the website

After publication finishes, open **https://grantbenham.github.io/** in your browser. It can take a few minutes for changes to appear. If the page looks unchanged, refresh it.

To check publication progress on GitHub:

1. Open your repository using the link above.
2. Click **Actions** near the top of the page.
3. Look for **Publish GitHub Pages (manual approval)**.
4. A green check means publication finished successfully. A yellow indicator means it is still running. A red cross means it needs attention; tell Codex and we can investigate.

## Ask for changes

The easiest way is to tell Codex what you want changed. For example:

- “Add this publication,” with its citation and DOI.
- “Add this former lab member,” with their name and photograph.
- “Change the wording on the Research page.”
- “Add this conference poster,” with the presentation details and PDF.

Codex can update the files, run the checks, and show you the changes. Say whether you want the update published or just prepared for review.

## Publish a future update yourself, if you wish

You can leave this to Codex. If you prefer to do it yourself after the updated files are on GitHub:

1. Open your repository and click **Actions**.
2. Select **Publish GitHub Pages (manual approval)** from the list on the left.
3. Click **Run workflow**.
4. Leave the branch set to **main**.
5. In the confirmation box, type **PUBLISH** in capital letters.
6. Click the green **Run workflow** button.
7. Wait for the green check, then open your public website.

Uploading changed files does not automatically publish them through this workflow. Publication happens when the workflow is run.

## Other files you may see

- **CONTENT-REVIEW.md**: plain-language notes about content decisions and things to revisit.
- **PREVIEW.md**: screenshots of the initial design. They are pictures, not a working website, and may be older than the live site.
- **EDITING.md** and **README.md**: technical reference for someone maintaining the code. You do not need to follow those commands yourself.
- **media-provenance.json**: a source list recording where the photos and PDFs came from. You can ignore it during ordinary website review.
