/* KOLFAT restricted YAML parser and JSON Schema subset validation.
 * No remote references, custom tags, anchors, or executable content. */
const MAX_DEPTH=25;
function value(raw){
 const s=raw.trim();
 if(s===""||s==="null"||s==="~")return null;
 if(s==="true")return true;if(s==="false")return false;
 if(/^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(s))return Number(s);
 if(s.startsWith('"'))return JSON.parse(s);
 if(s.startsWith("'")&&s.endsWith("'"))return s.slice(1,-1).replace(/''/g,"'");
 if(s==="[]")return [];if(s==="{}")return {};
 if(s.startsWith("[")||s.startsWith("{")){try{return JSON.parse(s);}catch{throw Error("Inline YAML collections require JSON-compatible syntax");}}
 if(/^(?:&|\*|!|<<|\||>|---|\.\.\.)/.test(s))throw Error("Advanced YAML construct not supported");
 return s.replace(/\s+#.*$/,"");
}
function keyOf(s,line){
 const m=s.match(/^((?:[^:"']|"[^"]*"|'[^']*')+?):(?:\s+(.*))?$/);
 if(!m)throw Error("Expected YAML key: value on line "+line);
 let key=m[1].trim();
 if(key[0]==='"'){try{key=JSON.parse(key);}catch{throw Error("Invalid quoted key");}}
 else if(key[0]==="'"&&key.endsWith("'"))key=key.slice(1,-1).replace(/''/g,"'");
 if(!key||["__proto__","prototype","constructor"].includes(key))throw Error("Unsafe YAML key");
 return {key,rest:m[2]};
}
export function yamlParse(input){
 if(input.length>300000)throw Error("YAML input exceeds 300 KB");
 const lines=input.replace(/\r\n?/g,"\n").split("\n").map((x,i)=>{
  if(/^\s*\t/.test(x))throw Error("Tabs cannot indent YAML (line "+(i+1)+")");
  const indent=x.match(/^ */)[0].length;
  return {indent,txt:x.trim(),line:i+1};
 }).filter(x=>x.txt&&!x.txt.startsWith("#"));
 if(!lines.length)throw Error("No YAML data");
 if(lines.some(x=>/^(---|\.\.\.)$/.test(x.txt)))throw Error("Multiple YAML documents are unsupported");
 if(lines[0].indent!==0)throw Error("YAML must start without indentation");
 let at=0;
 function parse(depth,indent){
  if(depth>MAX_DEPTH)throw Error("YAML nesting too deep");
  const arr=lines[at].txt==="-"||lines[at].txt.startsWith("- ");
  const out=arr?[]:Object.create(null);
  while(at<lines.length&&lines[at].indent===indent){
   const line=lines[at];
   if(arr){
    if(!(line.txt==="-"||line.txt.startsWith("- ")))throw Error("Mixed list and map at line "+line.line);
    const content=line.txt.slice(1).trim();at++;
    if(!content){out.push(at<lines.length&&lines[at].indent>indent?parse(depth+1,lines[at].indent):null);continue;}
    if(/^[^:"']+:\s*(?:.*)?$/.test(content)){
     const first=keyOf(content,line.line),item=Object.create(null);
     if(first.rest!==undefined)item[first.key]=value(first.rest);
     else item[first.key]=at<lines.length&&lines[at].indent>indent+2?parse(depth+1,lines[at].indent):null;
     if(at<lines.length&&lines[at].indent>indent){
      const rest=parse(depth+1,lines[at].indent);
      if(!rest||typeof rest!=="object"||Array.isArray(rest))throw Error("Unsupported multiline sequence entry at "+line.line);
      for(const [k,v]of Object.entries(rest)){if(Object.hasOwn(item,k))throw Error("Duplicate YAML key "+k);item[k]=v;}
     }
     out.push(item);
    }else{
     out.push(value(content));
     if(at<lines.length&&lines[at].indent>indent)throw Error("Unexpected YAML indentation at line "+lines[at].line);
    }
   }else{
    const {key,rest}=keyOf(line.txt,line.line);
    if(Object.hasOwn(out,key))throw Error("Duplicate YAML key "+key);
    at++;
    out[key]=rest===undefined?(at<lines.length&&lines[at].indent>indent?parse(depth+1,lines[at].indent):null):value(rest);
    if(rest!==undefined&&at<lines.length&&lines[at].indent>indent)throw Error("Unexpected indentation at line "+lines[at].line);
   }
  }
  return out;
 }
 const result=parse(0,0);
 if(at!==lines.length)throw Error("Inconsistent YAML indentation at line "+lines[at].line);
 return result;
}
export function yamlWrite(data){
 const scalar=v=>{
  if(v===null)return "null";
  if(typeof v==="boolean"||typeof v==="number")return String(v);
  if(typeof v!=="string")throw Error("Unsupported YAML data type");
  return !v||/[:#\r\n{}\[\],]|^\s|\s$|^(true|false|null|~|[-+]?\d+(?:\.\d+)?)$/i.test(v)?JSON.stringify(v):v;
 };
 function emit(value,level){
  if(level>MAX_DEPTH)throw Error("YAML nesting too deep");
  const pad=" ".repeat(level*2);
  if(Array.isArray(value)){
   if(!value.length)return pad+"[]";
   return value.map(v=>v&&typeof v==="object"?pad+"-\n"+emit(v,level+1):pad+"- "+scalar(v)).join("\n");
  }
  if(value&&typeof value==="object"){
   const keys=Object.keys(value);
   if(!keys.length)return pad+"{}";
   return keys.map(k=>{
    if(["__proto__","constructor","prototype"].includes(k))throw Error("Unsafe JSON key");
    const safeKey=/^[A-Za-z_][A-Za-z0-9_.-]*$/.test(k)?k:JSON.stringify(k),v=value[k];
    return v&&typeof v==="object"?pad+safeKey+":\n"+emit(v,level+1):pad+safeKey+": "+scalar(v);
   }).join("\n");
  }
  return pad+scalar(value);
 }
 return emit(data,0)+"\n";
}
const KEYWORDS=new Set(["$schema","$id","title","description","default","examples","type","properties","required","items","enum","const","minimum","maximum","minLength","maxLength","minItems","maxItems","additionalProperties"]);
function typeIs(v,t){
 if(t==="integer")return Number.isInteger(v);
 if(t==="number")return typeof v==="number";
 if(t==="null")return v===null;
 if(t==="array")return Array.isArray(v);
 if(t==="object")return v!==null&&typeof v==="object"&&!Array.isArray(v);
 return typeof v===t;
}
export function schemaCheck(data,schema){
 if(!schema||Array.isArray(schema)||typeof schema!=="object")throw Error("JSON Schema root must be an object");
 const errors=[];let visited=0;
 const walk=(v,s,path,depth)=>{
  if(++visited>4000)throw Error("Too many data elements for this browser validator");
  if(depth>MAX_DEPTH)throw Error("Schema nesting limit exceeded");
  if(!s||typeof s!=="object"||Array.isArray(s))throw Error("Schema must use object declarations");
  for(const k of Object.keys(s))if(!KEYWORDS.has(k))throw Error("Unsupported schema keyword: "+k+". Only a documented subset is supported.");
  if(s.type!==undefined){
   if(typeof s.type!=="string"||!["null","boolean","string","number","integer","object","array"].includes(s.type))throw Error("Unsupported schema type");
   if(!typeIs(v,s.type)){errors.push(path+" must be "+s.type);return;}
  }
  if(s.enum!==undefined){if(!Array.isArray(s.enum))throw Error("enum must be an array");if(!s.enum.some(x=>JSON.stringify(x)===JSON.stringify(v)))errors.push(path+" is not in enum");}
  if(Object.hasOwn(s,"const")&&JSON.stringify(s.const)!==JSON.stringify(v))errors.push(path+" differs from const");
  if(typeof v==="string"){if(s.minLength!==undefined&&[...v].length<s.minLength)errors.push(path+" is too short");if(s.maxLength!==undefined&&[...v].length>s.maxLength)errors.push(path+" is too long");}
  if(typeof v==="number"){if(s.minimum!==undefined&&v<s.minimum)errors.push(path+" is below minimum");if(s.maximum!==undefined&&v>s.maximum)errors.push(path+" exceeds maximum");}
  if(Array.isArray(v)){
   if(s.minItems!==undefined&&v.length<s.minItems)errors.push(path+" has too few items");
   if(s.maxItems!==undefined&&v.length>s.maxItems)errors.push(path+" has too many items");
   if(s.items!==undefined)v.forEach((it,i)=>walk(it,s.items,path+"["+i+"]",depth+1));
  }else if(v&&typeof v==="object"){
   if(s.required!==undefined){if(!Array.isArray(s.required))throw Error("required must be an array");for(const k of s.required)if(!Object.hasOwn(v,k))errors.push(path+"."+k+" is required");}
   for(const [k,val]of Object.entries(v)){
    if(s.properties&&Object.hasOwn(s.properties,k))walk(val,s.properties[k],path+"."+k,depth+1);
    else if(s.additionalProperties===false)errors.push(path+"."+k+" is not allowed");
   }
  }
 };
 walk(data,schema,"$",0);
 return errors;
}
