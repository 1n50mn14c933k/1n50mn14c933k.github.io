/* Keep the KOLFAT menu and language chooser mutually exclusive. */
(() => {
  const init = () => {
    const menus = Array.from(document.querySelectorAll(".kolfat-menu, .lang-menu"));
    if (!menus.length) return;
    menus.forEach(menu => menu.addEventListener("toggle", () => {
      if (menu.open) menus.filter(other => other !== menu).forEach(other => other.open = false);
    }));
    document.addEventListener("pointerdown", event => {
      menus.forEach(menu => {
        if (menu.open && !menu.contains(event.target)) menu.open = false;
      });
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        const openMenu = menus.find(menu => menu.open);
        if (openMenu) {
          openMenu.open = false;
          openMenu.querySelector("summary")?.focus();
        }
      }
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();

/* Global stand-alone KOLFAT Online Tools CTA, all site languages. */
(() => {
 const labels = {"en":"KOLFAT Online Tools","fa":"ابزارهای آنلاین KOLFAT","de":"KOLFAT Online-Tools","fr":"Outils en ligne KOLFAT","es":"Herramientas en línea KOLFAT","pt":"Ferramentas online KOLFAT","it":"Strumenti online KOLFAT","ja":"KOLFAT オンラインツール","zh":"KOLFAT 在线工具","hi":"KOLFAT ऑनलाइन टूल्स","ru":"Онлайн-инструменты KOLFAT","ar":"أدوات KOLFAT عبر الإنترنت"};
 const css = `
html body a.kolfat-tools-direct{box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:10px!important;min-height:48px!important;padding:11px 18px!important;background:#ff812e!important;color:#080808!important;border:1px solid #ffa763!important;border-radius:10px!important;box-shadow:0 8px 26px rgba(0,0,0,.45)!important;font:750 14px/1.3 "Segoe UI",Arial,sans-serif!important;letter-spacing:0!important;text-decoration:none!important;text-transform:none!important;white-space:normal!important;max-width:min(320px,calc(100vw - 24px));text-align:center!important;cursor:pointer!important;pointer-events:auto!important;z-index:100020!important}
html body a.kolfat-tools-direct:hover{background:#ffb073!important;color:#080808!important}
html body a.kolfat-tools-direct:focus-visible{outline:3px solid white!important;outline-offset:3px!important}
html body .kolfat-tools-direct .tools-lang{font-size:10px;background:rgba(0,0,0,.13);padding:3px 4px;border-radius:4px}
html body .kolfat-tools-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap;max-width:100%;direction:inherit}
html body .kolfat-tools-actions>.btn{margin:0!important}
html body a.kolfat-tools-direct--floating{position:fixed!important;right:16px;bottom:16px}
html[dir="rtl"] body a.kolfat-tools-direct--floating{right:auto;left:16px}
@media(max-width:640px){html body .kolfat-tools-actions>a.kolfat-tools-direct{position:fixed!important;right:12px!important;left:auto!important;bottom:12px!important;min-height:44px!important;padding:10px 14px!important;font-size:12px!important;max-width:min(280px,calc(100vw - 24px))}html[dir="rtl"] body .kolfat-tools-actions>a.kolfat-tools-direct{right:auto!important;left:12px!important}html body a.kolfat-tools-direct--floating{right:12px;bottom:12px;font-size:12px!important}html[dir="rtl"] body a.kolfat-tools-direct--floating{right:auto;left:12px}}
`;
 const init = () => {
   if (document.querySelector("a.kolfat-tools-direct")) return;
   const lang=(document.documentElement.lang||"en").toLowerCase().split("-")[0];
   const label=labels[lang]||labels.en;
   const style=document.createElement("style");style.textContent=css;document.head.append(style);
   const a=document.createElement("a");a.className="kolfat-tools-direct";a.href=(lang==="de"||lang==="fa"||lang==="fr"||lang==="es")?"/"+lang+"/tools/":"/tools/";a.dir="auto";a.setAttribute("aria-label",label+(lang==="de"?" (deutsche Werkzeugoberfläche)":lang==="fa"?" (رابط فارسی ابزارها)":lang==="fr"?" (interface française des outils)":lang==="es"?" (interfaz de herramientas en español)":lang==="en"?"":" (English tools interface)"));
   const span=document.createElement("span");span.textContent=label;a.append(span);
   if(lang!=="en"&&lang!=="de"&&lang!=="fa"&&lang!=="fr"&&lang!=="es"){const badge=document.createElement("small");badge.className="tools-lang";badge.textContent="EN";badge.title="Tools currently in English";a.append(badge);}
   const arrow=document.createElement("span");arrow.textContent="↗";arrow.setAttribute("aria-hidden","true");a.append(arrow);
   const hero=document.querySelector('html[data-kolfat-page="home"] .hero-copy');
   const start=hero?.querySelector('a.btn[href*="/Media_Kolfat/"]');
   if(start){
     const container=document.createElement("div");container.className="kolfat-tools-actions";
     start.parentNode.insertBefore(container,start);container.append(start,a);
   }else{a.classList.add("kolfat-tools-direct--floating");document.body.append(a);}
 };
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();


/* Voluntary Ko-fi support shortcut in the existing global header on every page.
   No third-party script, tracking, popup, automatic payment, or tool interruption. */
(() => {
  const initSupportLink = () => {
    const nav = document.querySelector(".top-nav");
    if (!nav || nav.querySelector(".kolfat-support-link")) return;
    const link = document.createElement("a");
    link.className = "kolfat-support-link";
    link.href = "https://ko-fi.com/kolfat_app";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = "☕ Support KOLFAT (optional one-time tip)";
    link.setAttribute("aria-label", "☕ Support KOLFAT (optional one-time tip)");
    link.innerHTML = '<span class="kolfat-support-emoji" aria-hidden="true">☕</span><span class="kolfat-support-text">Support KOLFAT</span>';
    nav.insertBefore(link, nav.firstElementChild);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initSupportLink, {once:true});
  else initSupportLink();
})();


/* Complete navigational sitemap, one shared enhancement for all KOLFAT pages.
   Links come from the published routes; categories are collapsed until requested.
   The existing native MENU/locale selectors, footer and hero are unchanged. */
(() => {
  "use strict";
  const localized = {"en":{"main":["HOME","MEDIA KOLFAT","DOWNLOAD","ABOUT","GUIDES","TOOLS","SUPPORT","CONTACT"],"sections":["MORE PAGES","GUIDE ARTICLES","ONLINE TOOL CATEGORIES","LEGAL & POLICIES","VIEW ALL TOOLS","GETTING STARTED (EN)"],"category":["Photo & File Tools","Code & Data Utilities","Networking & Automation","Security & Text Analysis"],"legal":["Privacy Policy","Terms of Use","Licenses","Disclaimer"],"guideTitles":["Organize Photos by Date","Organize Large Photo Libraries","Find Duplicate Photos Safely","Organize Photos from Phone and USB","Photo Organizer for Windows"]},"fa":{"main":["خانه","MEDIA KOLFAT","دانلود","درباره","راهنماها","ابزارها","پشتیبانی","تماس"],"sections":["صفحات بیشتر","مقاله‌های راهنما","دسته‌بندی ابزارهای آنلاین","قوانین و سیاست‌ها","نمایش همه ابزارها","شروع کار (EN)"],"category":["ابزارهای عکس و فایل","ابزارهای کد و داده","شبکه و خودکارسازی","امنیت و تحلیل متن"],"legal":["حریم خصوصی","شرایط","مجوزها","سلب مسئولیت"],"guideTitles":["چگونه عکس‌ها را در ویندوز بر اساس تاریخ مرتب کنیم","سامان‌دهی امن کتابخانه بزرگ عکس‌ها","پیدا کردن امن عکس‌های تکراری","مرتب‌سازی عکس‌های تلفن و حافظه USB","انتخاب نرم‌افزار مرتب‌سازی عکس برای ویندوز"]},"de":{"main":["STARTSEITE","MEDIA KOLFAT","DOWNLOAD","ÜBER KOLFAT","ANLEITUNGEN","TOOLS","SUPPORT","KONTAKT"],"sections":["Weitere Seiten","Alle Anleitungen","Online-Tool-Kategorien","Rechtliches & Richtlinien","Alle Tools anzeigen","Erste Schritte (EN)"],"category":["Foto- und Dateitools","Code- und Datenwerkzeuge","Netzwerk & Automatisierung","Sicherheit & Textanalyse"],"legal":["Datenschutz","Bedingungen","Lizenzen","Haftungsausschluss"],"guideTitles":["Fotos unter Windows nach Datum sortieren","Große Fotobibliothek sicher organisieren","Doppelte Fotos sicher finden","Fotos von Smartphone und USB-Laufwerk organisieren","Den passenden Foto-Organizer für Windows wählen"]},"fr":{"main":["ACCUEIL","MEDIA KOLFAT","TÉLÉCHARGER","À PROPOS","GUIDES","OUTILS","ASSISTANCE","CONTACT"],"sections":["Autres pages","Tous les guides","Catégories d’outils","Mentions légales","Voir tous les outils","Bien démarrer (EN)"],"category":["Outils photo et fichiers","Code et données","Réseau et automatisation","Sécurité et analyse de texte"],"legal":["Confidentialité","Conditions","Licences","Avertissement"],"guideTitles":["Classer ses photos par date sur Windows","Organiser une grande photothèque en sécurité","Trouver les photos en double sans risque","Organiser les photos du téléphone et des clés USB","Bien choisir son organisateur de photos pour Windows"]},"es":{"main":["INICIO","MEDIA KOLFAT","DESCARGAR","ACERCA DE","GUÍAS","HERRAMIENTAS","SOPORTE","CONTACTO"],"sections":["Más páginas","Todos los guías","Categorías de herramientas","Información legal","Ver todas las herramientas","Primeros pasos (EN)"],"category":["Fotos y archivos","Código y datos","Redes y automatización","Seguridad y análisis de texto"],"legal":["Privacidad","Términos","Licencias","Aviso legal"],"guideTitles":["Organizar fotos por fecha en Windows","Organizar una biblioteca grande de fotos con seguridad","Encontrar fotos duplicadas sin perder archivos","Organizar fotos del móvil y memorias USB","Cómo elegir un organizador de fotos para Windows"]},"pt":{"main":["INÍCIO","MEDIA KOLFAT","DOWNLOAD","SOBRE","GUIAS","FERRAMENTAS","SUPORTE","CONTATO"],"sections":["Mais páginas","Todos os guias","Categorias de ferramentas","Informações legais","Ver todas as ferramentas","Primeiros passos (EN)"],"category":["Fotos e ficheiros","Código e dados","Redes e automação","Segurança e análise de texto"],"legal":["Privacidade","Termos","Licenças","Aviso legal"],"guideTitles":["Como organizar fotos por data no Windows","Organizar uma biblioteca grande com segurança","Encontrar fotos duplicadas com segurança","Organizar fotos de celular e USB","Como escolher um organizador de fotos para Windows"]},"it":{"main":["HOME","MEDIA KOLFAT","SCARICA","CHI SIAMO","GUIDE","STRUMENTI","SUPPORTO","CONTATTI"],"sections":["Altre pagine","Tutte le guide","Categorie di strumenti","Note legali","Tutti gli strumenti","Primi passi (EN)"],"category":["Foto e file","Codice e dati","Reti e automazione","Sicurezza e analisi del testo"],"legal":["Privacy","Termini","Licenze","Esclusione di responsabilità"],"guideTitles":["Organizzare le foto per data su Windows","Organizzare in sicurezza una grande libreria fotografica","Trovare foto duplicate senza rischi","Organizzare foto da telefono e chiavette USB","Come scegliere un organizzatore di foto per Windows"]},"ja":{"main":["ホーム","MEDIA KOLFAT","ダウンロード","KOLFATについて","ガイド","ツール","サポート","お問い合わせ"],"sections":["その他のページ","すべてのガイド","ツールのカテゴリー","法的情報","すべてのツール","はじめに (EN)"],"category":["写真とファイル","コードとデータ","ネットワークと自動化","セキュリティとテキスト"],"legal":["プライバシー","利用規約","ライセンス","免責事項"],"guideTitles":["Windowsで写真を日付別に整理する方法","大量の写真を安全に整理する方法","重複写真を安全に見つける方法","スマホやUSBから写真を整理する方法","Windows用写真整理ソフトの選び方"]},"zh":{"main":["首页","MEDIA KOLFAT","下载","关于","指南","工具","支持","联系"],"sections":["更多页面","全部指南","工具分类","法律与政策","查看全部工具","入门指南 (EN)"],"category":["照片和文件","代码与数据","网络与自动化","安全与文本分析"],"legal":["隐私","条款","许可证","免责声明"],"guideTitles":["如何在 Windows 上按日期整理照片","如何安全整理大型照片库","如何安全查找重复照片","整理来自手机和 U 盘的照片","如何选择 Windows 照片整理软件"]},"hi":{"main":["होम","MEDIA KOLFAT","डाउनलोड","परिचय","मार्गदर्शिकाएँ","टूल","सहायता","संपर्क"],"sections":["अन्य पृष्ठ","सभी मार्गदर्शिकाएँ","टूल श्रेणियाँ","कानूनी जानकारी","सभी टूल देखें","शुरू करें (EN)"],"category":["फ़ोटो और फ़ाइलें","कोड और डेटा","नेटवर्किंग और ऑटोमेशन","सुरक्षा और टेक्स्ट विश्लेषण"],"legal":["गोपनीयता","शर्तें","लाइसेंस","अस्वीकरण"],"guideTitles":["Windows में फ़ोटो तारीख़ के अनुसार व्यवस्थित करें","बड़ी फ़ोटो लाइब्रेरी सुरक्षित व्यवस्थित करें","डुप्लिकेट फ़ोटो सुरक्षित ढंग से खोजें","फ़ोन और USB से फ़ोटो व्यवस्थित करें","Windows के लिए फ़ोटो आयोजक कैसे चुनें"]},"ru":{"main":["ГЛАВНАЯ","MEDIA KOLFAT","СКАЧАТЬ","О KOLFAT","РУКОВОДСТВА","ИНСТРУМЕНТЫ","ПОДДЕРЖКА","КОНТАКТ"],"sections":["Другие страницы","Все руководства","Категории инструментов","Правовая информация","Все инструменты","Начало работы (EN)"],"category":["Фото и файлы","Код и данные","Сети и автоматизация","Безопасность и анализ текста"],"legal":["Конфиденциальность","Условия","Лицензии","Отказ от ответственности"],"guideTitles":["Как сортировать фотографии по дате в Windows","Безопасная организация большой фототеки","Как безопасно находить дубликаты фото","Организация фото с телефона и USB","Как выбрать органайзер фотографий для Windows"]},"ar":{"main":["الرئيسية","MEDIA KOLFAT","تنزيل","حول KOLFAT","الأدلة","الأدوات","الدعم","اتصل بنا"],"sections":["صفحات أخرى","جميع الأدلة","فئات الأدوات","المعلومات القانونية","عرض جميع الأدوات","البدء (EN)"],"category":["الصور والملفات","الرموز والبيانات","الشبكات والأتمتة","الأمان وتحليل النص"],"legal":["الخصوصية","الشروط","التراخيص","إخلاء المسؤولية"],"guideTitles":["كيفية تنظيم الصور حسب التاريخ على Windows","تنظيم مكتبة صور كبيرة بأمان","العثور على الصور المكررة بأمان","تنظيم الصور من الهاتف وUSB","كيفية اختيار منظم صور لنظام Windows"]}};
  const guideSlugs = ["organize-photos-by-date","organize-large-photo-library","find-duplicate-photos-safely","organize-photos-from-phone-and-usb","photo-organizer-for-windows"];
  const tools = {"photo-file":[["image-compressor","Image Compressor"],["image-converter","Image Converter"],["exif-cleaner","EXIF Cleaner"],["image-to-pdf","Image to PDF"],["image-watermark","Image Watermark"],["photo-rotator","Photo Rotator"],["photo-color-palette","Photo Color Palette"],["photo-date-detective","Photo Date Detective"],["batch-file-renamer","Batch File Renamer"],["duplicate-checker","Duplicate Checker"],["qr-code-generator","QR Code Generator"],["sha256-verifier","SHA-256 Verifier"]],"code-data":[["base64-encoder","Base64 Encoder / Decoder"],["csv-json-converter","CSV / JSON Converter"],["html-entity-converter","HTML Entity Converter"],["json-formatter","JSON Formatter"],["json-schema-validator","JSON Schema Validator"],["markdown-preview","Markdown Preview"],["regex-tester","Regex Tester"],["sql-formatter","SQL Formatter"],["url-encoder","URL Encoder"],["uuid-generator","UUID Generator"],["xml-formatter","XML Formatter"],["yaml-json-converter","YAML / JSON Converter"]],"networking":[["cron-expression-builder","Cron Expression Builder"],["docker-compose-checker","Docker Compose Checker"],["ip-range-cidr-converter","IP Range / CIDR Converter"],["ipv4-subnet-calculator","IPv4 Subnet Calculator"],["ipv6-prefix-calculator","IPv6 Prefix Calculator"],["linux-chmod-calculator","Linux chmod Calculator"],["network-port-reference","Network Port Reference"],["systemd-timer-builder","systemd Timer Builder"],["time-zone-converter","Time Zone Converter"],["unix-timestamp-converter","Unix Timestamp Converter"],["vlan-ip-planner","VLAN / IP Planner"],["vlsm-subnet-planner","VLSM Subnet Planner"]],"security":[["jwt-inspector","JWT Inspector"],["passphrase-generator","Passphrase Generator"],["password-generator","Password Generator"],["password-strength","Password Strength"],["punycode-converter","Punycode Converter"],["secret-leak-scanner","Secret Leak Scanner"],["sensitive-text-redactor","Sensitive Text Redactor"],["text-code-diff","Text / Code Diff"],["text-hash-generator","Text Hash Generator"],["text-hex-utf8","Text / Hex / UTF-8"],["unicode-inspector","Unicode Inspector"],["url-safety-inspector","URL Safety Inspector"]]};
  const categorySlugs = ["photo-file","code-data","networking","security"];
  const supportedToolLanguages = new Set(["en","de","fa","fr","es"]);
  const corePages = ["home","media","download","about","guides","tools","support"];
  const pathname = () => window.location.pathname.replace(/\\/{2,}/g,"/").replace(/\\/?$/,"/");
  function enhanceMenu() {
    const nav = document.querySelector(".top-nav .kolfat-menu-panel");
    if (!nav || nav.querySelector(".kf-site-map")) return;
    const code = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
    const lang = Object.prototype.hasOwnProperty.call(localized,code) ? code : "en";
    const labels = localized[lang];
    const current = pathname();
    const pathFor = item => {
      if (item === "home") return "/" + lang + "/";
      if (item === "media") return "/" + lang + "/Media_Kolfat/";
      if (item === "tools") return supportedToolLanguages.has(lang) && lang !== "en" ? "/" + lang + "/tools/" : "/tools/";
      return (lang === "en" ? "/" : "/" + lang + "/") + item + "/";
    };
    const toolRoot = pathFor("tools");
    const categoryUrl = slug => toolRoot + slug + "/";
    const guideRoot = pathFor("guides");
    const a = (href,label) => {
      const el = document.createElement("a");
      el.href = href; el.textContent = label; el.dir = "auto";
      if (href === current) el.setAttribute("aria-current","page");
      return el;
    };
    // Correct older TOOLS templates still pointing to English main-site routes.
    const direct = Array.from(nav.children).filter(el => el.tagName === "A");
    const primaryPaths = {
      home:/^\\/(?:en|de|fa|fr|es|pt|it|ja|zh|hi|ru|ar)\\/$/,
      media:/^\\/(?:en|de|fa|fr|es|pt|it|ja|zh|hi|ru|ar)\\/Media_Kolfat\\/$/,
      download:/^\\/(?:en|de|fa|fr|es|pt|it|ja|zh|hi|ru|ar)\\/download\\/$|^\\/download\\/$/,
      about:/^\\/(?:en|de|fa|fr|es|pt|it|ja|zh|hi|ru|ar)\\/about\\/$|^\\/about\\/$/,
      guides:/^\\/(?:en|de|fa|fr|es|pt|it|ja|zh|hi|ru|ar)\\/guides\\/$|^\\/guides\\/$/,
      tools:/^\\/(?:de|fa|fr|es)\\/tools\\/$|^\\/tools\\/$/,
      support:/^\\/(?:en|de|fa|fr|es|pt|it|ja|zh|hi|ru|ar)\\/support\\/$|^\\/support\\/$/
    };
    const found = new Set();
    for (const el of direct) {
      const original = el.getAttribute("href") || "";
      for (let i=0;i<corePages.length;i++) {
        const key = corePages[i];
        if (!primaryPaths[key].test(original)) continue;
        const target = pathFor(key);
        el.href = target;
        el.textContent = labels.main[i];
        el.dir = "auto";
        el.removeAttribute("aria-current");
        if (target === current) el.setAttribute("aria-current","page");
        found.add(key);
        break;
      }
    }
    if (!found.has("tools")) {
      const toolLink = a(toolRoot,labels.main[5] + (supportedToolLanguages.has(lang) ? "" : " (EN)"));
      const guideLink = Array.from(nav.children).find(el => el.tagName === "A" && el.getAttribute("href") === pathFor("guides"));
      const supportLink = Array.from(nav.children).find(el => el.tagName === "A" && el.getAttribute("href") === pathFor("support"));
      if (guideLink) guideLink.after(toolLink);
      else if (supportLink) nav.insertBefore(toolLink,supportLink);
      else nav.append(toolLink);
    }
    const block = document.createElement("div");
    block.className = "kf-site-map";
    const section = label => {
      const title = document.createElement("span");
      title.className = "menu-section-label";
      title.textContent = label;
      block.append(title);
    };
    const group = (title,items,expanded) => {
      const details=document.createElement("details");
      details.className="kf-nav-subgroup";
      const summary=document.createElement("summary");
      summary.dir="auto";
      summary.textContent=title;
      details.append(summary);
      const links=document.createElement("div");
      links.className="kf-nav-subgroup-links";
      for(const [href,label] of items) links.append(a(href,label));
      details.append(links);
      if(expanded) details.open=true;
      block.append(details);
    };
    section(labels.sections[0]);
    const guideLinks=guideSlugs.map((slug,i)=>[guideRoot+slug+"/",labels.guideTitles[i]]);
    guideLinks.push(["/support/getting-started/",labels.sections[5]]);
    group(labels.sections[1],guideLinks,current.startsWith(guideRoot) && current!==guideRoot);
    section(labels.sections[2] + (supportedToolLanguages.has(lang)?"":" (EN)"));
    for(let i=0;i<categorySlugs.length;i++){
      const slug=categorySlugs[i],hub=categoryUrl(slug);
      const rows=[[hub,labels.sections[4]],...tools[slug].map(([id,name])=>[
        slug==="photo-file" ? toolRoot+id+"/" : hub+id+"/",name
      ])];
      const inside=current===hub || rows.some(([href])=>href===current);
      group(labels.category[i],rows,inside);
    }
    section(labels.sections[3]);
    const legalRoutes=["privacy","terms","licenses","disclaimer"];
    group(labels.sections[3],legalRoutes.map((p,i)=>[pathFor(p),labels.legal[i]]),
      legalRoutes.some(p=>pathFor(p)===current));
    const socialSection = Array.from(nav.children).find(el =>
      el.classList && el.classList.contains("menu-section-label") &&
      el.nextElementSibling && el.nextElementSibling.matches('a[href*="x.com/"]'));
    nav.insertBefore(block,socialSection||null);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",enhanceMenu,{once:true});
  else enhanceMenu();
})();

/* KOLFAT unified navigation artwork and footer, 2026-10-25.
   Only static DOM and inline SVG: no trackers, downloads, or external requests. */
(() => {
  const icons = Object.freeze({
    home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
    media: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-5 4 4 3-3 4 4"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5"/><path d="M5 17v4h14v-4"/>',
    about: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
    guides: '<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Z"/><path d="M12 5v15"/>',
    tools: '<path d="M13 5a6 6 0 0 0 6 7l-7 7a3 3 0 0 1-4-4l7-7a6 6 0 0 0-2-3Z"/><path d="m6 8 3 3"/>',
    support: '<path d="M20.8 8.5c0 5-8.8 11-8.8 11S3.2 13.5 3.2 8.5a4.5 4.5 0 0 1 8.8-1.3 4.5 4.5 0 0 1 8.8 1.3Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    privacy: '<path d="m12 2 8 4v6c0 5-3 8-8 10-5-2-8-5-8-10V6z"/><path d="m9 12 2 2 4-4"/>',
    terms: '<path d="M7 3h9l4 4v14H7z"/><path d="M16 3v5h4M10 12h7m-7 4h7"/>',
    licenses: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6m-4 5 1 1 3-3"/>',
    x: '<path d="M4 3 20 21M20 3 4 21M4 3h5l11 18h-5"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
    tiktok: '<path d="M13 3v12a5 5 0 1 1-5-5"/><path d="M13 3c1 4 3 6 7 6"/>',
    github: '<path d="M9 20c-5 1-6-2-6-2m12 2v-3c4-1 5-3 5-6 0-2-1-3-2-4 0-1 0-3-1-4l-4 2h-2L7 3C6 4 6 6 6 7c-1 1-2 2-2 4 0 3 2 5 5 6v3"/>',
    link: '<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-2 2"/><path d="M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l2-2"/>'
  });
  const iconFor = href => {
    const target = new URL(href, document.baseURI);
    const host = target.hostname.toLowerCase();
    if (target.protocol === "mailto:") return "mail";
    if (host === "x.com" || host === "twitter.com") return "x";
    if (host.includes("youtube.com") || host === "youtu.be") return "youtube";
    if (host.includes("tiktok.com")) return "tiktok";
    if (host === "github.com") return "github";
    const path = target.pathname.toLowerCase().replace(/\/+$/, "");
    if (path.includes("/media_kolfat")) return "media";
    if (path.includes("/download")) return "download";
    if (path.includes("/about")) return "about";
    if (path.includes("/guides")) return "guides";
    if (path.includes("/tools")) return "tools";
    if (path.includes("/support")) return "support";
    if (path.includes("/contact")) return "mail";
    if (path.includes("/privacy")) return "privacy";
    if (path.includes("/terms")) return "terms";
    if (path.includes("/licenses")) return "licenses";
    if (!path || /^\/(?:en|fa|de|fr|es|pt|it|ja|zh|hi|ru|ar)$/.test(path)) return "home";
    return "link";
  };
  const locales = {
    en:["Privacy","Terms","Licenses","Support","Contact"],
    fa:["حریم خصوصی","شرایط","مجوزها","پشتیبانی","تماس"],
    de:["Datenschutz","Nutzungsbedingungen","Lizenzen","Support","Kontakt"],
    fr:["Confidentialité","Conditions","Licences","Assistance","Contact"],
    es:["Privacidad","Términos","Licencias","Soporte","Contacto"],
    pt:["Privacidade","Termos","Licenças","Suporte","Contato"],
    it:["Privacy","Termini","Licenze","Supporto","Contatti"],
    ja:["プライバシー","利用規約","ライセンス","サポート","お問い合わせ"],
    zh:["隐私","条款","许可证","支持","联系"],
    hi:["गोपनीयता","शर्तें","लाइसेंस","सहायता","संपर्क"],
    ru:["Конфиденциальность","Условия","Лицензии","Поддержка","Контакты"],
    ar:["الخصوصية","الشروط","التراخيص","الدعم","اتصل بنا"]
  };
  const initUnifiedChrome = () => {
    // Existing site sections keep their semantic meaning; hide only superseded
    // footer markup, never content or page sections.
    const menu = document.querySelector(".top-nav .kolfat-menu-panel");
    if (menu) {
      for (const anchor of menu.querySelectorAll("a[href]")) {
        if (anchor.querySelector(".kf-menu-icon")) continue;
        const key = iconFor(anchor.getAttribute("href"));
        const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.classList.add("kf-menu-icon");
        svg.setAttribute("viewBox","0 0 24 24");
        svg.setAttribute("fill","none");
        svg.setAttribute("stroke","currentColor");
        svg.setAttribute("stroke-width","1.8");
        svg.setAttribute("stroke-linecap","round");
        svg.setAttribute("stroke-linejoin","round");
        svg.setAttribute("aria-hidden","true");
        svg.innerHTML=icons[key];
        anchor.prepend(svg);
      }
    }
    if (!document.querySelector(".header") && !document.querySelector(".kf-global-top-rule")) {
      const line=document.createElement("div");
      line.className="kf-global-top-rule";
      line.setAttribute("aria-hidden","true");
      document.body.append(line);
    }
    if (document.querySelector("footer.kf-global-footer")) return;
    const lang=(document.documentElement.lang||"en").toLowerCase().split("-")[0];
    const locale=Object.hasOwn(locales,lang)?lang:"en";
    const labels=locales[locale];
    const prefix=locale==="en"?"":"/"+locale;
    const items=[
      [prefix+"/privacy/",labels[0]],
      [prefix+"/terms/",labels[1]],
      [prefix+"/licenses/",labels[2]],
      [prefix+"/support/",labels[3]],
      ["mailto:contact@kolfat.app",labels[4]]
    ];
    const footer=document.createElement("footer");
    footer.className="kf-global-footer";
    footer.setAttribute("aria-label","KOLFAT website information");
    footer.dir=document.documentElement.dir||"ltr";
    const inner=document.createElement("div");
    inner.className="kf-global-footer-inner";
    const copy=document.createElement("span");
    copy.className="kf-footer-copyright";
    copy.textContent="© 2026 KOLFAT";
    const nav=document.createElement("nav");
    nav.className="kf-footer-links";
    nav.setAttribute("aria-label","Legal, support and contact");
    for(const [url,label] of items){
      const a=document.createElement("a");
      a.href=url;
      a.textContent=label;
      nav.append(a);
    }
    inner.append(copy,nav);
    footer.append(inner);
    for(const old of document.querySelectorAll("footer:not(.kf-global-footer)")){
      old.hidden=true;
      old.setAttribute("aria-hidden","true");
    }
    document.body.append(footer);
  };
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",initUnifiedChrome,{once:true});
  else initUnifiedChrome();
})();

/* German-first tool localization: English tools link to German counterparts. */
(()=>{const add=()=>{if(document.documentElement.lang!=="en"||!location.pathname.startsWith("/tools/"))return;const nav=document.querySelector(".top-nav");if(!nav||nav.querySelector(".kf-tools-language"))return;const d=document.createElement("details");d.className="lang-menu kf-tools-language";const summary=document.createElement("summary");summary.textContent="🌐 EN ▾";summary.setAttribute("aria-label","Tools language");const list=document.createElement("nav");list.className="lang-list";for(const [code,label] of [["en","✓ English"],["de","Deutsch"],["fa","فارسی"],["fr","Français"],["es","Español"]]){const a=document.createElement("a");a.textContent=label;a.href=code==="en"?location.pathname:"/"+code+location.pathname;list.append(a);}d.append(summary,list);nav.append(d);d.addEventListener("toggle",()=>{if(d.open)for(const other of nav.querySelectorAll("details"))if(other!==d)other.open=false;});};if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",add,{once:true});else add();})();
