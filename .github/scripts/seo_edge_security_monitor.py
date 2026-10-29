#!/usr/bin/env python3
"""Small, read-only Cloudflare edge security monitor for kolfat.app.

One GET and four TLS handshakes. No crawling, IP allowlisting, credential use,
Cloudflare API calls, or attempts to bypass bot challenges.
"""
import argparse
import json
import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

URL = "https://kolfat.app/en/"
HOST = "kolfat.app"
USER_AGENT = "KOLFAT-Security-Monitor/1.0 (+https://kolfat.app/)"
PASS = "PASS"
FAIL = "FAIL"
INCONCLUSIVE = "INCONCLUSIVE"


def parse_http_headers(raw):
    """Parse the final HTTP header block, ignoring proxy CONNECT/interim blocks."""
    status, headers = None, {}
    for block in re.split(r"\r?\n\r?\n", raw):
        lines = block.splitlines()
        if not lines or not re.match(r"^HTTP/\d(?:\.\d)?\s+\d{3}\b", lines[0]):
            continue
        try:
            candidate_status = int(lines[0].split()[1])
        except (ValueError, IndexError):
            continue
        candidate_headers = {}
        for line in lines[1:]:
            if ":" in line:
                key, value = line.split(":", 1)
                candidate_headers[key.lower().strip()] = value.strip()
        status, headers = candidate_status, candidate_headers
    return status, headers


def result(name, state, detail):
    return {"check": name, "status": state, "details": detail}


def header_checks(status, headers):
    if status in (403, 429) and (
        "cloudflare" in headers.get("server", "").lower()
        or "cf-ray" in headers
        or "cf-mitigated" in headers
    ):
        return [result("HTTP headers", INCONCLUSIVE,
                       f"Cloudflare returned HTTP {status}; likely bot protection. "
                       "Do not disable Bot Fight Mode to obtain a score.")]
    if status != 200:
        return [result("HTTP headers", FAIL, f"Expected HTTP 200 for {URL}; got {status!r}.")]

    checks = []
    edge = ("cloudflare" in headers.get("server", "").lower() or "cf-ray" in headers)
    checks.append(result("Cloudflare edge", PASS if edge else FAIL,
                         "Cloudflare response identified" if edge else "Cloudflare not identified"))

    value = headers.get("strict-transport-security", "")
    match = re.search(r"(?:^|;)\s*max-age\s*=\s*(\d+)\b", value, re.I)
    seconds = int(match.group(1)) if match else 0
    checks.append(result("HSTS", PASS if seconds >= 604800 else FAIL,
                         f"max-age={seconds} seconds (minimum monitored: 604800)"))

    nosniff = headers.get("x-content-type-options", "").strip().lower()
    checks.append(result("No-Sniff", PASS if nosniff == "nosniff" else FAIL,
                         f"X-Content-Type-Options: {nosniff or '(missing)'}"))

    csp = headers.get("content-security-policy", "")
    object_none = re.search(r"(?:^|;)\s*object-src\s+'none'\s*(?:;|$)", csp, re.I)
    base_protected = re.search(r"(?:^|;)\s*base-uri\s+'(?:self|none)'\s*(?:;|$)", csp, re.I)
    protected = bool(object_none and base_protected)
    checks.append(result("CSP baseline", PASS if protected else FAIL,
                         "object-src 'none' and restricted base-uri" if protected
                         else "Expected CSP object-src 'none' and base-uri 'self'/'none'"))
    return checks


def run_command(args, timeout=16):
    return subprocess.run(args, capture_output=True, text=True, timeout=timeout, check=False)


def http_probe():
    args = [
        "curl", "--silent", "--show-error", "--http1.1",
        "--max-time", "12", "--connect-timeout", "6",
        "--dump-header", "-", "--output", os.devnull,
        "--user-agent", USER_AGENT, URL,
    ]
    try:
        response = run_command(args, timeout=18)
    except (OSError, subprocess.TimeoutExpired) as exc:
        return [result("HTTP headers", INCONCLUSIVE, f"Network/probe unavailable: {type(exc).__name__}")]
    if response.returncode:
        return [result("HTTP headers", INCONCLUSIVE,
                       f"curl could not complete the HTTPS request (exit {response.returncode})")]
    status, headers = parse_http_headers(response.stdout)
    return header_checks(status, headers)


