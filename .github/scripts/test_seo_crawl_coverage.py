import unittest
import importlib.util
from pathlib import Path
spec=importlib.util.spec_from_file_location("coverage",Path(__file__).with_name("seo_crawl_coverage.py"))
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
class Tests(unittest.TestCase):
 def test_baseline_good(self):
  report={"results":[{"type":1,"status":"200"} for _ in range(459)]}
  self.assertTrue(mod.coverage(report,[str(x) for x in range(459)])["passed"])
 def test_cloudflare_block_rejected(self):
  report={"results":[{"type":1,"status":"403"} for _ in range(372)]+[{"type":2,"status":"200"} for _ in range(372)]}
  c=mod.coverage(report,[str(x) for x in range(459)])
  self.assertFalse(c["passed"])
  self.assertEqual(c["html_403"],372)
 def test_partial_rejected(self):
  report={"results":[{"type":1,"status":"200"} for _ in range(20)]}
  self.assertFalse(mod.coverage(report,[str(x) for x in range(459)])["passed"])
if __name__=="__main__":unittest.main()
