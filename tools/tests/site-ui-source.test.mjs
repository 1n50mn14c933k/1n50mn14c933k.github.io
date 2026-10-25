import test from "node:test";
import assert from "node:assert/strict";
import {readdirSync,readFileSync} from "node:fs";
const root=new URL("../../",import.meta.url);
const roots=["en","de","fr","es","pt","it","ja","zh","hi","ru","fa","ar"];
const css=readFileSync(new URL("assets/site-refinements.css",root),"utf8");
const toolsCss=readFileSync(new URL("tools/assets/tools.css",root),"utf8");
test("UI consistency rules cover content, RTL, mobile and tools",()=>{
 for(const term of ["--kf-content-width:1100px","html[dir=\"rtl\"] body main .hero h1","@media(max-width:720px)","html body .header .header-inner"])
  assert.ok(css.includes(term),term);
 assert.ok(toolsCss.includes("UI audit: consistent hierarchy"));
 assert.ok(toolsCss.includes("input:not([type=checkbox])"));
});
test("Homepage and product page templates exist for each of 12 languages",()=>{
 for(const locale of roots){
  for(const path of [locale+"/index.html",locale+"/Media_Kolfat/index.html"]){
   const text=readFileSync(new URL(path,root),"utf8");
   assert.ok(text.includes("<h1"),path+" missing heading");
   assert.ok(text.includes("nav-dropdown.css"),path+" missing navigation");
   assert.ok(text.includes("site-refinements.css"),path+" missing shared styles");
  }
 }
});