def tls_interpret(name, returncode, output, legacy=False):
    """Never mistake a local OpenSSL unsupported-protocol error for server rejection."""
    if legacy:
        version = "TLSv1.1" if name == "TLS 1.1 blocked" else "TLSv1"
        if re.search(r"Protocol\s*version:\s*" + re.escape(version) + r"\b", output, re.I):
            return result(name, FAIL, f"Obsolete {version} handshake negotiated")
        sent_hello = bool(re.search(r">>>[^\n]*ClientHello", output, re.I))
        server_alert = bool(re.search(r"<<<[^\n]*Alert", output, re.I)
                            or re.search(r"alert (?:protocol version|number 70)\b", output, re.I))
        if returncode != 0 and sent_hello and server_alert:
            return result(name, PASS, "Origin edge rejected obsolete TLS handshake")
        return result(name, INCONCLUSIVE,
                      "Could not prove remote rejection; local OpenSSL may lack legacy TLS support")

    version = "TLSv1.3" if name == "TLS 1.3" else "TLSv1.2"
    agreed = bool(re.search(r"Protocol\s*version:\s*" + re.escape(version) + r"\b", output, re.I))
    trusted = bool(re.search(r"Verification:\s*OK\b|Verify return code:\s*0\s*\(ok\)", output, re.I))
    if returncode == 0 and agreed and trusted:
        return result(name, PASS, f"{version} negotiated with valid certificate")
    return result(name, FAIL, f"{version} connection or certificate verification failed")


def tls_probe(name, option, legacy=False):
    args = [
        "openssl", "s_client", "-connect", f"{HOST}:443", "-servername", HOST,
        "-brief", "-verify_return_error", "-no_ign_eof", option,
    ]
    if legacy:
        args.extend(["-cipher", "DEFAULT:@SECLEVEL=0", "-msg"])
    try:
        response = run_command(args, timeout=14)
    except (OSError, subprocess.TimeoutExpired) as exc:
        return result(name, INCONCLUSIVE, f"TLS probe unavailable: {type(exc).__name__}")
    return tls_interpret(name, response.returncode, response.stdout + "\n" + response.stderr, legacy)


def markdown(results):
    states = [r["status"] for r in results]
    state = FAIL if FAIL in states else INCONCLUSIVE if INCONCLUSIVE in states else PASS
    lines = [
        "# KOLFAT live edge security monitor",
        "",
        f"**Result: {state}**",
        "",
        f"- Checked at: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        f"- HTTPS URL: {URL}",
        "- Scope: one GET and four TLS handshakes; no full site crawl",
        "- The GitHub runner may receive a Cloudflare bot challenge even when real users are unaffected",
        "",
        "| Check | Result | Evidence |", "|---|---|---|",
    ]
    for item in results:
        safe = item["details"].replace("|", "/").replace("\n", " ")
        lines.append(f"| {item['check']} | **{item['status']}** | {safe} |")
    lines += [
        "",
        "PASS = measured compliant. FAIL = measured violation. "
        "INCONCLUSIVE = blocked/unsupported measurement; **not** a security failure or a pass.",
        "",
        "The CSP check validates the minimal existing policy, not comprehensive XSS prevention. "
        "The monitor does not assess Cloudflare WAF quality or the GitHub Pages origin.",
        "",
    ]
    return "\n".join(lines), state


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=Path("edge-security-report.md"))
    parser.add_argument("--json", type=Path, default=Path("edge-security-report.json"))
    args = parser.parse_args()
    results = http_probe()
    results.extend([
        tls_probe("TLS 1.0 blocked", "-tls1", legacy=True),
        tls_probe("TLS 1.1 blocked", "-tls1_1", legacy=True),
        tls_probe("TLS 1.2", "-tls1_2"),
        tls_probe("TLS 1.3", "-tls1_3"),
    ])
    text, state = markdown(results)
    args.output.write_text(text, encoding="utf-8")
    args.json.write_text(json.dumps({"overall": state, "results": results}, indent=2) + "\n", encoding="utf-8")
    print(text)
    if state == INCONCLUSIVE:
        print("::warning::Some checks were inconclusive, often due to Cloudflare Bot Fight Mode.")
    if state == FAIL:
        print("::error::A live edge security check failed; inspect report before adjusting settings.")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
