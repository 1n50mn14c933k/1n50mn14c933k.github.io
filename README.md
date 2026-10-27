# KOLFAT Production Website

This repository contains the **production static website for KOLFAT**.

**Live domain:** https://kolfat.app/

## Purpose

The repository publishes the public KOLFAT website, including:

- The KOLFAT homepage
- MEDIA KOLFAT product pages
- Localized website variants
- Privacy Policy
- Terms
- Disclaimer
- Third-party licenses
- Support information
- Public website assets
- **KOLFAT TOOLS:** 48 free browser-based utilities organized into four categories
- Search-engine metadata such as `robots.txt` and `sitemap.xml`

The site is hosted with **GitHub Pages** and uses the custom domain defined in `CNAME`.

## MEDIA KOLFAT

**MEDIA KOLFAT 2.0.0 is now available through Microsoft Store and official GitHub Windows EXE downloads.** 🎉

**Current release:** **2.0.0** (Windows Microsoft Store package **2.0.0.0**, published October 27, 2026). The website's 12 localized product pages were refreshed on October 22, 2026. Read the [website update and audit log](docs/WEBSITE_UPDATES.md).

- Windows EXE on GitHub: https://github.com/1n50mn14c933k/MEDIA_KOLFAT/releases/tag/v2.0.0
- Microsoft Store: https://apps.microsoft.com/detail/9p0x091t7mv4?ocid=webpdpshare
- Product page: https://kolfat.app/en/Media_Kolfat/

- User Wiki: https://github.com/1n50mn14c933k/MEDIA_KOLFAT/wiki
- Community Discussions: https://github.com/1n50mn14c933k/MEDIA_KOLFAT/discussions
- Website update history: [docs/WEBSITE_UPDATES.md](docs/WEBSITE_UPDATES.md)

## Primary Pages

- KOLFAT: https://kolfat.app/
- **KOLFAT TOOLS:** https://kolfat.app/tools/
- Photo & File Tools (12): https://kolfat.app/tools/photo-file/
- Code & Data Utilities (12): https://kolfat.app/tools/code-data/
- Networking & Automation (12): https://kolfat.app/tools/networking/
- Security & Text Analysis (12): https://kolfat.app/tools/security/
- MEDIA KOLFAT: https://kolfat.app/en/Media_Kolfat/
- Download: https://kolfat.app/download/
- About KOLFAT: https://kolfat.app/about/
- Guides: https://kolfat.app/guides/
- Microsoft Store: https://apps.microsoft.com/detail/9p0x091t7mv4?ocid=webpdpshare
- Support: https://kolfat.app/support/
- Privacy: https://kolfat.app/privacy/
- Terms: https://kolfat.app/terms/
- Disclaimer: https://kolfat.app/disclaimer/
- Licenses: https://kolfat.app/licenses/

## KOLFAT TOOLS — 48 utilities

KOLFAT TOOLS has **four collections of twelve individual tools each**. The main `/tools/` page is a compact category dashboard; all tools have their own stable URLs. Each tool performs local browser-side processing and does not send input to a KOLFAT processing backend. The privacy notice is shown once on the main TOOLS dashboard; individual tools retain their own limitations and relevant safety warnings.

**Language status:** the 48 tools and their four category pages remain **English-only** as of October 25, 2026. The general website already supports twelve languages, but a multilingual tools release **has not yet been implemented**.

- [Tool inventory, source architecture, security boundaries and localization plan](docs/TOOLS_PLATFORM.md)
- [October 25 UI audit and visual regression scope](docs/UI_DESIGN_AUDIT_2026-10-25.md)
- [Website change history](docs/WEBSITE_UPDATES.md)

For changes affecting tools, run `node --test tools/tests/*.test.mjs` and the **KOLFAT Tools Regression** GitHub Actions workflow, which also runs Chromium browser checks and sitemap assertions. Browser tests exercise representative pages and interactions; they do **not** constitute a manual visual review of every one of the 238 committed HTML pages.

## Shared header, footer and icons

Every rendered page uses the shared header and an aligned divider. MENU entries have consistent SVG icons while preserving existing localized labels and destinations. The footer contains only **Privacy · Terms · Licenses · Support · Contact**, with localized routes where available; social networks remain in MENU. The implementation is centralized in `assets/nav-dropdown.js` and `assets/nav-dropdown.css`, documented in [docs/NAVIGATION.md](docs/NAVIGATION.md), and includes responsive/browser tests and a documented rollback in [docs/WEBSITE_UPDATES.md](docs/WEBSITE_UPDATES.md).

## Website navigation (desktop and mobile)

The site uses a common **KOLFAT MENU** dropdown at the top right. The language switcher is a separate control on multilingual marketing pages, next to MENU. The current English-only tools template has its own shared header without a localized tools language switcher. The brand logo remains on the top left. There is no second link/button row in the homepage hero/footer and no floating CONTACT overlay.

MENU contains Home, MEDIA KOLFAT, Download, About, Guides, Support, Contact (mailto), X, YouTube, TikTok and GitHub. Localized navigation maintains the current language for Home, MEDIA KOLFAT and Support; About, Download, Guides, and the five article pages are localized into all twelve site languages.

