# Cloudflare read-only security monitor setup

This extends **KOLFAT Security - Live Edge Monitor**, run manually or weekly Sunday at 03:37 UTC. The monitor makes **only GET requests** to Cloudflare. It cannot edit DNS, WAF, TLS, or the website.

## One-time token creation

1. In Cloudflare, open **My Profile → API Tokens → Create Token → Create Custom Token**.
2. Name: **KOLFAT GitHub Security Audit READ ONLY**.
3. Assign only **Zone → Zone Settings → Read**, **Zone → Transform Rules → Read**, and **Zone → Zone → Read** (if needed for zone details).
4. Set **Zone Resources → Include → Specific zone → kolfat.app**. No account-wide access or Write/Edit permissions.
5. Create the token. Do **not** paste it into an issue, chat, workflow YAML, or public commit.
6. In GitHub, open repository **Settings → Secrets and variables → Actions → New repository secret**. Create **CLOUDFLARE_READ_TOKEN** with the token value.
7. Find **Zone ID** on the Cloudflare domain overview page. Save this *identifier* as a second GitHub repository secret **CLOUDFLARE_ZONE_ID**.
8. Trigger **Actions → KOLFAT Security - Live Edge Monitor → Run workflow** and inspect **Cloudflare configuration audit** in the job summary.

If either secret is missing, the configuration check reports **INCONCLUSIVE**, not success. Cloudflare API permission errors also produce INCONCLUSIVE without printing token values or API response bodies. Configured security-setting failures produce FAIL and fail the workflow.

The API check covers Full (strict), minimum TLS 1.2, Always Use HTTPS, HSTS, No-Sniff, and the active response-header CSP transform rule for kolfat.app/www. It measures **configuration**, not user-visible response headers. The original external network probe is preserved and may still be challenged by Bot Fight Mode. This is a read-only monitoring token: rotate or revoke it if compromised.
