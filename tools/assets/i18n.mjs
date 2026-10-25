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
const safetyPacks=pack&&local?(await import("./i18n-safety-"+lang+".mjs")).safetySummaries:[];
const ui=textTranslations[lang]||{};
/* German-only coverage patch: no modifications to computational engines or output. */
const deExtra={
"Length (12–128)":"Länge (12–128)","Character groups":"Zeichengruppen","Select one or more character types.":"Wählen Sie mindestens eine Zeichenart aus.",
"Uppercase A–Z":"Großbuchstaben A–Z","Lowercase a–z":"Kleinbuchstaben a–z","Numbers 0–9":"Ziffern 0–9","Symbols":"Sonderzeichen","Avoid ambiguous characters":"Verwechselbare Zeichen vermeiden",
"Ready.":"Bereit.","Results appear here.":"Ergebnisse erscheinen hier.","More Security & Text Tools":"Weitere Sicherheits- und Textwerkzeuge","All 12 security and text analysis utilities.":"Alle zwölf Werkzeuge für Sicherheit und Textanalyse.","Back to Security & Text Analysis →":"Zurück zu Sicherheit und Textanalyse →","Character groups":"Zeichengruppen","Technical limitations":"Technische Einschränkungen","Show original technical details":"Technische Hinweise anzeigen","Choose your input to begin.":"Wählen Sie eine Eingabe, um zu beginnen.","Select files":"Dateien auswählen","Or drag and drop files here":"Oder Dateien hierher ziehen","Processing locally…":"Wird lokal verarbeitet…","Complete. Nothing was uploaded.":"Abgeschlossen. Es wurden keine Daten hochgeladen.","Important:":"Wichtig:","Input":"Eingabe","Output":"Ausgabe","Result":"Ergebnis",
"Choose a file":"Datei auswählen","Choose file":"Datei auswählen","Select file":"Datei auswählen","Select files":"Dateien auswählen",
"Copy":"Kopieren","Copied!":"Kopiert!","Clear":"Leeren","Reset":"Zurücksetzen","Download":"Herunterladen",
"Download PNG":"PNG herunterladen","Download PDF":"PDF herunterladen","Download CSV":"CSV herunterladen",
"Generate":"Erzeugen","Generate password":"Passwort erzeugen","Generate passphrase":"Passphrase erzeugen",
"Analyze":"Analysieren","Calculate":"Berechnen","Convert":"Konvertieren","Format":"Formatieren","Validate":"Prüfen",
"Check":"Prüfen","Inspect":"Untersuchen","Run":"Ausführen","Process":"Verarbeiten",
"Options":"Optionen","Settings":"Einstellungen","Preview":"Vorschau","Filename":"Dateiname","File name":"Dateiname",
"File size":"Dateigröße","Width":"Breite","Height":"Höhe","Quality":"Qualität","Size":"Größe",
"Input text":"Eingabetext","Text to analyze":"Zu analysierender Text","Text to convert":"Zu konvertierender Text",
"Paste text here...":"Text hier einfügen…","Enter text here...":"Text hier eingeben…",
"Select an option":"Option auswählen","Choose an option":"Option auswählen",
"Supported formats":"Unterstützte Formate","No files selected":"Keine Dateien ausgewählt",
"Enter a value":"Wert eingeben","No results":"Keine Ergebnisse","Processing...":"Verarbeitung läuft…",
"Error":"Fehler","Invalid input.":"Ungültige Eingabe.","Result copied.":"Ergebnis kopiert.",
"Show details":"Details anzeigen","Hide details":"Details ausblenden",
"Browser-based processing":"Verarbeitung direkt im Browser","Privacy":"Datenschutz",
"Back to all tools":"Zurück zu allen Werkzeugen","Back to tools":"Zurück zu den Werkzeugen",
"Photo & File":"Foto & Datei","Code & Data":"Code & Daten","Networking":"Netzwerk","Security":"Sicherheit",
"Generate securely":"Sicher erzeugen","Password length":"Passwortlänge",
"Security & Text Analysis":"Sicherheit & Textanalyse",
"Create cryptographically random passwords with optional character groups.":"Erzeugen Sie kryptografisch zufällige Passwörter mit frei wählbaren Zeichengruppen.",
"Generated using Web Crypto and unbiased random selection. Keep passwords in a trusted manager. No result is auto-downloaded.":"Die Passwörter werden mit der Web-Crypto-Schnittstelle ohne verzerrte Zufallsauswahl erzeugt. Bewahren Sie sie in einem vertrauenswürdigen Passwortmanager auf. Ergebnisse werden nicht automatisch heruntergeladen."
};
if(lang==="de")Object.assign(ui,deExtra);
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
  const divider=compact.match(/^(\/\s*)(.+)$/);
  if(divider){const right=translated(divider[2]);if(right!==divider[2])return divider[1]+right;}
  if(baseName.has(compact))return pack.names[baseName.get(compact)];
  const cleaned=compact.toUpperCase().replace(/\s+/g," ");
  const groupNames={"CODE & DATA":"code-data","NETWORKING":"networking","PHOTO & FILE":"photo","SECURITY":"security","PHOTOS • FILES":"photo","DEVELOPMENT • DATA":"code-data","NETWORKS • SYSTEMS":"networking","SECURITY • PRIVACY":"security"};
  if(groupNames[cleaned])return pack.labels[groupNames[cleaned]];
  const shortCategory={"Code & Data Utilities":"code-data","Photo & File Tools":"photo","Networking & Automation":"networking","Security & Text Analysis":"security"};
  if(shortCategory[compact])return pack.labels[shortCategory[compact]];
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
 // The general privacy banner is only displayed on the TOOLS hub.
 // Older German utility HTML may contain a generated banner: remove it.
 if(!isDir){
   for(const notice of document.querySelectorAll(".kf-i18n-safety,.kf-hub-privacy"))notice.remove();
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
  let translation=null;
  if(href.startsWith("mailto:"))translation=local.contact;
  else if(href.includes("Media_Kolfat"))translation="MEDIA KOLFAT";
  else if(href.includes("/tools/"))translation=local.tool;
  else if(href.includes("/download/"))translation=local.download;
  else if(href.includes("/about/"))translation=local.about;
  else if(href.includes("/guides/"))translation=local.guides;
  else if(href.includes("/support/"))translation=local.support;
  else if(href==="/en/")translation=local.home;
  if(translation!==null){
    // Keep the existing SVG icon and keyboard metadata instead of wiping child nodes.
    let labelNode=Array.from(a.childNodes).find(n=>n.nodeType===Node.TEXT_NODE);
    if(!labelNode){labelNode=document.createTextNode("");a.append(labelNode);}
    labelNode.textContent=translation;
  }
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
 for(const code of ["en","de"]){
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

 // Normalize page-specific breadcrumbs, hero copy and old English promotional text.
 // Preserve original technical explanations separately instead of throwing them away.
 const heroText=document.querySelector("main .hero-tools,main .hero");
 if(heroText){
   for(const p of heroText.querySelectorAll("p")){
     if(p.closest(".kf-i18n-safety")||p.querySelector("input,button,code,pre"))continue;
     const line=p.textContent.trim();
     if(line.length>65&&/^[A-Za-z]/.test(line)&&!p.classList.contains("eyebrow")){
       const details=document.createElement("details");
       details.className="kf-technical-details kf-description-reference";
       const label=document.createElement("summary");
       label.textContent=ui["Show original technical details"]||"Original English description";
       const original=document.createElement("p");
       original.textContent=line;
       details.append(label,original);
       p.textContent=local.lead;
       p.insertAdjacentElement("afterend",details);
     }
   }
 }
 for(const promo of document.querySelectorAll("main .promotion")){
   const title=promo.querySelector("h2");
   if(title)title.textContent=local.more+" KOLFAT";
   for(const p of promo.querySelectorAll("p"))p.textContent=local.directory;
   for(const a of promo.querySelectorAll("a")){
     const target=a.getAttribute("href")||"";
     a.textContent=target.includes("Media_Kolfat")?local.more+" MEDIA KOLFAT →":pack.labels.more+" →";
     if(target.includes("/tools/")&&!target.startsWith("/"+lang+"/"))a.href="/"+lang+target;
   }
 }
 const privacy=document.querySelector("main .kf-hub-privacy");
 if(privacy){
   privacy.textContent="";
   const strong=document.createElement("strong");strong.textContent=pack.labels.privacy+". ";
   privacy.append(strong,document.createTextNode(local.directory+" "+local.lead));
 }
 for(const promo of document.querySelectorAll("main .kf-hub-promo")){
   const title=promo.querySelector("h2");if(title)title.textContent=local.more+" MEDIA KOLFAT";
   for(const p of promo.querySelectorAll("p"))p.textContent=local.directory;
 }

 // Translate UI attributes in German only; never alter user input or machine-readable values.
 if(lang==="de")for(const el of document.querySelectorAll("main input[placeholder],main textarea[placeholder],main input[aria-label],main button[aria-label],main select[aria-label],main [title]")){
   for(const attr of ["placeholder","aria-label","title"]){
     const v=el.getAttribute(attr);if(!v)continue;
     const translation=translated(v);if(translation!==v)el.setAttribute(attr,translation);
   }
 }
 // Translate plain text nodes without modifying technical input values or output formats.
 // Existing browser processing engines are never translated or replaced.
 const walker=document.createTreeWalker(document.querySelector("main")||document.body,NodeFilter.SHOW_TEXT);
 const replaceNodes=[];
 while(walker.nextNode()){
   const node=walker.currentNode,el=node.parentElement;
   if(!el||el.closest("script,style,pre,code,textarea,svg,output,#output,#downloads,.kf-technical-details"))continue;
   const old=node.textContent.trim();if(!old)continue;
   const translation=translated(old);
   if(translation!==old)replaceNodes.push([node,old,translation]);
 }
 for(const [node,old,translation] of replaceNodes)node.textContent=node.textContent.replace(old,translation);
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
   else if(status.dataset.kind==="error"&&!v.startsWith(pack.labels.error))next=lang==="de"?("Fehler: "+v):pack.labels.error+" "+v;
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
