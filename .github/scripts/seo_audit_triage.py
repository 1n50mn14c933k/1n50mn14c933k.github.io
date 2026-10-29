#!/usr/bin/env python3
"""Summarize SiteOne JSON findings without modifying website files."""
import json
import sys
from pathlib import Path

INPUT = Path(sys.argv[1] if len(sys.argv) > 1 else "reports/siteone-report.json")
OUTPUT = Path(sys.argv[2] if len(sys.argv) > 2 else "reports/seo-action-plan.md")
data = json.loads(INPUT.read_text(encoding="utf-8"))
summary = {item.get("aplCode"): item for item in data.get("summary", {}).get("items", [])}
overall = data.get("qualityScores", {}).get("overall", {}).get("score", "unknown")
categories = {c.get("code"): c.get("score") for c in data.get("qualityScores", {}).get("categories", [])}
visited = data.get("stats", {}).get("totalUrls", "unknown")

def finding(code, label, risk, guidance):
    item = summary.get(code)
    if not item or item.get("status") == "OK":
        return None
    return f"| {risk} | {label} | {item.get('text', '').replace('|', '/')} | {guidance} |"

lines = [
    "# KOLFAT SEO: automated triage",
    "",
    "Generated from SiteOne crawler output. Recommendations require verification; this file does not change any website content.",
    "",
    f"**Visited URLs:** {visited}  ",
    f"**Overall:** {overall}/10  ",
    f"**SEO:** {categories.get('seo', 'unknown')}/10  ",
    "",
    "## Prioritized findings",
    "",
    "| Priority | Area | Evidence | Next action |",
    "|---|---|---|---|",
]
actions = [
    ("security", "Missing security response headers", "Review", "Check CDN/proxy routing; test CSP in report-only mode. Never auto-change HSTS/CSP."),
    ("seo-canonical-missing", "Canonical missing", "Investigate", "Inspect root URL for intentional noindex/redirect before editing."),
    ("seo-noindex", "Noindex", "Investigate", "Verify whether the flagged URL is intentionally excluded."),
    ("seo-meta-description-length", "Description lengths", "Low", "Review page-by-page; avoid shortening meaningful localized descriptions automatically."),
    ("seo-title-length", "Title lengths", "Low", "Review title quality in context rather than enforcing arbitrary length."),
    ("pages-without-main-landmark", "Missing main landmark", "Low", "Identify specific page and test accessibility before proposing code changes."),
    ("pages-with-non-clickable-phone-numbers", "Telephone link suggestions", "Low", "Check false positives; do not modify arbitrary numeric text."),
    ("brotli-support", "Brotli", "Infrastructure", "Check hosting/CDN capabilities; do not change DNS automatically."),
    ("static-assets-short-cache", "Asset caching", "Infrastructure", "Review cache invalidation and hosting controls."),
    ("skipped", "Skipped URLs", "Informational", "External links are intentionally outside the crawler's scope."),
]
found = []
for a in actions:
    v = finding(*a)
    if v:
        lines.append(v)
        found.append(a[0])
if not found:
    lines.append("| Informational | No matching findings | No prioritized exceptions detected | Continue monitoring |")
lines += [
    "",
    "## Guardrails",
    "",
    "- The SiteOne quality score is not Google's organic ranking score or Core Web Vitals.",
    "- Rule-based analysis is intentionally conservative and does not hallucinate per-page causes.",
    "- Never automatically change DNS, CDN security headers, page copy, translations, visual design, or canonical/noindex on a guess.",
    "- Historical comparisons require storing and comparing prior reports; not implemented here.",
    "",
]
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
OUTPUT.write_text("\n".join(lines), encoding="utf-8")
print(f"Saved triage to {OUTPUT}, {len(found)} issue groups")
