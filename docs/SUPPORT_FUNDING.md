# KOLFAT Optional Support / Funding

**Established:** October 25, 2026  
**Public destination:** https://ko-fi.com/kolfat_app  
**Intent:** Optional one-time financial support for the developer. This is not a paid application license, a subscription requirement, or a condition for access to the current 48 free KOLFAT TOOLS.

## Current setup

1. **Ko-fi:** https://ko-fi.com/kolfat_app, KOLFAT branding, PayPal, optional **one-time tips**. The owner confirmed monthly support was disabled on October 25, 2026.
2. **Website:** Every KOLFAT page displays **🧹🪣❤️ Keep Our Maid Alive, Strong & Cleaning!** in the shared header before MENU. On mobile, 🧹🪣❤️ opens a panel with the full localized message and Ko-fi link. Online Tools follows the language selector as the last top-bar control.
3. **GitHub:** The profile README in `1n50mn14c933k/1n50mn14c933k` and the public `MEDIA_KOLFAT` README display the Ko-fi shortcut. `MEDIA_KOLFAT/.github/FUNDING.yml` configures its GitHub Sponsor option. The website repository **does not** advertise a Sponsor button of its own.
4. **Previous placement:** The old `/tools/` footer-only link was removed; no donation popups, tool interruptions, or embedded Ko-fi scripts are used.

## Boundaries

- Existing KOLFAT TOOLS remain free. Tips do not unlock functionality and are never required.
- The website does not run embedded checkout scripts or process payment card numbers; the link opens Ko-fi as an external service.
- Ko-fi and PayPal policies, processing fees and any transaction-related personal information are managed separately from this GitHub repository.
- No payment credentials, PayPal account identifiers, donor personal data, webhooks or secrets belong in `FUNDING.yml` or other public website files.
- In Ko-fi Free mode, **Ko-fi's platform fee on one-time tips is 0%**, while PayPal/Stripe processing fees can still apply. Confirm current terms on Ko-fi before changing the account settings.

## Validation

Run `node --test tools/tests/*.test.mjs` and the **KOLFAT Tools Regression** GitHub Actions workflow. The global-support tests inspect HTML source and exercise representative pages in Chromium at desktop, mobile and narrow-phone widths. Verify the desktop support link before MENU and mobile tap-to-reveal panel, stays inside the viewport, opens the exact `https://ko-fi.com/kolfat_app` address in a new tab, remains readable on desktop and accessible on mobile. The site does not test a Ko-fi payment.

## Rollback and troubleshooting

- **Website:** Revert the merge commit that introduces the global shortcut; alternatively remove the final support-link initializer from `assets/nav-dropdown.js` and the related `.kolfat-support-link` styles from `assets/nav-dropdown.css`. The rest of the MENU code must remain intact.
- **Browser cache:** Old versioned asset URLs may remain cached briefly after deployment. Check the deployed JavaScript/CSS and retry after cache expiry before diagnosing a missing button.
- **GitHub profile:** Remove the support badge from the profile repository README and record the rollback in its `docs/CHANGES.md`.
- **MEDIA_KOLFAT:** Remove the support badge from its README and delete or adjust `.github/FUNDING.yml` to disable its GitHub Sponsor shortcut; record the rollback in its `docs/CHANGES.md`.
- Do not put payment secrets in public files. If Ko-fi's account name changes, update all three locations and their change logs together.
