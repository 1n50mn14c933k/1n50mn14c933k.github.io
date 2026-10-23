/* KOLFAT TOOLS: local-only utilities. No network requests or dependencies. */
const encoder = new TextEncoder();
export function bytes(n){if(!Number.isFinite(n))return "unknown";const u=["B","KiB","MiB","GiB"];let i=0;while(n>=1024&&i<u.length-1){n/=1024;i++;}return n.toFixed(i?1:0)+" "+u[i];}
export function cleanName(value){let x=String(value||"file").normalize("NFC").replace(/[<>:"/\\|?*\x00-\x1f\x7f]/g,"_").replace(/^\.+/,"").replace(/[. ]+$/,"").trim();return (x||"file").slice(0,140);}
export function parts(name){const i=name.lastIndexOf(".");return i>0?{stem:name.slice(0,i),ext:name.slice(i).toLowerCase()}:{stem:name,ext:""};}
export function fileDate(d){return Number.isFinite(d)&&d>0?new Date(d).toISOString().slice(0,10):"";}
export function filenameDate(name){
  const matches=String(name).match(/(?:19|20)\d{2}[-_. ]?(?:0[1-9]|1[0-2])[-_. ]?(?:0[1-9]|[12]\d|3[01])/g)||[];
  for(const found of matches){const m=found.match(/^(\d{4})[-_. ]?(\d{2})[-_. ]?(\d{2})$/);if(!m)continue;const d=new Date(Date.UTC(+m[1],+m[2]-1,+m[3]));if(d.getUTCFullYear()==+m[1]&&d.getUTCMonth()==+m[2]-1&&d.getUTCDate()==+m[3])return m[1]+"-"+m[2]+"-"+m[3];}return "";
}
export function exifDate(text){
 const m=String(text||"").match(/^(\d{4}):(\d{2}):(\d{2})(?:\s|$)/);
 if(!m)return "";const d=new Date(Date.UTC(+m[1],+m[2]-1,+m[3]));return d.getUTCFullYear()==+m[1]&&d.getUTCMonth()==+m[2]-1&&d.getUTCDate()==+m[3]?m[1]+"-"+m[2]+"-"+m[3]:"";
}
/* Lightweight JPEG EXIF DateTimeOriginal + GPS IFD presence detection.
   Best effort: JPEG APP1/TIFF only, first megabyte. Never guess GPS coordinates. */
export function inspectJpegExif(buf){
 const data=new DataView(buf), length=data.byteLength;
 const result={captured:"",hasGPS:false,hasExif:false,note:""};
 if(length<4||data.getUint16(0)!==0xffd8){result.note="Not a JPEG with accessible EXIF";return result;}
 let pos=2;
 while(pos+4<=length){
  if(data.getUint8(pos)!==0xff)break;
  let marker=data.getUint8(pos+1);pos+=2;
  if(marker===0xda||marker===0xd9)break;
  if(marker===0xff)continue;
  if(marker>=0xd0&&marker<=0xd7)continue;
  if(pos+2>length)break;
  let segment=data.getUint16(pos);
  if(segment<2||pos+segment>length)break;
  if(marker===0xe1&&segment>=16&&String.fromCharCode(...new Uint8Array(buf,pos+2,6))==="Exif\x00\x00"){
   result.hasExif=true;
   const start=pos+8,end=pos+segment;
   const order=data.getUint16(start);
   if(order!==0x4949&&order!==0x4d4d){result.note="Unsupported EXIF byte order";return result;}
   const little=order===0x4949;
   const u16=p=>p+2<=end?data.getUint16(p,little):null;
   const u32=p=>p+4<=end?data.getUint32(p,little):null;
   if(u16(start+2)!==42){result.note="Invalid TIFF header";return result;}
   const ascii=(entry,count)=>{
    const where=count<=4?entry+8:start+u32(entry+8);
    if(!Number.isSafeInteger(where)||where<start||where+count>end||count>300)return "";
    return Array.from(new Uint8Array(buf,where,count)).map(c=>String.fromCharCode(c)).join("").replace(/\x00.*$/,"");
   };
   const ifd=(offset,depth=0)=>{
    if(depth>2||!offset||offset>1024*1024)return;
    const p=start+offset;
    if(p<start||p+2>end)return;
    const n=u16(p);if(n===null||n>512||p+2+n*12>end)return;
    for(let i=0;i<n;i++){
     const e=p+2+i*12,tag=u16(e),type=u16(e+2),count=u32(e+4),v=u32(e+8);
     if(tag===0x8825&&v)result.hasGPS=true;
     if(type===2&&count>0&&(tag===0x9003||tag===0x0132||tag===0x9004)){const date=exifDate(ascii(e,count));if(tag===0x9003&&date){result.captured=date;result.originalFound=true;}else if(!result.originalFound&&date&&!result.captured)result.captured=date;}
     if(tag===0x8769&&type===4&&count===1)ifd(v,depth+1);
    }
   };
   ifd(u32(start+4));return result;
  }
  pos+=segment;
 }
 result.note="No JPEG EXIF found";return result;
}
export function escapeCsv(x){let s=String(x??"");if(/^[\x00-\x20]*[=+@-]/.test(s))s="'"+s;return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}
export function csv(rows){return "\ufeff"+rows.map(r=>r.map(escapeCsv).join(",")).join("\r\n")+"\r\n";}
const crcTable=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
export function crc32(a){let c=0xffffffff;for(const v of a)c=crcTable[(c^v)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
const le16=(v)=>[v&255,(v>>>8)&255],le32=(v)=>[v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255];
/* Valid ZIP stored entries, no compression; memory cap enforced by callers. */
export function makeZip(entries){
 let chunks=[],directory=[],position=0;
 if(entries.length>65535)throw Error("Too many ZIP entries");
 for(const entry of entries){
  const name=encoder.encode(entry.name), data=entry.data instanceof Uint8Array?entry.data:new Uint8Array(entry.data);
  if(name.byteLength>65535||data.length>0xffffffff)throw Error("ZIP entry too large");
  const crc=crc32(data),size=data.length;
  const local=new Uint8Array([80,75,3,4,20,0,0,8,0,0,0,0,0,0,...le32(crc),...le32(size),...le32(size),...le16(name.length),0,0]);
  chunks.push(local,name,data);
  directory.push({name,size,crc,at:position});
  position+=local.length+name.length+size;
 }
 let center=[],cdsize=0;
 for(const {name,size,crc,at} of directory){
  const header=new Uint8Array([80,75,1,2,20,0,20,0,0,8,0,0,0,0,0,0,...le32(crc),...le32(size),...le32(size),...le16(name.length),0,0,0,0,0,0,0,0,0,0,0,0,0,0,...le32(at)]);
  center.push(header,name);cdsize+=header.length+name.length;
 }
 const tail=new Uint8Array([80,75,5,6,0,0,0,0,...le16(entries.length),...le16(entries.length),...le32(cdsize),...le32(position),0,0]);
 return new Blob([...chunks,...center,tail],{type:"application/zip"});
}
export function uniqueName(name,used){
 const {stem,ext}=parts(cleanName(name));let candidate=stem+ext,n=2;
 while(used.has(candidate.toLowerCase()))candidate=stem+"-"+n+++ext;
 used.add(candidate.toLowerCase());return candidate;
}
