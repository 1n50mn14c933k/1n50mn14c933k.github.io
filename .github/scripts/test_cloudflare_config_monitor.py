import importlib.util
import unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location("cloudflare_config_monitor",Path(__file__).with_name("cloudflare_config_monitor.py"))
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
class CloudflareTests(unittest.TestCase):
 def test_expected_configuration(self):
  settings={"ssl":"strict","min_tls_version":"1.2","always_use_https":"on","security_header":{"strict_transport_security":{"enabled":True,"max_age":2592000,"nosniff":True}}}
  rules=[{"enabled":True,"action":"rewrite","expression":'(http.host eq "kolfat.app" or http.host eq "www.kolfat.app")',"action_parameters":{"headers":{"Content-Security-Policy":{"operation":"set","value":"object-src 'none'; base-uri 'self'"}}}}]
  self.assertTrue(all(s=="PASS" for _,s,_ in m.evaluate(settings,rules)))
 def test_disabled_rule_fails(self):
  settings={"ssl":"strict","min_tls_version":"1.2","always_use_https":"on","security_header":{"strict_transport_security":{"enabled":True,"max_age":2592000,"nosniff":True}}}
  rules=[{"enabled":False,"action":"rewrite","expression":'(http.host eq "kolfat.app" or http.host eq "www.kolfat.app")',"action_parameters":{"headers":{"content-security-policy":{"operation":"set","value":"object-src 'none'; base-uri 'self'"}}}}]
  self.assertEqual(m.evaluate(settings,rules)[-1][1],"FAIL")
if __name__=="__main__":unittest.main()
