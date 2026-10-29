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

## First verified live baseline (2026-10-29)

- Run [#4](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/actions/runs/40849200066): **success**, all steps passed.
- 590 URLs fetched (459 HTML pages plus 131 assets); all returned HTTP 200; no observed 404s.
- SiteOne scores: overall 8.8/10, SEO 10/10, performance 10/10, security 6.5/10, accessibility 9.8/10, best practices 7.9/10.
- Two missing HTTP response headers on 459 HTML responses: HSTS and CSP. SiteOne counts this as 918 critical *findings*, not 918 different vulnerable pages. Review separately; don't change Cloudflare proxy settings or deploy a restrictive CSP without testing.
- Metadata length notices: 9 titles and 104 meta descriptions. These are recommendations, not missing metadata or Google penalties.
- Other notices: 1 root landing page without canonical and marked noindex (confirm intended redirect), 131 static assets short-cache, 1 missing main landmark, 5 non-clickable phone-number indications (verify for false positives).
- 9 skipped links were external domains and not checked by this crawler.

## Weekly scheduling (proposed)

The weekly workflow runs on Sundays at **03:17 UTC**, plus manual dispatch when desired. On every run it preserves read-only credentials, existing limits (2 requests/sec, 2 workers), and artifacts retained for 14 days. GitHub scheduled Actions are UTC-based and can start later during heavy service load. A successful scan does **not** mean there are no SEO or security findings; review the downloaded report.

The workflow does not automatically remediate issues, create PRs, submit indexing requests, or ingest Google Search Console data. Those tasks require independently reviewed integrations.
