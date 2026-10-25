import {readFileSync,writeFileSync,readdirSync} from "node:fs";
import {join,dirname,relative} from "node:path";
import {fileURLToPath} from "node:url";
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const paths=[];
const scan=(folder)=>{for(const e of readdirSync(folder,{withFileTypes:true})){const p=join(folder,e.name);if(e.isDirectory())scan(p);else if(e.name==="index.html")paths.push(p);}};
scan(join(root,"tools"));paths.sort();
if(paths.length!==53)throw Error("53 canonical English tool pages required; found "+paths.length);
const entities=s=>s.replace(/&(?:amp|lt|gt|quot|nbsp|#39|#x27);/gi,m=>({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&nbsp;":" ","&#39;":"'","&#x27;":"'"}[m.toLowerCase()]||m));
const dict=new Map();
for(const path of paths){
 const source=readFileSync(path,"utf8");const main=source.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];if(!main)throw Error("Missing main: "+path);
 for(const match of main.matchAll(/>([^<>]+)</g)){
  const value=entities(match[1]).replace(/\s+/g," ").trim();
  if(value.length<3||!/[\p{L}]/u.test(value)||/^[0-9\s\W]+$/u.test(value))continue;
  const prev=dict.get(value)||[];prev.push(relative(root,path));dict.set(value,prev);
 }
}
const output=[...dict].sort((a,b)=>a[0].localeCompare(b[0])).map(([text,pages])=>({text,pages:[...new Set(pages)]}));
writeFileSync(join(root,"docs","TOOLS_ENGLISH_COPY_AUDIT.json"),JSON.stringify({created:"2026-10-25",canonicalPages:paths.length,uniqueStrings:output.length,strings:output},null,2)+"\n");
console.log("AUDIT:",output.length,"unique visible text entries in",paths.length,"canonical tool pages");
