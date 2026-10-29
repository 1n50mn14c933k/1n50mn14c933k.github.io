#!/usr/bin/env python3
"""Conservative, idempotent repair of wrong localized language-menu URLs.

Only equivalent top-level informational pages are in scope. This script never
modifies normal navigation, translations, metadata, layout, JavaScript, or CSS.
"""
import argparse
import re
from pathlib import Path

LOCALES = ("fa", "de", "fr", "es", "it", "pt", "ja", "zh", "hi", "ru", "ar")
SECTIONS = ("about", "download", "guides", "support", "privacy", "terms",
            "disclaimer", "licenses")
MENU_RE = re.compile(
    r'<details\b[^>]*\bclass="[^"]*\blang-menu\b[^"]*"[^>]*>.*?</details>',
    re.IGNORECASE | re.DOTALL,
)
LINK_RE = re.compile(r'(<a\b[^>]*\bhref=")(/[^"]+)(")', re.IGNORECASE)


def target_for(current_section: str, old_href: str, root: Path) -> str | None:
    """Return a safe equivalent-language URL only if the destination exists."""
    if not old_href.startswith("/") or not old_href.endswith("/"):
        return None
    parts = old_href.strip("/").split("/")
    if len(parts) == 1 and parts[0] in SECTIONS:
        language = "en"
    elif len(parts) == 2 and parts[0] in LOCALES and parts[1] in SECTIONS:
        language = parts[0]
    else:
        return None
    new_href = f"/{current_section}/" if language == "en" else f"/{language}/{current_section}/"
    if not (root / new_href.lstrip("/") / "index.html").is_file():
        return None
    return new_href if new_href != old_href else None


def repair_page(content: str, section: str, root: Path) -> tuple[str, int]:
    changes = 0

    def replace_menu(match: re.Match[str]) -> str:
        nonlocal changes

        def replace_link(link: re.Match[str]) -> str:
            nonlocal changes
            expected = target_for(section, link.group(2), root)
            if expected is None:
                return link.group(0)
            changes += 1
            return link.group(1) + expected + link.group(3)

        return LINK_RE.sub(replace_link, match.group(0))

    return MENU_RE.sub(replace_menu, content), changes


def candidate_pages(root: Path):
    for section in SECTIONS:
        path = root / section / "index.html"
        if path.is_file():
            yield path, section
        for locale in LOCALES:
            path = root / locale / section / "index.html"
            if path.is_file():
                yield path, section


def scan_site(root: Path, apply: bool = False) -> tuple[int, int]:
    changed_pages = changed_links = 0
    for path, section in candidate_pages(root):
        original = path.read_text(encoding="utf-8")
        revised, count = repair_page(original, section, root)
        if not count:
            continue
        changed_pages += 1
        changed_links += count
        print(f"{path.relative_to(root)}: {count} incorrect language-menu URL(s)")
        if apply:
            path.write_text(revised, encoding="utf-8")
    return changed_pages, changed_links


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path("."))
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check", action="store_true", help="Fail if repairable errors remain.")
    mode.add_argument("--apply", action="store_true", help="Apply only verified equivalent-page links.")
    args = parser.parse_args()
    pages, links = scan_site(args.root.resolve(), apply=args.apply)
    print(f"{'Fixed' if args.apply else 'Detected'} {links} link(s) across {pages} page(s)")
    return 1 if args.check and pages else 0


if __name__ == "__main__":
    raise SystemExit(main())
