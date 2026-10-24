# KOLFAT Website — Change History and Audit Record

## 2026-10-24 — Time Zone Converter selection UI refresh

- Replaced eleven cramped checkboxes with keyboard-accessible, full-width clickable timezone tiles, grouped in a responsive two-column grid (single-column on small screens).
- Retained all eleven IANA time-zone values, the five original default selections, and the existing local conversion engine.
- Display city names and IANA identifiers separately, with KOLFAT orange selected states and visible keyboard focus.
- Restricted CSS changes to the Time Zone Converter selection controls and added automated page / styling contract tests. No translation changes or new dependencies.


This file documents updates to the **public KOLFAT website** at https://kolfat.app/. It does not replace the application release notes in the [MEDIA KOLFAT repository](https://github.com/1n50mn14c933k/MEDIA_KOLFAT).

## 2026-10-23 — Compact KOLFAT TOOLS category dashboard

- Reorganized `/tools/` as a compact **category overview** rather than a long list of 24 individual utility cards. Every new tool category gets an equally prominent dedicated card, designed to scale as categories are added.
- Added `/tools/photo-file/`, a dedicated landing page containing the existing 12 Photo & File Tools with their original cards and SVG icons.
- Kept the existing `/tools/code-data/` category page with its 12 tools; improved its cross-category link.
- Added `assets/tools-categories.css` under `tools/` to style the overview only, preserving original individual utility functionality, navigation, 12-language marketing website, and MEDIA KOLFAT product calls-to-action.
- Added the new photo category URL to the sitemap and extended regression checks for category navigation, destination routes, tool counts, and preservation of the MEDIA KOLFAT marketing link.
- English-only tool interfaces remain intentional for this release; the public 12-language marketing pages are unchanged.

## 2026-10-22 — MEDIA KOLFAT 1.8.0 website refresh

**Application release:** MEDIA KOLFAT **1.8.0** (Microsoft Store package `1.8.0.0`, published October 19, 2026)  
**Website update:** October 22, 2026  
**Website content commit:** [`322018e`](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/commit/322018e53a6890ea16146aec0689dd419e704f00)

### What changed on the site

- Updated **all 12 localized MEDIA KOLFAT product pages**: English (`en`), German (`de`), Persian (`fa`), Arabic (`ar`), Spanish (`es`), French (`fr`), Hindi (`hi`), Italian (`it`), Japanese (`ja`), Portuguese (`pt`), Russian (`ru`), and Chinese (`zh`).
- Added a clearly visible **current-release information panel** to the product pages stating **MEDIA KOLFAT 1.8.0**, its original **October 19, 2026** publication date, Windows platform, and Microsoft Store package version **`1.8.0.0`**.
- Summarized the relevant 1.8.0 improvements: safer COPY/MOVE workflows, Pause/Resume/Cancel, more detailed progress information, and improved file visibility.
- Added **GitHub release notes**, **user Wiki**, and **community Discussions** links to all 12 product pages.
- Corrected outdated **“still being built”** language in English, German, and Persian product pages; the product is already available through the Microsoft Store.
- Preserved existing product-page layout, language navigation, Microsoft Store links, and other site content. No new installer or application source code was published.

### Source paths

The updated product pages are at `<language>/Media_Kolfat/index.html` for the languages listed above. The release panel can be found in source by searching for `data-kolfat-release="1.8.0"`.

### Published information and links

- Official Windows download: https://apps.microsoft.com/detail/9p0x091t7mv4?ocid=webpdpshare
- Complete MEDIA KOLFAT 1.8.0 notes: https://github.com/1n50mn14c933k/MEDIA_KOLFAT/blob/main/release-notes/v1.8.0.md
- Documentation Wiki: https://github.com/1n50mn14c933k/MEDIA_KOLFAT/wiki
- Community Discussions: https://github.com/1n50mn14c933k/MEDIA_KOLFAT/discussions

### Audit and verification

The audit tooling was added in these commits:

- [`14f49ca`](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/commit/14f49ca7d65df9ed824743fdb38a391ce141c9eb): read-only audit script at `.github/scripts/site_content_audit.py`.
- [`3caeeae`](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/commit/3caeeae0fc1a666dde6d7b6bc4baebb4ca76916b): GitHub Actions workflow at `.github/workflows/site-content-audit.yml`, with a downloadable text report.

[Audit workflow run 39750854416](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/actions/runs/39750854416) completed **successfully** before the page refresh. Results from that initial scan:

- **185 HTML files** scanned.
- **0 old version strings** `1.0.0`, `1.2.0`, `1.4.0`, or `1.6.0` detected in parsed visible page text.
- **0 current 1.8.0 strings** detected in parsed visible page text before the refresh; the localized product pages lacked an explicit version label.
- **0 broken internal links** found by the script's filesystem-based path check.

After the content change, a fresh GitHub fetch confirmed the new `data-kolfat-release="1.8.0"` panel in sampled localized pages (EN, DE, FA, ZH). The [GitHub Pages deployment for commit `322018e`](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/actions/runs/39751118579) completed **successfully**.

**Verification scope:** The scan checked committed HTML text and locally resolvable links; it was not a full browser-based visual QA or external-link availability test. An independent retrieval of the deployed live website after publication was not performed at that time. No claim is made that every translation was independently reviewed by a native speaker.

### How to run the audit again

Open [KOLFAT Website Content Audit](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/actions/workflows/site-content-audit.yml) in GitHub Actions and select **Run workflow** on `main`. Read the run log or download the `kolfat-website-content-audit` artifact (retained for 14 days).

For local runs with Python 3:

```bash
python3 .github/scripts/site_content_audit.py
```

The script is read-only and reports possible issues; it does not change production pages.

### Maintenance guidance

- Update release information **consistently across all 12 product page variants** when a new MEDIA KOLFAT production version is announced.
- Use the actual public release version and date. Do **not** change historical changelogs or older release notes just to make them match the latest version.
- Preserve the difference between a **new release announcement** and a **published Microsoft Store build**.
- Check localized copy, navigation and RTL presentation after changing content.
- Re-run the site audit and check [GitHub Pages deployment](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/actions) after significant edits.
- If automated localization or page-refinement scripts regenerate product HTML, ensure the current release panel and Wiki/Discussions links are preserved.
- Maintain the site's normal distribution and privacy claims accurately. Production installers remain Microsoft Store-only.

## Earlier website maintenance

Earlier navigation, localization, mobile header and styling changes are documented in [NAVIGATION.md](NAVIGATION.md), including the October 18–19, 2026 localization and UI refinements. Git history remains the authoritative record of individual file changes.
