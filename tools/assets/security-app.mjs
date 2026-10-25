/* KOLFAT Security & Text Analysis: browser-only, no telemetry or persistence. */
import {passwordGenerate,passphraseGenerate,passphraseEntropy,passwordEstimate,jwtInspect,textHash,leakScan,redactText} from "./security-core.mjs";
import {diffText,unicodeInspect,idnConvert,urlInspect,utf8Inspect} from "./security-text.mjs";
const $=id=>document.getElementById(id),tool=document.body.dataset.securityTool;
const input=$("source"),secondary=$("secondary"),out=$("output"),status=$("status"),run=$("run");
let objectUrl;
function val(id){return $(id)?.value||"";}
function num(id,fallback){const n=Number(val(id));return Number.isInteger(n)?n:fallback;}
function flag(id){return $(id)?.checked===true;}
function say(s,error=false){status.textContent=s;status.dataset.kind=error?"error":"ok";}
function clearLink(){if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=null;$("downloads").replaceChildren();}
function render(value,name="kolfat-security-result.txt",sensitive=false){
 const text=typeof value==="string"?value:JSON.stringify(value,null,2);
 out.value=text;clearLink();
 if(sensitive)return;
 const a=document.createElement("a");a.className="download";a.textContent="Download result";
 a.download=name;a.href=URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"}));
 objectUrl=a.href;$("downloads").append(a);
}
async function calculate(){
 const s=input?.value||"";
 if(s.length>200000||val("secondary").length>200000)throw Error("Input exceeds 200,000 characters.");
 switch(tool){
  case "password":return [passwordGenerate(num("length",20),{upper:flag("upper"),lower:flag("lower"),digits:flag("digits"),symbols:flag("symbols"),unambiguous:flag("unambiguous")}),"",true];
  case "passphrase":{const n=num("count",6);return [passphraseGenerate(n,val("separator"))+"\n\nEstimated random-selection entropy: "+passphraseEntropy(n).toFixed(1)+" bits.\nGenerated from an offline word-combination list.","",true];}
  case "strength":return [passwordEstimate(s),"",true];
  case "jwt":return [jwtInspect(s),"",true];
  case "hash":return [val("algorithm")+": "+await textHash(s,val("algorithm")),"kolfat-hash.txt",false];
  case "secrets":return [leakScan(s),"",true];
  case "redact":return [redactText(s,{emails:flag("emails"),ipv4:flag("ipv4"),phones:flag("phones")}),"",true];
  case "diff":return [diffText(s,val("secondary")),"kolfat-text-diff.txt",false];
  case "unicode":return [unicodeInspect(s),"kolfat-unicode-inspection.json",false];
  case "punycode":return [idnConvert(s,val("mode")),"kolfat-idn.txt",false];
  case "url":return [urlInspect(s),"kolfat-url-inspection.json",false];
  case "hex":return [utf8Inspect(s,val("mode")),"kolfat-text-hex.json",false];
  default:throw Error("No handler for this tool.");
 }
}
run.addEventListener("click",async()=>{
 run.disabled=true;out.value="";clearLink();say("Processing locally…");
 try{const [value,filename,sensitive]=await calculate();render(value,filename||"kolfat-result.txt",sensitive);say("Complete. Your data stayed in this browser.");}
 catch(e){say(e?.message||"Could not process input.",true);}
 finally{run.disabled=false;}
});
$("copy").addEventListener("click",async()=>{if(!out.value){say("Generate a result first.",true);return;}try{await navigator.clipboard.writeText(out.value);say("Copied to clipboard. Clear clipboard history if the result is sensitive.");}catch{say("Clipboard unavailable. Copy the result manually.",true);}});
$("clear").addEventListener("click",()=>{if(input)input.value="";if(secondary)secondary.value="";out.value="";clearLink();say("Cleared. The browser may still retain clipboard contents separately.");});
document.addEventListener("pagehide",clearLink,{once:true});
