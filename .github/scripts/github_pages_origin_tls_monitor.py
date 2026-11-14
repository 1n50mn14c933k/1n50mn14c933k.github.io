#!/usr/bin/env python3
"""Read-only GitHub Pages origin certificate health check (bypasses Cloudflare DNS)."""
from __future__ import annotations

import datetime as dt
import os
import socket
import ssl
import sys

HOSTS = ("kolfat.app", "www.kolfat.app")
GITHUB_PAGES_IPV4 = (
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153",
)
ALERT_DAYS = 21


def inspect(host: str, ip: str, context: ssl.SSLContext, now: dt.datetime):
    # The socket connects straight to GitHub. TLS uses host SNI and checks its CA
    # chain + hostname, exactly as a normal browser connecting to the origin would.
    with socket.create_connection((ip, 443), timeout=12) as raw:
        with context.wrap_socket(raw, server_hostname=host) as tls:
            details = tls.getpeercert()
    expiry = dt.datetime.fromtimestamp(
        ssl.cert_time_to_seconds(details["notAfter"]), dt.timezone.utc
    )
    days = (expiry - now).total_seconds() / 86400
    return expiry, days


def main() -> int:
    now = dt.datetime.now(dt.timezone.utc)
    context = ssl.create_default_context()
    rows = []
    failures = []
    for host in HOSTS:
        for ip in GITHUB_PAGES_IPV4:
            try:
                expiry, days = inspect(host, ip, context, now)
                severity = "ALERT" if days <= ALERT_DAYS else "PASS"
                rows.append((host, ip, expiry.isoformat(), f"{days:.1f}", severity))
                if severity == "ALERT":
                    failures.append(f"{host} @ {ip}: origin certificate expires in {days:.1f} days")
            except (OSError, ssl.SSLError, KeyError, ValueError) as exc:
                rows.append((host, ip, "-", "-", "FAIL"))
                failures.append(f"{host} @ {ip}: {type(exc).__name__}: {exc}")

    print(f"GitHub Pages origin TLS verification, checked {now.isoformat()}")
    print(f"Threshold: {ALERT_DAYS} days; IPs are GitHub's published Pages endpoints")
    print("Host | GitHub IP | Certificate expiry (UTC) | Days remaining | Status")
    for row in rows:
        print(" | ".join(row))
    summary_file = os.getenv("GITHUB_STEP_SUMMARY")
    if summary_file:
        with open(summary_file, "a", encoding="utf-8") as out:
            out.write("## GitHub Pages origin TLS and expiry\n\n")
            out.write(f"Checked {now.isoformat()}; alert threshold {ALERT_DAYS} days.\n\n")
            out.write("| SNI host | Direct GitHub IP | Certificate expiry UTC | Days left | Result |\n")
            out.write("|---|---|---|---:|---|\n")
            for row in rows:
                out.write("| " + " | ".join(row) + " |\n")
            out.write("\nThis test connects to GitHub Pages directly; Cloudflare DNS, proxy, and TLS settings are unchanged.\n")
    if failures:
        for issue in failures:
            print(f"::error::{issue}")
        return 1
    print("All GitHub Pages origin HTTPS certificates are valid and sufficiently far from expiry.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
