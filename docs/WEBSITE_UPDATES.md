# KOLFAT Website — Change History and Audit Record

## 2026-10-25 — German-first multilingual staging

Created an isolated 53-page German tools branch with shared translation assets, English/German language selection, 53 sitemap URLs, and release-gate documentation. Do not merge until German workflow and wording tests pass. Rollback: revert the resulting merge; keep original English tools. See docs/TOOLS_GERMAN_ROLLOUT.md.

## 2026-10-25 — Consistent site-wide header/footer borders and menu icons

**Purpose:** Eliminate inconsistent small/empty footer templates and styling across KOLFAT pages. Keep all five requested links visible (Privacy, Terms, Licenses, Support, Contact), without social links in the footer. Add SVG icons to every item in the dropdown MENU.

**Files:** `assets/nav-dropdown.js`, `assets/nav-dropdown.css`, `.github/workflows/kolfat-tools-regression.yml`, `tools/tests/site-chrome.test.mjs`, `tools/tests/site-chrome.spec.mjs`, `docs/WEBSITE_UPDATES.md`, `docs/NAVIGATION.md`, and `README.md`.

**Additional layout correction:** The browser suite found that pages without a language switcher could push the MENU dropdown outside the viewport when opened. On these tool pages the dropdown is now aligned to the MENU button rather than using the offset reserved for a language switcher.

**Implementation:** Shared navigation script adds an accessible 5-link multilingual footer, hides superseded footer markup, inserts inline SVG icons alongside existing MENU anchors, adds a top divider to fullscreen home/product pages, and leaves existing header dropdown interactions intact. All generated elements use local source only. Floating TOOLS CTA stays above footer, never covers legal links.

**Validation:** Node contract tests check icon mapping, footer paths, script presence and links. Chromium browser tests check footer/menu across representative locales and page types, including mobile. Results must be verified before merge; a passing automation suite is not a substitute for checking every live page.

**Rollback:** Revert this merge commit or remove the final `KOLFAT unified navigation artwork and footer` initializer from `assets/nav-dropdown.js` and the `KOLFAT site-wide chrome` block from `assets/nav-dropdown.css`. Existing native footers then reappear. No content, backend, or user data changes.

## 2026-10-25 — Visible site-wide ☕ Support KOLFAT header shortcut

**Reason:** The previously added Ko-fi link was hidden in the main TOOLS footer and therefore not visible to most visitors. The owner requested an attractive, unobtrusive header shortcut **on every website page** next to MENU/language controls; on GitHub, visible shortcuts **only** on the account's profile README and MEDIA_KOLFAT repository.

**Changed files:** `assets/nav-dropdown.js`, `assets/nav-dropdown.css`, `tools/index.html`, `tools/tests/support-links.test.mjs`, `tools/tests/global-support.spec.mjs`, `.github/workflows/kolfat-tools-regression.yml`, `README.md`, `docs/SUPPORT_FUNDING.md`, `docs/NAVIGATION.md`, this history; remove the website repository's `.github/FUNDING.yml` to match GitHub scope. Separate documented PRs update profile and MEDIA_KOLFAT repositories.

**Implementation:** Inject one external Ko-fi header anchor before MENU from the shared navigation script. Use a compact coffee icon on narrow phones, full label on desktop, visible orange outline, accessible keyboard focus, tooltip, no popup and no external payment scripts. Existing `/tools/` footer-only link removed.

**Verification:** Node tests check shared script, CSS, documentation and page coverage. Chromium verifies header placement, clickability, mobile viewport containment and Ko-fi target on representative locales, content templates and utilities. Browser/live-deployment outcomes must be reported separately.

**Rollback:** Revert the corresponding merge commit; or remove only `kolfat-support-link` code from `assets/nav-dropdown.js` and `assets/nav-dropdown.css`, then restore the prior documentation as necessary. No payments or personal data are processed on the site.

## 2026-10-25 — Optional Ko-fi support, repository sponsor link, and mandatory change documentation

**Reason:** Give satisfied users an entirely voluntary method to support KOLFAT without subscriptions, paywalls or intrusive prompts. Enforce the project owner's requirement to document every GitHub change for troubleshooting and recovery.

**Changed files:** `.github/FUNDING.yml`, `.github/PULL_REQUEST_TEMPLATE.md`, `tools/index.html`, `tools/tests/support-links.test.mjs`, `README.md`, `docs/SUPPORT_FUNDING.md`, `docs/CHANGE_MANAGEMENT.md`, this change log.

**Implementation:** `ko_fi: kolfat_app` points the GitHub repository Sponsor button to `https://ko-fi.com/kolfat_app`. A modest `☕ Tip (optional)` link appears only in the main TOOLS directory footer. It is an ordinary external link, not a payment script or embedded donation widget. GitHub sponsorship feature may require a repository administrator to enable it in Settings. Existing tools, prices, privacy processing and other pages are unchanged.

