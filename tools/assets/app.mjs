import {bytes,cleanName,parts,filenameDate,fileDate,inspectJpegExif,csv,makeZip,uniqueName} from "./core.mjs";

const $=id=>document.getElementById(id);
const tool=document.body.dataset.tool;
const picker=$("files"), action=$("run"), output=$("results"), status=$("status");
const MAX_BATCH=200*1024*1024, MAX_DIGEST=256*1024*1024;
let current=[],busy=false;
function setStatus(message,kind="info"){status.textContent=message;status.dataset.kind=kind;}
function clear(){output.replaceChildren();}
function node(tag,text,cls){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;}
function row(text){output.append(node("div",text,"result-row"));}
function addLink(blob,name,label){
 const a=node("a",label||"Download result","download");
 a.href=URL.createObjectURL(blob);a.download=name;a.addEventListener("click",()=>setTimeout(()=>URL.revokeObjectURL(a.href),60000),{once:true});
 output.append(a);
}
function summary(message){output.prepend(node("p",message,"summary"));}
function download(blob,name){addLink(blob,name);}
function selected(){return Array.from(picker?.files||[]);}
function picked(files){
 current=files;clear();const amount=files.reduce((a,f)=>a+f.size,0);
 $("picked").textContent=files.length?files.length+" file(s) selected • "+bytes(amount):"No files selected";
 setStatus(files.length?"Ready. Original files will not be modified.":"Choose files to get started.");
}
if(picker){picker.addEventListener("change",()=>picked(selected()));const drop=$("drop");drop.addEventListener("dragover",e=>{e.preventDefault();drop.classList.add("drag");});drop.addEventListener("dragleave",()=>drop.classList.remove("drag"));drop.addEventListener("drop",e=>{e.preventDefault();drop.classList.remove("drag");if(e.dataTransfer?.files?.length){picker.value="";picked(Array.from(e.dataTransfer.files));}});}
const imageAllowed=f=>/^image\/(jpeg|png|webp|bmp|gif|avif)$/.test(f.type)||/\.(jpe?g|png|webp|bmp|gif|avif)$/i.test(f.name);
function guardImages(files){const ok=files.filter(imageAllowed);if(!ok.length)throw Error("Choose a supported browser-readable image (JPEG, PNG, WebP, BMP, GIF or AVIF).");if(ok.length!==files.length)row((files.length-ok.length)+" unsupported files skipped.");return ok;}
async function decode(file){
 // HTMLImageElement fallback retains compatibility where createImageBitmap is missing.
 if(typeof createImageBitmap==="function")try{return await createImageBitmap(file);}catch{}
 return await new Promise((resolve,reject)=>{
  const url=URL.createObjectURL(file), img=new Image();
  img.onload=()=>{URL.revokeObjectURL(url);resolve(img);};
  img.onerror=()=>{URL.revokeObjectURL(url);reject(Error("This browser cannot decode "+file.name));};img.src=url;
 });
}
async function encode(file,type,maxW,maxH,quality){
 const image=await decode(file);
 try{
  const w=image.width||image.naturalWidth,h=image.height||image.naturalHeight;
  if(!w||!h||w*h>95000000)throw Error("Image dimensions exceed browser processing limit");
  const ratio=Math.min(1,maxW>0?maxW/w:1,maxH>0?maxH/h:1);
  const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(w*ratio));canvas.height=Math.max(1,Math.round(h*ratio));
  const context=canvas.getContext("2d");if(!context)throw Error("Canvas not available");
  if(type==="image/jpeg"){context.fillStyle="#ffffff";context.fillRect(0,0,canvas.width,canvas.height);}
  context.drawImage(image,0,0,canvas.width,canvas.height);
  const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error("Image encoding failed")),type,quality));
  canvas.width=0;canvas.height=0;
  if(blob.type!==type)throw Error("Your browser does not support "+type+" encoding");
  return {blob,width:Math.max(1,Math.round(w*ratio)),height:Math.max(1,Math.round(h*ratio))};
 }finally{if(typeof image.close==="function")image.close();}
}
async function jpegInfo(file){
 if(!/(\.jpe?g)$/i.test(file.name)&&file.type!=="image/jpeg")return {captured:"",hasGPS:false,hasExif:false,note:"EXIF inspection currently supports JPEG only"};
 try{return inspectJpegExif(await file.slice(0,1024*1024).arrayBuffer());}
 catch{return {captured:"",hasGPS:false,hasExif:false,note:"Could not parse EXIF"};}
}
function captureType(){return $("format")?.value||"image/jpeg";}
function extension(t){return ({"image/jpeg":".jpg","image/png":".png","image/webp":".webp"})[t];}
function qty(){return Math.max(0.1,Math.min(1,Number($("quality")?.value||.82)/100));}
function maxDimension(id){return Math.max(0,Math.min(16000,Number($(id)?.value||0)));}
async function imageJobs(files,mode){
 const images=guardImages(files);
 if(images.length>60)throw Error("Choose 60 images or fewer in one batch.");
 const total=images.reduce((s,f)=>s+f.size,0);
 if(total>MAX_BATCH)throw Error("Batch exceeds 200 MiB browser safety limit. Select fewer files.");
 const t=mode==="clean"?null:captureType();
 const entries=[],used=new Set();let saved=0;
 for(let i=0;i<images.length;i++){
  const f=images[i], info=await jpegInfo(f);
  const type=t||(f.type==="image/png"?"image/png":f.type==="image/webp"?"image/webp":"image/jpeg");
  setStatus("Processing "+(i+1)+"/"+images.length+" • "+f.name);
  const result=await encode(f,type,mode==="compress"?maxDimension("maxWidth"):0,mode==="compress"?maxDimension("maxHeight"):0,qty());
  const name=uniqueName(cleanName(parts(f.name).stem)+extension(type),used);
  saved+=f.size-result.blob.size;
  row(name+" • "+result.width+" × "+result.height+" • "+bytes(f.size)+" → "+bytes(result.blob.size)+(mode==="clean"&&info.hasGPS?" • source contained GPS metadata":""));
  entries.push({name,data:new Uint8Array(await result.blob.arrayBuffer())});
 }
 if(entries.length===1)download(new Blob([entries[0].data],{type:t||images[0].type||"application/octet-stream"}),entries[0].name);
 else download(makeZip(entries),"kolfat-images.zip");
 summary("Created "+entries.length+" new file(s). "+(mode==="compress"?"Total size change: "+bytes(Math.abs(saved))+(saved>=0?" smaller.":" larger."):"Originals stay untouched."));
}
async function dates(files){
 if(files.length>300)throw Error("Choose 300 files or fewer per date report.");
 const rows=[["File","EXIF capture date (JPEG)","Filename date","File modified (not capture date)","GPS EXIF present","Finding"]];
 let found=0;
 for(let i=0;i<files.length;i++){
  const f=files[i],info=await jpegInfo(f),fromName=filenameDate(f.name),mod=fileDate(f.lastModified);
  const disagree=info.captured&&fromName&&info.captured!==fromName;
  const label=disagree?"Conflicting capture and filename dates":info.captured?"EXIF capture date available":fromName?"Filename date only":"Capture date unknown";
  if(info.captured)found++;
  rows.push([f.name,info.captured,fromName,mod,info.hasGPS?"Yes":"No / not detected",label]);
  row(f.name+" → "+(info.captured||fromName||"unknown")+" ("+label+")");
  setStatus("Inspecting "+(i+1)+"/"+files.length);
 }
 download(new Blob([csv(rows)],{type:"text/csv;charset=utf-8"}),"kolfat-date-report.csv");
 summary(found+" of "+files.length+" file(s) contained a readable JPEG EXIF capture date. The modified timestamp is NOT proof of capture date.");
}
async function duplicates(files){
 if(files.length>500)throw Error("Choose 500 files or fewer.");
 if(!crypto?.subtle)throw Error("SHA-256 requires a secure HTTPS browser context.");
 const groups=new Map();for(const f of files){const k=f.size;groups.set(k,[...(groups.get(k)||[]),f]);}
 const hashed=new Map();let scanned=0,skipped=0;
 for(const [size,matches] of groups){
  if(matches.length<2)continue;
  for(const f of matches){
   if(size>MAX_DIGEST){skipped++;continue;}
   const digest=new Uint8Array(await crypto.subtle.digest("SHA-256",await f.arrayBuffer()));
   const hash=Array.from(digest).map(x=>x.toString(16).padStart(2,"0")).join("");
   const key=size+":"+hash;hashed.set(key,[...(hashed.get(key)||[]),f.name]);scanned++;
   setStatus("Hashing "+scanned+" possible duplicate file(s)");
  }
 }
 let count=0,excess=0;const report=[["Group","File","Bytes","SHA-256"]];
 for(const [key,names] of hashed){
  if(names.length<2)continue;count++;excess+=names.length-1;
  row("Group "+count+" • "+names.length+" byte-identical files:");
  for(const name of names){row("  "+name);report.push([count,name,key.split(":")[0],key.split(":")[1]]);}
 }
 if(!count)row("No byte-identical duplicate groups found among inspected files.");
 if(skipped)row(skipped+" matching-size file(s) skipped (over 256 MiB each).");
 download(new Blob([csv(report)],{type:"text/csv;charset=utf-8"}),"kolfat-duplicates.csv");
 summary(count+" duplicate group(s); "+excess+" redundant copies identified. No files deleted. Different-size similar photos are not detected.");
}
async function renamer(files){
 if(files.length>250||files.reduce((s,f)=>s+f.size,0)>MAX_BATCH)throw Error("Maximum 250 files and 200 MiB total per ZIP batch.");
 const prefix=cleanName($("prefix").value||"photo"),method=$("naming").value;
 const entries=[],used=new Set(),preview=[["Original","New name"]];
 for(let i=0;i<files.length;i++){
  const file=files[i],ext=parts(cleanName(file.name)).ext||"";
  const info=method==="date"?await jpegInfo(file):{captured:""};
  const dt=method==="date"?(info.captured||filenameDate(file.name)||"undated"):"";
  const number=String(i+1).padStart(4,"0");
  const name=uniqueName(prefix+"-"+(dt?dt+"-":"")+number+ext,used);
  preview.push([file.name,name]);row(file.name+" → "+name);setStatus("Preparing "+(i+1)+"/"+files.length);
  entries.push({name,data:new Uint8Array(await file.arrayBuffer())});
 }
 download(makeZip(entries),"kolfat-renamed-files.zip");
 download(new Blob([csv(preview)],{type:"text/csv;charset=utf-8"}),"kolfat-rename-preview.csv");
 summary("Prepared "+entries.length+" renamed copies inside a ZIP archive. Original filenames and files remain unchanged on your computer.");
}
const tasks={"compress":files=>imageJobs(files,"compress"),"convert":files=>imageJobs(files,"convert"),"clean":files=>imageJobs(files,"clean"),"dates":dates,"duplicates":duplicates,"rename":renamer};
if(action){action.addEventListener("click",async()=>{
 if(busy)return;if(!current.length){setStatus("Choose one or more files first.","error");return;}
 busy=true;action.disabled=true;clear();const started=current;
 try{await tasks[tool](started);setStatus("Complete. Use the download links below.","ok");}
 catch(e){setStatus(e?.message||"Processing failed. Choose smaller or different files.","error");}
 finally{busy=false;action.disabled=false;}
});}
