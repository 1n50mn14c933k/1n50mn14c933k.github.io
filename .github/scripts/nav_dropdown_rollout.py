#!/usr/bin/env python3
"""One-time, idempotent rollout of the KOLFAT top dropdown navigation."""
from pathlib import Path
from html import escape
import re

LANGUAGES = ("en", "fa", "de", "fr", "es", "pt", "it", "ja", "zh", "hi", "ru", "ar")
LEGAL = ("support", "privacy", "terms", "disclaimer", "licenses")
LABELS = {
    "en": ("MENU", "HOME", "DOWNLOAD", "ABOUT", "GUIDES", "SUPPORT", "CONTACT"),
    "fa": ("فهرست", "خانه", "دانلود", "درباره", "راهنماها", "پشتیبانی", "تماس"),
    "de": ("MENÜ", "STARTSEITE", "DOWNLOAD", "ÜBER UNS", "ANLEITUNGEN", "SUPPORT", "KONTAKT"),
    "fr": ("MENU", "ACCUEIL", "TÉLÉCHARGER", "À PROPOS", "GUIDES", "ASSISTANCE", "CONTACT"),
    "es": ("MENÚ", "INICIO", "DESCARGAR", "ACERCA DE", "GUÍAS", "SOPORTE", "CONTACTO"),
    "pt": ("MENU", "INÍCIO", "DOWNLOAD", "SOBRE", "GUIAS", "SUPORTE", "CONTATO"),
    "it": ("MENU", "HOME", "SCARICA", "CHI SIAMO", "GUIDE", "SUPPORTO", "CONTATTO"),
    "ja": ("メニュー", "ホーム", "ダウンロード", "KOLFATについて", "ガイド", "サポート", "お問い合わせ"),
    "zh": ("菜单", "首页", "下载", "关于", "指南", "支持", "联系"),
    "hi": ("मेनू", "होम", "डाउनलोड", "परिचय", "मार्गदर्शिकाएँ", "सहायता", "संपर्क"),
    "ru": ("МЕНЮ", "ГЛАВНАЯ", "СКАЧАТЬ", "О НАС", "РУКОВОДСТВА", "ПОДДЕРЖКА", "КОНТАКТ"),
    "ar": ("القائمة", "الرئيسية", "تنزيل", "حول", "الأدلة", "الدعم", "اتصل بنا"),
}
TOPNAV_PATTERN = re.compile(
    r'<div class="top-nav">.*?(?P<langmenu><details class="lang-menu">.*?</details>)</div>',
    re.S,
)
CONTENT_NAV_PATTERN = re.compile(r'<nav class="nav" aria-label="Primary">.*?</nav>', re.S)
CONTACT_PATTERN = re.compile(r'<a class="contact-kolfat"\b[^>]*>.*?</a>', re.S)
BOTTOM_NAV_PATTERN = re.compile(r'<nav class="(?:primary-seo-links|seo-footer-links)"\b[^>]*>.*?</nav>', re.S)

def link(url, label, current, *, external=False):
    # The links remain plain HTML, crawlable even when the details panel is closed.
    attrs = ' target="_blank" rel="noopener noreferrer"' if external else ''
    if url == current:
        attrs += ' aria-current="page"'
    return f'<a href="{escape(url, quote=True)}"{attrs} dir="auto">{escape(label)}</a>'

def make_menu(lang, current, langmenu=""):
    lab = LABELS[lang]
    support_url = "/support/" if lang == "en" else f"/{lang}/support/"
    home_url = f"/{lang}/"
    menu_links = [
        link(home_url, lab[1], current),
        link(f"/{lang}/Media_Kolfat/", "MEDIA KOLFAT", current),
        link("/download/", lab[2], current),
        link("/about/", lab[3], current),
        link("/guides/", lab[4], current),
        link(support_url, lab[5], current),
        link("mailto:contact@kolfat.app", lab[6], current),
    ]
    social_links = [
        link("https://x.com/KOLFAT_APP", "X", current, external=True),
        link("https://www.youtube.com/@KOLFAT_APP", "YOUTUBE", current, external=True),
        link("https://www.tiktok.com/@kolfat.app", "TIKTOK", current, external=True),
        link("https://github.com/1n50mn14c933k/Media_Kolfat", "GITHUB", current, external=True),
    ]
    summary_label = escape(lab[0])
    nav = (
        '<details class="kolfat-menu">'
        f'<summary aria-label="{summary_label}" aria-haspopup="true">'
        '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" '
        'stroke="currentColor" stroke-width="2" stroke-linecap="round">'
        '<path d="M4 7h16M4 12h16M4 17h16"/></svg>'
        f'<span>{summary_label}</span><span class="menu-chevron" aria-hidden="true">⌄</span>'
        '</summary>'
        '<nav class="kolfat-menu-panel" aria-label="KOLFAT navigation">'
        '<span class="menu-section-label">KOLFAT</span>'
        + "".join(menu_links)
        + '<span class="menu-section-label">FOLLOW KOLFAT</span>'
        + "".join(social_links)
        + '</nav></details>'
    )
    return '<div class="top-nav">' + nav + langmenu + '</div>'