**Verification:** Static funding, URL, markup, privacy and documentation checks in `tools/tests/support-links.test.mjs`; run with the repository's Node regression suite before merging. Confirm live GitHub button and Ko-fi payment mode independently.

**Rollback:** Revert this change's merge commit, or remove `.github/FUNDING.yml` and the specific `☕ Tip (optional)` footer anchor from `tools/index.html`; restore prior README/change-policy text as needed. No payment data or secrets are stored in the repository. See [support recovery instructions](SUPPORT_FUNDING.md).

## 2026-10-25 — Site-wide UI consistency audit and improvements

**Pull request:** [#16](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/pull/16)  
**Merge commit:** [`1e0e78f`](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/commit/1e0e78ffc0f3e926a3ff75f81e637e6618b726f8)

- Updated shared `assets/site-refinements.css` for navigation alignment, wider editorial layouts, heading hierarchy, accessible focus indicators, and RTL/script-aware typography.
- Updated `tools/assets/tools.css` to improve card consistency, text wrapping, form sizing, and mobile layout across the existing 48 utilities.
- Added the dedicated [UI audit](UI_DESIGN_AUDIT_2026-10-25.md), source checks, and Chromium geometry tests across representative home/product/content/tool pages in twelve languages.
- **Scope limit:** automated representative UI tests passed before merge; a manual visual inspection of every website page and verification of the live deployment were not completed as part of that audit.
- Existing routes, translations, mascots, backgrounds and utility processing were not intentionally changed.

## 2026-10-25 — Persian homepage typography corrections

**Pull requests:** [#14](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/pull/14), [#15](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/pull/15)

- Fixed overly tight Persian headline leading and awkward line breaks.
- Follow-up corrected a smaller-than-English font-size regression: Persian now uses the English responsive headline-size formulas, with Persian-specific line spacing and no second-line shrink.
- Added seven-viewport Chromium size, overflow and parity checks for the Persian hero.
- Only the Persian homepage typography was modified by these two targeted fixes.

## 2026-10-25 — Security checkbox styling and visual regression repair

**Pull requests:** [#12](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/pull/12), [#13](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/pull/13)

- Replaced oversized checkboxes with selectable KOLFAT-themed tiles in Password Generator and Sensitive Text Redactor, following the existing Time Zone Converter style.
- Corrected the shared form CSS conflict that made native checkboxes behave like full-width text inputs; isolated security tile layout from generic two-column forms.
- Added browser layout tests for tile size, alignment, labels, interaction and narrow/mobile widths and versioned the updated stylesheet.

## 2026-10-25 — Security & Text Analysis collection (12 utilities)

**Pull request:** [#11](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/pull/11)

- Added the fourth TOOLS category at `/tools/security/`, twelve individual tool URLs and sitemap entries, bringing the directory to 48 utilities and four categories.
- Includes secure password/passphrase generation, heuristic strength/secret checks, JWT **decoding without signature verification**, hashing, redaction, text diff, Unicode/IDN inspection, offline URL structure checks and UTF-8 inspection.
- Browser smoke tests exercised the new tool action buttons before merge; functionality limitations remain documented on individual pages.

## 2026-10-24 — Networking & Automation collection (12 utilities)

**Pull requests:** [#8](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/pull/8), [#9](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/pull/9)

- Added `/tools/networking/` and twelve offline calculators, planners and automation helpers.
- Fixed an initial release-breaking issue where twelve HTML pages omitted the `data-network-tool` identifier, preventing their common JavaScript dispatcher from selecting a utility. Added page/handler contract tests.
- All networking operations are offline; the port reference is not a network scan and the Compose checker is not the official validator.

## 2026-10-23 — Code & Data Utilities collection (12 utilities)

**Pull request:** [#6](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/pull/6)

- Added `/tools/code-data/` and twelve tools for JSON, restricted YAML, CSV, XML, Base64, URL components, regular expressions, UUIDs, HTML entities, basic SQL formatting, Markdown preview and a documented JSON Schema subset.
- Added tool-specific URLs, browser-local processors, SVG icons, sitemap entries and regression checks.
- Regex evaluation runs in a terminating worker; advanced YAML and JSON Schema constructs remain explicitly unsupported.

## 2026-10-23 — Photo & File collection expanded to 12 utilities

- The original six photo/file browser utilities were expanded with image watermarking, photo rotation/cropping, image-to-PDF, SHA-256 verification, QR generation and photo color palette extraction.
- The `/tools/photo-file/` category page created later retains those 12 utilities; existing individual tool URLs were preserved.

## 2026-10-25 — Consolidated TOOLS privacy notice

- Kept one clear privacy and local-processing notice on the main `/tools/` category directory, covering all 48 tools.
- Removed repeated green privacy banners from the 48 individual tool pages and four category pages; page features and processing engines are unchanged.
- Added a regression test requiring exactly one privacy banner across all 53 TOOLS HTML pages.
- Tool-specific safety limitations and explanations remain where relevant.


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
