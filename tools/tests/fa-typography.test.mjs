import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const root=new URL("../../",import.meta.url);
const page=readFileSync(new URL("fa/index.html",root),"utf8");
const css=readFileSync(new URL("assets/fa-hero-typography.css",root),"utf8");
test("Persian home headline uses script-aware two-line treatment",()=>{
 assert.match(page,/lang="fa" dir="rtl"/);
 assert.match(page,/class="fa-hero-title"/);
 assert.match(page,/class="fa-title-line fa-title-line--long"/);
 assert.match(page,/assets\/fa-hero-typography\.css\?v=20261025-fa1/);
 assert.match(css,/line-height:1\.34!important/);
 assert.match(css,/font-weight:500!important/);
 assert.match(css,/white-space:nowrap/);
 assert.match(css,/@media\(max-width:640px\)/);
});
