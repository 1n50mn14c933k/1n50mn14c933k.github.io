import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const pairs=[
 ["ipv4-subnet-calculator","ipv4"],["ipv6-prefix-calculator","ipv6"],
 ["vlsm-subnet-planner","vlsm"],["ip-range-cidr-converter","range"],
 ["vlan-ip-planner","vlan"],["network-port-reference","ports"],
 ["cron-expression-builder","cron"],["systemd-timer-builder","systemd"],
 ["unix-timestamp-converter","timestamp"],["time-zone-converter","timezone"],
 ["linux-chmod-calculator","chmod"],["docker-compose-checker","compose"]
];
const root=new URL("../",import.meta.url);
const script=readFileSync(new URL("assets/networking-app.mjs",root),"utf8");
test("all 12 Networking pages dispatch to the intended calculator",()=>{
 for(const [slug,id] of pairs){
  const html=readFileSync(new URL("networking/"+slug+"/index.html",root),"utf8");
  assert.match(html,new RegExp('<body\\s+data-network-tool="'+id+'">'),"Missing dispatcher ID: "+slug);
  assert.ok(html.includes('id="run"'),"Missing calculate button: "+slug);
  assert.ok(html.includes('id="output"'),"Missing results: "+slug);
  assert.ok(html.includes('id="status"'),"Missing status: "+slug);
  assert.ok(html.includes('src="/tools/assets/networking-app.mjs?v=1"'),"Missing JS import: "+slug);
  assert.ok(script.includes(id+":"),"Handler missing in networking-app: "+id);
 }
});
test("input-less tools cannot dereference missing source textarea",()=>{
 assert.ok(script.includes('input?.value||""'),"Input must be optional for ports/systemd");
});
