import {jsonFormat,csvToJson,jsonToCsv,base64Encode,base64Decode,urlCodec,htmlCodec,uuids,xmlCheck,sqlFormat,markdownHtml} from "./code-data-core.mjs";
import {yamlParse,yamlWrite,schemaCheck} from "./code-data-advanced.mjs";
const $=id=>document.getElementById(id);
const id=document.body.dataset.codeTool;
const src=$("source"),other=$("secondary"),out=$("output"),preview=$("preview"),status=$("status"),go=$("run");
let objectUrls=[];
function say(text,failed=false){status.textContent=text;status.dataset.kind=failed?"error":"ok";}
function clearDownloads(){for(const url of objectUrls)URL.revokeObjectURL(url);objectUrls=[];$("downloads").replaceChildren();}
function result(text,filename="kolfat-result.txt"){
 out.value=text;clearDownloads();
 const blob=new Blob([text],{type:"text/plain;charset=utf-8"});
 const a=document.createElement("a");a.className="download";a.textContent="Download result";a.href=URL.createObjectURL(blob);a.download=filename;
 objectUrls.push(a.href);$("downloads").append(a);
}
function checkLen(text){if(text.length>500000)throw Error("Input exceeds 500,000 characters. Select a smaller sample.");}
function getMode(){return $("mode")?.value||"";}
async function regexTest(){
 const pattern=src.value,flags=$("flags").value,subject=other.value;
 checkLen(subject);
 if(!pattern)throw Error("Enter a regular expression.");
 if(typeof Worker!=="function")throw Error("This browser cannot safely run regular expressions in isolation.");
 const answer=await new Promise((resolve,reject)=>{
  const w=new Worker("/tools/assets/code-regex-worker.mjs?v=1",{type:"module"});
  const timer=setTimeout(()=>{w.terminate();reject(Error("Regex timed out after 400 ms. Simplify the pattern."));},400);
  w.onmessage=e=>{clearTimeout(timer);w.terminate();resolve(e.data);};
  w.onerror=()=>{clearTimeout(timer);w.terminate();reject(Error("Could not start regex worker."));};
  w.postMessage({pattern,flags,text:subject});
 });
 if(answer.error)throw Error(answer.error);
 return JSON.stringify(answer,null,2);
}
async function execute(){
 const s=src?.value||"",v=other?.value||"",mode=getMode();
 if(id!=="uuid")checkLen(s);
 if(id!=="regex")checkLen(v);
 switch(id){
  case "json":return [jsonFormat(s,mode==="minify"),"kolfat-formatted.json"];
  case "yaml":return mode==="from-json"?[yamlWrite(JSON.parse(s)),"kolfat-converted.yaml"]:[JSON.stringify(yamlParse(s),null,2),"kolfat-converted.json"];
  case "csv":return mode==="from-json"?[jsonToCsv(s,$("separator").value),"kolfat-converted.csv"]:[JSON.stringify(csvToJson(s,$("separator").value),null,2),"kolfat-converted.json"];
  case "xml":return [xmlCheck(s,mode),"kolfat-xml-result.xml"];
  case "base64":return [mode==="decode"?base64Decode(s):base64Encode(s),"kolfat-base64.txt"];
  case "url":return [urlCodec(s,mode),"kolfat-url.txt"];
  case "regex":return [await regexTest(),"kolfat-regex-matches.json"];
  case "uuid":return [uuids(Math.min(100,Math.max(1,Number($("count").value)||1))),"kolfat-uuids.txt"];
  case "html":return [htmlCodec(s,mode),"kolfat-entities.txt"];
  case "sql":return [sqlFormat(s),"kolfat-formatted.sql"];
  case "markdown":return [markdownHtml(s),"kolfat-preview.html"];
  case "schema":{
   const issues=schemaCheck(JSON.parse(s),JSON.parse(v));
   return [issues.length?"INVALID\n"+issues.join("\n"):"VALID: Data satisfies the supported JSON Schema keywords.","kolfat-schema-validation.txt"];
  }
  default:throw Error("Unknown tool");
 }
}
go.addEventListener("click",async()=>{
 go.disabled=true;say("Processing locally…");clearDownloads();out.value="";if(preview)preview.srcdoc="";
 try{
  const [data,name]=await execute();result(data,name);
  if(id==="markdown"&&preview)preview.srcdoc='<meta charset="utf-8"><style>body{font:16px/1.55 system-ui;background:#101010;color:#eee;padding:16px}a{color:#ffa766}code{background:#222}</style>'+data;
  say("Complete. Nothing was uploaded.");
 }catch(error){say(error.message||"Processing failed.",true);}
 finally{go.disabled=false;}
});
$("copy").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(out.value);say("Result copied.");}catch{say("Clipboard unavailable. Select and copy the result manually.",true);}});
$("clear").addEventListener("click",()=>{if(src)src.value="";if(other)other.value="";out.value="";clearDownloads();if(preview)preview.srcdoc="";say("Cleared.");});
const file=$("loadfile");if(file)file.addEventListener("change",async()=>{
 const f=file.files?.[0];if(!f)return;
 if(f.size>500000){say("Maximum local text file size is 500 KB.",true);return;}
 try{src.value=await f.text();say("Loaded locally: "+f.name);}catch{say("Could not open file.",true);}
});
