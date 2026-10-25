# KOLFAT website navigation — production specification

## Design contract

- **Desktop and mobile:** KOLFAT logo at upper left; a single **MENU** dropdown at upper right.
- **Localized pages:** language chooser is immediately to the right of MENU, not embedded in it. Keep all twelve languages and their existing URL destinations.
- **No second toolbar:** remove the old footer/hero `primary-seo-links` and `seo-footer-links` button bars. The existing descriptive homepage footer tagline stays.
- **Contact:** `mailto:contact@kolfat.app` is inside MENU, not a fixed overlapping box. Keep the Microsoft Store call-to-action within page content.
- **Links in menu:** Home (current language where available), MEDIA KOLFAT, Download, About, Guides, Support, Contact, X, YouTube, TikTok, GitHub. The TOOLS templates additionally expose TOOLS; templates currently differ in their precise menu items, so do not assume all menus include the same link set.
- **Language:** localize MENU and internal navigation labels; About, Download, the Guides hub, and all five guide articles now have genuine localized pages in every supported language. Each locale must link to its own translated route.
- **Styling:** monochrome, matches existing KOLFAT appearance; no animations required to navigate.
- **Mobile:** all controls share one header row, with no overlap with the logo; dropdown scrolls vertically when the device screen is short. Test 320, 360, 375, 390 and 430 CSS-pixel widths.
- **Desktop:** test 1024, 1280, 1440 and 1920 CSS-pixel widths.

## Files

- `assets/nav-dropdown.css`: shared responsive layout. Loaded after legacy inline styles and shared CSS.
- `assets/nav-dropdown.js`: outside-click dismissal, Escape-key focus restoration and mutual exclusion of MENU/language.
- `.github/scripts/nav_dropdown_rollout.py`: idempotent static-page upgrade with metadata preservation checks.
- `.github/workflows/nav-dropdown-rollout.yml`: applies the upgrade after a specific trigger commit.
- `README.md`: links to this specification.

All anchors are ordinary server-rendered HTML, visible in page source and accessible to search crawlers even though MENU starts collapsed. The script is a progressive enhancement; the native HTML `<details>` remains functional without JavaScript.

## Routes and SEO

Localized landing pages: `/<lang>/`, localized MEDIA KOLFAT: `/<lang>/Media_Kolfat/` for `en fa de fr es pt it ja zh hi ru ar`. Localized support/legal pages retain their existing paths and language switcher. Do not modify canonical, hreflang, robots, JSON-LD, CNAME, sitemap, SEO titles, or descriptions when changing navigation.

The original English URLs `/about/`, `/download/`, `/guides/` and five guide articles remain unchanged for backwards compatibility. Equivalent localized pages are `/<lang>/about/`, `/<lang>/download/`, `/<lang>/guides/` and `/<lang>/guides/<article>/` for every other supported language. The language selector must switch between these exact corresponding pages. The Getting Started help remains English-only until separately localized.

## Acceptance checks

1. On mobile, logo/MENU/language share one row, with no overlap. No horizontal scrolling caused by top navigation.
2. MENU opens and closes with tap/click or keyboard Enter/Space. Escape closes the dropdown and restores focus.
3. Opening the language dropdown closes MENU and vice versa; clicking outside closes any open dropdown.
4. Every MENU link works. External links open in a separate tab and have `rel="noopener noreferrer"`.
5. On all localized home/product/legal pages, language choice retains the current page type.
6. HOME, MEDIA KOLFAT, Download, About and Guides all lead to the selected language; article language switching preserves the article topic.
7. Bottom SEO links and floating contact box do not reappear on mobile or desktop.
8. Microsoft Store download link and page content remain available.
9. Homepage hero and product hero remain usable at 320px and desktop widths.
10. Canonical/hreflang/schema, sitemap, and robots file contents are unchanged by this navigation patch.
11. The GitHub Pages build/deploy must pass; verify the deployed pages and hard-refresh if CSS caching persists.

## Rollback

Restore the prior page/asset versions from Git history if necessary. Do not delete the language selector or alter production URLs while rolling back. Review mobile and desktop screenshots before closing a regression.

## Maintenance

Edit shared menu generation in `.github/scripts/nav_dropdown_rollout.py` and shared layout in `assets/nav-dropdown.css`; keep all localized pages in sync. The rollout script is meant for a one-time migration, not as a perpetual workflow that mutates content on every push. For later updates, use reviewed Git changes and regression tests.


