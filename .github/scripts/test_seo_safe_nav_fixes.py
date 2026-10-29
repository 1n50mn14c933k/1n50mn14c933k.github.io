import tempfile
import unittest
from pathlib import Path
import importlib.util

SCRIPT = Path(__file__).parent / "seo_safe_nav_fixes.py"
spec = importlib.util.spec_from_file_location("seo_safe_nav_fixes", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class LanguageMenuTests(unittest.TestCase):
    def test_repairs_only_menu_and_existing_page(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for section in ("support", "about"):
                for language in ("", "de/"):
                    folder = root / language / section
                    folder.mkdir(parents=True)
                    (folder / "index.html").write_text("placeholder")
            html = ('<a href="/de/about/">Normal navigation</a>'
                    '<details class="lang-menu"><a href="/about/">English</a>'
                    '<a href="/de/about/">Deutsch</a>'
                    '<a href="/fa/about/">Persian</a></details>')
            updated, count = mod.repair_page(html, "support", root)
            self.assertEqual(count, 2)
            self.assertIn('<a href="/de/about/">Normal navigation</a>', updated)
            self.assertIn('<a href="/support/">English</a>', updated)
            self.assertIn('<a href="/de/support/">Deutsch</a>', updated)
            self.assertIn('<a href="/fa/about/">Persian</a>', updated)
            second, n = mod.repair_page(updated, "support", root)
            self.assertEqual(n, 0)
            self.assertEqual(second, updated)

    def test_unknown_links_untouched(self):
        with tempfile.TemporaryDirectory() as tmp:
            s = '<details class="lang-menu"><a href="https://example.com/">External</a><a href="/tools/">Tools</a></details>'
            self.assertEqual(mod.repair_page(s, "support", Path(tmp)), (s, 0))


if __name__ == "__main__":
    unittest.main()
