import {ipv4Report,ipv6Report,vlsmReport,rangeReport,vlanReport} from "./networking-address.mjs";
import {portReport,cronReport,systemdTimer,timestampReport,timezoneReport,chmodReport,composeCheck} from "./networking-automation.mjs";
import {yamlParse} from "./code-data-advanced.mjs";
const $=id=>document.getElementById(id),tool=document.body.dataset.networkTool;
const input=$("source"),result=$("output"),status=$("status"),run=$("run");let url=null;
function value(id){return $(id)?.value||"";}
function message(s,failed=false){status.textContent=s;status.dataset.kind=failed?"error":"ok";}
function reset(){if(url){URL.revokeObjectURL(url);url=null;}$("downloads").replaceChildren();}
function produce(s){
 result.value=s;const a=document.createElement("a");a.className="download";a.textContent="Download result";url=URL.createObjectURL(new Blob([s],{type:"text/plain;charset=utf-8"}));a.href=url;a.download="kolfat-network-result.txt";$("downloads").append(a);
}
run.addEventListener("click",()=>{
 run.disabled=true;reset();result.value="";message("Calculating locally…");
 try{
  const s=tool==="ports"?"":input.value;
  if(s.length>50000||value("secondary").length>50000)throw Error("Input exceeds 50,000 characters.");
  const fn={
   ipv4:()=>ipv4Report(s),ipv6:()=>ipv6Report(s),vlsm:()=>vlsmReport(s,value("secondary")),
   range:()=>rangeReport(s,value("mode")),vlan:()=>vlanReport(s),ports:()=>portReport(value("query")),
   cron:()=>cronReport(s),systemd:()=>systemdTimer(value("mode"),value("description")),
   timestamp:()=>timestampReport(s),timezone:()=>timezoneReport(s,Array.from(document.querySelectorAll('input[name="zone"]:checked'),el=>el.value)),
   chmod:()=>chmodReport(s),compose:()=>composeCheck(s,yamlParse)
  }[tool];
  if(!fn)throw Error("Unknown utility.");
  produce(fn());message("Complete. Nothing was uploaded.");
 }catch(err){message(err.message||"Invalid input.",true);}
 finally{run.disabled=false;}
});
$("copy").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(result.value);message("Result copied.");}catch{message("Clipboard unavailable. Copy text manually.",true);}});
$("clear").addEventListener("click",()=>{if(input)input.value="";const alt=$("secondary");if(alt)alt.value="";result.value="";reset();message("Cleared.");});
$("loadfile")?.addEventListener("change",async e=>{
 const file=e.target.files?.[0];if(!file)return;
 if(file.size>50000){message("Text input file must be below 50 KB.",true);return;}
 try{input.value=await file.text();message("File loaded locally.");}catch{message("Could not read file.",true);}
});
