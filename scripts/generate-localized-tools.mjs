import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {join,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {toolIds,categoryIds,localePacks} from "../tools/assets/i18n-data.mjs";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const paths=["tools/index.html",...categoryIds.map(x=>"tools/"+x+"/index.html"),...toolIds.map((slug,i)=>i<12?"tools/"+slug+"/index.html":"tools/"+categoryIds[Math.floor(i/12)]+"/"+slug+"/index.html")];
if(paths.length!==53)throw Error("Expected 53 English pages");
const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");
const langs=Object.keys(localePacks);
let generated=0;
for(const lang of langs){
 const pack=localePacks[lang];
 if(pack.names.length!==48)throw Error("Missing localized names "+lang);
 for(const path of paths){
  const slug=path.split("/").at(-2),i=toolIds.indexOf(slug),ci=categoryIds.indexOf(slug);
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
  const dest=join(root,lang,path);mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,html);
  generated++;
 }
}
const sitemap=join(root,"sitemap.xml");let xml=readFileSync(sitemap,"utf8");
xml=xml.replace(/\s*<url><loc>https:\/\/kolfat\.app\/(?:de|fr|es|pt|it|ru|zh|ja|hi|fa|ar)\/tools\/[\s\S]*?<\/url>/g,"");
const entries=langs.flatMap(lang=>paths.map(path=>'  <url><loc>https://kolfat.app/'+lang+'/'+path.replace(/index.html$/,"")+'</loc><lastmod>2026-10-25</lastmod></url>'));
xml=xml.replace("</urlset>",entries.join("\n")+"\n</urlset>");writeFileSync(sitemap,xml);
if(generated!==583)throw Error("Generated "+generated+" not 583");
console.log("PASS: 583 localized HTML pages generated");
