from pathlib import Path
import re
import xml.etree.ElementTree as ET

# Repoint every published content page to the latest shared stylesheet.
# Preserve pages, translations, canonical/alternate tags and tool workflows.
tag = '<link rel="stylesheet" href="/assets/site-refinements.css?v=20261027-matched-v2">'
pages = sorted(Path(".").rglob("index.html"))
seen = 0
updated = 0
for page in pages:
    if ".git" in page.parts:
        continue
    before = page.read_text(encoding="utf-8")
    if "site-refinements.css" not in before:
        continue  # Redirect-only entries never load the site theme.
    seen += 1
    after = re.sub(
        r'<link\s+rel="stylesheet"\s+href="/assets/site-refinements\.css(?:\?[^"]*)?"\s*/?>',
        tag, before
    )
    if after.count("/assets/site-refinements.css") != 1:
        raise RuntimeError(f"Shared CSS link missing or repeated in {page}")
    if after != before:
        page.write_text(after, encoding="utf-8")
        updated += 1

assert seen >= 300, f"Unexpected CSS coverage: {seen}"
assert updated >= 300, f"Expected browser cache rollover for all pages: {updated}"
print(f"Repointed {updated}/{seen} content pages to current stylesheet; no text or SEO metadata changed")
