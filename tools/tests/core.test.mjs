import test from "node:test";
import assert from "node:assert/strict";
import {csv,filenameDate,exifDate,makeZip,cleanName,uniqueName,crc32,inspectJpegExif} from "../assets/core.mjs";
test("CSV escapes malicious spreadsheet cells",()=>{
 for(const payload of ["=1+1","+SUM(1,2)","-42","@SUM(A1)","  =HYPERLINK(1)"]){
  assert.ok(csv([[payload]]).includes("'"+payload.replace(/^  /,"  ")),"not neutralized: "+payload);
 }
 assert.match(csv([['a,"b"']]),/""b""/);
});
test("date parsing validates actual calendar dates",()=>{
 assert.equal(filenameDate("IMG_2024-02-29.jpg"),"2024-02-29");
 assert.equal(filenameDate("IMG_2023-02-29.jpg"),"");
 assert.equal(exifDate("2024:02:29 20:12:14"),"2024-02-29");
 assert.equal(exifDate("2023:02:29 20:12:14"),"");
});
test("safe and collision-free names",()=>{
 const used=new Set();
 assert.equal(cleanName("../../file?.jpg"),"file_.jpg");
 assert.equal(uniqueName("x.jpg",used),"x.jpg");
 assert.equal(uniqueName("x.JPG",used),"x-2.jpg");
});
test("ZIP archive has valid headers and matches input",async()=>{
 const bytes=new TextEncoder().encode("KOLFAT");
 const zip=new Uint8Array(await makeZip([{name:"test.txt",data:bytes}]).arrayBuffer());
 const dv=new DataView(zip.buffer);
 assert.equal(dv.getUint32(0,true),0x04034b50);
 assert.equal(dv.getUint32(14,true),crc32(bytes));
 assert.equal(dv.getUint32(18,true),bytes.length);
 const central=zip.findIndex((_,i)=>i>=30&&dv.getUint32(i,true)===0x02014b50);
 assert.ok(central>0,"central ZIP header");
 assert.equal(dv.getUint32(central+16,true),crc32(bytes));
 assert.equal(dv.getUint32(central+20,true),bytes.length);
 assert.equal(zip.slice(-22,-18).join(","),"80,75,5,6");
});
test("invalid EXIF input is handled",()=>{
 const bytes=new Uint8Array([0,1,2,3]).buffer;
 assert.equal(inspectJpegExif(bytes).hasExif,false);
});
