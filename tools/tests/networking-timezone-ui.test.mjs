import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL(path,import.meta.url),"utf8");
const page=read("../networking/time-zone-converter/index.html");
const css=read("../assets/networking.css");
const app=read("../assets/networking-app.mjs");
const zones=["UTC","Europe/Amsterdam","Europe/Vienna","Europe/London","America/New_York",
 "America/Los_Angeles","Asia/Tokyo","Asia/Dubai","Asia/Tehran","Asia/Kolkata","Australia/Sydney"];
test("Time Zone Converter keeps all 11 zone options and five default selections",()=>{
 assert.match(page,/<body data-network-tool="timezone">/);
 assert.match(page,/class="zone-grid"/);
 assert.match(page,/class="zone-picker"/);
 assert.match(page,/href="\/tools\/assets\/networking\.css\?v=2"/);
 const match=[...page.matchAll(/<input type="checkbox" name="zone" value="([^"]+)"( checked)?>/g)];
 assert.deepEqual(match.map(x=>x[1]),zones);
 assert.deepEqual(match.filter(x=>x[2]).map(x=>x[1]),zones.slice(0,5));
 assert.equal((page.match(/class="zone-choice"/g)||[]).length,zones.length);
 assert.equal((page.match(/class="zone-tile"/g)||[]).length,zones.length);
 assert.equal((page.match(/class="zone-indicator"/g)||[]).length,zones.length);
 assert.ok(!page.includes('<div class="kf-controls"><fieldset class="zone-options">'));
});
test("Time zone tiles visibly indicate checked state and keyboard focus",()=>{
 for(const needle of ["input:checked+.zone-tile","input:focus-visible+.zone-tile","@media(max-width:620px)",".zone-picker .zone-grid"])
  assert.ok(css.includes(needle),needle);
 assert.ok(app.includes('input[name="zone"]:checked'),"Selected zones must still reach the converter");
});
