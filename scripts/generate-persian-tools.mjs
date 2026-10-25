import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {join,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {toolIds,categoryIds,englishNames,englishCategories,localePacks} from "../tools/assets/i18n-data.mjs";
import {textTranslations} from "../tools/assets/i18n-text.mjs";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const paths=["tools/index.html",...categoryIds.map(x=>"tools/"+(x==="photo"?"photo-file":x)+"/index.html"),...toolIds.map((slug,i)=>i<12?"tools/"+slug+"/index.html":"tools/"+categoryIds[Math.floor(i/12)]+"/"+slug+"/index.html")];
if(paths.length!==53)throw Error("Expected 53 English pages");
const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");
const langs=["fa"];
const decode=s=>s.replaceAll("&amp;","&").replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&quot;",'"').replaceAll("&#39;","'");
const staticTranslate=(html,lang,pack)=>{
 const map=new Map();
 const common=textTranslations[lang]||{};
 for(const [english,translation] of Object.entries(common))map.set(english,translation);
 for(let i=0;i<englishNames.length;i++)map.set(englishNames[i],pack.names[i]);
 for(let i=0;i<englishCategories.length;i++)map.set(englishCategories[i],pack.labels[categoryIds[i]]);
 // Translate individual text nodes only, never attributes, scripts, JS code or user data.
 return html.replace(/(<main\b[^>]*>)([\s\S]*?)(<\/main>)/i,(whole,open,main,close)=>{
  const translated=main.replace(/>([^<>]+)</g,(full,original)=>{
   const plain=decode(original.trim());
   const value=map.get(plain);
   if(!value)return full;
   const lead=original.match(/^\s*/)?.[0]||"",tail=original.match(/\s*$/)?.[0]||"";
   return ">"+lead+esc(value)+tail+"<";
  });
  return open+translated+close;
 });
};

let generated=0;
for(const lang of langs){
 const pack=localePacks[lang];
 const safety=(await import("../tools/assets/i18n-safety-"+lang+".mjs")).safetySummaries;
 if(safety.length!==48)throw Error("Expected 48 Persian safety translations");
 if(pack.names.length!==48)throw Error("Missing localized names "+lang);
 for(const path of paths){
  const slug=path.split("/").at(-2),i=toolIds.indexOf(slug),ci=categoryIds.indexOf(slug==="photo-file"?"photo":slug);
  const title=i>=0?pack.names[i]:ci>=0?pack.labels[categoryIds[ci]]:pack.labels.all;
  const url="/"+lang+"/"+path.replace(/index.html$/,"");
  let html=readFileSync(join(root,path),"utf8");
  html=html.replace(/<html lang="en"([^>]*)>/,(_,a)=>'<html lang="'+lang+'" dir="'+(["ar","fa"].includes(lang)?"rtl":"ltr")+'" data-localized-tools="true"'+a.replace(/\\sdir="[^"]*"/g,"")+'>');
  if(!html.includes('data-localized-tools="true"'))throw Error("Missing lang "+path);
  html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+esc(title)+' | KOLFAT TOOLS</title>');
  const desc=esc(title+" · "+pack.labels.local+". KOLFAT.");
  html=html.replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+desc+'">');
  html=html.replace(/<link rel="canonical" href="[^"]*">/,'<link rel="canonical" href="https://kolfat.app'+url+'">');
  html=html.replace(/<meta property="og:title" content="[^"]*">/,'<meta property="og:title" content="'+esc(title)+' | KOLFAT TOOLS">');
  html=html.replace(/<meta property="og:description" content="[^"]*">/,'<meta property="og:description" content="'+desc+'">');
  html=html.replace(/<meta property="og:url" content="[^"]*">/,'<meta property="og:url" content="https://kolfat.app'+url+'">');
  html=html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g,"");
  let alternate='<link rel="alternate" hreflang="en" href="https://kolfat.app/'+path.replace(/index.html$/,"")+'">';
  for(const locale of langs)alternate+='<link rel="alternate" hreflang="'+locale+'" href="https://kolfat.app/'+locale+'/'+path.replace(/index.html$/,"")+'">';
  alternate+='<link rel="alternate" hreflang="x-default" href="https://kolfat.app/'+path.replace(/index.html$/,"")+'">';
  html=html.replace("</head>",'<link rel="stylesheet" href="/tools/assets/i18n.css?v=20261025-1">'+alternate+"</head>");
  html=html.replace("</body>",'<script type="module" src="/tools/assets/i18n.mjs?v=20261025-1"></script></body>');
  html=staticTranslate(html,lang,pack);
  // The privacy notice is only on the tools hub; no banner on utilities.
  // Keep canonical English scripts/styles, but localize navigation and page routes.
  html=html.replace(/href="\/tools\//g,'href="/fa/tools/');
  html=html.replace(/href="\/en\/"/g,'href="/fa/"');
  html=html.replace(/href="\/en\/Media_Kolfat\/"/g,'href="/fa/Media_Kolfat/"');
  html=html.replace(/href="\/(download|about|guides|support)\/"/g,(_,part)=>'href="/fa/'+part+'/"');
  // Undo any accidental changes to shared assets: these always live in /tools/assets.
  html=html.replace(/((?:href|src)=")\/fa\/tools\/assets\//g,'$1/tools/assets/');
  html=html.replace(/<script type="module" src="\/tools\/assets\/i18n\.mjs\?v=20261025-1"/,
    '<script type="module" src="/tools/assets/i18n.mjs?v=20261025-fa1"');
  // Language-specific descriptions preserve the actual function of each utility.
  const descriptions=["پاک‌سازی اطلاعات موقعیت و EXIF از تصویرها","فشرده‌سازی و تغییر اندازهٔ تصویرها","تبدیل تصاویر به فرمت‌های مختلف","بررسی تاریخ ثبت یا ویرایش عکس","یافتن فایل‌های کاملاً یکسان","تغییر نام دسته‌جمعی نسخه‌های فایل‌ها","ساخت واترمارک روی تصویر","چرخاندن و برش تصاویر","تبدیل چند تصویر به PDF","بررسی یکپارچگی فایل با SHA-256","ساخت کد QR از متن یا نشانی","استخراج رنگ‌های اصلی تصویر","قالب‌بندی و اعتبارسنجی JSON","تبدیل YAML و JSON","تبدیل CSV و JSON","قالب‌بندی و بررسی XML","کدگذاری و کدگشایی Base64","کدگذاری و کدگشایی اجزای URL","آزمودن عبارت‌های باقاعده","ساخت UUID نسخهٔ ۴","تبدیل موجودیت‌های HTML","قالب‌بندی خوانای SQL","پیش‌نمایش زندهٔ Markdown","بررسی قوانین پایهٔ JSON Schema","محاسبهٔ IPv4 و CIDR","محاسبهٔ پیشوند و محدودهٔ IPv6","برنامه‌ریزی زیرشبکه‌های VLSM","تبدیل بازهٔ IP و CIDR","طرح‌ریزی VLAN و نشانی‌های IP","راهنمای آفلاین پورت‌های شبکه","ساخت و بررسی عبارت cron","ساخت نمونهٔ تایمر systemd","تبدیل زمان Unix","تبدیل منطقه‌های زمانی","محاسبهٔ مجوزهای chmod","بررسی اولیهٔ YAML برای Docker Compose","ساخت گذرواژهٔ تصادفی امن","ساخت عبارت عبور تصادفی","برآورد قدرت گذرواژه","مشاهدهٔ بخش‌های JWT بدون تأیید امضا","محاسبهٔ هش متن","جست‌وجوی الگوهای اطلاعات محرمانه","پوشاندن داده‌های حساس در متن","مقایسهٔ متن و کد سطر به سطر","بررسی برخی نویسه‌های مشابه Unicode","تبدیل نام دامنه با Punycode و IDN","بررسی ساختار URL بدون مراجعه به مقصد","نمایش متن، Hex و UTF-8"];
  if(i>=0){
    html=html.replace(/(<section class="hero-tools[^"]*"[^>]*>[\\s\\S]*?<p class="lead">)[\\s\\S]*?(<\\/p>)/i,(_,a,b)=>a+esc(descriptions[i])+b);
  }
  if(path==="tools/index.html"){
    const words={"Tools for every task.":"ابزارهایی برای هر کار","Choose a category. Find the right tool. Keep your files and data on your device.":"دسته‌بندی مناسب را انتخاب کنید. فایل‌ها و داده‌های شما روی دستگاه خودتان می‌مانند.","48 online tools in 4 collections":"۴۸ ابزار آنلاین در چهار دسته‌بندی","Resize, convert, clean, organize and analyze your files.":"تغییر اندازه، تبدیل، پاک‌سازی و بررسی فایل‌ها","Format, encode, convert and validate data locally.":"قالب‌بندی، کدگذاری، تبدیل و اعتبارسنجی داده‌ها در مرورگر","Plan networks, convert time, and build automation examples.":"برنامه‌ریزی شبکه، تبدیل زمان و ساخت نمونه‌های خودکارسازی","Generate passwords and inspect text, tokens, and URLs privately.":"ساخت گذرواژه و بررسی خصوصی متن، توکن و نشانی وب","Your privacy comes first.":"حریم خصوصی شما در اولویت است.","All 48 KOLFAT TOOLS run in your browser. Your files and input are not uploaded to KOLFAT. No account or subscription required.":"هر ۴۸ ابزار KOLFAT در مرورگر شما اجرا می‌شوند. هیچ فایل یا ورودی به KOLFAT آپلود نمی‌شود و حساب یا اشتراک لازم نیست.","Meet MEDIA KOLFAT for Windows":"با MEDIA KOLFAT برای ویندوز آشنا شوید","For bigger photo and video collections, use our free desktop organizer with guided copy workflows.":"برای مجموعه‌های بزرگ عکس و ویدئو، از برنامهٔ رایگان ویندوز ما با روند کپی راهنمایی‌شده استفاده کنید.","Explore MEDIA KOLFAT":"آشنایی با MEDIA KOLFAT","Explore category":"مشاهدهٔ دسته‌بندی","PHOTOS • FILES":"عکس‌ها • فایل‌ها","DEVELOPMENT • DATA":"برنامه‌نویسی • داده","NETWORKS • SYSTEMS":"شبکه • سامانه","SECURITY • PRIVACY":"امنیت • حریم خصوصی"};
    for(const [en,fa]of Object.entries(words))html=html.replaceAll(en,fa);
  }
  // General privacy notice belongs to the hub, never individual pages.


  const dest=join(root,lang,path);mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,html);
  generated++;
 }
}
const sitemap=join(root,"sitemap.xml");let xml=readFileSync(sitemap,"utf8");
xml=xml.replace(/\s*<url><loc>https:\/\/kolfat\.app\/fa\/tools\/[^<]*<\/loc>(?:<lastmod>[^<]*<\/lastmod>)?<\/url>/g,"");
const entries=langs.flatMap(lang=>paths.map(path=>'  <url><loc>https://kolfat.app/'+lang+'/'+path.replace(/index.html$/,"")+'</loc><lastmod>2026-10-25</lastmod></url>'));
xml=xml.replace("</urlset>",entries.join("\n")+"\n</urlset>");writeFileSync(sitemap,xml);
if(generated!==53)throw Error("Generated "+generated+" not 53");
console.log("PASS: 53 Persian HTML pages generated");
