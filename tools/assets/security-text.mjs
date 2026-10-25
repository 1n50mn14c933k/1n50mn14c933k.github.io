/* KOLFAT text, Unicode, URL and IDN inspection: offline only. */
export function diffText(left,right){
 if(left.length>20000||right.length>20000)throw Error("Maximum 20,000 characters per side.");
 const a=left.replace(/\r\n/g,"\n").split("\n"),b=right.replace(/\r\n/g,"\n").split("\n");
 if(a.length>180||b.length>180)throw Error("Maximum 180 lines per side.");
 const dp=Array.from({length:a.length+1},()=>new Uint16Array(b.length+1));
 for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)dp[i][j]=a[i]===b[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
 let i=0,j=0,added=0,removed=0,out=["--- Original","+++ Modified"];
 while(i<a.length||j<b.length){
  if(i<a.length&&j<b.length&&a[i]===b[j]){out.push("  "+a[i]);i++;j++;}
  else if(j<b.length&&(i===a.length||dp[i][j+1]>=dp[i+1][j])){out.push("+ "+b[j++]);added++;}
  else{out.push("- "+a[i++]);removed++;}
 }
 return {text:out.join("\n")+"\n",added,removed};
}
const HOMOGLYPHS=new Map(Object.entries({
 "а":"Cyrillic a","е":"Cyrillic e","о":"Cyrillic o","р":"Cyrillic p","с":"Cyrillic s","у":"Cyrillic y",
 "х":"Cyrillic x","і":"Cyrillic i","ј":"Cyrillic j","һ":"Cyrillic h","к":"Cyrillic k","м":"Cyrillic m",
 "А":"Cyrillic A","В":"Cyrillic B","Е":"Cyrillic E","К":"Cyrillic K","М":"Cyrillic M","Н":"Cyrillic H",
 "О":"Cyrillic O","Р":"Cyrillic P","С":"Cyrillic C","Т":"Cyrillic T","Х":"Cyrillic X",
 "α":"Greek alpha","ο":"Greek omicron","ρ":"Greek rho","ν":"Greek nu","Α":"Greek A","Β":"Greek B","Ε":"Greek E","Ο":"Greek O"
}));
export function unicodeInspect(text){
 if(text.length>50000)throw Error("Maximum 50,000 characters.");
 const alerts=[];let scripts=new Set(),position=0;
 for(const ch of text){
  const cp=ch.codePointAt(0),code="U+"+cp.toString(16).toUpperCase().padStart(4,"0");
  if(/\p{Script=Latin}/u.test(ch))scripts.add("Latin");
  if(/\p{Script=Cyrillic}/u.test(ch))scripts.add("Cyrillic");
  if(/\p{Script=Greek}/u.test(ch))scripts.add("Greek");
  if(HOMOGLYPHS.has(ch))alerts.push({position,code,reason:"Confusable: "+HOMOGLYPHS.get(ch)});
  else if(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/u.test(ch))alerts.push({position,code,reason:"Invisible or bidirectional format character"});
  position++;
  if(alerts.length>=100)break;
 }
 if(scripts.size>1)alerts.unshift({position:null,code:"MIXED",reason:"Mixed scripts: "+[...scripts].join(", ")});
 return {codePoints:[...text].length,scripts:[...scripts],normalizedNFC:text.normalize("NFC"),alerts,warning:"Only a curated set of confusables is recognized, not the full Unicode confusables database."};
}
function decodeDigit(cp){if(cp>=48&&cp<=57)return cp-22;if(cp>=65&&cp<=90)return cp-65;if(cp>=97&&cp<=122)return cp-97;throw Error("Invalid Punycode digit.");}
function adapt(delta,numPoints,first){delta=first?Math.floor(delta/700):Math.floor(delta/2);delta+=Math.floor(delta/numPoints);let k=0;while(delta>455){delta=Math.floor(delta/35);k+=36;}return k+Math.floor(36*delta/(delta+38));}
export function punycodeDecodeLabel(encoded){
 if(!/^[a-z0-9-]{1,63}$/i.test(encoded))throw Error("Invalid Punycode label.");
 let n=128,i=0,bias=72,pos=0;
 const end=encoded.lastIndexOf("-");let output=[];
 if(end>=0){for(const ch of encoded.slice(0,end)){if(ch.charCodeAt(0)>127)throw Error("Invalid ASCII.");output.push(ch.codePointAt(0));}pos=end+1;}
 while(pos<encoded.length){
  const old=i;let w=1,k=36;
  for(;;k+=36){
   if(pos>=encoded.length)throw Error("Truncated Punycode.");
   const d=decodeDigit(encoded.charCodeAt(pos++)),t=k<=bias?1:k>=bias+26?26:k-bias;
   i+=d*w;if(!Number.isSafeInteger(i))throw Error("Punycode overflow.");
   if(d<t)break;w*=36-t;if(!Number.isSafeInteger(w))throw Error("Punycode overflow.");
  }
  const len=output.length+1;bias=adapt(i-old,len,old===0);
  n+=Math.floor(i/len);i%=len;
  if(n>0x10ffff||(n>=0xd800&&n<=0xdfff))throw Error("Invalid Unicode code point.");
  output.splice(i,0,n);i++;
 }
 return String.fromCodePoint(...output);
}
export function idnConvert(input,mode="to-ascii"){
 const s=String(input).trim();if(!s||s.length>253||/[\s/:@?#\\]/.test(s))throw Error("Provide a domain name only, without URL, port, or whitespace.");
 const lower=s.toLowerCase();const labels=lower.split(".");
 if(labels.some(x=>!x))throw Error("Domain contains an empty label.");
 if(mode==="to-unicode")return labels.map(x=>x.startsWith("xn--")?punycodeDecodeLabel(x.slice(4)):x).join(".");
 if(mode!=="to-ascii")throw Error("Unknown conversion mode.");
 const hostname=new URL("https://"+lower+"/").hostname;
 if(hostname.length>253||hostname.split(".").some(x=>x.length>63))throw Error("Domain is too long.");
 return hostname;
}
export function urlInspect(input){
 if(input.length>4096)throw Error("URL too long.");
 let url;try{url=new URL(input.trim());}catch{throw Error("Enter an absolute URL including https://.");}
 const issues=[];
 if(url.protocol!=="https:"&&url.protocol!=="http:")issues.push("Unsupported or dangerous URL scheme: "+url.protocol);
 else if(url.protocol==="http:")issues.push("Unencrypted HTTP (no TLS).");
 if(url.username||url.password)issues.push("Contains URL username or password credentials.");
 if(url.hostname.startsWith("xn--")||url.hostname.includes(".xn--"))issues.push("Internationalized hostname uses Punycode. Verify the decoded domain.");
 if(/^\d+\.\d+\.\d+\.\d+$/.test(url.hostname)||url.hostname.startsWith("["))issues.push("Direct IP address rather than a named domain.");
 if(url.hostname.split(".").length>=5)issues.push("Unusually deep hostname.");
 if(url.port&&url.port!=="443"&&url.port!=="80")issues.push("Unusual explicit port: "+url.port);
 for(const key of url.searchParams.keys())if(/^(url|next|redirect|return|returnurl|dest|destination|continue)$/i.test(key)){issues.push("Possible redirect parameter: "+key);break;}
 if(/%(?:25)?(?:2f|5c|40)/i.test(url.href))issues.push("Encoded URL separator or at-sign.");
 return {scheme:url.protocol,hostname:url.hostname,port:url.port||"(default)",pathname:url.pathname,issues,
 warning:"Offline structure review ONLY, not malware or phishing reputation verification. No URL was visited."};
}
export function utf8Inspect(text,mode="encode"){
 if(text.length>12000)throw Error("Maximum 12,000 input characters.");
 if(mode==="encode"){
  const bytes=new TextEncoder().encode(text);
  return {utf8Hex:Array.from(bytes,b=>b.toString(16).padStart(2,"0").toUpperCase()).join(" "),bytes:bytes.length,
   characters:[...text].length,codePoints:[...text].slice(0,256).map(c=>"U+"+c.codePointAt(0).toString(16).toUpperCase().padStart(4,"0")).join(" ")};
 }
 if(mode!=="decode")throw Error("Unknown inspection mode.");
 const hex=text.replace(/\s+/g,"");
 if(!/^(?:[a-fA-F0-9]{2})*$/.test(hex))throw Error("Hex input must contain pairs of hexadecimal digits.");
 const bytes=new Uint8Array(hex.match(/.{2}/g)?.map(pair=>parseInt(pair,16))||[]);
 return {decoded:new TextDecoder("utf-8",{fatal:true}).decode(bytes),bytes:bytes.length};
}
