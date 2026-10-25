# KOLFAT TOOLS Persian rollout

Date: 2026-10-25. Language: Persian (fa), right-to-left.

## Changes

- Adds 53 Persian pages under `/fa/tools/`: 48 utilities, four category pages, and the main tools directory.
- Preserves the English browser-side processing engines and local-only handling of submitted data.
- Translates the tool names, individual purposes, common controls, navigation, and 48 safety/technical limitation descriptions.
- Places the general data-privacy notice only on the main `/fa/tools/` hub; individual utilities retain their own contextual technical caveats without a repeated privacy banner.
- Adds 53 canonical routes to sitemap.xml with English/Persian hreflang, leaving other language routes untouched.
- Adds RTL route-level tests and functional checks for representative tools.

## Verification requirements

The generated page-count, local styles/scripts, canonical links, sitemap uniqueness, RTL direction, desktop/mobile overflow, real interactive workflows, and browser console must be checked. Some tool-engine generated explanations are intentionally kept in their machine-readable form (e.g., JSON, SQL, CIDR, hexadecimal text). Fluent editorial proofreading is recommended prior to declaring language perfection.

## Rollback

Revert the Persian tools PR or its merge commit. The existing English and German tool pages and processing engines are independent.
