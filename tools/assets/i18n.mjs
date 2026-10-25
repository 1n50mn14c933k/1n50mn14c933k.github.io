/* KOLFAT TOOLS client translations. Existing tool engines remain untouched.
 * Localized routes are generated statically; this module translates interface
 * labels and links, not technical data, example code, or user inputs. */
import {toolIds,englishNames,categoryIds,englishCategories,localePacks,allToolLanguages} from "./i18n-data.mjs";
import {textTranslations} from "./i18n-text.mjs";
const lang=(document.documentElement.lang||"en").slice(0,2).toLowerCase();
const pack=localePacks[lang];
const baseName=new Map(englishNames.map((value,i)=>[value,i]));
const cats=new Map(englishCategories.map((value,i)=>[value,i]));
const slugIndex=new Map(toolIds.map((slug,i)=>[slug,i]));
const langNames={en:"English",de:"Deutsch",fr:"Français",es:"Español",pt:"Português",it:"Italiano",ru:"Русский",zh:"中文",ja:"日本語",hi:"हिन्दी",fa:"فارسی",ar:"العربية"};
const common={
 "Input text":"input","Input":"input","Text":"input","Source":"input","Result":"output",
 "Output":"output","Copy result":"copy","Copy":"copy","Clear":"clear",
 "Download result":"download","Download":"download","Ready.":"ready",
 "Ready to calculate.":"ready","Ready to process.":"ready",
 "Complete. Nothing was uploaded.":"complete",
 "Complete. Your data stayed in this browser.":"complete",
 "Calculate locally":"run","Process locally":"run","Analyze locally":"run",
 "Generate securely":"run","Generate":"run","Run":"run",
 "Open tool →":"open","Explore category ↗":"explore","Explore category":"explore",
 "FREE • LOCAL • PRIVATE":"free","FREE • ON-DEVICE":"local",
 "12 tools":"twelve","All tools":"all","All tools →":"all",
 "More KOLFAT TOOLS":"more","More Security & Text Tools":"more",
 "Browse by category":"choose","Your privacy comes first.":"privacy",
 "Browse tools":"choose"
};
const other={
 de:{status:"Wird lokal verarbeitet…",home:"Startseite",about:"Über uns",download:"Download",guides:"Anleitungen",support:"Support",contact:"Kontakt",tool:"Werkzeuge",privacy:"Datenschutz",terms:"Bedingungen",license:"Lizenzen",more:"Mehr entdecken",warning:"Hinweis: Bitte beachten Sie die technischen Einschränkungen unten.",lead:"Verwenden Sie dieses Werkzeug direkt im Browser. Ihre Eingaben werden nicht an KOLFAT hochgeladen.",catlead:"Zwölf Werkzeuge dieser Kategorie, ohne Uploads nutzbar.",directory:"Entdecken Sie 48 kostenlose Werkzeuge in vier Kategorien.",lang:"Sprache"},
 fr:{status:"Traitement local…",home:"Accueil",about:"À propos",download:"Télécharger",guides:"Guides",support:"Assistance",contact:"Contact",tool:"Outils",privacy:"Confidentialité",terms:"Conditions",license:"Licences",more:"Découvrir",warning:"Remarque : consultez les limites techniques ci-dessous.",lead:"Utilisez cet outil dans votre navigateur. Vos données ne sont pas envoyées à KOLFAT.",catlead:"Douze outils disponibles dans cette catégorie, sans envoi de données.",directory:"Découvrez 48 outils gratuits dans quatre catégories.",lang:"Langue"},
 es:{status:"Procesando localmente…",home:"Inicio",about:"Acerca de",download:"Descargar",guides:"Guías",support:"Soporte",contact:"Contacto",tool:"Herramientas",privacy:"Privacidad",terms:"Términos",license:"Licencias",more:"Explorar",warning:"Nota: lea las limitaciones técnicas que aparecen debajo.",lead:"Use esta herramienta en su navegador. Sus datos no se suben a KOLFAT.",catlead:"Doce herramientas en esta categoría, sin subir datos.",directory:"Descubra 48 herramientas gratuitas en cuatro categorías.",lang:"Idioma"},
 pt:{status:"A processar localmente…",home:"Início",about:"Sobre",download:"Descarregar",guides:"Guias",support:"Suporte",contact:"Contacto",tool:"Ferramentas",privacy:"Privacidade",terms:"Termos",license:"Licenças",more:"Explorar",warning:"Nota: consulte os limites técnicos abaixo.",lead:"Use esta ferramenta no navegador. Os seus dados não são enviados para KOLFAT.",catlead:"Doze ferramentas nesta categoria sem carregar dados.",directory:"Explore 48 ferramentas gratuitas em quatro categorias.",lang:"Idioma"},
 it:{status:"Elaborazione locale…",home:"Home",about:"Chi siamo",download:"Scarica",guides:"Guide",support:"Supporto",contact:"Contatti",tool:"Strumenti",privacy:"Privacy",terms:"Termini",license:"Licenze",more:"Scopri",warning:"Nota: leggere i limiti tecnici riportati sotto.",lead:"Usa questo strumento nel browser. I tuoi dati non vengono caricati su KOLFAT.",catlead:"Dodici strumenti in questa categoria senza caricamenti.",directory:"Scopri 48 strumenti gratuiti in quattro categorie.",lang:"Lingua"},
 ru:{status:"Локальная обработка…",home:"Главная",about:"О проекте",download:"Скачать",guides:"Руководства",support:"Поддержка",contact:"Контакты",tool:"Инструменты",privacy:"Конфиденциальность",terms:"Условия",license:"Лицензии",more:"Подробнее",warning:"Примечание: ознакомьтесь с техническими ограничениями ниже.",lead:"Используйте инструмент в браузере. Ваши данные не отправляются KOLFAT.",catlead:"Двенадцать инструментов категории без загрузки данных.",directory:"48 бесплатных инструментов в четырёх категориях.",lang:"Язык"},
 zh:{status:"正在本地处理…",home:"首页",about:"关于",download:"下载",guides:"指南",support:"支持",contact:"联系",tool:"工具",privacy:"隐私",terms:"条款",license:"许可证",more:"了解更多",warning:"注意：请阅读下方的技术限制。",lead:"直接在浏览器中使用本工具。您的数据不会上传至 KOLFAT。",catlead:"本类别提供十二款无需上传数据的工具。",directory:"浏览四个类别中的 48 款免费工具。",lang:"语言"},
 ja:{status:"ローカルで処理中…",home:"ホーム",about:"概要",download:"ダウンロード",guides:"ガイド",support:"サポート",contact:"お問い合わせ",tool:"ツール",privacy:"プライバシー",terms:"利用規約",license:"ライセンス",more:"もっと見る",warning:"注意：以下の技術的な制限を確認してください。",lead:"ブラウザー内でツールを使用できます。データは KOLFAT に送信されません。",catlead:"アップロード不要の 12 個のツールを利用できます。",directory:"4 つのカテゴリから 48 個の無料ツールをご利用ください。",lang:"言語"},
 hi:{status:"स्थानीय रूप से काम जारी है…",home:"होम",about:"परिचय",download:"डाउनलोड",guides:"मार्गदर्शिकाएँ",support:"सहायता",contact:"संपर्क",tool:"टूल्स",privacy:"गोपनीयता",terms:"शर्तें",license:"लाइसेंस",more:"और देखें",warning:"ध्यान दें: नीचे तकनीकी सीमाएँ पढ़ें।",lead:"इस टूल का उपयोग ब्राउज़र में करें। आपका डेटा KOLFAT पर अपलोड नहीं होता।",catlead:"इस श्रेणी के बारह टूल, बिना डेटा अपलोड के।",directory:"चार श्रेणियों में 48 मुफ़्त टूल देखें।",lang:"भाषा"},
 fa:{status:"در حال پردازش محلی…",home:"خانه",about:"درباره",download:"دریافت",guides:"راهنما",support:"پشتیبانی",contact:"تماس",tool:"ابزارها",privacy:"حریم خصوصی",terms:"شرایط",license:"مجوزها",more:"مشاهده بیشتر",warning:"توجه: محدودیت‌های فنی زیر را بخوانید.",lead:"این ابزار در مرورگر شما کار می‌کند و داده‌های شما به KOLFAT ارسال نمی‌شوند.",catlead:"دوازده ابزار در این دسته، بدون نیاز به بارگذاری داده‌ها.",directory:"۴۸ ابزار رایگان در چهار دسته‌بندی را ببینید.",lang:"زبان"},
 ar:{status:"جارٍ المعالجة محلياً…",home:"الرئيسية",about:"حول",download:"تنزيل",guides:"الأدلة",support:"الدعم",contact:"الاتصال",tool:"الأدوات",privacy:"الخصوصية",terms:"الشروط",license:"التراخيص",more:"المزيد",warning:"ملاحظة: اقرأ القيود التقنية أدناه.",lead:"استخدم الأداة في متصفحك. لا تُرفع بياناتك إلى KOLFAT.",catlead:"اثنتا عشرة أداة في هذه الفئة دون رفع البيانات.",directory:"اكتشف ٤٨ أداة مجانية في أربع فئات.",lang:"اللغة"}
};
const local=other[lang];
const ui=textTranslations[lang]||{};
if(pack&&local){
 const route=location.pathname.replace(/^\/(?:de|fr|es|pt|it|ru|zh|ja|hi|fa|ar)(?=\/tools\/)/,"");
 const parts=route.split("/").filter(Boolean).slice(1);
 const categoryPath=parts[0]||"";
 const slug=parts.length?parts[parts.length-1]:"";
 const toolIndex=slugIndex.get(slug);
 const isDir=!parts.length;
 const isCat=parts.length===1&&(slug==="photo-file"||categoryIds.includes(slug));
 const categoryIndex=categoryIds.indexOf(categoryPath==="photo-file"?"photo":categoryPath);
 const translateTitle=v=>{
   const normalized=v.trim().replace(/&amp;/g,"&");
   if(baseName.has(normalized))return pack.names[baseName.get(normalized)];
   if(cats.has(normalized))return pack.labels[categoryIds[cats.get(normalized)]];
   return v;
 };
 const translated=t=>{
  const compact=t.trim().replace(/\s+/g," ");
  if(!compact)return t;
  if(ui[compact])return ui[compact];
  if(common[compact])return pack.labels[common[compact]];
  const renamed=translateTitle(compact);
  if(renamed!==compact)return renamed;
  if(/^Back to /.test(compact))return pack.labels.back+" →";
  if(/^Open tool/.test(compact))return pack.labels.open+" →";
  if(/^Explore category/.test(compact))return pack.labels.explore+" ↗";
  if(/^12 (.+) Tools$/.test(compact))return pack.labels.twelve;
  return t;
 };
 // Preserve code/technical inputs, textareas, accessible SVGs, and displayed results.
 const selectors="main h1,main h2,main h3,main strong,main legend,main label,main button,main option,main .eyebrow,main .card-label,main .card-arrow,main .kf-category-label,main .kf-category-count,main .kf-category-open,main .status,main .breadcrumb,main .download,main .file-label,main .drop-zone,main .uploader,main .field-label,main .controls,main .section-tools";
 for(const el of document.querySelectorAll(selectors)){
  if(el.matches("textarea,input,pre,code")||el.closest("pre,code,textarea,.zone-text"))continue;
  if(el.tagName==="LABEL"&&el.querySelector("input,select,textarea")){
   for(const node of el.childNodes)if(node.nodeType===3){const v=node.textContent;if(v.trim()){const tr=translated(v);if(tr!==v)node.textContent=tr;}}
   continue;
  }
  for(const node of el.childNodes)if(node.nodeType===3){const v=node.textContent;if(v.trim()){const tr=translated(v);if(tr!==v)node.textContent=tr;}}
 }
 // Tool and collection names are authoritative by route, regardless of English variant.
 if(toolIndex!==undefined){
  const heading=document.querySelector("main h1");
  if(heading)heading.textContent=pack.names[toolIndex];
 }else if(isCat&&categoryIndex>=0){
  const heading=document.querySelector("main h1");
  if(heading)heading.textContent=pack.labels[categoryPath==="photo-file"?"photo":categoryPath];
 }else if(isDir){
  const heading=document.querySelector("main h1");if(heading)heading.textContent=pack.labels.all;
 }
 for(const card of document.querySelectorAll("a.tool-card")){
  const slug=card.getAttribute("href")?.split("/").filter(Boolean).pop();
  const i=slugIndex.get(slug);
  if(i!==undefined){const title=card.querySelector("h2");if(title)title.textContent=pack.names[i];}
  const c=card.querySelector(".card-arrow");if(c)c.textContent=pack.labels.open+" →";
 }
 for(const card of document.querySelectorAll("a.kf-category-card")){
  const slug=card.getAttribute("href")?.split("/").filter(Boolean).pop();
  if(categoryIds.includes(slug)){const title=card.querySelector(".kf-category-name");if(title)title.textContent=pack.labels[slug];}
  const c=card.querySelector(".kf-category-count");if(c)c.textContent=pack.labels.twelve;
  const x=card.querySelector(".kf-category-open");if(x)x.textContent=pack.labels.explore+" ↗";
 }
 const lead=document.querySelector("main .hero-tools p.lead");
 if(lead)lead.textContent=isDir?local.directory:isCat?local.catlead:local.lead;
 for(const card of document.querySelectorAll("a.tool-card p,a.kf-category-card .kf-category-description")){
   card.textContent=isDir||isCat?local.lead:local.catlead;
 }
 const disclaimer=document.querySelector(".workspace .caveat");
 if(disclaimer){const original=disclaimer.textContent;const details=document.createElement("details");details.className="kf-technical-details";const summary=document.createElement("summary");summary.textContent=ui["Show original technical details"]||"Show original technical details";details.append(summary);const p=document.createElement("p");p.textContent=original;details.append(p);disclaimer.textContent=local.warning+" ";disclaimer.append(details);}
 // Update links only within the TOOLS directory; retain original engine assets.
 for(const a of document.querySelectorAll('a[href^="/tools/"]')){
  a.setAttribute("href","/"+lang+a.getAttribute("href"));
 }
 // Convert localized marketing links on cloned tool pages.
 for(const a of document.querySelectorAll(".kolfat-menu-panel a[href]")){
  const href=a.getAttribute("href");const part=href.split("/").filter(Boolean);
  if(a.getAttribute("href")==="/en/")a.href="/"+lang+"/";
  if(href==="/download/"||href==="/about/"||href==="/guides/"||href==="/support/")a.href="/"+lang+href;
  if(href.startsWith("mailto:"))a.textContent=local.contact;
  else if(href.includes("Media_Kolfat"))a.textContent="MEDIA KOLFAT";
  else if(href.includes("/tools/"))a.textContent=local.tool;
  else if(href.includes("/download/"))a.textContent=local.download;
  else if(href.includes("/about/"))a.textContent=local.about;
  else if(href.includes("/guides/"))a.textContent=local.guides;
  else if(href.includes("/support/"))a.textContent=local.support;
  else if(href==="/en/")a.textContent=local.home;
 }
 const breadcrumb=document.querySelector("main .breadcrumb");
 if(breadcrumb)for(const a of breadcrumb.querySelectorAll("a")){
  if(a.getAttribute("href")==="/en/")a.href="/"+lang+"/";
  if(a.textContent.trim().toUpperCase()==="TOOLS")a.textContent=local.tool;
 }
 const picker=document.createElement("details");
 picker.className="lang-menu kf-tools-language";
 const summary=document.createElement("summary");
 summary.textContent=(lang==="fa"?"🇮🇷":lang==="ar"?"🇸🇦":"🌐")+" "+lang.toUpperCase()+" ▾";
 summary.setAttribute("aria-label",local.lang+" / Language");
 const list=document.createElement("nav");
 list.className="lang-list";list.setAttribute("aria-label",local.lang+" / Language");
 const origin=route.replace(/^\/tools\//,"");
 for(const code of allToolLanguages){
  const anchor=document.createElement("a");anchor.href=(code==="en"?"/tools/":"/"+code+"/tools/")+origin;
  anchor.textContent=(code===lang?"✓ ":"")+langNames[code];
  if(code===lang)anchor.setAttribute("aria-current","page");
  list.append(anchor);
 }
 picker.append(summary,list);
 const top=document.querySelector(".top-nav");
 if(top)top.append(picker);
 picker.addEventListener("toggle",()=>{
  if(picker.open)for(const d of document.querySelectorAll(".top-nav details"))if(d!==picker)d.open=false;
 });
 // Translate plain text nodes without modifying technical input values or output formats.
 // Existing browser processing engines are never translated or replaced.
 const walker=document.createTreeWalker(document.querySelector("main")||document.body,NodeFilter.SHOW_TEXT);
 const replaceNodes=[];
 while(walker.nextNode()){
   const node=walker.currentNode,el=node.parentElement;
   if(!el||el.closest("script,style,pre,code,textarea,svg,output,#output,#downloads,.kf-technical-details"))continue;
   const old=node.textContent.trim();if(old&&ui[old])replaceNodes.push([node,old]);
 }
 for(const [node,old] of replaceNodes)node.textContent=node.textContent.replace(old,ui[old]);
 // Dynamic labels from all four unmodified calculation engines.
 const status=document.querySelector("#status");
 if(status){
  let translating=false;
  const observer=new MutationObserver(()=>{
   if(translating)return;
   const v=status.textContent.trim();
   let next;
   if(/^(Ready|Prêt|Listo)\b|^Ready\./i.test(v))next=pack.labels.ready;
   else if(/^(Processing|Calculating|Loading|Generating)/i.test(v))next=local.status;
   else if(/^(Complete|Done|Success)/i.test(v))next=pack.labels.complete;
   else if(status.dataset.kind==="error"&&!v.startsWith(pack.labels.error))next=pack.labels.error+" "+v;
   if(next&&v!==next){translating=true;status.textContent=next;translating=false;}
  });
  observer.observe(status,{childList:true,characterData:true,subtree:true});
  status.textContent=pack.labels.ready;
 }
 const downloadContainer=document.getElementById("downloads");
 if(downloadContainer){
  new MutationObserver(()=>{for(const a of downloadContainer.querySelectorAll("a"))a.textContent=pack.labels.download;})
    .observe(downloadContainer,{childList:true});
 }
 document.documentElement.dir=(lang==="fa"||lang==="ar")?"rtl":"ltr";
}
