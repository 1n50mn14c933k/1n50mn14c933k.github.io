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
- Search-engine metadata such as `robots.txt` and `sitemap.xml`

The site is hosted with **GitHub Pages** and uses the custom domain defined in `CNAME`.

## MEDIA KOLFAT

**MEDIA KOLFAT is now available on the Microsoft Store.** 🎉

- Microsoft Store: https://apps.microsoft.com/detail/9p0x091t7mv4?ocid=webpdpshare
- Product page: https://kolfat.app/en/Media_Kolfat/

## Primary Pages

- KOLFAT: https://kolfat.app/
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

## Website navigation (desktop and mobile)

All supported website pages use the same **KOLFAT MENU** dropdown at the top right. The language switcher remains a separate control on localized pages, next to the MENU. The brand logo remains on the top left. There is no second link/button row in the homepage hero/footer and no floating CONTACT overlay.

MENU contains Home, MEDIA KOLFAT, Download, About, Guides, Support, Contact (mailto), X, YouTube, TikTok and GitHub. Localized navigation maintains the current language for Home, MEDIA KOLFAT and Support; About, Download, Guides, and the five article pages are localized into all twelve site languages.

The site-wide implementation is documented at [docs/NAVIGATION.md](docs/NAVIGATION.md). The deployment stylesheet and script are `assets/nav-dropdown.css` and `assets/nav-dropdown.js`. Do not bring back the old separately positioned `support-top`, `social-top`, `github-top`, `contact-kolfat`, `primary-seo-links`, or `seo-footer-links` layouts.

## Multilingual About, Download, and Guides

All **12 supported languages** have their own About, Download, Guides hub and five photo-organization guides. English uses `/about/`, `/download/`, and `/guides/`; other languages use `/<lang>/about/`, `/<lang>/download/`, and `/<lang>/guides/`. Every article has a corresponding localized path.

The rollout keeps self-canonical URLs, reciprocal `hreflang` and `x-default`, structured data, and language-specific menu links. Translation sources live in `.github/i18n/`; see [docs/NAVIGATION.md](docs/NAVIGATION.md) for implementation and testing details.

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

## Security

See [SECURITY.md](SECURITY.md) for security and responsible-disclosure guidance.
