# Google Analytics 4 for kolfat.app

- Measurement ID: `G-F14QLKP9SC`
- Implementation: `assets/kolfat-ga4-consent.js` loaded from the shared `assets/nav-dropdown.js` script on pages that use the common navigation.
- GA4 uses **basic** consent: no Google tag request before explicit optional opt-in. Rejected visitors are not tracked.
- `analytics_storage` is granted only upon consent. All Google advertising consent categories remain denied; Google signals are disabled.
- Consent is saved locally under `kolfat_ga4_consent_v1`; a visible localized "Privacy settings" control allows changing the preference. Revoking an already-loaded tag clears available GA cookies and reloads.
- Enhanced Measurement is configured in the Google Analytics web stream. The custom event `kolfat_download_click` adds the parameter `download_source=microsoft_store|github_release`. This counts outbound **click intent**, not verified downloads or installations.
- Scripts do not inspect users' files in the browser tools. The local tool privacy notice stays only on the tools landing page.
- Privacy disclosures are updated in the site's 12 supported languages.

## Before merging and after deployment

1. Review translations, especially privacy-law language. Confirm Google Analytics admin settings (data retention, Google signals, and data-sharing settings) match the disclosure.
2. Test with browser dev tools: in a new session before consent, and after Reject, there must be **no** requests to `www.googletagmanager.com/gtag/js`, `www.google-analytics.com/g/collect`, or GA cookies. On Accept, expect normal GA4 loading and a `page_view`.
3. Verify visitor activity in **GA4 Reports > Realtime** with tracking blockers disabled for the test. It can take time to appear.
4. Verify clicks to Microsoft Store and GitHub release tag pages send one `kolfat_download_click` per click and that the `download_source` parameter matches.
5. Revoke in Privacy settings: the page should reload, clear accessible GA cookies, and stop all further GA4 requests. Re-check on another page.
6. Check desktop/mobile on `/en/`, `/fa/` (RTL), `/ar/` (RTL), `/privacy/`, `/tools/` and a tool detail page, including keyboard navigation and consent banner overlap.
7. Check whether any pages do not include the shared navigation script; add the loader there separately if found. This PR is not evidence of a sitewide runtime test.

Do not merge until consent behavior and CSP compatibility are verified in a real browser.
