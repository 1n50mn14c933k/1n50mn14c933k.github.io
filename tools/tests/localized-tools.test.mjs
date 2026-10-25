import test from "node:test";import assert from "node:assert/strict";import {readFileSync,existsSync} from "node:fs";import {toolIds,localePacks,categoryIds} from "../assets/i18n-data.mjs";
test("all generated localized tool URLs have files and localized metadata",()=>{
assert.equal(Object.keys(localePacks).length,11);
for(const [lang,pack] of Object.entries(localePacks)){
assert.equal(pack.names.length,48);
for(let i=0;i<toolIds.length;i++){
const slug=toolIds[i],path=i<12?lang+"/tools/"+slug+"/index.html":lang+"/tools/"+categoryIds[Math.floor(i/12)]+"/"+slug+"/index.html";
const file=new URL("../../"+path,import.meta.url);
assert.ok(existsSync(file),path);
const html=readFileSync(file,"utf8");
assert.ok(html.includes('lang="'+lang+'"'),path);
assert.ok(html.includes('src="/tools/assets/i18n.mjs'),path);
}
}
});
test("528 tool-specific safety notices in 11 language packs",async()=>{
 for(const lang of Object.keys(localePacks)){
  const pack=await import("../assets/i18n-safety-"+lang+".mjs");
  assert.equal(pack.safetySummaries.length,48,lang);
  assert.ok(pack.safetySummaries.every(text=>text.length>70),lang);
  const compact=pack.safetySummaries.join("\n");
  assert.ok(compact.includes("SHA-256"),lang);
  assert.ok(compact.includes("JWT"),lang);
  assert.ok(compact.includes("UTF-8"),lang);
 }
});