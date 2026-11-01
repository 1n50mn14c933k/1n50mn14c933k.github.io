/* Localized MEDIA KOLFAT Guides visual launcher.
   Only runs for Guides hub and articles. The illustrated User Guide is excluded. */
(()=>{
"use strict";
const path=location.pathname;
const parts=path.split("/").filter(Boolean);
const guideIndex=parts.indexOf("guides");
if(guideIndex<0)return;
const slug=parts[guideIndex+1]||"";
if(slug==="media-kolfat-2-user-guide")return;
const types=new Set(["organize-photos-by-date","organize-large-photo-library","find-duplicate-photos-safely","organize-photos-from-phone-and-usb","photo-organizer-for-windows"]);
const extras=new Set(["copy-vs-move-safely","photos-without-capture-dates","recover-interrupted-organization","understand-activity-reports"]);
const isHub=slug==="",isArticle=types.has(slug)||extras.has(slug);
if(!isHub&&!isArticle)return;
const html=document.documentElement;
if(html.dataset.kolfatGuideLoaderStarted==="1")return;
html.dataset.kolfatGuideLoaderStarted="1";
html.dataset.kolfatPage=isHub?"guide-index":"guide-article";
const css=document.createElement("link");css.rel="stylesheet";css.href="/assets/guides-visual.css?v=20261101-parity1";document.head.append(css);
const cardHitStyle=document.createElement("style");
cardHitStyle.textContent='html[data-kolfat-page="guide-index"] a.kf-guide-card-clickable{cursor:pointer}html[data-kolfat-page="guide-index"] a.kf-guide-card-clickable:focus-visible{outline:3px solid #ff963c!important;outline-offset:3px!important}html[data-kolfat-page="guide-index"] a.kf-guide-card-clickable h2{text-decoration:none!important}';
document.head.append(cardHitStyle);
const langs={en:["Choose your guide","Learn with clear steps, visual examples and practical safety checks.","START HERE","PRACTICAL GUIDE","Read the guide","EXTRA GUIDE"],
de:["Anleitung auswählen","Klare Schritte, anschauliche Beispiele und sichere Kontrollen.","HIER STARTEN","PRAXISANLEITUNG","Anleitung lesen","EXTRA"],
es:["Elige una guía","Pasos claros, ejemplos visuales y controles de seguridad.","EMPIEZA AQUÍ","GUÍA PRÁCTICA","Leer guía","EXTRA"],
fa:["راهنمای خود را انتخاب کنید","مراحل روشن، نمونه‌های تصویری و بررسی‌های ایمنی.","شروع از اینجا","راهنمای کاربردی","مطالعهٔ راهنما","راهنمای بیشتر"],
ar:["اختر دليلك","خطوات واضحة وأمثلة مرئية وفحوصات السلامة.","ابدأ هنا","دليل عملي","قراءة الدليل","دليل إضافي"],
fr:["Choisissez votre guide","Des étapes claires, des exemples visuels et des vérifications de sécurité.","COMMENCER ICI","GUIDE PRATIQUE","Lire le guide","EN PLUS"],
it:["Scegli una guida","Passaggi chiari, esempi visivi e verifiche di sicurezza.","INIZIA QUI","GUIDA PRATICA","Leggi la guida","EXTRA"],
pt:["Escolha o guia","Passos claros, exemplos visuais e verificações de segurança.","COMECE AQUI","GUIA PRÁTICO","Ler o guia","EXTRA"],
hi:["अपनी मार्गदर्शिका चुनें","सरल चरण, चित्रों वाले उदाहरण और सुरक्षा जाँच।","यहाँ शुरू करें","व्यावहारिक गाइड","गाइड पढ़ें","अतिरिक्त गाइड"],
ja:["ガイドを選ぶ","わかりやすい手順と図解、安全確認で学びましょう。","ここから開始","実践ガイド","ガイドを読む","追加ガイド"],
ru:["Выберите руководство","Понятные шаги, схемы и проверки безопасности.","НАЧАТЬ ЗДЕСЬ","ПРАКТИЧЕСКОЕ РУКОВОДСТВО","Читать руководство","ДОПОЛНИТЕЛЬНО"],
zh:["选择指南","清晰的步骤、图解实例和安全检查。","从这里开始","实用指南","阅读指南","补充指南"]};
const lang=(html.lang||"en").split("-")[0],t=langs[lang]||langs.en;
function init(){
 const main=document.querySelector("main");if(!main)return;
 if(isHub){
   main.classList.add("kf-guides-hub");
   const hero=main.querySelector(".hero");hero?.classList.add("kf-guides-hero");
   const section=main.querySelector(":scope > .section");section?.classList.add("kf-guides-section");
   const grid=section?.querySelector(".grid");grid?.classList.add("kf-guides-grid");
   if(grid&&!section.querySelector(".kf-guides-section-head")){
      const heading=document.createElement("h2");heading.className="kf-guides-section-head";heading.textContent=t[0];
      const p=document.createElement("p");p.className="kf-guides-intro";p.textContent=t[1];p.style.color="#c6c6c2";p.style.margin="0 0 20px";
      grid.before(heading,p);
   }
   const icons=[
    '<path d="M3 8V4h18v16H3Z"/><path d="m7 12 3 3 7-7"/>',
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 2v6M16 2v6M3 10h18"/>',
    '<path d="M3 8V5h7l3 3h8v12H3Z"/><path d="M7 12h10M7 16h7"/>',
    '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 8h6M9 12h6M9 16h6"/>',
    '<rect x="3" y="7" width="15" height="12" rx="2"/><path d="M20 10h2v8h-2M7 4h7"/>',
    '<path d="m12 2 9 4v6c0 5-3.5 8-9 10-5.5-2-9-5-9-10V6Z"/><path d="m8 12 3 3 5-6"/>',
    '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M8 12h8M12 8v8"/>',
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m7 15 3-3 3 2 4-5"/>'
   ];
   grid?.querySelectorAll("article.card").forEach((original,i)=>{
     const source=original.querySelector("h2 a[href]")||original.querySelector("a[href]");
     if(!source)return;
     const url=source.getAttribute("href");
     if(!url)return;
     const card=document.createElement("a");
     card.href=url;
     card.className=original.className+" kf-guide-card kf-guide-card-clickable";
     if(original.id)card.id=original.id;
     card.setAttribute("aria-label",(original.querySelector("h2")?.textContent||source.textContent).trim());
     while(original.firstChild)card.append(original.firstChild);
     card.querySelectorAll("a").forEach(link=>{
       if(link.closest("h2,h3"))link.replaceWith(...Array.from(link.childNodes));
       else link.remove();
     });
     const mark=document.createElement("div");mark.className="kf-guide-card-mark";
     mark.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[i%icons.length]+'</svg>';
     const tag=document.createElement("span");tag.textContent=i===0?t[2]:i>5?t[5]:t[3];
     mark.append(tag);card.prepend(mark);
     original.replaceWith(card);
   });
 }else{
   for(const name of ["guides-walkthrough.js","guides-enrichment.js","guides-examples.js"]){
     const src=document.createElement("script");src.src="/assets/"+name+"?v=20261101-parity1";src.async=false;document.body.append(src);
   }
 }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();