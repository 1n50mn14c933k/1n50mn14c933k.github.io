from pathlib import Path
import re

# Apply the upgraded shared navigation to every published page, all locales
# and all tools, without touching content, metadata or other styling.
version = "20261028-guides-visual1"
pages = sorted(Path(".").rglob("index.html"))
seen = 0
updated = 0
for page in pages:
    if ".git" in page.parts:
        continue
    before = page.read_text(encoding="utf-8")
    if "site-refinements.css" not in before:
        continue  # Redirect-only pages have no site navigation.
    seen += 1
    after, css_count = re.subn(
        r'/assets/nav-dropdown[.]css(?:[?][^"]*)?',
        f"/assets/nav-dropdown.css?v={version}", before,
    )
    after, js_count = re.subn(
        r'/assets/nav-dropdown[.]js(?:[?][^"]*)?',
        f"/assets/nav-dropdown.js?v={version}", after,
    )
    after, refined_count = re.subn(
        r'/assets/site-refinements[.]css(?:[?][^"]*)?',
        '/assets/site-refinements.css?v=20261028-guides-visual1', after,
    )
    if refined_count != 1:
        raise RuntimeError(f"{page}: expected exactly one shared site CSS link, got {refined_count}")
    if css_count != 1 or js_count != 1:
        raise RuntimeError(f"{page}: expected exactly one shared CSS and JS nav reference; got {css_count}, {js_count}")
    if after != before:
        page.write_text(after,encoding="utf-8")
        updated += 1
assert seen >= 300, f"Unexpected navigation coverage: {seen}"
assert updated >= 300, f"Expected cache rollover across localized pages and tools: {updated}"
print(f"Repointed shared menu assets on {updated}/{seen} pages; page content, SEO and releases preserved")
