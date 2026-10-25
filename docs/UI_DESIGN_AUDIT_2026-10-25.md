# KOLFAT website UI design audit
**Audit date:** 2026-10-25  
**Scope:** Visual design, responsive layouts, typography, navigation and UI accessibility only. No changes to the behavior of the 48 utilities or to translations.

## Audit findings

| Area | Finding | Remediation |
| --- | --- | --- |
| Main homepage | Cinematic home styles use very tight heading leading; some locale headlines can crowd | Improve shared leading while preserving the original artwork and per-language font sizing |
| About/Download/Guides | Content-page header uses a constrained centered width, unlike the homepage branding | Extend shared header to consistent outer margins; keep article text in a centered readable column |
| Editorial typography | Inconsistent heading scaling/spacing among page templates; certain scripts should not use Latin negative tracking | Apply page-type hierarchy and script-aware RTL line spacing |
| Mobile | Header and card layouts have multiple competing stylesheets; potential crowding at small widths | Establish minimum control targets, stable mobile header sizing, and viewport checks |
| KOLFAT TOOLS | All categories share basic structure but cards and controls have inconsistent spacing | Normalize card rhythm, heading wraps, form dimensions and responsive spacing using tool-scoped CSS |
| UI audit coverage | Existing CI focuses on tool functions and only a few visual interactions | Add Chromium UI geometry checks across 12 languages, product pages, content pages and representative tools |

## Scope and guardrails

- Keep the black, white and restrained orange KOLFAT identity, hero imagery and mascot unchanged.
- Do not change app releases, file processing, password functions, SEO canonical URLs or translated text.
- UI additions are applied through shared stylesheets instead of editing hundreds of independent copies of markup.
- The existing tools **remain English-only**. Translating all 48 tools into the current site languages is a separate future phase and should start only after the UI system is stable.
- Do not claim every page was individually visually inspected: the audit uses a source inventory of site pages and representative automated Chromium coverage across major page families.
- Ensure any regression discovered by Chromium is resolved before merging.

## Next phase: multilingual tools

After UI sign-off, create a localization strategy covering navigation, field labels, instructions, errors, result labels, RTL controls, canonical and hreflang tags, sitemaps, and language-specific browser tests. Avoid directly translating code identifiers, parser formats, security algorithm names or output formats.
