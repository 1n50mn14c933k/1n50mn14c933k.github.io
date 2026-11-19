#!/usr/bin/env python3
"""Publish verified MEDIA KOLFAT 2.5.0 information across the 12 localized pages.
Edits only the homepage, product and download pages for each language.
Preserves existing navigation, MS Store links, full product feature catalogue,
Linux/macOS content and all visual assets. Re-running is safe.
"""
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GH = "https://github.com/1n50mn14c933k/MEDIA_KOLFAT/releases/tag/v2.5.0"
SHA = "https://github.com/1n50mn14c933k/MEDIA_KOLFAT/releases/download/v2.5.0/MEDIA_KOLFAT_2.5.0_SHA256.txt"

# headline, short overview, status, five feature highlights (title, description)
I18N = {
"en": (
    "Windows 2.5.0 is available now",
    "Smarter media discovery, Timeline & Advanced Search, Smart Batch Renaming, redesigned Settings, safer COPY/MOVE and HTML reports.",
    "Windows 2.5.0 is available on GitHub. The Microsoft Store listing may offer a different package version.",
    [
        ("Smarter Guided Mode", "Automatic folder recommendations, easier library scanning and browsing."),
        ("Timeline & Advanced Search", "Browse by date, find items with unknown dates and combine filters."),
        ("Batch Renaming & Settings", "Rename files using patterns and manage options in six clearer Settings categories."),
        ("Safer COPY & MOVE", "Clearer readiness checks, organization controls and Advanced MOVE safeguards."),
        ("HTML Reports & UI", "Readable offline reports, refined navigation and four-language interface improvements."),
    ]),
"de": (
    "Windows 2.5.0 ist jetzt verfügbar",
    "Intelligentere Medienerkennung, Zeitleiste und erweiterte Suche, Stapelumbenennung, neue Einstellungen, sichereres Kopieren/Verschieben und HTML-Berichte.",
    "Windows 2.5.0 ist auf GitHub verfügbar. Im Microsoft Store kann eine andere Paketversion angeboten werden.",
    [
        ("Intelligenter geführter Modus", "Automatische Ordnervorschläge sowie einfacheres Scannen und Durchsuchen."),
        ("Zeitleiste und erweiterte Suche", "Nach Datum suchen, unbekannte Aufnahmedaten finden und Filter kombinieren."),
        ("Stapelumbenennung & Einstellungen", "Dateien nach Mustern umbenennen und Einstellungen in sechs Bereichen verwalten."),
        ("Sicheres Kopieren & Verschieben", "Klarere Prüfungen, bessere Organisation und Schutz beim erweiterten Verschieben."),
        ("HTML-Berichte & Oberfläche", "Lesbare Offline-Berichte, bessere Navigation und Verbesserungen in vier App-Sprachen."),
    ]),
"fa": (
    "نسخهٔ ۲.۵.۰ ویندوز اکنون منتشر شده است",
    "شناسایی هوشمند رسانه، خط زمانی و جست‌وجوی پیشرفته، تغییر نام گروهی، تنظیمات جدید، کپی و انتقال ایمن‌تر و گزارش HTML.",
    "نسخهٔ ۲.۵.۰ ویندوز در GitHub در دسترس است. نسخهٔ موجود در Microsoft Store ممکن است متفاوت باشد.",
    [
        ("حالت راهنمای هوشمندتر", "پیشنهاد خودکار پوشه‌ها و بررسی و مرور آسان‌تر کتابخانه."),
        ("خط زمانی و جست‌وجوی پیشرفته", "مرور بر اساس تاریخ، یافتن تاریخ‌های نامشخص و ترکیب فیلترها."),
        ("تغییر نام گروهی و تنظیمات", "تغییر نام فایل‌ها با الگو و مدیریت گزینه‌ها در شش بخش تنظیمات."),
        ("کپی و انتقال ایمن‌تر", "بررسی‌های روشن‌تر و حفاظت بهتر در انتقال پیشرفتهٔ ویندوز."),
        ("گزارش HTML و رابط کاربری", "گزارش‌های آفلاین خواناتر، ناوبری بهتر و بهبود چهار زبان برنامه."),
    ]),
"es": (
    "Windows 2.5.0 ya está disponible",
    "Detección inteligente, cronología y búsqueda avanzada, renombrado por lotes, nuevos ajustes, COPY/MOVE más seguros e informes HTML.",
    "Windows 2.5.0 está disponible en GitHub. Microsoft Store puede ofrecer otra versión del paquete.",
    [
        ("Modo guiado más inteligente", "Recomendación automática de carpetas y exploración más sencilla de la biblioteca."),
        ("Cronología y búsqueda avanzada", "Explora por fecha, encuentra fechas desconocidas y combina filtros."),
        ("Renombrado por lotes y ajustes", "Renombra archivos mediante patrones y configura seis categorías de ajustes."),
        ("COPY y MOVE más seguros", "Comprobaciones más claras y protecciones para MOVE avanzado en Windows."),
        ("Informes HTML e interfaz", "Informes locales legibles, mejor navegación y mejoras en cuatro idiomas."),
    ]),
"fr": (
    "Windows 2.5.0 est disponible",
    "Détection intelligente, chronologie et recherche avancée, renommage par lot, nouveaux paramètres, copie/déplacement sécurisés et rapports HTML.",
    "Windows 2.5.0 est disponible sur GitHub. La version proposée sur Microsoft Store peut différer.",
    [
        ("Mode guidé plus intelligent", "Suggestions automatiques de dossiers et navigation simplifiée dans la bibliothèque."),
        ("Chronologie et recherche avancée", "Parcourez par date, repérez les dates inconnues et combinez les filtres."),
        ("Renommage et paramètres", "Renommez des fichiers selon des modèles et gérez six catégories de paramètres."),
        ("Copie et déplacement sécurisés", "Contrôles plus clairs et protection renforcée du déplacement avancé Windows."),
        ("Rapports HTML et interface", "Rapports hors ligne lisibles, navigation améliorée et quatre langues affinées."),
    ]),
"pt": (
    "Windows 2.5.0 já está disponível",
    "Descoberta inteligente, linha do tempo e pesquisa avançada, renomeação em lote, novas configurações, COPY/MOVE mais seguros e relatórios HTML.",
    "Windows 2.5.0 está disponível no GitHub. A versão no Microsoft Store pode ser diferente.",
    [
        ("Modo guiado mais inteligente", "Sugestões automáticas de pastas e navegação mais fácil pela biblioteca."),
        ("Linha do tempo e pesquisa", "Explore por data, encontre datas desconhecidas e combine filtros."),
        ("Renomeação e configurações", "Renomeie arquivos por padrões e gerencie seis categorias de configurações."),
        ("Cópia e movimentação seguras", "Verificações claras e proteção aprimorada na movimentação avançada Windows."),
        ("Relatórios HTML e interface", "Relatórios locais legíveis, melhor navegação e melhorias em quatro idiomas."),
    ]),
"it": (
    "Windows 2.5.0 è disponibile",
    "Ricerca intelligente, timeline e ricerca avanzata, rinomina multipla, nuove impostazioni, copia/spostamento più sicuri e report HTML.",
    "Windows 2.5.0 è disponibile su GitHub. Microsoft Store potrebbe offrire una versione differente.",
    [
        ("Modalità guidata più intelligente", "Suggerimenti automatici delle cartelle e navigazione più semplice nella libreria."),
        ("Timeline e ricerca avanzata", "Sfoglia per data, trova date sconosciute e combina i filtri."),
        ("Rinomina e impostazioni", "Rinomina file con modelli e gestisci sei categorie di impostazioni."),
        ("Copia e spostamento più sicuri", "Controlli più chiari e protezioni per lo spostamento avanzato Windows."),
        ("Report HTML e interfaccia", "Report offline leggibili, navigazione migliorata e quattro lingue perfezionate."),
    ]),
"ja": (
    "Windows 2.5.0 を公開しました",
    "スマートなメディア検出、タイムラインと高度な検索、一括名前変更、新しい設定、安全性を高めたコピー・移動、HTMLレポート。",
    "Windows 2.5.0 は GitHub から入手できます。Microsoft Store のパッケージ版は異なる場合があります。",
    [
        ("よりスマートなガイドモード", "フォルダーの自動提案と簡単なライブラリのスキャン・閲覧。"),
        ("タイムラインと高度な検索", "日付別の閲覧、日付不明の項目、複数条件での絞り込み。"),
        ("一括名前変更と設定", "パターンを使った名前変更と6つの設定カテゴリ。"),
        ("安全なコピーと移動", "より明確な事前確認と Windows 高度な移動の保護。"),
        ("HTMLレポートと操作性", "読みやすいオフラインレポート、ナビゲーションと4言語の改善。"),
    ]),
"zh": (
    "Windows 2.5.0 现已发布",
    "智能媒体发现、时间线与高级搜索、批量重命名、新设置、更安全的复制与移动，以及 HTML 报告。",
    "Windows 2.5.0 已在 GitHub 发布。Microsoft Store 提供的软件包版本可能不同。",
    [
        ("更智能的引导模式", "自动推荐文件夹，更轻松地扫描和浏览媒体库。"),
        ("时间线与高级搜索", "按日期浏览、识别未知日期并组合筛选条件。"),
        ("批量重命名与设置", "按模式重命名文件，通过六个设置类别管理选项。"),
        ("更安全的复制与移动", "更明确的操作检查和 Windows 高级移动保护。"),
        ("HTML 报告与界面", "易读的离线报告、改进的导航和四种应用语言。"),
    ]),
"hi": (
    "Windows 2.5.0 अब उपलब्ध है",
    "स्मार्ट मीडिया खोज, टाइमलाइन और उन्नत खोज, बैच रीनेमिंग, नए सेटिंग्स, सुरक्षित कॉपी/मूव और HTML रिपोर्ट।",
    "Windows 2.5.0 GitHub पर उपलब्ध है। Microsoft Store पर पैकेज का संस्करण अलग हो सकता है।",
    [
        ("बेहतर गाइडेड मोड", "फ़ोल्डर के स्वचालित सुझाव और आसान लाइब्रेरी स्कैन व ब्राउज़िंग।"),
        ("टाइमलाइन और उन्नत खोज", "तिथि के अनुसार ब्राउज़ करें, अज्ञात तिथियाँ खोजें और फ़िल्टर मिलाएँ।"),
        ("बैच रीनेमिंग और सेटिंग्स", "पैटर्न से फ़ाइल नाम बदलें और छह सेटिंग श्रेणियों का उपयोग करें।"),
        ("सुरक्षित कॉपी और मूव", "स्पष्ट जाँच और Windows के उन्नत मूव में अतिरिक्त सुरक्षा।"),
        ("HTML रिपोर्ट और इंटरफ़ेस", "पढ़ने योग्य ऑफ़लाइन रिपोर्ट, बेहतर नेविगेशन और चार भाषाओं में सुधार।"),
    ]),
"ru": (
    "Windows 2.5.0 уже доступна",
    "Умный поиск медиа, хронология и расширенный поиск, пакетное переименование, новые настройки, безопасное копирование/перемещение и HTML-отчёты.",
    "Windows 2.5.0 доступна на GitHub. В Microsoft Store может быть другая версия приложения.",
    [
        ("Умный режим мастера", "Автоматические рекомендации папок, удобное сканирование и просмотр библиотеки."),
        ("Хронология и расширенный поиск", "Просмотр по дате, неизвестные даты и сочетание фильтров."),
        ("Переименование и настройки", "Переименование файлов по шаблонам и шесть разделов настроек."),
        ("Безопасное копирование и перемещение", "Понятные проверки и защита расширенного перемещения в Windows."),
        ("HTML-отчёты и интерфейс", "Читаемые офлайн-отчёты, улучшенная навигация и четыре языка интерфейса."),
    ]),
"ar": (
    "Windows 2.5.0 متوفر الآن",
    "اكتشاف ذكي للوسائط، خط زمني وبحث متقدم، إعادة تسمية جماعية، إعدادات جديدة، نسخ ونقل أكثر أمانًا وتقارير HTML.",
    "الإصدار 2.5.0 لنظام Windows متوفر على GitHub. قد يختلف إصدار الحزمة في Microsoft Store.",
    [
        ("وضع موجه أكثر ذكاءً", "اقتراح المجلدات تلقائيًا وتسهيل فحص مكتبة الوسائط وتصفحها."),
        ("الخط الزمني والبحث المتقدم", "التصفح حسب التاريخ والعثور على التواريخ المجهولة ودمج المرشحات."),
        ("إعادة التسمية والإعدادات", "إعادة تسمية الملفات بأنماط واضحة مع ست فئات للإعدادات."),
        ("نسخ ونقل أكثر أمانًا", "فحوصات أوضح وحماية أفضل للنقل المتقدم في Windows."),
        ("تقارير HTML والواجهة", "تقارير محلية مقروءة وتنقل أفضل وتحسين أربع لغات للتطبيق."),
    ]),
}

