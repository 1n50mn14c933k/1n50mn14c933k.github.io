import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("monitor", Path(__file__).with_name("seo_edge_security_monitor.py"))
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class MonitorTests(unittest.TestCase):
    def test_headers_pass(self):
        headers = {"server": "cloudflare", "strict-transport-security": "max-age=2592000",
                   "x-content-type-options": "nosniff",
                   "content-security-policy": "object-src 'none'; base-uri 'self'"}
        self.assertTrue(all(x["status"] == mod.PASS for x in mod.header_checks(200, headers)))

    def test_csp_missing_fails(self):
        headers = {"server": "cloudflare", "strict-transport-security": "max-age=2592000",
                   "x-content-type-options": "nosniff"}
        checks = mod.header_checks(200, headers)
        self.assertEqual(next(x for x in checks if x["check"] == "CSP baseline")["status"], mod.FAIL)

    def test_cloudflare_challenge_inconclusive(self):
        checks = mod.header_checks(403, {"server": "cloudflare"})
        self.assertEqual(checks[0]["status"], mod.INCONCLUSIVE)

    def test_legacy_tls_local_rejection_not_pass(self):
        x = mod.tls_interpret("TLS 1.0 blocked", 1, "no protocols available", legacy=True)
        self.assertEqual(x["status"], mod.INCONCLUSIVE)

    def test_legacy_tls_remote_alert_pass(self):
        output = ">>> TLS 1.0, Handshake [length 0020], ClientHello\n<<< TLS 1.2, Alert [length 0002]"
        x = mod.tls_interpret("TLS 1.0 blocked", 1, output, legacy=True)
        self.assertEqual(x["status"], mod.PASS)

    def test_legacy_tls_negotiated_fails(self):
        x = mod.tls_interpret("TLS 1.0 blocked", 0, "Protocol version: TLSv1\nVerification: OK", legacy=True)
        self.assertEqual(x["status"], mod.FAIL)

    def test_parse_final_headers(self):
        raw = "HTTP/1.1 200 Connection established\r\n\r\nHTTP/2 200\r\nserver: cloudflare\r\n\r\n"
        status, headers = mod.parse_http_headers(raw)
        self.assertEqual(status, 200)
        self.assertEqual(headers["server"], "cloudflare")


if __name__ == "__main__":
    unittest.main()
