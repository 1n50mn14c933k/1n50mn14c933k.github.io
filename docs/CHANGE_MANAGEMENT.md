# KOLFAT GitHub Change Management Policy

**Mandatory rule, requested by the repository owner, effective October 25, 2026:**

> **After EVERY GitHub change, update the relevant GitHub documentation in the same pull request or commit. Never mark a change complete without documenting it.**

This policy applies to code, website UI, content, translations, assets, workflows, infrastructure configuration, funding links, and documentation changes.

## Required records for every change

1. **Description / purpose:** What changed, why it was necessary, and what problem it solves.
2. **Scope / affected files:** Paths, functionality, pages, languages, dependencies and whether existing workflows are unchanged.
3. **Verification evidence:** Commands/tests and outcomes actually observed; clearly distinguish source checks, automated browser checks, and live deployment or manual QA. Never claim "tested" if unverified.
4. **Known risks / limitations:** Open problems, production caveats, feature flags, security/privacy impact and any incomplete validation.
5. **Rollback / recovery:** How to revert the commit or selectively undo the change, plus any special backup/recovery steps needed.
6. **Traceability:** Link to pull request and commit SHA when known, version/date, and updated README, runbook, troubleshooting or topic-specific documents as relevant.

Record the entry in [WEBSITE_UPDATES.md](WEBSITE_UPDATES.md) for website changes. Keep [README](../README.md), [TOOLS_PLATFORM](TOOLS_PLATFORM.md), [NAVIGATION](NAVIGATION.md), [SECURITY](../SECURITY.md), [SUPPORT_FUNDING](SUPPORT_FUNDING.md) and [UI audit](UI_DESIGN_AUDIT_2026-10-25.md) current where they apply. Do not rewrite unrelated historic change history.

## Mandatory pull request checklist

- [ ] Required code/content changes are reviewed and minimal.
- [ ] Existing user data and secrets stay safe, and privacy/security effects are considered.
- [ ] Automated checks are executed and their **actual** results recorded.
- [ ] The change has a rollback or restore plan. Identify backups for destructive changes.
- [ ] `docs/WEBSITE_UPDATES.md` (or the project equivalent) is updated in **this PR**.
- [ ] All related documentation is updated **in this same PR**; if a document is unaffected, say so.
- [ ] Real deployment / browser checks are identified as complete or **not yet verified**.
- [ ] The PR summary has links to the documentation and a commit SHA.

**Hard release gate:** Documentation is a requirement, not optional cleanup after deployment. Even quick visual fixes and emergency hotfixes require a documented change and recovery instructions in the delivery.

## Emergency changes

When an urgent fix cannot wait for a normal PR, include its documentation and rollback information in the emergency commit if feasible. If an operational emergency truly prevents this, explicitly mark documentation incomplete and do not present the work as fully finished until it is recorded.

## Future projects

Follow the same rule for KOLFAT application repositories, Gitea repositories and GitHub workflows whenever the owner asks for modifications. In repositories without a change log, create a suitable `CHANGELOG.md` or `docs/CHANGES.md` in the same PR. Do not assume documenting this website repository automatically updates any other repository.
