import {test} from "@playwright/test";
import {readFileSync} from "node:fs";
const catalog=JSON.parse(readFileSync(new URL("../../docs/TOOLS_ENGLISH_COPY_AUDIT.json",import.meta.url),"utf8")).strings.map(x=>x.text);
const all=new Set(catalog.filter(x=>x.length>10&&/[a-z]{3}/i.test(x)));
const photo=["exif-cleaner","image-compressor","image-converter","photo-date-detective","duplicate-checker","batch-file-renamer","image-watermark","photo-rotator","image-to-pdf","sha256-verifier","qr-code-generator","photo-color-palette"];
const groups={ "code-data":["json-formatter","yaml-json-converter","csv-json-converter","xml-formatter","base64-encoder","url-encoder","regex-tester","uuid-generator","html-entity-converter","sql-formatter","markdown-preview","json-schema-validator"],networking:["ipv4-subnet-calculator","ipv6-prefix-calculator","vlsm-subnet-planner","ip-range-cidr-converter","vlan-ip-planner","network-port-reference","cron-expression-builder","systemd-timer-builder","unix-timestamp-converter","time-zone-converter","linux-chmod-calculator","docker-compose-checker"],security:["password-generator","passphrase-generator","password-strength","jwt-inspector","text-hash-generator","secret-leak-scanner","sensitive-text-redactor","text-code-diff","unicode-inspector","punycode-converter","url-safety-inspector","text-hex-utf8"]};
const paths=["/tools/","/tools/photo-file/",...Object.keys(groups).map(c=>"/tools/"+c+"/"),...photo.map(x=>"/tools/"+x+"/"),...Object.entries(groups).flatMap(([c,names])=>names.map(x=>"/tools/"+c+"/"+x+"/"))];
test("report visible English source-copy leftovers in German tool pages",async({page})=>{
 test.setTimeout(180000);
 const hits=new Map();
 for(const p of paths){
  await page.goto("http://127.0.0.1:8765/de"+p,{waitUntil:"domcontentloaded"});
  await page.locator(".kf-tools-language").waitFor();
  const visible=await page.locator("main").evaluate(main=>{
   const walker=document.createTreeWalker(main,NodeFilter.SHOW_TEXT);
   const found=[];
   while(walker.nextNode()){
    const node=walker.currentNode,el=node.parentElement;
    if(!el||el.closest("pre,code,textarea,script,style,svg,.kf-technical-details,.kf-i18n-safety"))continue;
    let cur=el,hidden=false;
    while(cur&&cur!==main){if(getComputedStyle(cur).display==="none"||getComputedStyle(cur).visibility==="hidden"){hidden=true;break;}cur=cur.parentElement;}
    if(!hidden){const v=node.textContent.replace(/\\s+/g," ").trim();if(v.length>10)found.push(v);}
   }
   return found;
  });
  for(const v of visible)if(all.has(v)){const list=hits.get(v)||[];list.push(p);hits.set(v,list);}
 }
 const ranked=[...hits].sort((a,b)=>b[1].length-a[1].length).map(([value,pages])=>({value,count:pages.length}));
 console.log("LOCALIZATION_COPY_AUDIT",JSON.stringify({pages:paths.length,untranslatedExactStrings:ranked.length,top:ranked.slice(0,160)}));
});
