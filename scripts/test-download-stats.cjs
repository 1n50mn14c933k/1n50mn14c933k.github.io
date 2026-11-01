"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("download-stats/index.html", "utf8");
const match = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(match, "Dashboard inline JavaScript must exist");
const js = match[1];
new vm.Script(js, {filename:"download-stats/index.html"});

assert.ok(!html.includes("Hourly snapshot:"), "Live page must not depend on scheduled workflows");
assert.ok(!html.includes("Health monitor:"), "Live page must not show misleading monitor freshness");
assert.ok(!js.includes("actions/runs"), "Live counters must not require GitHub Actions API");
assert.ok(js.includes("5*60*1000"), "Five-minute refresh required");

const history = {
  schema_version:2,
  last_checked_at_utc:"2026-11-01T18:25:49Z",
  snapshots:[
    {date:"2026-10-27",counts:{windows:12,linux:null,macos:null}},
    {date:"2026-11-01",counts:{windows:31,linux:1,macos:null}}
  ]
};

function runScenario(publishMac) {
  const nodes = new Map();
  const handlers = {};
  let failLive = false;
  function node(id) {
    return {
      id,
      textContent:"",
      className:"",
      children:[],
      style:{},
      setAttribute(){},
      replaceChildren(){this.children.length=0;},
      appendChild(child){this.children.push(child);},
      addEventListener(name,cb){handlers[id+":"+name]=cb;},
      classList:{add(){},remove(){},toggle(){}}
    };
  }
  function element(id) {
    if(!nodes.has(id)) nodes.set(id,node(id));
    return nodes.get(id);
  }
  const document={
    hidden:false,
    getElementById:element,
    createElement:()=>node(null),
    createElementNS:()=>node(null),
    addEventListener(name,cb){handlers["document:"+name]=cb;}
  };
  const window={
    addEventListener(name,cb){handlers["window:"+name]=cb;}
  };
  const mac={id:3,name:"MEDIA_KOLFAT_macOS_Beta_2.4.0_arm64.dmg",download_count:0};
  const releases=[
    {draft:false,tag_name:"v2.0.0",assets:[
      {id:1,name:"MEDIA_KOLFAT_2.0.0_Setup.exe",download_count:32},
      {id:11,name:"MEDIA_KOLFAT_2.0.0_SHA256.txt",download_count:3}
    ]},
    {draft:false,tag_name:"v2.4.0-linux-beta",assets:[
      {id:2,name:"MEDIA_KOLFAT_Linux_Beta_2.4.0_x86_64.AppImage",download_count:1}
    ]},
    {draft:!publishMac,tag_name:"v2.4.0-macos-beta",assets:[mac]}
  ];
  const fetch=async url=>{
    if(url.includes("/releases?")){
      if(failLive) return {ok:false,status:403};
      return {ok:true,json:async()=>releases};
    }
    if(url.includes("download-dashboard-history.json"))
      return {ok:true,json:async()=>history};
    throw Error("Unexpected network dependency "+url);
  };
  vm.runInNewContext(js,{
    document,window,fetch,console,
    setInterval:()=>{},
    Date,Intl,
  },{timeout:4000});
  return {element,handlers,setFail(v){failLive=v;}};
}
async function settle() {
  for(let i=0;i<8;i++)
    await new Promise(resolve=>setImmediate(resolve));
}
(async()=>{
  for(const publishMac of [false,true]){
    const app=runScenario(publishMac);
    await settle();
    assert.equal(app.element("windows-count").textContent,"32");
    assert.equal(app.element("linux-count").textContent,"1");
    assert.equal(app.element("total").textContent,"33");
    assert.equal(app.element("macos-count").textContent,publishMac?"0":"Not released");
    assert.equal(app.element("status").className,"status ok");
    assert.ok(app.element("history-chart").children.length>0, "History chart rendered");
    app.setFail(true);
    app.handlers["refresh:click"]();
    await settle();
    assert.equal(app.element("status").className,"status fail");
    assert.equal(app.element("total").textContent,"Unavailable");
  }
  console.log("PASS: live API, published/draft macOS, checksum exclusion, chart, error behavior.");
})().catch(e=>{console.error(e);process.exitCode=1;});
