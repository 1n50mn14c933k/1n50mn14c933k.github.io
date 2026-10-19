from pathlib import Path
import re
import xml.etree.ElementTree as ET

sitemap = ET.fromstring(Path("sitemap.xml").read_text(encoding="utf-8"))
ns = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
urls = [x.text for x in sitemap.findall(".//" + ns + "loc")]
assert len(urls) == 181, f"Expected 181 sitemap URLs, got {len(urls)}"
updated = 0
for url in urls:
    path = url.removeprefix("https://kolfat.app/").strip("/")
    file = Path(path) / "index.html" if path else Path("index.html")
    assert file.exists(), f"Missing page: {file}"
    before = file.read_text(encoding="utf-8")
    original = re.findall(r'<link rel="canonical"[^>]*>|<link rel="alternate" hreflang="[^"]+"[^>]*>|<script type="application/ld\+json">.*?</script>', before, flags=re.S)
    tag = '<link rel="stylesheet" href="/assets/site-refinements.css?v=20261019-refine1">'
    if "site-refinements.css" in before:
        after = re.sub(r'<link rel="stylesheet" href="/assets/site-refinements.css[^"]*">', tag, before)
    else:
        assert before.count("</head>") == 1, str(file)
        after = before.replace("</head>", tag + "\n</head>", 1)
    current = re.findall(r'<link rel="canonical"[^>]*>|<link rel="alternate" hreflang="[^"]+"[^>]*>|<script type="application/ld\+json">.*?</script>', after, flags=re.S)
    assert original == current, f"SEO metadata changed: {file}"
    assert after.count("site-refinements.css") == 1, str(file)
    if after != before:
        file.write_text(after, encoding="utf-8")
        updated += 1
assert updated > 0
print(f"Verified {len(urls)} sitemap pages; updated {updated} page references, SEO metadata preserved")
