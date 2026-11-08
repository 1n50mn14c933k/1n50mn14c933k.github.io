#!/usr/bin/env python3
"""Invalidate stale cached shared navigation on every public HTML page.

The source /assets/nav-dropdown.js is kept at its canonical path. Only the
version query in HTML <script src> references changes. No page content,
analytics, routes, or unrelated JavaScript/CSS is modified.
"""
from __future__ import annotations

import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "assets" / "nav-dropdown.js"
PATTERN = re.compile(
    r'(?P<start><script\b[^>]*?\bsrc\s*=\s*["\'])'
    r'(?P<url>/assets/nav-dropdown\.js)'
    r'(?:\?v=[^"\']*)?'
    r'(?P<end>["\'])',
    re.IGNORECASE,
)


def main():
    if not SCRIPT.is_file():
        raise SystemExit("ERROR: shared navigation script missing")
    source = SCRIPT.read_text(encoding="utf-8")
    # Guard against re-publishing the outdated five-guide generator.
    if "const guideLinks=guideSlugs.map" in source or "heading(words.learn);" in source:
        raise SystemExit("ERROR: obsolete guide accordion remains in source")
    sha = subprocess.check_output(
        ["git", "hash-object", str(SCRIPT)], cwd=ROOT, text=True
    ).strip()[:12]
    target = f"/assets/nav-dropdown.js?v={sha}"
    scanned = linked = changed = 0
    languages = set()
    for page in sorted(ROOT.rglob("*.html")):
        if ".git" in page.parts:
            continue
        scanned += 1
        raw = page.read_text(encoding="utf-8")
        matches = list(PATTERN.finditer(raw))
        if not matches:
            continue
        linked += 1
        updated = PATTERN.sub(
            lambda match: match.group("start") + target + match.group("end"), raw
        )
        if updated != raw:
            page.write_text(updated, encoding="utf-8")
            changed += 1
        # Every matched src must reference the current content-addressed URL.
        if any(m.group("url") != "/assets/nav-dropdown.js" for m in PATTERN.finditer(updated)):
            raise SystemExit(f"ERROR: unexpected shared navigation URL in {page}")
        parts = page.relative_to(ROOT).parts
        if parts[0] in {"en","de","fa","ar","fr","es","pt","it","hi","ja","zh","ru"}:
            languages.add(parts[0])
    if linked < 100 or len(languages) < 12:
        raise SystemExit(f"ERROR: incomplete rollout: {linked} pages, {len(languages)} languages")
    print(f"PASS: {scanned} HTML pages scanned; {linked} shared-menu pages; "
          f"{changed} updated; {len(languages)} languages; target {target}")


if __name__ == "__main__":
    main()
