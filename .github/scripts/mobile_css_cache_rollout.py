from pathlib import Path
import re
pages = sorted(Path(".").rglob("index.html"))
changed = 0
for page in pages:
    if ".git" in page.parts:
        continue
    original = page.read_text(encoding="utf-8")
    if "/assets/nav-dropdown.css?v=" not in original:
        continue
    updated = re.sub(r'/assets/nav-dropdown\.css\?v=[A-Za-z0-9._-]+', '/assets/nav-dropdown.css?v=20261019-mobile3', original)
    if updated != original:
        page.write_text(updated, encoding="utf-8")
        changed += 1
assert changed >= 90, f"Unexpected count: {changed}"
print(f"Updated CSS references in {changed} pages.")
