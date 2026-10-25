import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {join,dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {toolIds,categoryIds,englishNames,englishCategories,localePacks} from "../tools/assets/i18n-data.mjs";
import {textTranslations} from "../tools/assets/i18n-text.mjs";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const paths=["tools/index.html",...categoryIds.map(x=>"tools/"+(x==="photo"?"photo-file":x)+"/index.html"),...toolIds.map((slug,i)=>i<12?"tools/"+slug+"/index.html":"tools/"+categoryIds[Math.floor(i/12)]+"/"+slug+"/index.html")];
if(paths.length!==53)throw Error("Expected 53 English pages");
const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");
const langs=["fr"];
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
 if(safety.length!==48)throw Error("Expected 48 French safety translations");
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
  html=html.replace(/href="\/tools\//g,'href="/fr/tools/');
  html=html.replace(/href="\/en\/"/g,'href="/fr/"');
  html=html.replace(/href="\/en\/Media_Kolfat\/"/g,'href="/fr/Media_Kolfat/"');
  html=html.replace(/href="\/(download|about|guides|support)\/"/g,(_,part)=>'href="/fr/'+part+'/"');
  // Undo any accidental changes to shared assets: these always live in /tools/assets.
  html=html.replace(/((?:href|src)=")\/fa\/tools\/assets\//g,'$1/tools/assets/');
  html=html.replace(/<script type="module" src="\/tools\/assets\/i18n\.mjs\?v=20261025-1"/,
    '<script type="module" src="/tools/assets/i18n.mjs?v=20261025-fr1"');
  // Language-specific descriptions preserve the actual function of each utility.
  const descriptions=["Supprimer les métadonnées EXIF et GPS des photos","Compresser et redimensionner des images","Convertir des images entre plusieurs formats","Analyser les dates associées aux photos","Détecter des fichiers parfaitement identiques","Renommer des copies de fichiers par lots","Ajouter un filigrane à une image","Faire pivoter et recadrer une photo","Créer un PDF à partir d’images","Vérifier l’intégrité d’un fichier par SHA-256","Créer un code QR à partir d’un texte ou d’une URL","Extraire les couleurs principales d’une photo","Mettre en forme et vérifier du JSON","Convertir entre YAML et JSON","Convertir entre CSV et JSON","Mettre en forme et vérifier du XML","Encoder et décoder du Base64","Encoder et décoder un composant d’URL","Tester des expressions régulières","Générer des UUID de version 4","Convertir des entités HTML","Mettre en forme du SQL","Prévisualiser du Markdown","Vérifier un schéma JSON élémentaire","Calculer des sous-réseaux IPv4 et des CIDR","Calculer des préfixes IPv6","Planifier des sous-réseaux VLSM","Convertir des plages IP et des blocs CIDR","Préparer un plan VLAN et IP","Consulter une référence des ports réseau","Créer une expression cron","Créer un exemple de minuterie systemd","Convertir des horodatages Unix","Convertir des fuseaux horaires","Calculer des permissions Linux chmod","Effectuer un contrôle élémentaire de Docker Compose YAML","Générer des mots de passe aléatoires sécurisés","Générer des phrases secrètes","Évaluer la robustesse d’un mot de passe","Décoder et examiner un JWT sans vérifier sa signature","Calculer une empreinte de texte","Repérer des secrets potentiels dans du texte","Masquer les données sensibles dans du texte","Comparer du texte et du code ligne à ligne","Examiner des caractères Unicode similaires","Convertir des domaines IDN et Punycode","Examiner la structure d’une URL hors ligne","Examiner le texte, l’hexadécimal et l’UTF-8"];
  if(i>=0){
    html=html.replace(/(<section class="hero-tools[^"]*"[^>]*>[\s\S]*?<p class="lead">)[\s\S]*?(<\/p>)/i,(_,a,b)=>a+esc(descriptions[i])+b);
  }
  if(path==="tools/index.html"){
    const words={"Tools for every task.":"Des outils pour chaque tâche.","Choose a category. Find the right tool. Keep your files and data on your device.":"Choisissez une catégorie et le bon outil. Vos fichiers et données restent sur votre appareil.","48 online tools in 4 collections":"48 outils en ligne répartis en quatre catégories","Resize, convert, clean, organize and analyze your files.":"Redimensionnez, convertissez, nettoyez, organisez et analysez vos fichiers.","Format, encode, convert and validate data locally.":"Formatez, encodez, convertissez et validez vos données localement.","Plan networks, convert time, and build automation examples.":"Planifiez des réseaux, convertissez des heures et préparez des automatisations.","Generate passwords and inspect text, tokens, and URLs privately.":"Générez des mots de passe et examinez des textes, jetons et URL en privé.","Your privacy comes first.":"Votre vie privée avant tout.","All 48 KOLFAT TOOLS run in your browser. Your files and input are not uploaded to KOLFAT. No account or subscription required.":"Les 48 outils KOLFAT fonctionnent dans votre navigateur. Aucun fichier ou contenu saisi n’est envoyé à KOLFAT. Aucun compte ni abonnement n’est nécessaire.","Meet MEDIA KOLFAT for Windows":"Découvrez MEDIA KOLFAT pour Windows","For bigger photo and video collections, use our free desktop organizer with guided copy workflows.":"Pour les grandes collections de photos et vidéos, utilisez notre logiciel gratuit avec une procédure guidée de copie.","Explore MEDIA KOLFAT":"Découvrir MEDIA KOLFAT","Explore category":"Explorer la catégorie","PHOTOS • FILES":"PHOTOS • FICHIERS","DEVELOPMENT • DATA":"DÉVELOPPEMENT • DONNÉES","NETWORKS • SYSTEMS":"RÉSEAUX • SYSTÈMES","SECURITY • PRIVACY":"SÉCURITÉ • CONFIDENTIALITÉ"};
    for(const [en,fr]of Object.entries(words))html=html.replaceAll(en,fr);
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
console.log("PASS: 53 French HTML pages generated");
