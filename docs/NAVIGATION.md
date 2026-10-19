# KOLFAT website navigation — production specification

## Design contract

- **Desktop and mobile:** KOLFAT logo at upper left; a single **MENU** dropdown at upper right.
- **Localized pages:** language chooser is immediately to the right of MENU, not embedded in it. Keep all twelve languages and their existing URL destinations.
- **No second toolbar:** remove the old footer/hero `primary-seo-links` and `seo-footer-links` button bars. The existing descriptive homepage footer tagline stays.
- **Contact:** `mailto:contact@kolfat.app` is inside MENU, not a fixed overlapping box. Keep the Microsoft Store call-to-action within page content.
- **Links in menu:** Home (current language), MEDIA KOLFAT (current language), Download, About, Guides, Support (current language), Contact, X, YouTube, TikTok, GitHub.
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
