#!/usr/bin/env python3
"""Update exactly 24 localized KOLFAT product and download pages to verified v2.0.0 facts."""
from pathlib import Path
import json
import re
from html import escape

ROOT = Path(__file__).resolve().parents[2]
DATA = json.loads((ROOT / ".github/i18n/media-kolfat-v2-website.json").read_text(encoding="utf-8"))
FOLDERS = (
    "SORTED PHOTOS", "SORTED VIDEOS", "DUPLICATED PHOTOS",
    "DUPLICATED VIDEOS", "PHOTOS WITH UNKNOWN DATE",
    "VIDEOS WITH UNKNOWN DATE", "OTHER FILES",
)
RELEASE = "https://github.com/1n50mn14c933k/MEDIA_KOLFAT/releases/tag/v2.0.0"
CHECKSUM = "https://github.com/1n50mn14c933k/MEDIA_KOLFAT/releases/download/v2.0.0/MEDIA_KOLFAT_2.0.0_SHA256.txt"
ASSET = '<link rel="stylesheet" href="/assets/media-kolfat-release-v2.css?v=20261027-release2">'
CSS = "</head>"
PAGES = []
for lang, translated in DATA.items():
    assert len(translated) == 20, lang
    PAGES.extend((
        (lang, ROOT / lang / "Media_Kolfat" / "index.html", "product"),
        (lang, ROOT / ("download" if lang == "en" else f"{lang}/download") / "index.html", "download"),
    ))

def render(lang, values, kind):
    e = lambda s: escape(s, quote=True)
    # Six feature cards; all details come from the official GitHub v2.0 release.
    feature_ids = (2, 4, 6, 8, 10, 12)
    cards = "".join(
        f'<article class="kf-v2-card"><h3>{e(values[i])}</h3><p>{e(values[i+1])}</p></article>'
        for i in feature_ids
    )
    folders = "".join(f'<span>{e(folder)}</span>' for folder in FOLDERS)
    extra = (f'<p class="kf-v2-download-help">{e(values[19])}</p>' if kind == "download" else "")
    return (f'<section class="kf-v2-section" id="media-kolfat-v2" aria-labelledby="kf-v2-title">'
            f'<div class="kf-v2-content"><p class="kf-v2-eyebrow">MEDIA KOLFAT • v2.0.0</p>'
            f'<h2 id="kf-v2-title">{e(values[0])}</h2>'
            f'<p class="kf-v2-intro">{e(values[1])}</p>'
            f'<div class="kf-v2-grid">{cards}</div>'
            f'<div class="kf-v2-folders"><h3>{e(values[14])}</h3>'
            f'<p>{e(values[15])}</p><div class="kf-v2-folder-list">{folders}</div></div>'
            f'<p class="kf-v2-meta">{e(values[16])}</p>{extra}'
            f'<div class="kf-v2-links">'
            f'<a href="{RELEASE}" target="_blank" rel="noopener noreferrer">{e(values[17])}</a>'
            f'<a href="{CHECKSUM}" target="_blank" rel="noopener noreferrer">{e(values[18])}</a>'
            f'</div></div></section>')

seen = set()
for lang, page, kind in PAGES:
    assert page.is_file(), page
    assert page not in seen, page
    seen.add(page)
    before = page.read_text(encoding="utf-8")
    if "kf-v2-section" in before or "media-kolfat-release-v2.css" in before:
        raise RuntimeError(f"Unexpected existing release content: {page}")
    if before.count(CSS) != 1:
        raise RuntimeError(f"Head missing/ambiguous: {page}")
    if before.count("<main") != 1:
        raise RuntimeError(f"Main missing/ambiguous: {page}")
    if "kf-download-ms" not in before or "kf-download-gh" not in before:
        raise RuntimeError(f"Approved paired buttons missing: {page}")
    marker = ('<section class="section" id="features">' if kind == "product"
              else '<section class="section">')
    if marker not in before:
        raise RuntimeError(f"Insert location missing: {page}")
    section = render(lang, DATA[lang], kind)
    after = before.replace(CSS, ASSET + CSS, 1)
    after = after.replace(marker, section + "\n" + marker, 1)
    if after.count("kf-v2-section") != 1 or after.count(RELEASE) < 2:
        raise RuntimeError(f"Release missing or repeated: {page}")
    if after.count("kf-download-ms") != before.count("kf-download-ms") or after.count("kf-download-gh") != before.count("kf-download-gh"):
        raise RuntimeError(f"Original CTA was modified: {page}")
    if after.count("nav-dropdown.js") != before.count("nav-dropdown.js"):
        raise RuntimeError(f"Navigation was modified: {page}")
    page.write_text(after, encoding="utf-8")
assert len(seen) == 24, len(seen)
print("PASS: updated all 24 KOLFAT v2.0.0 product/download pages; buttons, SEO and nav tags preserved")