def esc(s):
    return html.escape(s, quote=True)

def release_box(lang, texts):
    head, overview, channel, items = texts
    cards = "".join(
        '<article class="kf-v2-card"><div class="kf-v2-feature-head"><h3>'
        + esc(title) + '</h3></div><p>' + esc(desc) + '</p></article>'
        for title, desc in items
    )
    return (
        '<section class="kf-v2-section" id="media-kolfat-v2" aria-labelledby="kf-v2-title">'
        '<div class="kf-v2-content"><p class="kf-v2-eyebrow">MEDIA KOLFAT • WINDOWS 2.5.0</p>'
        '<h2 id="kf-v2-title">' + esc(head) + '</h2>'
        '<p class="kf-v2-intro">' + esc(overview) + '</p>'
        '<div class="kf-v2-grid">' + cards + '</div>'
        '<p class="kf-v2-meta">' + esc(channel) + '</p>'
        '<div class="kf-v2-links">'
        '<a href="' + GH + '" target="_blank" rel="noopener noreferrer">GitHub · Windows 2.5.0</a>'
        '<a href="' + SHA + '" target="_blank" rel="noopener noreferrer">SHA-256</a>'
        '</div></div></section>'
    )

def product_box(lang, texts):
    head, overview, channel, _ = texts
    url = "/download/" if lang == "en" else f"/{lang}/download/"
    return (
        '<section id="kf-v250-preview" aria-label="MEDIA KOLFAT 2.5.0" '
        'style="padding:30px max(20px,calc((100% - 1080px)/2));background:#0d0d0d;'
        'border-block:1px solid #444;color:#eee">'
        '<p style="font:700 12px/1.5 Segoe UI,Arial,sans-serif;letter-spacing:.06em;margin:0 0 10px">'
        + esc(head) + '</p>'
        '<h2 style="color:#fff;font:400 clamp(25px,3vw,36px)/1.2 Georgia,serif;margin:0 0 16px">'
        'MEDIA KOLFAT 2.5.0</h2>'
        '<p style="font:500 15px/1.7 Segoe UI,Arial,sans-serif;margin:0 0 12px">'
        + esc(overview) + '</p>'
        '<p style="font:400 13px/1.6 Segoe UI,Arial,sans-serif;color:#bbb;margin:0 0 12px">'
        + esc(channel) + '</p>'
        '<a href="' + url + '" style="font:600 13px Segoe UI,Arial,sans-serif;color:#fff;text-decoration:underline">'
        'MEDIA KOLFAT 2.5.0 · GitHub</a></section>'
    )

