import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const output=process.env.GUIDE_QA_OUTPUT||'test-results/media-guide';mkdirSync(output,{recursive:true});
const launch={headless:true};if(process.env.GUIDE_BROWSER_PATH)launch.executablePath=process.env.GUIDE_BROWSER_PATH;
const browser=await chromium.launch(launch);
const context=await browser.newContext({deviceScaleFactor:1});
const root=fileURLToPath(new URL('../../',import.meta.url));
await context.route('**/*',async r=>{
 const u=new URL(r.request().url());if(u.hostname!=='127.0.0.1')return r.abort();
 if(!process.env.GUIDE_LOCAL_FILES)return r.continue();
 const path=resolve(root,'.'+decodeURIComponent(u.pathname)+(u.pathname.endsWith('/')?'index.html':''));
 if(!path.startsWith(resolve(root)+sep))return r.abort();
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.json':'application/json'};
 try{return await r.fulfill({status:200,contentType:types[extname(path)]||'application/octet-stream',body:readFileSync(path)});}catch{return r.fulfill({status:404,body:'Not found'});}
});
const page=await context.newPage();const failures=[],results=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));
const langs=['en','fa','de','fr','es','pt','it','ja','zh','hi','ru','ar'];
const route=l=>(l==='en'?'/':`/${l}/`)+'guides/media-kolfat-2-user-guide/';
try{
 for(const lang of langs){
  for(const width of [320,360,375,390,430,1024,1280,1440,1920]){
   await page.setViewportSize({width,height:width<500?844:1080});
   const response=await page.goto('http://127.0.0.1:8765'+route(lang),{waitUntil:'load'});assert.equal(response.status(),200);
   const optional=page.locator('.kf-ga-reject');if(await optional.isVisible())await optional.click();
   const layout=await page.evaluate(()=>{
    const rect=s=>{const r=document.querySelector(s)?.getBoundingClientRect();return r&&{left:r.left,right:r.right,top:r.top,bottom:r.bottom}};
    return {scroll:document.documentElement.scrollWidth,body:document.body.scrollWidth,dir:getComputedStyle(document.documentElement).direction,
     logo:rect('.brand img'),menu:rect('.kolfat-menu > summary'),language:rect('.lang-menu > summary'),heading:rect('h1'),
     chapters:document.querySelectorAll('.guide-chapter').length,steps:document.querySelectorAll('.guide-steps>li').length,
     figures:document.querySelectorAll('figure').length,closedMenus:[...document.querySelectorAll('.kolfat-menu-panel,.lang-list')].every(x=>x.getBoundingClientRect().height===0)};
   });
   assert.ok(layout.scroll<=width+2&&layout.body<=width+2,`${lang}/${width}: horizontal overflow ${JSON.stringify(layout)}`);
   for(const k of ['logo','menu','language','heading'])assert.ok(layout[k]&&layout[k].left>=-2&&layout[k].right<=width+2,`${lang}/${width}: clipped ${k}`);
   assert.ok(layout.logo.right<=layout.menu.left+2,`${lang}/${width}: logo/menu overlap`);
   assert.equal(layout.chapters,12);assert.equal(layout.steps,91);assert.equal(layout.figures,91);assert.ok(layout.closedMenus);
   assert.equal(layout.dir,['fa','ar'].includes(lang)?'rtl':'ltr');
   const menu=page.locator('.kolfat-menu > summary');await menu.click();
   const panel=await page.locator('.kolfat-menu-panel').boundingBox();assert.ok(panel&&panel.x>=-2&&panel.x+panel.width<=width+2);
   await page.keyboard.press('Escape');assert.equal(await page.locator('.kolfat-menu').getAttribute('open'),null);
   assert.equal(await menu.evaluate(x=>x===document.activeElement),true);
   await page.locator('.lang-menu > summary').click();
   const choices=await page.locator('.lang-list a').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')));
   assert.deepEqual(choices,langs.map(route));await page.keyboard.press('Escape');
   if(['en','de','fa','ar'].includes(lang)&&[390,1440].includes(width)){await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${output}/${lang}-${width}-start.png`});}
   results.push({language:lang,width,status:'PASS'});
  }
  await page.setViewportSize({width:390,height:844});
  for(const id of ['copy-06','progress-10','move-07','settings-08','troubleshooting-09']){
   await page.locator('#'+id).scrollIntoViewIfNeeded();
   const box=await page.locator('#'+id).boundingBox();assert.ok(box&&box.x>=-2&&box.x+box.width<=392,`${lang}/${id}: overflow`);
   await page.locator('#'+id+' img').evaluate(async img=>{
    img.loading='eager';
    if(!img.complete)await new Promise((resolve,reject)=>{
     img.addEventListener('load',resolve,{once:true});
     img.addEventListener('error',()=>reject(new Error('Guide image failed to load: '+img.src)),{once:true});
    });
    await img.decode();
   });
   assert.ok(await page.locator('#'+id+' img').evaluate(img=>img.naturalWidth>=1920&&img.naturalHeight>=1080));
  }
  if(['fa','ar'].includes(lang)){
   assert.equal(await page.locator('#troubleshooting-09 bdi').filter({hasText:'{YYYY}'}).innerText(),'{YYYY}\\{YYYY-MM}');
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).map(i=>i.decode().catch(()=>{})));});
   await page.screenshot({path:`${output}/${lang}-390-pattern.png`});
  }
 }
 assert.deepEqual(errors,[]);console.log(`PASS: ${results.length} locale/viewport cases, 60 deep-step image checks, menus, language switching and RTL`);
}catch(e){failures.push(e.stack);console.error(e.stack);process.exitCode=1;await page.screenshot({path:`${output}/failure.png`}).catch(()=>{});}
finally{writeFileSync(`${output}/results.json`,JSON.stringify({browser:browser.version(),cases:results,failures,pageErrors:errors},null,2));await browser.close();}
