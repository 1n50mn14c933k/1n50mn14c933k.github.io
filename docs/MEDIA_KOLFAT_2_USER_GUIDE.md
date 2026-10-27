# MEDIA KOLFAT 2.0 illustrated guide

## Scope and provenance

The guide documents the installed Windows application, version 2.0.0 / build 2.0.0.0. It contains twelve chapters and 91 illustrated steps in English, German, Persian, French, Spanish, Portuguese, Italian, Japanese, Simplified Chinese, Hindi, Russian and Arabic. Translated instructions, captions, notes, summaries and SEO metadata retain the actual English UI labels shown in the screenshots. Native-speaker editorial review has not been performed.

Canonical English route: `/guides/media-kolfat-2-user-guide/`. Other languages use `/<lang>/guides/media-kolfat-2-user-guide/` (Chinese route `zh`, language tag `zh-CN`). Each localized Guides hub links to its corresponding guide. The existing shared logo, background, header, menu, language chooser, footer, fonts and styles are retained; the additional stylesheet is scoped to `.media-user-guide`.

The [public screenshot manifest](../assets/media-kolfat-2-guide/manifest.json) maps all 87 selected original PNGs to their navigation steps and records their SHA-256, native dimensions, capture method and binary/visual verification. Three images are 1920 × 1080; the remaining selected images are 1934 × 1087. They are original lossless native captures, without upscaling, JPEG conversion, reconstructed interfaces or generated UI. Shared assets serve all twelve languages; screenshots show English UI.

The Computer Use session failed with an access-denied cursor error and was ended. A separately authorized direct Windows UI Automation execution controlled the real app with selectors, runtime identity checks and application/path guards. Native GDI/PrintWindow captured the app and its owned dialogs. The broader local archive retains 179 native captures, including drafts and explicitly excluded failures. Only 87 visually reviewed images are published. No personal media, application source changes, catalogs, profiles, logs or demo datasets are committed here.

## Verified workflows and reliability

**PASS:** app identity/version, native main-window and owned-dialog PNG capture, manual selection, scan/refresh, health/date analysis, exact duplicates and Stop Scan, search/filters, single and batch rotations with Undo, Guided COPY, COPY Pause/Resume/Stop/retry, explicit Advanced MOVE, Activity/reports, accessibility, validation errors, catalog-only removal and reset-warning cancellation.

- Small COPY: 16 copied, zero failures, all destination hashes matched; 17 original files and independent backups unchanged.
- Cancelled large COPY: 110 completed copies retained, no partial outputs; retry copied 402 and skipped 110 identical files, zero failures. All 512 destination hashes matched.
- MOVE: explicitly approved exception solely for disposable backed-up samples; 16 moved, zero failures, all destination hashes matched, all 17 independent backup files unchanged. The excluded text file and all four source directories remained. The original demonstration library was not moved.
- Application source integrity: 178 tracked-file hashes compared to the pre-guide baseline, zero changes.

**FAIL / bounded limitations:** Computer Use cursor control was unavailable. Parent-window capture omits separate native popup menus; the failed menu capture is excluded. Computer-wide discovery was not run because it reads drives beyond the disposable scope; the guide explains the visible choice without claiming a tested discovery result. No personal cloud, network or external storage was connected. Duplicate Finder in this installed build offers Stop Scan, without Pause/Resume. Reset was reviewed and cancelled. Native folder-picker Navigation pane restoration could not be verified; if needed, restore it manually through Organize → Layout → Navigation pane. That is a picker-view preference, not a media change.

## Maintenance

- Localized content: `content/media-kolfat-2-guide/{en,fa,de,fr,es,pt,it,ja,zh,hi,ru,ar}.json`.
- Render: `python3 .github/scripts/build_media_user_guide.py`.
- Add Guides-hub links/sitemap idempotently: `python3 .github/scripts/integrate_media_user_guide.py`.
- Content, metadata, links and original PNG checks: `node --test tools/tests/media-user-guide.test.mjs`.
- Existing source regression: `node --test tools/tests/*.test.mjs`.
- Browser checks: install Playwright, serve this repository on `127.0.0.1:8765`, then run `node tools/tests/media-guide-browser.mjs`.
- Optional isolated local-file browser checks: set `GUIDE_LOCAL_FILES=1`; exact repository files are fulfilled to the browser, with external requests blocked. This verifies rendering, not deployed HTTP behavior. `GUIDE_BROWSER_PATH` selects a disposable browser executable; `GUIDE_QA_OUTPUT` selects the evidence folder. No existing browser profile is used.

The dedicated guide workflow checks maintenance-script syntax, screenshot hashes, all twelve languages and responsive layouts at 320, 360, 375, 390, 430, 1024, 1280, 1440 and 1920 CSS pixels. It also checks menus, language URLs, RTL direction and 60 deeper-step images. Uploaded website QA screenshots are browser evidence, distinct from the original native application screenshots.

## Delivery record

Development branch: `codex/media-kolfat-2-user-guide`. Initial website baseline: `071995db5389129fe557fc435947cd39691dffd0`; incorporated current main `832a1a55956ee37c55ae471645ce2e028d1255ef` before release. Local source tests: 50 passed, zero failures. Initial browser run: 108 locale/viewport cases and 60 deeper-step image checks passed using a disposable Edge profile with local-file fulfillment because localhost HTTP was blocked. A visual review identified an RTL custom-pattern isolation issue and it was corrected; the corrected RTL pattern was explicitly checked and the full browser suite passed again against current main. Original content and chrome on all twelve modified Guides hubs were compared with main and preserved. CI and deployment remain pending until recorded in the PR.

**Rollback:** revert the guide PR merge commit. This removes the twelve new routes, dedicated content/assets/tests/workflow and added Guides-hub/sitemap links while preserving the existing site and application. To amend content, edit the appropriate JSON, regenerate, review screenshot correspondence and run validation. Never edit screenshot pixels to represent an unobserved state.

## Final publication scope

The owner explicitly approved public upload of the 87 reviewed PNGs and twelve guides, subject to final privacy validation. Product-page link additions were removed: no product pages, tools, shared branding, backgrounds or unrelated content are part of this guide change. The twelve existing Guides hubs present the complete manual as their first entry. Approved translations and screenshot bytes are preserved.

Final pre-upload validation (2026-10-27): current main 2478925 incorporated; final scope is twelve existing Guides hubs, twelve new guides and their dedicated assets/content/tests/docs/sitemap entries. No product pages, existing tool functionality or shared visual assets are changed. All 87 unchanged PNGs passed final offline OCR/privacy and PNG metadata checks; no private-data findings. Approved translations, guide steps and screenshot bytes match the previously approved commit. All 50 source tests passed. GitHub CI/deployment remain pending until confirmed in delivery metadata.
