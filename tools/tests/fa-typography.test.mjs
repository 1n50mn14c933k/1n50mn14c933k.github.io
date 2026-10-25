import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const root=new URL("../../",import.meta.url);
const page=readFileSync(new URL("fa/index.html",root),"utf8");
const css=readFileSync(new URL("assets/fa-hero-typography.css",root),"utf8");
test("Persian homepage uses English-equivalent sizes without shrinking its second line",()=>{
 assert.match(page,/lang="fa" dir="rtl"/);
 assert.match(page,/class="fa-hero-title"/);
 assert.match(page,/class="fa-title-line fa-title-line--long"/);
 assert.match(page,/assets\/fa-hero-typography\.css\?v=20261025-fa2/);
 assert.match(css,/font-size:clamp\(60px,4\.75vw,92px\)!important/);
 assert.match(css,/font-size:clamp\(58px,4\.1vw,80px\)!important/);
 assert.match(css,/font-size:clamp\(2\.7rem,12vw,4\.5rem\)!important/);
 assert.match(css,/white-space:nowrap/);
 assert.match(css,/\.fa-title-line\{[\s\S]*?font-size:inherit/);
 assert.doesNotMatch(css,/\.fa-title-line--long\s*\{/);
});
