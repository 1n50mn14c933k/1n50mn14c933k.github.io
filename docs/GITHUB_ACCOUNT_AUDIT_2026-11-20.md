# KOLFAT GitHub account audit — 2026-11-20

**Scope:** Five repositories under `1n50mn14c933k`: profile, `homelab-core`, website, private MEDIA KOLFAT source, and public `MEDIA_KOLFAT`. Checked accessible GitHub repository inventory, open issues and PRs, recent Actions runs, published release assets, and selected documentation. This is an operational/documentation audit, **not** a comprehensive source-code vulnerability scan, native build test or local machine inspection.

## Critical operational follow-up: GitHub Pages origin TLS

- [Origin TLS monitor run 44765222494](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/actions/runs/44765222494) failed on 2026-11-20.
- Direct GitHub Pages origin for `kolfat.app` and `www.kolfat.app` showed certificate expiration **2026-12-01T14:00:46Z** across all four IPv4 endpoints, **10.9 days remaining**.
- [Tracking issue #128](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/issues/128) created for a read-only check of Pages custom-domain/DNS/HTTPS certificate provisioning and renewal. Do not disable Full (strict), change DNS/proxy mode or remove the domain without an evaluated, reversible change.
- GitHub Pages deployment and security/hygiene jobs were successful in recent runs. The origin TLS monitor failure is separate from build success. The public Cloudflare-proxied site was reachable during the check; an outage is not established.

## MEDIA KOLFAT downloads dashboard

- Issue [#26](https://github.com/1n50mn14c933k/MEDIA_KOLFAT/issues/26) was an actual dashboard health alert: refresh had exceeded 110 minutes.
- The updater succeeded at [run 44771189120](https://github.com/1n50mn14c933k/MEDIA_KOLFAT/actions/runs/44771189120), and GitHub automatically closed the issue on **2026-11-20T16:14:00Z**. Intermittent scheduled-job delays remain worth monitoring.
- The [published release-integrity workflow](https://github.com/1n50mn14c933k/MEDIA_KOLFAT/actions/runs/44752952745) succeeded on November 20.
- The permanent historical asset ledger is documented in [DOWNLOAD_DASHBOARD.md](https://github.com/1n50mn14c933k/MEDIA_KOLFAT/blob/main/docs/DOWNLOAD_DASHBOARD.md). Removing an installer without a final successful snapshot loses unrecoverable downloads since the last sample; deleting assets also changes public download availability. Do not delete release assets in a docs-only update.

## Open pull requests requiring owner review

| Repository | PR | Status on 2026-11-20 | Recommendation |
|---|---|---|---|
| Website | [#116](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/pull/116) | Dependency group, 17 files; reported not mergeable | Rebase and test workflow/toolchain compatibility before merging |
| Website | [#115](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/pull/115) | macOS Public Beta DMG label | Compare with deployed dashboard and close only if already implemented |
| Website | [#108](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/pull/108) | Guides cards in all 12 locales | Verify current hubs before merging; preserve single-guide public navigation |
| Website | [#21](https://github.com/1n50mn14c933k/1n50mn14c933k.github.io/pull/21) | Draft, 611 files, not mergeable | Do not blindly merge old localization branch; inventory current routes and reconcile |
| MEDIA_KOLFAT | [#39](https://github.com/1n50mn14c933k/MEDIA_KOLFAT/pull/39) | Download badge readability | Compare against live README/badges and ledger first |
| Private source | [#2](https://github.com/1n50mn14c933k/Media_Kolfat_Source/pull/2) | setup-python v5 → v7 | Review supported runner/runtime and workflow checks |
| Private source | [#3](https://github.com/1n50mn14c933k/Media_Kolfat_Source/pull/3) | checkout v4 → v7 | Review compatibility and workflow checks |

GitHub issue search initially found the dashboard alert; it auto-closed before final review. This TLS audit intentionally opened website issue #128. No existing PR was merged or closed during the audit.

## Released platform truth

- **Windows Stable 2.5.0:** [published November 19, 2026](https://github.com/1n50mn14c933k/MEDIA_KOLFAT/releases/tag/v2.5.0) with a GitHub EXE and SHA-256 file.
- **Linux Public Beta 2.4.0:** [AppImage and checksum](https://github.com/1n50mn14c933k/MEDIA_KOLFAT/releases/tag/v2.4.0-linux-beta).
- **macOS Apple Silicon Public Beta 2.4.0:** [DMG and checksum](https://github.com/1n50mn14c933k/MEDIA_KOLFAT/releases/tag/v2.4.0-macos-beta).
- The Microsoft Store is a distinct distribution channel; do not assume that its published package version equals the GitHub version.
- **Free forever** applies to the existing product. No paid PRO edition is currently announced.
- The private source repository still documents itself as containing governance files rather than a verified full application source backup. Confirm source recoverability independently; do not publish proprietary source to the public release repository.

## Documentation changed as part of audit

- MEDIA_KOLFAT: current public roadmap and development timeline corrected.
- Private source README: current GitHub release, official URLs and source backup caveat corrected.
- Website README: corrected release/platform status and outdated English-only TOOLS claim (this PR).
- Homelab README: outdated hardcoded private inventory repository reference corrected in a separate PR.
- This document and website change history record findings only; no releases, workflow schedules, binaries, live DNS, certificates or application code were modified.

## Verification / rollback

Review the documentation diff, run repository hygiene and existing link/content CI, then merge only when required checks pass. Verify README links, version tags, and release asset names after merge. Roll back by reverting the documentation-only commits. The certificate risk is **not** resolved by this documentation update; issue #128 must be closed only after origin renewal is independently verified.
