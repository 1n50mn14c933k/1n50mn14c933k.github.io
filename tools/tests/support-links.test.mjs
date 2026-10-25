import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
const root=new URL("../../",import.meta.url);
const read=p=>readFileSync(new URL(p,root),"utf8");
const destination="https://ko-fi.com/kolfat_app";
function walk(url){
 return readdirSync(url,{withFileTypes:true}).flatMap(e=>{
  if([".git","node_modules"].includes(e.name))return [];
  const u=new URL(e.name+(e.isDirectory()?"/":""),url);
  return e.isDirectory()?walk(u):e.name==="index.html"?[u]:[];
 });
}
test("one shared header support initializer and safe Ko-fi destination",()=>{
 const js=read("assets/nav-dropdown.js"),css=read("assets/nav-dropdown.css");
 assert.match(js,/querySelector\("\.top-nav"\)/);
 assert.match(js,/kolfat-support-link/);
 assert.match(js,/insertBefore\(link, nav.firstElementChild\)/);
 assert.match(js,/link\.href = "https:\/\/ko-fi\.com\/kolfat_app"/);
 assert.match(js,/link\.rel = "noopener noreferrer"/);
 assert.match(js,/link\.setAttribute\("aria-label",/);
 assert.match(css,/\.top-nav > a\.kolfat-support-link/);
 assert.match(css,/@media\(max-width:640px\)/);
 assert.match(css,/focus-visible/);
});
test("every visible website HTML page includes shared nav code and MENU control",()=>{
 const pages=walk(root),issues=[];let checked=0;
 for(const file of pages){
  const src=readFileSync(file,"utf8"),name=file.href.replace(root.href,"");
  if(!src.includes("class=\"top-nav\"")){
   if(src.includes("http-equiv=\"refresh\"")||src.includes("http-equiv='refresh'"))continue;
   issues.push(name+" missing header nav");continue;
  }
  checked++;
  if(!src.includes("/assets/nav-dropdown.js"))issues.push(name+" missing header initializer");
  if(!src.includes("/assets/nav-dropdown.css"))issues.push(name+" missing nav stylesheet");
 }
 assert.ok(pages.length>=230,"Unexpected missing website HTML pages");
 assert.ok(checked>=230,"Most published pages must have a header");
 assert.deepEqual(issues,[],"All non-redirect pages need the global header");
});
test("only header Ko-fi CTA, not a duplicate footer-only TOOLS link",()=>{
 const hub=read("tools/index.html");
 assert.doesNotMatch(hub,/href="https:\/\/ko-fi\.com\/kolfat_app"/);
 assert.equal((hub.match(/class="kf-category-card"/g)||[]).length,4);
 const readme=read("README.md"),updates=read("docs/WEBSITE_UPDATES.md"),support=read("docs/SUPPORT_FUNDING.md");
 for(const s of [readme,updates,support])assert.ok(s.includes("kolfat_app"));
 for(const s of [updates,support])assert.match(s,/rollback|revert/i);
});
