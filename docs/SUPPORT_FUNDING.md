# KOLFAT Optional Support / Funding

**Established:** October 25, 2026  
**Public destination:** https://ko-fi.com/kolfat_app  
**Intent:** Optional one-time financial support for the developer. This is not a paid application license, a subscription requirement, or a condition for access to the current 48 free KOLFAT TOOLS.

## Current setup

1. **Ko-fi account:** Public name `KOLFAT` and account identifier `kolfat_app`, provided by the account owner. The user selected PayPal and Ko-fi Free mode with optional one-time tips.
2. **Ko-fi page controls:** The owner's screenshot shows a default €2 tip and both *One time* and *Monthly* tabs. If the goal is strictly one-time support, the owner should open **Ko-fi → Memberships → Memberships Mode** and set it to **Off**. This is a Ko-fi account setting, not something GitHub Pages can control.
3. **Funding file:** `.github/FUNDING.yml` uses `ko_fi: kolfat_app`. GitHub supports the Ko-fi account identifier, not the full URL, in the `ko_fi` key.
4. **GitHub Sponsor button:** If the repository's Sponsor button is not visible, an administrator must check **Settings → General → Features → Sponsorships**. Presence of `FUNDING.yml` alone is not proof that the button is enabled in GitHub's interface.
5. **Public website:** The only added Ko-fi link is in the **main** `/tools/` footer, marked "☕ Tip (optional)." We intentionally do not show fundraising popups or ask for donations in individual tool workflows.

## Boundaries

- Existing KOLFAT TOOLS remain free. Tips do not unlock functionality and are never required.
- The website does not run embedded checkout scripts or process payment card numbers; the link opens Ko-fi as an external service.
- Ko-fi and PayPal policies, processing fees and any transaction-related personal information are managed separately from this GitHub repository.
- No payment credentials, PayPal account identifiers, donor personal data, webhooks or secrets belong in `FUNDING.yml` or other public website files.
- In Ko-fi Free mode, **Ko-fi's platform fee on one-time tips is 0%**, while PayPal/Stripe processing fees can still apply. Confirm current terms on Ko-fi before changing the account settings.

## Validation

Run `node --test tools/tests/*.test.mjs` or verify the **KOLFAT Tools Regression** workflow. Open `/tools/`, verify there is exactly one external optional-tip footer link, confirm its address, and make sure all four category cards and existing tool links still work. In GitHub, inspect the repository's funding menu and confirm whether Sponsorships is enabled. Do not perform a test payment automatically.

## Rollback and troubleshooting

- To hide the tip from the website: remove the footer anchor containing `https://ko-fi.com/kolfat_app` from `tools/index.html`; redeploy GitHub Pages.
- To remove the GitHub Sponsor link: remove or change `.github/FUNDING.yml`; Github will update the available funding links.
- To revert the whole change, revert the support integration merge commit from GitHub history. Retain this record as the recovery reference.
- If Ko-fi changes its username, update the destination and funding key **together** in the same commit, plus README and WEBSITE_UPDATES. Avoid broken or redirected donation links.
- If recurring tips are still visible on Ko-fi, check **Memberships → Memberships Mode** directly in Ko-fi; it is not controlled by the GitHub repo.
