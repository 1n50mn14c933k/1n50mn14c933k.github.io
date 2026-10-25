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
   const a=document.createElement("a");a.className="kolfat-tools-direct";a.href=(lang==="de"||lang==="fa"||lang==="fr")?"/"+lang+"/tools/":"/tools/";a.dir="auto";a.setAttribute("aria-label",label+(lang==="de"?" (deutsche Werkzeugoberfläche)":lang==="fa"?" (رابط فارسی ابزارها)":lang==="fr"?" (interface française des outils)":lang==="en"?"":" (English tools interface)"));
   const span=document.createElement("span");span.textContent=label;a.append(span);
   if(lang!=="en"&&lang!=="de"&&lang!=="fa"&&lang!=="fr"){const badge=document.createElement("small");badge.className="tools-lang";badge.textContent="EN";badge.title="Tools currently in English";a.append(badge);}
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
(()=>{const add=()=>{if(document.documentElement.lang!=="en"||!location.pathname.startsWith("/tools/"))return;const nav=document.querySelector(".top-nav");if(!nav||nav.querySelector(".kf-tools-language"))return;const d=document.createElement("details");d.className="lang-menu kf-tools-language";const summary=document.createElement("summary");summary.textContent="🌐 EN ▾";summary.setAttribute("aria-label","Tools language");const list=document.createElement("nav");list.className="lang-list";for(const [code,label] of [["en","✓ English"],["de","Deutsch"],["fa","فارسی"],["fr","Français"]]){const a=document.createElement("a");a.textContent=label;a.href=code==="en"?location.pathname:"/"+code+location.pathname;list.append(a);}d.append(summary,list);nav.append(d);d.addEventListener("toggle",()=>{if(d.open)for(const other of nav.querySelectorAll("details"))if(other!==d)other.open=false;});};if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",add,{once:true});else add();})();
