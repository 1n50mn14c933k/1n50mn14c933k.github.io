# Security Policy

## Scope

This repository publishes the static **KOLFAT production website** and public MEDIA KOLFAT website assets.

Because the repository is public and deployed through GitHub Pages, all committed content must be treated as publicly accessible.

## Never Commit

Do not commit:

- Passwords or API tokens
- GitHub personal access tokens
- SSH, VPN, TLS, or code-signing private keys
- Signing certificates or Microsoft Store credentials
- Recovery codes
- Real environment files containing secrets
- Internal infrastructure addresses or sensitive diagrams
- Private customer, family, or third-party data
- MEDIA KOLFAT proprietary application source code
- Temporary files containing raw or encoded confidential material

## Reporting a Security Issue

Do **not** publish exploitable security findings in a public issue.

Use GitHub's private security reporting/security advisory mechanism when available, or contact the repository owner privately through GitHub.

For general KOLFAT support, use:

https://kolfat.app/support/

## Secret Handling

Secrets must never be stored in this repository.

Use GitHub repository/environment secrets only when a workflow genuinely requires them, and grant workflows the minimum permissions necessary.

If a secret is accidentally committed, assume it is compromised and rotate or revoke it immediately. Removing the value from the newest commit is not sufficient.

## GitHub Actions

Workflows should:

- Use least-privilege `permissions`
- Pin third-party actions to immutable commit SHAs where practical
- Avoid unnecessary `contents: write`
- Never reconstruct or publish assets from secret material
- Avoid committing generated temporary artifacts back into the production branch

## Production Review

Before publishing a change:

1. Review the public diff
2. Check for credentials, internal identifiers, and sensitive metadata
3. Verify links, canonical URLs, and referenced assets
4. Confirm legal and support pages remain reachable
5. Verify the deployment does not expose development-only artifacts
