# KOLFAT SEO Autopilot — Phase 2: SiteOne baseline

This repository already has `KOLFAT Website Content Audit` and `KOLFAT Tools Regression` workflows. The new `KOLFAT SEO - SiteOne Live Crawl` workflow complements them by auditing the **published** website, not only HTML checked into Git.

## Safety and scope

- Manual on-demand audit during the first phase (no schedule yet).
- Read-only `contents: read` permission; `persist-credentials: false`.
- No commits, pushes, API writes, auto-fixes, automatic publication, or changes to the Cloudflare configuration.
- URL seeds are validated and extracted from `sitemap.xml`, with the site homepage included.
- Two concurrent workers, maximum two requests per second, 3,500 visited URLs, 45-minute job timeout.
- The crawler is downloaded as a pinned release and validated against the upstream SHA-256 digest.
- Reports stay in the GitHub Actions artifacts for 14 days and include HTML, JSON, text, seed list and console log.
- Automated crawl failure does not modify production. Review findings before making any SEO fixes.

## Run the first baseline

1. Merge the reviewed workflow-only pull request into `main`.
2. Open **Actions → KOLFAT SEO - SiteOne Live Crawl**.
3. Click **Run workflow**, select `main`, and run.
4. Open the resulting workflow run, check the summary, and download `kolfat-siteone-seo-baseline` from **Artifacts**.
5. Review crawler issues, prioritizing live 4xx/5xx, broken assets, canonicals, titles, and hreflang. Note that crawler warnings are hypotheses until verified.

## Later phases (not enabled)

After confirming coverage, duration, request limits, and report accuracy, add a weekly schedule through another reviewed PR. Separately connect Search Console performance data, and then optionally create *draft* pull requests for deterministic technical corrections with dedicated tests. AI-generated copy, translations and branding changes require explicit review.

### Existing coverage

The current `site-content-audit.yml` scans repository HTML for stale wording and broken internal links. It is intentionally not replaced. The `kolfat-tools-regression.yml` workflow checks functional tools and sitemap integrity.
