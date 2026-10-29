#!/usr/bin/env python3
"""Prevent a Cloudflare block/challenge from looking like a successful SEO audit.

This gate checks HTTP results for sitemap-seeded HTML pages. It never changes
website files or tries to bypass security controls.
"""
import argparse
import json
from pathlib import Path


def coverage(report: dict, seed_urls: list[str]) -> dict:
    pages = [entry for entry in report.get("results", []) if entry.get("type") == 1]
    ok = sum(str(entry.get("status")) == "200" for entry in pages)
    forbidden = sum(str(entry.get("status")) == "403" for entry in pages)
    unexpected = sum(str(entry.get("status")) not in ("200", "403") for entry in pages)
    expected = len(set(seed_urls))
    # Requiring 90% of the known sitemap URLs protects against misleading scans
    # where bot challenges replace every real HTML response.
    required = max(1, (expected * 9 + 9) // 10)
    return {
        "expected_seed_urls": expected,
        "html_200": ok,
        "html_403": forbidden,
        "html_other": unexpected,
        "required_html_200": required,
        "passed": bool(expected) and ok >= required and forbidden == 0,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("report", type=Path)
    parser.add_argument("seeds", type=Path)
    parser.add_argument("--summary", type=Path)
    args = parser.parse_args()
    result = coverage(
        json.loads(args.report.read_text(encoding="utf-8")),
        [x.strip() for x in args.seeds.read_text(encoding="utf-8").splitlines()
         if x.strip() and not x.lstrip().startswith("#")],
    )
    lines = [
        "## SEO crawl validity",
        "",
        f"- Expected sitemap/homepage URLs: {result['expected_seed_urls']}",
        f"- HTML 200 responses: {result['html_200']}",
        f"- HTML 403 responses: {result['html_403']}",
        f"- Other HTML statuses: {result['html_other']}",
        f"- Minimum successful HTML responses: {result['required_html_200']}",
        f"- Audit result: **{'VALID' if result['passed'] else 'INVALID / BLOCKED'}**",
        "",
        "If invalid, disregard the SiteOne quality scores. Check Cloudflare Security Events "
        "for the GitHub runner requests. Do not allowlist all bots, weaken the CSP, "
        "or disable WAF protection to force a green check.",
    ]
    message = "\n".join(lines) + "\n"
    print(message)
    if args.summary:
        args.summary.parent.mkdir(parents=True, exist_ok=True)
        with args.summary.open("a", encoding="utf-8") as out:
            out.write("\n" + message)
    if not result["passed"]:
        print("::error::SEO crawl is incomplete: sitemap pages returned non-200/403 responses. Ignore quality scores.")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
