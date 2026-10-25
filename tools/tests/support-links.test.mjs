import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const root=new URL("../../",import.meta.url);
const read=p=>readFileSync(new URL(p,root),"utf8");
test("Ko-fi Sponsor config targets only the user's published account",()=>{
 const funding=read(".github/FUNDING.yml");
 assert.match(funding,/^ko_fi: kolfat_app\s*$/m);
 assert.doesNotMatch(funding,/^github:\s*\S/m);
 assert.doesNotMatch(funding,/https?:\/\/.*\b(?:token|secret|apikey)=/i);
});
test("main TOOLS page contains one unobtrusive Ko-fi footer link",()=>{
 const hub=read("tools/index.html");
 const matches=[...hub.matchAll(/https:\/\/ko-fi\.com\/kolfat_app/g)];
 assert.equal(matches.length,1);
 const footer=hub.slice(hub.indexOf("<footer>"));
 assert.match(footer,/href="https:\/\/ko-fi\.com\/kolfat_app"/);
 assert.match(footer,/rel="noopener noreferrer"/);
 assert.match(footer,/Tip \(optional\)/);
 assert.equal((hub.match(/class="kf-category-card"/g)||[]).length,4);
});
test("support setup is documented with rollback, plus permanent change policy",()=>{
 const readme=read("README.md"),updates=read("docs/WEBSITE_UPDATES.md"),support=read("docs/SUPPORT_FUNDING.md"),policy=read("docs/CHANGE_MANAGEMENT.md"),template=read(".github/PULL_REQUEST_TEMPLATE.md");
 for(const s of [readme,updates,support])assert.ok(s.includes("kolfat_app"));
 for(const s of [updates,support,policy,template])assert.match(s,/rollback|revert|recovery/i);
 assert.match(policy,/EVERY GitHub change/);
 assert.match(template,/WEBSITE_UPDATES\.md/);
});