def enhance(text, path, *, lang, current, category):
    before = text
    baseline_meta = (
        re.findall(r'<link rel="canonical"[^>]*>', text),
        re.findall(r'<link rel="alternate" hreflang="[^"]+"[^>]*>', text),
        re.findall(r'<script type="application/ld\+json">.*?</script>', text, re.S),
    )
    if category == "localized":
        m = TOPNAV_PATTERN.search(text)
        if not m:
            raise RuntimeError(f"{path}: existing top-nav/language selector not found")
        nav = make_menu(lang, current, m.group("langmenu"))
        text = text[:m.start()] + nav + text[m.end():]
        # Remove unbalanced tags left by previous static-page nav injections, if present.
        text = re.sub(r'\s*</details></div>\s*(?=<div class="top-nav">)', '\n', text)
    elif category == "content":
        m = CONTENT_NAV_PATTERN.search(text)
        if not m:
            raise RuntimeError(f"{path}: content header nav not found")
        text = text[:m.start()] + make_menu(lang, current) + text[m.end():]
    elif category == "guide":
        original = '<a class="nav" href="/support/">SUPPORT</a>'
        if text.count(original) != 1:
            raise RuntimeError(f"{path}: guide support shortcut missing")
        guide_logo = ('<a class="guide-site-logo" href="/en/" aria-label="KOLFAT home">'
                      '<img src="/assets/kolfat-logo.webp?v=d2c25ec0" alt="KOLFAT"></a>')
        text = text.replace(original, guide_logo + make_menu("en", current), 1)

    if category == "localized":
        # Move the fixed contact control into the dropdown, on desktop and mobile.
        text = CONTACT_PATTERN.sub('', text)
        text = BOTTOM_NAV_PATTERN.sub('', text)
        # Fix a malformed logo anchor injected by an older GitHub workflow.
        text = re.sub(r'(<a class="site-logo" href="/[^"]+")\x01>', r'\1 aria-label="KOLFAT home">', text)

    if 'href="/assets/nav-dropdown.css?v=20261018-2"' not in text:
        if text.count('</head>') != 1:
            raise RuntimeError(f"{path}: cannot find unique closing head")
        text = text.replace('</head>', '<link rel="stylesheet" href="/assets/nav-dropdown.css?v=20261018-2"></head>', 1)
    if 'src="/assets/nav-dropdown.js?v=20261018-2"' not in text:
        if text.count('</body>') != 1:
            raise RuntimeError(f"{path}: cannot find unique closing body")
        text = text.replace('</body>', '<script defer src="/assets/nav-dropdown.js?v=20261018-2"></script></body>', 1)

    after_meta = (
        re.findall(r'<link rel="canonical"[^>]*>', text),
        re.findall(r'<link rel="alternate" hreflang="[^"]+"[^>]*>', text),
        re.findall(r'<script type="application/ld\+json">.*?</script>', text, re.S),
    )
    if baseline_meta != after_meta:
        raise RuntimeError(f"{path}: SEO tags changed unexpectedly")
    assert text.count('class="kolfat-menu"') == 1, path
    assert text.count('class="top-nav"') == 1, path
    assert text.count('https://x.com/KOLFAT_APP') >= 1, path
    assert text.count('https://www.youtube.com/@KOLFAT_APP') >= 1, path
    assert text.count('https://www.tiktok.com/@kolfat.app') >= 1, path
    assert 'mailto:contact@kolfat.app' in text, path
    assert 'class="primary-seo-links"' not in text, path
    assert 'class="seo-footer-links"' not in text, path
    assert 'class="contact-kolfat"' not in text, path
    assert text.count('class="lang-menu"') == (1 if category == "localized" else 0), path
    return text != before, text

pages = []
for lang in LANGUAGES:
    pages.extend((Path(lang) / "index.html", Path(lang) / "Media_Kolfat" / "index.html"))
for legal in LEGAL:
    pages.append(Path(legal) / "index.html")
    for lang in LANGUAGES:
        if lang != "en":
            pages.append(Path(lang) / legal / "index.html")
pages.extend((Path("about/index.html"), Path("download/index.html"), Path("guides/index.html")))
pages.extend(sorted(Path("guides").glob("*/index.html")))
pages.append(Path("support/getting-started/index.html"))

seen = set()
counts = {"localized":0,"content":0,"guide":0}
for path in pages:
    if path in seen or not path.is_file():
        raise RuntimeError(f"Missing or repeated expected production page: {path}")
    seen.add(path)
    parts = path.parts
    if parts[0] in LANGUAGES and len(parts) in (2,3):
        category, lang = "localized", parts[0]
    elif (parts[0] in LEGAL and len(parts)==2):
        category, lang = "localized", "en"
    elif parts[:2] == ("support", "getting-started"):
        category, lang = "guide", "en"
    else:
        category, lang = "content", "en"
    current = "/" + str(path.parent).replace("\\", "/").strip("/") + "/"
    if current == "/en/" and category == "localized":
        pass
    if category == "localized" and lang == "en" and parts[0] in LEGAL:
        current = f"/{parts[0]}/"
    original = path.read_text(encoding="utf-8")
    updated, content = enhance(original, str(path), lang=lang, current=current, category=category)
    if updated:
        path.write_text(content, encoding="utf-8")
    counts[category] += 1
assert len(pages)==93, len(pages)
assert counts=={"localized":84,"content":8,"guide":1}, counts

print(f"Validated {len(pages)} pages: {counts}; canonical, hreflang and JSON-LD preserved")
