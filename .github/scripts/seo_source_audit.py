#!/usr/bin/env python3
"""Read-only SEO source audit for GitHub Pages. No network requests or score claims."""
import argparse
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET

DOMAIN = "kolfat.app"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self._inside_title = False
        self.description = ""
        self.canonical = ""
        self.language = ""
        self.hreflang = {}

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.language = (a.get("lang") or "").strip()
        elif tag == "title":
            self._inside_title = True
        elif tag == "meta" and (a.get("name") or "").lower() == "description":
            self.description = (a.get("content") or "").strip()
        elif tag == "link":
            rel = (a.get("rel") or "").lower().split()
            if "canonical" in rel:
                self.canonical = a.get("href") or ""
            if "alternate" in rel and a.get("hreflang"):
                self.hreflang[a["hreflang"]] = a.get("href") or ""

    def handle_data(self, data):
        if self._inside_title:
            self.title += data

    def handle_endtag(self, tag):
        if tag == "title":
            self._inside_title = False


def file_for_url(root, url):
    p = urlsplit(url)
    if p.scheme != "https" or p.netloc != DOMAIN or p.query or p.fragment:
        raise ValueError(f"Unexpected URL in sitemap: {url}")
    path = unquote(p.path)
    if "\\" in path or ".." in path.split("/"):
        raise ValueError(f"Invalid sitemap path: {url}")
    rel = path.lstrip("/")
    if not rel or rel.endswith("/"):
        return root / rel / "index.html"
    return root / rel


def audit(root):
    sitemap = root / "sitemap.xml"
    entries = ET.parse(sitemap).findall("sm:url/sm:loc", NS)
    urls = [x.text.strip() for x in entries if x.text]
    if not urls or len(set(urls)) != len(urls):
        raise ValueError("Sitemap is empty or has duplicate URLs")
    problems = defaultdict(list)
    titles = defaultdict(list)
    checked = 0
    for url in urls:
        page = file_for_url(root, url)
        if not page.is_file():
            problems["MISSING_FILE"].append(url)
            continue
        checked += 1
        parser = Metadata()
        parser.feed(page.read_text(encoding="utf-8"))
        title = parser.title.strip()
        if not title:
            problems["MISSING_TITLE"].append(url)
        else:
            titles[title.casefold()].append(url)
        if not parser.description:
            problems["MISSING_DESCRIPTION"].append(url)
        if not parser.language:
            problems["MISSING_LANG"].append(url)
        if not parser.canonical:
            problems["MISSING_CANONICAL"].append(url)
        elif urlsplit(parser.canonical).netloc != DOMAIN:
            problems["FOREIGN_CANONICAL"].append(url)
        if not parser.hreflang:
            problems["NO_HREFLANG"].append(url)
    for group in titles.values():
        if len(group) > 1:
            problems["REPEATED_TITLE"].extend(group)
    return len(urls), checked, dict(problems)


def markdown(total, checked, problems):
    lines = [
        "# KOLFAT SEO source audit",
        "",
        "Read-only audit of repository HTML and sitemap. This is **not a live Cloudflare scan**, "
        "does not validate response headers, and does not simulate Google rankings.",
        "",
        f"- Sitemap URLs: **{total}**",
        f"- HTML pages found: **{checked}**",
        f"- Missing sitemap targets: **{len(problems.get('MISSING_FILE', []))}**",
        "",
        "| Check | Pages flagged |", "|---|---:|",
    ]
    for key in ("MISSING_FILE", "MISSING_TITLE", "MISSING_DESCRIPTION",
                "MISSING_LANG", "MISSING_CANONICAL", "FOREIGN_CANONICAL",
                "NO_HREFLANG", "REPEATED_TITLE"):
        lines.append(f"| {key} | {len(problems.get(key, []))} |")
    lines.extend(["", "## Examples (up to 12 per category)", ""])
    for key in sorted(problems):
        lines.extend([f"### {key}"])
        lines.extend(f"- {url}" for url in problems[key][:12])
        if len(problems[key]) > 12:
            lines.append(f"- … and {len(problems[key]) - 12} more")
        lines.append("")
    lines += [
        "## Operational guidance", "",
        "- Investigate warnings before changing metadata or translations.",
        "- Some pages intentionally omit indexing signals; warnings are not automatic ranking penalties.",
        "- SiteOne live crawling cannot reliably pass Cloudflare free Bot Fight Mode challenges.",
        "- Never disable Bot Fight Mode or allowlist GitHub runner IP ranges merely to get a green audit.", "",
    ]
    return "\n".join(lines)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--root", type=Path, default=Path("."))
    p.add_argument("--output", type=Path, default=Path("seo-source-audit.md"))
    args = p.parse_args()
    try:
        count, found, problems = audit(args.root.resolve())
    except (ValueError, ET.ParseError, OSError) as e:
        p.error(str(e))
    args.output.write_text(markdown(count, found, problems), encoding="utf-8")
    print(f"SEO source audit: {found}/{count} sitemap pages present; report {args.output}")
    if problems.get("MISSING_FILE"):
        print("::error::Sitemap includes pages not present in the source repository")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
