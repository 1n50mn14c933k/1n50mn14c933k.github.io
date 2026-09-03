# Security Policy

## Scope

This repository publishes the static Kolfat website and Media Kolfat public assets.

Do not commit or submit:

- Passwords or API tokens
- SSH or TLS private keys
- VPN credentials
- Internal infrastructure addresses or diagrams
- Private customer, family, or third-party data
- Environment files containing secrets

## Reporting a Security Issue

Please report security issues privately through GitHub Security Advisories for this repository, or contact the repository owner through GitHub.

Do not disclose exploitable vulnerabilities publicly before they are reviewed.

## Secret Handling

Secrets must never be stored in this repository. Use GitHub repository or environment secrets for CI/CD values and a password manager for operational credentials.
