import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const read = p => readFileSync(new URL("../"+p, import.meta.url),"utf8");
const hub = read("index.html");
const photo = read("photo-file/index.html");
const code = read("code-data/index.html");
const count = (text,regex)=>(text.match(regex)||[]).length;
test("TOOL homepage is a compact category overview, not a wall of individual cards",()=>{
 assert.equal(count(hub,/class="kf-category-card"/g),2);
 assert.equal(count(hub,/class="tool-card"/g),0);
 assert.ok(hub.includes('href="/tools/photo-file/"'));
 assert.ok(hub.includes('href="/tools/code-data/"'));
 assert.ok(hub.includes("tools-categories.css?v=1"));
 assert.ok(hub.includes("Explore MEDIA KOLFAT"));
});
test("each category retains the existing 12 tool cards and routes",()=>{
 assert.equal(count(photo,/class="tool-card"/g),12);
 assert.equal(count(code,/class="tool-card"/g),12);
 const links=[...photo.matchAll(/class="tool-card" href="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(links).size,12);
 for(const link of links){
  const local=new URL("../"+link.replace(/^\/tools\//,"")+"index.html",import.meta.url);
  assert.ok(existsSync(local), "Missing tool page: "+link);
 }
 assert.ok(photo.includes("Explore MEDIA KOLFAT"));
 assert.ok(code.includes('href="/tools/photo-file/"'));
});
test("navigation keeps category pages indexed and original marketing available",()=>{
 const sitemap=read("../sitemap.xml");
 const categories=["https://kolfat.app/tools/photo-file/","https://kolfat.app/tools/code-data/"];
 for(const url of categories)assert.ok(sitemap.includes("<loc>"+url+"</loc>"),url);
 const all=read("index.html");
 assert.ok(all.includes("kolfat-logo.webp"));
 assert.ok(all.includes('href="/en/Media_Kolfat/"'));
});
