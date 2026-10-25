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
   const a=document.createElement("a");a.className="kolfat-tools-direct";a.href="/tools/";a.dir="auto";a.setAttribute("aria-label",label+(lang==="en"?"":" (English tools interface)"));
   const span=document.createElement("span");span.textContent=label;a.append(span);
   if(lang!=="en"){const badge=document.createElement("small");badge.className="tools-lang";badge.textContent="EN";badge.title="Tools currently in English";a.append(badge);}
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
