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

## Primary Pages

- KOLFAT: https://kolfat.app/
- MEDIA KOLFAT: https://kolfat.app/en/Media_Kolfat/
- Support: https://kolfat.app/support/
- Privacy: https://kolfat.app/privacy/
- Terms: https://kolfat.app/terms/
- Disclaimer: https://kolfat.app/disclaimer/
- Licenses: https://kolfat.app/licenses/

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

## Security

See [SECURITY.md](SECURITY.md) for security and responsible-disclosure guidance.
