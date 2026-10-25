# KOLFAT TOOLS — Production Inventory and Maintenance

**Status:** October 25, 2026. **48 tools** in four categories, plus five directory/category pages. Main directory: https://kolfat.app/tools/

## Page inventory

Each category has a dedicated index and 12 utility URLs. All links below resolve through the static website's `/tools/` path.

### Photo & File Tools — `/tools/photo-file/`

| Tool | Route |
| --- | --- |
| EXIF & GPS Privacy Cleaner | `/tools/exif-cleaner/` |
| Image Compressor & Resizer | `/tools/image-compressor/` |
| Image Format Converter | `/tools/image-converter/` |
| Photo Date Detective | `/tools/photo-date-detective/` |
| Duplicate File Checker | `/tools/duplicate-checker/` |
| Batch File Renamer | `/tools/batch-file-renamer/` |
| Image Watermark Maker | `/tools/image-watermark/` |
| Photo Rotator & Cropper | `/tools/photo-rotator/` |
| Image to PDF | `/tools/image-to-pdf/` |
| SHA-256 File Verifier | `/tools/sha256-verifier/` |
| QR Code Generator | `/tools/qr-code-generator/` |
| Photo Color Palette Extractor | `/tools/photo-color-palette/` |

### Code & Data Utilities — `/tools/code-data/`

| Tool | Route |
| --- | --- |
| JSON Formatter & Validator | `/tools/code-data/json-formatter/` |
| YAML ↔ JSON Converter | `/tools/code-data/yaml-json-converter/` |
| CSV ↔ JSON Converter | `/tools/code-data/csv-json-converter/` |
| XML Formatter & Validator | `/tools/code-data/xml-formatter/` |
| Base64 Encoder & Decoder | `/tools/code-data/base64-encoder/` |
| URL Encoder & Decoder | `/tools/code-data/url-encoder/` |
| Regex Tester | `/tools/code-data/regex-tester/` |
| UUID Generator | `/tools/code-data/uuid-generator/` |
| HTML Entity Converter | `/tools/code-data/html-entity-converter/` |
| SQL Formatter | `/tools/code-data/sql-formatter/` |
| Markdown Live Preview | `/tools/code-data/markdown-preview/` |
| JSON Schema Validator | `/tools/code-data/json-schema-validator/` |

### Networking & Automation — `/tools/networking/`

| Tool | Route |
| --- | --- |
| IPv4 Subnet / CIDR Calculator | `/tools/networking/ipv4-subnet-calculator/` |
| IPv6 Prefix Calculator | `/tools/networking/ipv6-prefix-calculator/` |
| VLSM Subnet Planner | `/tools/networking/vlsm-subnet-planner/` |
| IP Range ↔ CIDR Converter | `/tools/networking/ip-range-cidr-converter/` |
| VLAN & IP Address Planner | `/tools/networking/vlan-ip-planner/` |
| Network Port Reference | `/tools/networking/network-port-reference/` |
| Cron Expression Builder | `/tools/networking/cron-expression-builder/` |
| Systemd Timer Builder | `/tools/networking/systemd-timer-builder/` |
| Unix Timestamp Converter | `/tools/networking/unix-timestamp-converter/` |
| Time Zone Converter | `/tools/networking/time-zone-converter/` |
| Linux chmod Calculator | `/tools/networking/linux-chmod-calculator/` |
| Docker Compose YAML Checker | `/tools/networking/docker-compose-checker/` |

### Security & Text Analysis — `/tools/security/`

