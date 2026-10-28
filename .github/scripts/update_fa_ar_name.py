from pathlib import Path
import re

NAME = "مدیا کلفت"
TARGETS = ("fa", "ar")
legacy = re.compile(r"MEDIA KOLFAT|Media Kolfat|مدیا کولفات|ميديا كولفات|ميديا كلفت|میدیا کلفت")
# Preserve literal Windows UI / output folder labels that must match the app.
protected = re.compile(r"<bdi\b[^>]*>.*?</bdi>", re.S | re.I)
changed = 0
for lang in TARGETS:
    for p in sorted(Path(lang).rglob("*.html")):
        before = p.read_text(encoding="utf-8")
        parts = protected.split(before)
        kept = protected.findall(before)
        out = []
        for i, part in enumerate(parts):
            out.append(legacy.sub(NAME, part))
            if i < len(kept): out.append(kept[i])
        after = "".join(out)
        if after != before:
            p.write_text(after, encoding="utf-8")
            changed += 1
            print("FIXED",p)
assert changed > 20, f"Expected sitewide localization changes, got {changed}"
print(f"PASS: updated {changed} Persian/Arabic HTML pages; technical bdi and URLs untouched")
