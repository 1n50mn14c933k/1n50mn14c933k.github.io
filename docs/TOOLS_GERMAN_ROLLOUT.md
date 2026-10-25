# German-first KOLFAT TOOLS rollout

Date: 2026-10-25. Scope: German (de) only. Status: staging pull request, not yet released.

This focused branch contains 53 German HTML pages (48 utilities, 4 categories, 1 hub), and reuses the existing English processing engines. No other language's generated HTML pages are included. The German UI includes translated tool headings, common controls, safety notices, and links. English tool pages receive an English/German chooser. The sitemap adds 53 German paths, for 287 total URLs based on the current 234-entry baseline.

**Important limitations:** Original detailed technical caveats, certain tool-specific labels, runtime errors, and machine-readable results can still appear in English. German-language proofreading and functional checks for all 48 workflows are still release gates. Do not advertise 100% translated or merge until these are resolved.

Validation: check exact German page count; run Node syntax tests, the full English regression, German browser checks, and mobile/RTL absence checks. Confirm URL and legal footer correctness. Generator PR #21 remains separate and unmerged.

Rollback: revert the German rollout merge, restoring the previous sitemap and shared navigation files. English tool engines remain unchanged. Future languages must each have an independent reviewed PR.

## Automated CI tests

Added 53 route-level Chromium checks for German navigation, title, safety notices and mobile overflow, plus real JSON processing, secure password generation and English-to-German route switching. The result must be checked before release.