| Tool | Route |
| --- | --- |
| Secure Password Generator | `/tools/security/password-generator/` |
| Secure Passphrase Generator | `/tools/security/passphrase-generator/` |
| Password Strength Estimator | `/tools/security/password-strength/` |
| JWT Decoder & Inspector | `/tools/security/jwt-inspector/` |
| Text Hash Generator | `/tools/security/text-hash-generator/` |
| Secret Leak Scanner | `/tools/security/secret-leak-scanner/` |
| Sensitive Text Redactor | `/tools/security/sensitive-text-redactor/` |
| Text & Code Diff Checker | `/tools/security/text-code-diff/` |
| Unicode & Homoglyph Inspector | `/tools/security/unicode-inspector/` |
| Punycode / IDN Converter | `/tools/security/punycode-converter/` |
| URL Safety Inspector | `/tools/security/url-safety-inspector/` |
| Text Hex & UTF-8 Inspector | `/tools/security/text-hex-utf8/` |

## Architecture

- `tools/index.html`: four-category landing page with the **one** site-wide tools privacy notice.
- `tools/<category>/index.html`: collection pages for the four categories.
- `tools/<utility>/index.html` or `tools/<category>/<utility>/index.html`: independent HTML for each tool, with stable IDs and buttons.
- `tools/assets/tools.css`, `tools/assets/tools-categories.css`, `tools/assets/code-data.css`, `tools/assets/networking.css`, `tools/assets/security.css`: shared and scoped dark/orange visual styles.
- `tools/assets/core.mjs`, `phase2.mjs`, `code-data-core.mjs`, `code-data-advanced.mjs`, `networking-address.mjs`, `networking-automation.mjs`, `security-core.mjs`, `security-text.mjs`: local transformation and calculation modules.
- `tools/assets/app.mjs`, `code-data-app.mjs`, `networking-app.mjs`, `security-app.mjs`: browser DOM event handlers and output wiring.
- `tools/assets/vendor/`: bundled QR generation library and license.
- `tools/tests/`: Node unit, HTML contract and Chromium interaction/layout checks. CI: `.github/workflows/kolfat-tools-regression.yml`.

## Functional and privacy boundaries

All tool inputs are intended to be processed inside the browser with no server-side transformation or storage. No tool requires an account. Keep this invariant during maintenance; do not introduce network calls for submitted data without a separate decision and privacy review.

Some tools are deliberately **subsets** or **offline previews**: XML serialization isn't full formatting; YAML parser does not support all YAML syntax; JSON Schema validator supports only documented keywords; SQL formatter isn't a validator; Network Port Reference isn't a scanner; Docker Compose Checker isn't the official Docker validator; JWT Inspector doesn't verify token signatures; URL Safety Inspector doesn't query threat reputation; sensitive-text redaction and secret scanning are heuristics. Do not promise exhaustive verification in page copy.

## Localization roadmap (not yet delivered)

The marketing website supports **12 languages**: `en`, `fa`, `de`, `fr`, `es`, `pt`, `it`, `ja`, `zh`, `hi`, `ru` and `ar`. **Every one of the 48 tools is currently English-only.** No new translated tool URLs should be advertised or entered in the sitemap before fully translated pages exist.

Recommended implementation: translate each category description, tool title, button, field label, warning, status, instructional/help text, download label and accessible name. Decide explicitly how to localize generated result explanations and errors. Do not translate code tokens, JSON/YAML/SQL syntax, URL encodings, algorithm identifiers or machine-readable outputs. Preserve working handler IDs, clipboard controls and filenames. Test RTL for Persian and Arabic; compare mobile and desktop screenshots, canonical/hreflang and sitemap integrity per language. Have fluent speakers review translated strings.

## Release checklist

1. Verify all relevant category and tool pages have a valid local handler and interactive controls.
2. Run unit tests and browser checks (including CSS layout/overflow at mobile widths).
3. Confirm correct keyboard operation and focus indicators, especially checkboxes, selection tiles and drop-down menus.
4. Confirm local-only data processing and inspect third-party dependencies and licenses.
5. Verify new URLs have matching HTML files, canonical tags and sitemap entries; don't break existing URLs.
6. Audit English/RTL rendering and mobile screenshots; review a live deployed page before claiming visual sign-off.
7. Document the GitHub PR, commit and limitations in [WEBSITE_UPDATES.md](WEBSITE_UPDATES.md).
