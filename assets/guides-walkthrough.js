/* Visual guidance for real KOLFAT articles. No external services and no invented steps. */
(()=>{
"use strict";
const icons=[
 '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
 '<path d="M3 8V5h7l3 3h8v12H3Z"/><path d="M7 12h10M7 16h7"/>',
 '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
 '<path d="M5 7h14M7 12h10M8 17h8"/><path d="m4 7 3-3M20 7l-3-3"/>',
 '<path d="M4 19V5h16v14H4Z"/><path d="m7 15 3-3 3 2 4-5"/>',
 '<path d="M12 2 20 6v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-4Z"/><path d="m8 12 3 3 5-6"/>'
];
const words={
en:["Visual guide map","Choose a step to jump to that part of the guide"],
de:["Visueller Leitfaden","Schritt auswählen und zum Abschnitt springen"],
fa:["نقشهٔ تصویری راهنما","برای رفتن به بخش موردنظر، مرحله را انتخاب کنید"],
es:["Mapa visual de la guía","Elige un paso para ir directamente a esa sección"],
fr:["Parcours visuel","Choisissez une étape pour accéder à la section"],
pt:["Mapa visual do guia","Escolha uma etapa para ir para essa secção"],
it:["Percorso visivo","Scegli una fase per passare alla sezione"],
ja:["ガイドの手順一覧","手順を選ぶと、その項目に移動できます"],
zh:["可视化步骤导航","选择步骤即可跳转到对应部分"],
hi:["विज़ुअल गाइड","किसी चरण को चुनकर उस भाग पर जाएँ"],
ru:["Наглядная карта руководства","Выберите шаг для перехода к нужному разделу"],
ar:["خريطة الدليل المرئية","اختر خطوة للانتقال إلى القسم المطلوب"]
};
function create(){
 const html=document.documentElement;
 if(html.dataset.kolfatPage!=="guide-article")return;
 const main=document.querySelector("main"),hero=main?.querySelector(":scope > .hero");
 if(!main||!hero||main.querySelector(".kf-guide-roadmap"))return;
 const lang=(html.lang||"en").split("-")[0];
 const w=words[lang]||words.en;
 const chapters=[...main.querySelectorAll(":scope > section.section")].filter(s=>s.querySelector("h2"));
 if(!chapters.length)return;
 let counter=0;
 const steps=[];
 for(const section of chapters){
   const h=section.querySelector("h2");if(!h)continue;
   if(section.classList.contains("guide-contents"))continue;
   const raw=h.textContent.trim();
   const title=raw.replace(/^\\d+[.)]\\s*/,"");
   if(!section.id)section.id="guide-topic-"+String(++counter).padStart(2,"0");
   section.classList.add("kf-lesson-section");
   const head=document.createElement("div");head.className="kf-lesson-heading";
   const symbol=document.createElement("span");symbol.className="kf-lesson-icon";
   symbol.setAttribute("aria-hidden","true");
   symbol.innerHTML='<svg viewBox="0 0 24 24">'+icons[steps.length%icons.length]+'</svg>';
   h.before(head);head.append(symbol,h);
   steps.push({id:section.id,title});
 }
 if(!steps.length)return;
 const nav=document.createElement("nav");nav.className="kf-guide-roadmap";
 nav.setAttribute("aria-label",w[0]);
 const heading=document.createElement("h2");heading.textContent=w[0];
 const grid=document.createElement("div");grid.className="kf-guide-roadmap-grid";
 for(const [i,step] of steps.entries()){
   const link=document.createElement("a");link.href="#"+step.id;
   const number=document.createElement("span");number.className="kf-guide-roadmap-num";number.textContent=String(i+1).padStart(2,"0");
   const label=document.createElement("span");label.textContent=step.title;link.append(number,label);grid.append(link);
 }
 nav.append(heading,grid);
 const hint=document.createElement("p");hint.textContent=w[1];hint.style.color="#bdbdb8";hint.style.margin="0 0 17px";
 nav.insertBefore(hint,grid);
 const progress=document.createElement("div");progress.className="kf-guide-progress";
 progress.setAttribute("aria-hidden","true");const bar=document.createElement("span");progress.append(bar);
 hero.after(progress,nav);
 let busy=false;
 const redraw=()=>{busy=false;const doc=document.documentElement;
   const total=Math.max(1,doc.scrollHeight-doc.clientHeight);
   bar.style.width=Math.min(100,Math.max(0,Math.round(100*doc.scrollTop/total)))+"%";
 };
 const update=()=>{if(!busy){busy=true;requestAnimationFrame(redraw)}};
 addEventListener("scroll",update,{passive:true});addEventListener("resize",update,{passive:true});update();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",create,{once:true});else create();
})();