## Localized content expansion (2026-10-18)

- 88 additional translated URLs: 11 languages × (About, Download, Guides hub, five articles). 96 content URLs including the eight original English pages.
- Translation sources: `.github/i18n/{fa,de,fr,es,pt,it,ja,zh,hi,ru,ar}.json`.
- Generator and metadata validation: `.github/scripts/localize_content_pages.py`.
- Localization styling: `assets/localized-content.css`; keep RTL for Persian and Arabic.
- Every translated page has a self-canonical, reciprocal 12-language `hreflang` plus `x-default`, translated title/description and visible body text, valid JSON-LD, translated MENU and localized footer links.
- All original 93 sitemap URLs are retained; 88 new canonical URLs increase expected sitemap count to **181**.
- Avoid creating empty or English-only placeholder translations. Translation edits should be reviewed by a native speaker where practical.


## Mobile header regression fix (2026-10-19)

The shared navigation stylesheet now explicitly hides the menu panel and language list unless their native HTML `details` element is open. Previously `display:grid!important` on a closed panel overrode native hiding and resulted in a large dark overlay.

English content pages and localized content pages now use the same single-row header layout at mobile widths: KOLFAT logo, MENU and the separate language selector. No extra navigation row or permanently visible overlay is permitted. The final selectors in `assets/nav-dropdown.css` override older conflicting layout rules in `assets/seo-content.css` and `assets/localized-content.css`.

`assets/nav-dropdown.css?v=20261019-mobile3` is the versioned stylesheet used by all production pages after the rollout. Regression checks: closed MENU and language list must not be visible; each opens on demand; both can close via Escape/outside click; mobile widths 320/360/375/390/430px, tablet and desktop; English plus Persian/Arabic RTL pages.


## Shared visual refinement system (2026-10-19)

At the time of the October 19 rollout, `assets/site-refinements.css` was applied across **181 sitemap-indexed pages** (all 12 languages, including home, product, legal, About, Download, Guides and articles). The sitemap has since grown to **234 canonical URLs** as of October 25, including 53 TOOLS URLs. This paragraph describes the historical October 19 rollout, not today's page count. This is a restrained improvement only: typography, body readability, heading sizing, link focus, spacing, and orange `#ff812e` accents. Original background photography, CRT/mascot imagery, KOLFAT logo, page layouts, URLs, visible content, Microsoft Store button, and navigation architecture are intentionally unchanged.

Use a single presentation system across screen sizes; only responsive text scaling and layout fit differ. Keep native font fallback per script for Persian/Arabic (RTL), Hindi, Japanese, and Chinese without loading external fonts. Do not overwrite all writing systems with one Latin font.

Maintenance: edit `assets/site-refinements.css` and increment its query-string version in the static pages. The deployment script `.github/scripts/apply_site_refinements.py` validates the current sitemap and preserves canonical, hreflang, and JSON-LD exactly. Always check closed/open menu states, 320–430px mobile, tablet, desktop, LTR and RTL, and record screenshots before asserting visual QA.

## October 25, 2026 — UI consistency and TOOLS navigation

- Site-wide UI updates are tracked in [UI_DESIGN_AUDIT_2026-10-25.md](UI_DESIGN_AUDIT_2026-10-25.md), with page geometry tests in `tools/tests/site-ui-audit.spec.mjs` and source checks in `tools/tests/site-ui-source.test.mjs`.
- The main TOOLS dashboard is `/tools/`, with four collection routes: `/tools/photo-file/`, `/tools/code-data/`, `/tools/networking/`, and `/tools/security/`. Each collection contains twelve tools; see [TOOLS_PLATFORM.md](TOOLS_PLATFORM.md).
- The general website supports twelve languages. All 48 tools remain English-only until their separate localization project is developed and verified; do not add a language chooser that points to untranslated pages.
- Shared CSS `assets/site-refinements.css` controls common visual details. Tools use `tools/assets/tools.css` and category-specific CSS. Preserve the cinematic homepage design, content-page reading width, mobile header alignment and RTL text readability.
- Keep native keyboard operation, `<details>` menu visibility, visible focus styling, responsive card grids, and verified navigation for English/Persian/Arabic and the other site languages.
- The October 25 UI audit Chromium suite checked representative pages and two viewport widths, not every URL individually. Treat passed CI as a release gate, not a substitute for human visual review of every template.