The site-wide implementation is documented at [docs/NAVIGATION.md](docs/NAVIGATION.md). The deployment stylesheet and script are `assets/nav-dropdown.css` and `assets/nav-dropdown.js`. Do not bring back the old separately positioned `support-top`, `social-top`, `github-top`, `contact-kolfat`, `primary-seo-links`, or `seo-footer-links` layouts.

## Multilingual About, Download, and Guides

All **12 supported languages** have their own About, Download, Guides hub and five photo-organization guides. English uses `/about/`, `/download/`, and `/guides/`; other languages use `/<lang>/about/`, `/<lang>/download/`, and `/<lang>/guides/`. Every article has a corresponding localized path.

The rollout keeps self-canonical URLs, reciprocal `hreflang` and `x-default`, structured data, and language-specific menu links. Translation sources live in `.github/i18n/`; see [docs/NAVIGATION.md](docs/NAVIGATION.md) for implementation and testing details.

## Shared Visual Design System

The site's sitemap currently lists **234 canonical URLs** (verified October 25, 2026), including the main TOOLS page, four category pages and 48 individual tools. The shared `assets/site-refinements.css` layer provides common layout/typography rules on existing website templates; TOOLS pages additionally use scoped styles in `tools/assets/`. The October 25 UI consistency pass adjusted header alignment, editorial page widths, accessible focus states, RTL spacing and tool card/form responsiveness without replacing the KOLFAT artwork or app functionality.

See [docs/UI_DESIGN_AUDIT_2026-10-25.md](docs/UI_DESIGN_AUDIT_2026-10-25.md) for audit findings and automated browser-coverage limitations; see [docs/NAVIGATION.md](docs/NAVIGATION.md) for navigation/RTL checks and maintenance.

## Production Repository Rules

This is a public production repository.

Do not commit:

- Passwords, tokens, credentials, or private keys
- Internal infrastructure information
- Private customer or third-party data
- Application source code for MEDIA KOLFAT
- Signing certificates or Microsoft Store credentials
- Temporary base64/image reconstruction chunks
- Local development artifacts that are not required by the deployed site

MEDIA KOLFAT proprietary application source code is maintained separately in a private repository.

## Auditing and Updates

The [website change history](docs/WEBSITE_UPDATES.md) now records the October 22 product-page update, the October 23–25 rollout of all 48 online tools, the UI/privacy/checkbox fixes, the Persian headline corrections, and the site-wide October 25 UI audit. The [UI audit report](docs/UI_DESIGN_AUDIT_2026-10-25.md) documents its scope and verification limits. These records describe website changes, not an application release.

Run the read-only audit script with `python3 .github/scripts/site_content_audit.py`, or use the **KOLFAT Website Content Audit** GitHub Actions workflow. Review GitHub Pages deployment results after updating production pages.

## Deployment

Changes committed to the production branch are published through GitHub Pages.

Before changing production content:

1. Review the diff
2. Confirm referenced assets exist
3. Check that localized navigation still works
4. Keep canonical and hreflang URLs consistent
5. Preserve `CNAME`, `.nojekyll`, `robots.txt`, and `sitemap.xml`
6. Never place secrets in repository content or workflow files
7. Verify both dropdowns, keyboard operation, and 320–430px mobile layout as well as desktop
8. Check all 12 locales plus product, support, legal and guide pages using the navigation checklist

## Voluntary Support ☕

KOLFAT remains free to use. Visitors who appreciate the current free MEDIA KOLFAT application and the 48 KOLFAT TOOLS can leave an entirely **optional, one-time tip** at [Ko-fi — KOLFAT](https://ko-fi.com/kolfat_app). Contributions are never required to use, download or access any current free features.

- Website: the global header displays **☕ Support KOLFAT** beside MENU / the language switcher on every rendered page. On small screens the accessible button uses a compact coffee icon to avoid crowding the logo.
- GitHub visibility is intentionally limited to the **profile README** at `1n50mn14c933k/1n50mn14c933k` and the **MEDIA_KOLFAT README** (plus that repository's Sponsor funding configuration), not the GitHub Pages repository.
- The older Ko-fi link in the `/tools/` footer was removed to avoid duplicate donation prompts. There are no popups, third-party donation scripts or per-tool marketing banners.
- Payment and supporter details are handled by Ko-fi and the payment provider. The website does not process payments or accept payment card details.
- Support-page details and rollback notes are documented in [docs/SUPPORT_FUNDING.md](docs/SUPPORT_FUNDING.md).

## Required documentation for every GitHub change

**Every repository change must update GitHub documentation in the same pull request or commit.** Record the purpose, changed files, verification, user-visible effect, known limits and rollback instructions in `docs/WEBSITE_UPDATES.md` and relevant topic-specific documentation. Update inventory, navigation, security or support docs whenever they become inaccurate. This requirement is also recorded in [docs/CHANGE_MANAGEMENT.md](docs/CHANGE_MANAGEMENT.md) and the [pull request template](.github/PULL_REQUEST_TEMPLATE.md).

## Security

See [SECURITY.md](SECURITY.md) for security and responsible-disclosure guidance.