def swap_exact(s, old, new, path):
    if old not in s:
        if new in s:
            return s
        raise ValueError(f"{path}: missing expected marker {old[:80]}")
    return s.replace(old, new, 1)

def update_page(path, lang, kind):
    content = path.read_text(encoding="utf-8")
    texts = I18N[lang]
    if kind == "home":
        # Preserve the established home hero and download button styling.
        pattern = r'<p id="kf-v250-preview"\b[^>]*>.*?</p>'
        replacement = (
            '<p id="kf-v250-preview" style="max-width:740px;margin:10px 0 18px;'
            'font:600 13px/1.6 Segoe UI,Arial,sans-serif;color:#eee">'
            '<a style="color:#fff;text-decoration:underline;text-underline-offset:3px" '
            'href="' + ("/download/" if lang=="en" else f"/{lang}/download/") + '">'
            + esc(texts[0]) + '</a></p>'
        )
        content, n = re.subn(pattern, lambda _: replacement, content, count=1, flags=re.S)
        assert n == 1, f"{path}: preview teaser missing"
    elif kind == "product":
        pattern = r'<section id="kf-v250-preview"\b.*?</section>'
        content, n = re.subn(pattern, lambda _: product_box(lang, texts), content, count=1, flags=re.S)
        assert n == 1 and '<section class="kf-product-all"' in content, f"{path}: product preview/catalog missing"
    else:
        pattern = r'<section id="kf-v250-preview"\b.*?</section>'
        content, n = re.subn(pattern, "", content, count=1, flags=re.S)
        assert n == 1, f"{path}: prior draft preview missing"
        # Replace the obsolete 2.0 "What's New" feature gallery, not the entire page.
        start_marker = '<section class="kf-v2-section" id="media-kolfat-v2" aria-labelledby="kf-v2-title">'
        assert content.count(start_marker) == 1, f"{path}: 2.0 release gallery missing"
        start = content.index(start_marker)
        end = content.index("</main>", start)
        content = content[:start] + release_box(lang, texts) + content[end:]
    # Point all Windows GitHub buttons to the publicly released version.
    assert content.count("releases/tag/v2.0.0") == 1, f"{path}: expected old Windows download button"
    content = content.replace("releases/tag/v2.0.0", "releases/tag/v2.5.0")
    # Correct stale homepage/download SEO metadata, hero release labels and descriptions.
    content = content.replace("2.0.0", "2.5.0")
    # Do not claim a Microsoft Store 2.5.0.0 rollout that hasn't been verified.
    assert "2.5.0.0" not in content, f"{path}: unverified Store version"
    assert "releases/tag/v2.0.0" not in content
    assert 'id="kf-v250-preview"' in content if kind != "download" else 'id="media-kolfat-v2"' in content
    assert "releases/tag/v2.5.0" in content
    if kind == "download":
        assert "MEDIA_KOLFAT_2.0.0_Setup.exe" not in content
        assert "MEDIA_KOLFAT_2.0.0_SHA256.txt" not in content
        assert "MEDIA_KOLFAT_2.5.0_SHA256.txt" in content
        assert content.count("kf-v2-card") == 5
    path.write_text(content, encoding="utf-8")
    return path

def main():
    count = 0
    for lang, texts in I18N.items():
        assert len(texts[3]) == 5
        for kind, rel in [
            ("home", f"{lang}/index.html"),
            ("product", f"{lang}/Media_Kolfat/index.html"),
            ("download", "download/index.html" if lang == "en" else f"{lang}/download/index.html"),
        ]:
            path = ROOT / rel
            update_page(path, lang, kind)
            count += 1
            print("PASS", rel)
    assert count == 36
    print("DONE: 36 translated pages updated for published Windows 2.5.0; 2.0.0 links removed.")

if __name__ == "__main__":
    main()
