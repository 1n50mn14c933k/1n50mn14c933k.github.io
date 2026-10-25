# Multilingual KOLFAT TOOLS

**Updated:** October 25, 2026. **Status:** feature branch, not approved for release.

## Inventory and architecture

The English site has 53 tool-related HTML pages: 48 utility pages, four category pages and one directory. New localized pages are generated for de, fr, es, pt, it, ru, zh, ja, hi, fa and ar, totaling 583 additional pages and 817 site sitemap entries. Technical engines are reused. No new file processing API or external CDN is introduced.

- tools/assets/i18n-data.mjs: all 48 tool names translated into 11 languages and shared labels.
- tools/assets/i18n.mjs: browser-local language UI, headings, navigation, link rewriting, statuses, language chooser.
- tools/assets/i18n.css: styles for RTL and responsive selector consistent with the existing KOLFAT dark/orange design.
- scripts/generate-localized-tools.mjs: static clone generator with localized title, canonical, hreflang and metadata.
- .github/workflows/generate-localized-tools.yml: generates route pages and sitemap on the feature branch.

## Release blockers

This is NOT yet fully translated: individual input labels, every description, help/caveat, validation error, some statuses and structured result messages require manual, domain-specific translations and review. Technical strings, programmatic data and security warnings must not be silently replaced with inaccurate prose. The Chromium suite must test all 48 tools across representative languages, 320px mobile and desktop, RTL focus behavior, and generated URL and metadata uniqueness.

## Verification and rollback

Run the generator; verify all 583 static pages, unique sitemap URLs and canonical/hreflang. Check that the English engines are unchanged, secrets remain local, and actions still work. Have fluent speakers verify each language, especially security disclaimers, before merging. Emergency rollback: revert the future PR merge commit and redeploy; English routes remain intact. Do not merge while translations or functional QA remain incomplete.

**Project policy:** Every future edit requires same-commit change history, test evidence and recovery information.

## English-language entry point

The shared `assets/nav-dropdown.js` now adds a 12-language selector to the original English tool pages. Visitors can switch directly from an English utility to the corresponding localized URL and back. Both mobile navigation and preservation of active tool route need Chromium QA. This change is part of this draft PR only; no other marketing page receives the extra selector.
