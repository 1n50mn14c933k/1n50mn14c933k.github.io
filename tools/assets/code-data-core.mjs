/* KOLFAT Code & Data utilities: local-only text transformations. */
export function jsonFormat(s,minify=false){return JSON.stringify(JSON.parse(s),null,minify?0:2);}
export function csvParse(input,separator=","){
 if(![",",";","\t","|"].includes(separator))throw Error("Invalid separator");
 input=input.replace(/^\ufeff/,"");
 const rows=[];let row=[],cell="",quoted=false,ended=false;
 for(let i=0;i<input.length;i++){
  const c=input[i];
  if(quoted){if(c==='"'&&input[i+1]==='"'){cell+='"';i++;}else if(c==='"')quoted=false;else cell+=c;continue;}
  if(c==='"'){if(cell||ended)throw Error("Invalid CSV quote at position "+i);quoted=true;ended=true;continue;}
  if(c===separator){row.push(cell);cell="";ended=false;continue;}
  if(c==="\n"||c==="\r"){if(c==="\r"&&input[i+1]==="\n")i++;row.push(cell);rows.push(row);row=[];cell="";ended=false;continue;}
  if(ended){if(c===" "||c==="\t")continue;throw Error("Unexpected character after CSV quote");}
  cell+=c;
 }
 if(quoted)throw Error("Unterminated CSV quote");
 if(row.length||cell||ended)rows.push([...row,cell]);
 return rows;
}
export function csvWrite(rows,sep=","){
 const esc=v=>{let s=String(v??"");if(/^[\x00-\x20]*[=+@-]/.test(s))s="'"+s;return s.includes(sep)||/["\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
 return "\ufeff"+rows.map(row=>row.map(esc).join(sep)).join("\r\n")+"\r\n";
}
export function csvToJson(input,sep=","){
 const rows=csvParse(input,sep);if(!rows.length)throw Error("CSV header is missing");
 const headers=rows.shift();if(headers.some(h=>!h.trim())||new Set(headers).size!==headers.length)throw Error("CSV headers must be unique and nonempty");
 return rows.filter(r=>r.length>1||r[0]!=="").map((row,i)=>{
  if(row.length>headers.length)throw Error("Row "+(i+2)+" contains too many columns");
  return Object.fromEntries(headers.map((h,j)=>[h,row[j]??""]));
 });
}
export function jsonToCsv(input,sep=","){
 const arr=JSON.parse(input);if(!Array.isArray(arr)||!arr.length||arr.some(o=>!o||Array.isArray(o)||typeof o!=="object"))throw Error("JSON must be a nonempty array of objects");
 const keys=[...new Set(arr.flatMap(Object.keys))];if(!keys.length)throw Error("Objects have no keys");
 return csvWrite([keys,...arr.map(row=>keys.map(k=>{const v=row[k];return v===undefined||v===null?"":typeof v==="object"?JSON.stringify(v):String(v);}))],sep);
}
export function base64Encode(text){
 const a=new TextEncoder().encode(text);let bin="";
 for(let i=0;i<a.length;i+=8192)bin+=String.fromCharCode(...a.subarray(i,i+8192));
 return btoa(bin);
}
export function base64Decode(text){
 const c=text.replace(/\s/g,"");if(!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(c))throw Error("Invalid Base64");
 const bin=atob(c),a=Uint8Array.from(bin,ch=>ch.charCodeAt(0));
 return new TextDecoder("utf-8",{fatal:true}).decode(a);
}
export function urlCodec(text,mode){return mode==="encode"?encodeURIComponent(text):decodeURIComponent(text);}
export function escapeHtml(text){return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
export function htmlCodec(text,mode){
 if(mode==="encode")return escapeHtml(text);
 if(typeof document==="undefined")throw Error("HTML decoding requires a browser");
 const x=document.createElement("textarea");x.innerHTML=text;return x.value;
}
export function uuids(n){
 if(!globalThis.crypto?.getRandomValues)throw Error("Secure random UUIDs require HTTPS");
 if(!Number.isInteger(n)||n<1||n>100)throw Error("Generate 1–100 UUIDs");
 const make=()=>{
  if(typeof crypto.randomUUID==="function")return crypto.randomUUID();
  const a=new Uint8Array(16);crypto.getRandomValues(a);a[6]=(a[6]&15)|64;a[8]=(a[8]&63)|128;
  const h=Array.from(a,b=>b.toString(16).padStart(2,"0")).join("");
  return h.slice(0,8)+"-"+h.slice(8,12)+"-"+h.slice(12,16)+"-"+h.slice(16,20)+"-"+h.slice(20);
 };
 return Array.from({length:n},make).join("\n");
}
export function xmlCheck(input,output){
 if(/<!\s*(DOCTYPE|ENTITY)\b/i.test(input))throw Error("DTD and entity declarations are not allowed");
 if(typeof DOMParser==="undefined")throw Error("XML parsing is not available");
 const doc=new DOMParser().parseFromString(input,"application/xml");
 const err=doc.querySelector("parsererror");if(err)throw Error("XML syntax error: "+err.textContent.slice(0,220));
 if(!doc.documentElement)throw Error("Missing XML root");
 // Serializer preserves XML semantics; it is not a pretty-printer.
 return output==="serialize"?new XMLSerializer().serializeToString(doc):"Valid XML. Root: "+doc.documentElement.nodeName;
}
export function sqlFormat(input){
 if(input.length>50000)throw Error("SQL input too large");
 // Basic lexical formatter, not a SQL validator. Quoted strings and comments remain intact.
 const words=input.match(/'(?:''|[^'])*'|"(?:\"\"|[^"])*"|--[^\n]*|\/\*[\s\S]*?\*\/|[a-zA-Z_][\w$]*|\d+(?:\.\d+)?|[(),;.]|\S/g)||[];
 const breaks=new Set(["SELECT","FROM","WHERE","HAVING","GROUP","ORDER","LIMIT","OFFSET","VALUES","SET","JOIN","LEFT","RIGHT","INNER","OUTER","UNION","INSERT","UPDATE","DELETE","RETURNING","ON"]);
 let out="",indent=0;
 for(const token of words){
  const t=token.toUpperCase();
  if(breaks.has(t)&&out.trim())out=out.trimEnd()+"\n"+"  ".repeat(indent);
  else if(out&&!/[\s(.]$/.test(out)&&![",",")",".",";"].includes(token))out+=" ";
  if(token===")")indent=Math.max(0,indent-1);
  out+=token;
  if(token==="(")indent++;
  if(token===","||token===";")out+="\n"+"  ".repeat(indent);
 }
 return out.trim()+"\n";
}
export function markdownHtml(input){
 // All input HTML is escaped. This is deliberately a safe Markdown subset, not full GFM.
 const inline=t=>{
  let s=escapeHtml(t);
  s=s.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>");
  s=s.replace(/\[([^\]]{1,100})\]\((https?:\/\/[^\s)<>"]{1,400})\)/g,(_,label,url)=>'<a target="_blank" rel="noopener noreferrer" href="'+url+'">'+label+"</a>");
  return s;
 };
 const html=[];let list=[];
 const finish=()=>{if(list.length){html.push("<ul>"+list.map(t=>"<li>"+inline(t)+"</li>").join("")+"</ul>");list=[];}};
 for(const raw of input.replace(/\r\n?/g,"\n").split("\n")){
  if(!raw.trim()){finish();continue;}
  const h=raw.match(/^(#{1,4})\s+(.+)$/);
  if(h){finish();html.push("<h"+h[1].length+">"+inline(h[2])+"</h"+h[1].length+">");continue;}
  const m=raw.match(/^\s*[-*]\s+(.+)$/);
  if(m){list.push(m[1]);continue;}
  finish();html.push("<p>"+inline(raw)+"</p>");
 }
 finish();return html.join("\n");
}
