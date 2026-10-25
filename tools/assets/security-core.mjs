/* KOLFAT: security tools, local-only. Never send, persist or log user input. */
export function randomIndex(max){
 if(!Number.isInteger(max)||max<1||max>65536)throw Error("Invalid random range.");
 if(!globalThis.crypto?.getRandomValues)throw Error("HTTPS with secure randomness is required.");
 const limit=Math.floor(65536/max)*max,buf=new Uint16Array(1);
 for(let i=0;i<1000;i++){crypto.getRandomValues(buf);if(buf[0]<limit)return buf[0]%max;}
 throw Error("Secure randomness unavailable.");
}
const GROUPS={upper:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",lower:"abcdefghijklmnopqrstuvwxyz",digits:"0123456789",symbols:"!@#$%^&*()-_=+[]{}:,.?"};
export function passwordGenerate(length=20,options={upper:true,lower:true,digits:true,symbols:true,unambiguous:false}){
 if(!Number.isInteger(length)||length<12||length>128)throw Error("Use a length of 12–128.");
 const groups=Object.entries(GROUPS).filter(([name])=>options[name]).map(([,chars])=>options.unambiguous?[...chars].filter(c=>!/[0OIl1|]/.test(c)).join(""):chars);
 if(!groups.length)throw Error("Select at least one character set.");
 const pool=groups.join("");const chars=groups.map(g=>g[randomIndex(g.length)]);
 while(chars.length<length)chars.push(pool[randomIndex(pool.length)]);
 for(let i=chars.length-1;i>0;i--){const j=randomIndex(i+1);[chars[i],chars[j]]=[chars[j],chars[i]];}
 return chars.join("");
}
const ADJ="amber azure brisk bright calm cedar clear clever cosmic crisp crystal daring deep eager ember fair gentle golden grand green hardy hidden honest ivory keen kind lunar mellow merry misty modern noble north ocean open orange peaceful quick quiet radiant rapid rare royal rustic sacred serene sharp silent silver simple solar solid south spring steady stone sunny swift tender timeless vivid warm wild winter wise young".split(" ");
const NOUN="acorn anchor apple arrow atlas aurora bamboo beacon blossom breeze bridge canyon castle cedar cherry comet copper coral delta desert dolphin dragon eagle echo ember falcon fern forest garden glacier harbor hawk island ivory jungle lantern lemon lily maple meadow meteor mountain ocean olive orchid owl panda pebble planet quartz raven river rocket rose sailboat satellite shadow signal spark spirit summit sunrise thunder valley willow".split(" ");
export function passphraseGenerate(words=6,sep="-"){
 if(!Number.isInteger(words)||words<5||words>10)throw Error("Choose 5–10 words.");
 if(!["-"," ","."].includes(sep))throw Error("Invalid separator.");
 if(new Set(ADJ).size!==ADJ.length||new Set(NOUN).size!==NOUN.length)throw Error("Wordlist error.");
 return Array.from({length:words},()=>ADJ[randomIndex(ADJ.length)]+NOUN[randomIndex(NOUN.length)]).join(sep);
}
export function passphraseEntropy(words){return words*Math.log2(ADJ.length*NOUN.length);}
export function passwordEstimate(s){
 if(s.length>10000)throw Error("Too much input.");
 const issues=[];
 if(s.length<12)issues.push("Use at least 12 characters. Prefer 16+.");
 if(/(.)\1{2,}/u.test(s))issues.push("Repeated characters detected.");
 if(/(?:1234|abcd|qwerty|password|admin|letmein|welcome|iloveyou|2026)/i.test(s))issues.push("Common words or sequences detected.");
 if(/^\d+$/.test(s))issues.push("Numbers alone are easy to guess.");
 let kinds=0;for(const re of [/[a-z]/,/[A-Z]/,/[0-9]/,/[^a-zA-Z0-9]/])if(re.test(s))kinds++;
 let score=s.length>=24?4:s.length>=16?3:s.length>=12?2:s.length?1:0;
 if(kinds<2)score=Math.min(score,2);
 if(issues.some(x=>/Repeated|Common|Numbers/.test(x)))score=Math.min(score,1);
 return {score,label:["Empty","Weak","Fair","Good","Strong"][score],issues:issues.length?issues:["No obvious patterns detected. This is only a heuristic, not a cracking benchmark."]};
}
function jwtPart(segment){
 if(!/^[A-Za-z0-9_-]+$/.test(segment)||segment.length>200000)throw Error("Malformed JWT Base64URL section.");
 const s=segment.replace(/-/g,"+").replace(/_/g,"/");const binary=atob(s+"=".repeat((4-s.length%4)%4));
 return JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(Uint8Array.from(binary,c=>c.charCodeAt(0))));
}
export function jwtInspect(token,now=Math.floor(Date.now()/1000)){
 const p=token.trim().split(".");if(p.length!==3||p.some(x=>!x))throw Error("A JWT must have three dot-separated parts.");
 const header=jwtPart(p[0]),claims=jwtPart(p[1]);
 if(!header||typeof header!=="object"||Array.isArray(header)||!claims||typeof claims!=="object"||Array.isArray(claims))throw Error("Expected object header and claims.");
 const dates=Object.fromEntries(["iat","nbf","exp"].filter(k=>typeof claims[k]==="number").map(k=>[k,new Date(claims[k]*1000).toISOString()]));
 const notices=[];
 if(typeof claims.exp==="number")notices.push(claims.exp>now?"Not expired by the unverified exp claim.":"Expired by the unverified exp claim.");
 if(typeof claims.nbf==="number"&&claims.nbf>now)notices.push("Not valid before the nbf timestamp.");
 notices.push("DECODED ONLY. Signature is NOT checked. Claims can be forged.");
 return {header,claims,dates,notices};
}
export async function textHash(s,algorithm="SHA-256"){
 if(!["SHA-256","SHA-512"].includes(algorithm))throw Error("Unsupported hash algorithm.");
 if(!globalThis.crypto?.subtle)throw Error("HTTPS required for Web Crypto.");
 const b=new TextEncoder().encode(s);if(b.length>1048576)throw Error("Text limit is 1 MiB.");
 return Array.from(new Uint8Array(await crypto.subtle.digest(algorithm,b)),x=>x.toString(16).padStart(2,"0")).join("");
}
export function leakScan(text){
 if(text.length>200000)throw Error("Limit is 200,000 characters.");
 const patterns=[
 ["AWS access key",/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
 ["GitHub legacy token",/\b(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9]{30,255}\b/g],
 ["GitHub fine-grained token",/\bgithub_pat_[a-zA-Z0-9_]{20,255}\b/g],
 ["OpenAI-style key",/\bsk-(?:proj-)?[a-zA-Z0-9_-]{20,}\b/g],
 ["Private key header",/-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/g],
 ["Credential assignment",/\b(?:password|passwd|api[_-]?key|secret)\s*[:=]\s*["']?[^\s"']{8,}/gi]
 ];
 const hits=[];
 for(const [type,re] of patterns){let match,count=0;while((match=re.exec(text))&&count<100){hits.push({type,line:text.slice(0,match.index).split("\n").length});count++;}}
 return {hits,warning:"Pattern-based scan only; false positives and missed secrets are possible. Matched values are not shown."};
}
export function redactText(text,{emails=true,ipv4=true,phones=true}={}){
 if(text.length>200000)throw Error("Limit is 200,000 characters.");
 let output=text;const counts={};
 const apply=(label,re,replacement)=>{let n=0;output=output.replace(re,()=>{n++;return replacement;});counts[label]=n;};
 if(emails)apply("emails",/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,"[EMAIL]");
 if(ipv4)apply("IPv4 addresses",/\b(?:\d{1,3}\.){3}\d{1,3}\b/g,"[IPV4]");
 if(phones)apply("phone-like strings",/(?<!\w)\+?\d[\d\s().-]{7,}\d(?!\w)/g,"[PHONE]");
 return {output,counts,warning:"Heuristic redaction only. Review manually before sharing."};
}
