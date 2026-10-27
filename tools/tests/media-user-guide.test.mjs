import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const locales=['en','fa','de','fr','es','pt','it','ja','zh','hi','ru','ar'];
const route=l=>(l==='en'?'/':`/${l}/`)+'guides/media-kolfat-2-user-guide/';
const tag=l=>l==='zh'?'zh-CN':l;
const source=l=>JSON.parse(read(`content/media-kolfat-2-guide/${l}.json`));
const manifest=JSON.parse(read('assets/media-kolfat-2-guide/manifest.json'));
const en=source('en'),baseline=en.chapters.flatMap(c=>c.steps);

test('87 original full-HD PNGs match reviewed manifest and hashes',()=>{
 assert.equal(manifest.imageCount,87);assert.equal(manifest.illustratedSteps,91);
 const files=readdirSync(new URL('assets/media-kolfat-2-guide/screenshots/',root));
 assert.equal(files.length,87);
 for(const s of manifest.screenshots){
  assert.equal(s.visualVerification,'PASS');assert.equal(s.binaryVerification,'PASS');
  assert.equal(s.originalPng,true);assert.equal(s.upscaled,false);assert.equal(s.jpegDerived,false);
  const bytes=readFileSync(new URL('assets/media-kolfat-2-guide/screenshots/'+s.file,root));
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(bytes.readUInt32BE(16),s.width);assert.equal(bytes.readUInt32BE(20),s.height);
  assert.ok(s.width>=1920&&s.height>=1080);assert.equal(bytes.length,s.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex').toUpperCase(),s.sha256);
 }
});
for(const lang of locales)test(`complete localized guide, SEO, navigation and links: ${lang}`,()=>{
 const data=source(lang),page=read(route(lang).slice(1)+'index.html');
 assert.equal(data.language,lang);assert.equal(data.chapters.length,12);
 const steps=data.chapters.flatMap(c=>c.steps);assert.equal(steps.length,91);
 assert.deepEqual(steps.map(s=>[s.id,s.image]),baseline.map(s=>[s.id,s.image]));
 assert.equal(new Set(steps.map(s=>s.image)).size,87);
 assert.equal((page.match(/<figure>/g)||[]).length,91);
 assert.equal((page.match(/<h1>/g)||[]).length,1);
 assert.ok(page.includes(`<html lang="${tag(lang)}"`));
 if(['fa','ar'].includes(lang)){assert.match(page,/<html[^>]*dir="rtl"/);assert.match(page,/<bdi dir="ltr">/);}
 const canonical='https://kolfat.app'+route(lang);
 assert.ok(page.includes(`<link rel="canonical" href="${canonical}">`));
 assert.equal((page.match(/hreflang=/g)||[]).length,13);
 for(const l of locales)assert.ok(page.includes(`hreflang="${tag(l)}" href="https://kolfat.app${route(l)}"`));
 assert.ok(page.includes(`hreflang="x-default" href="https://kolfat.app${route('en')}"`));
 const schema=JSON.parse(page.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.equal(schema['@graph'][0].inLanguage,tag(lang));assert.equal(schema['@graph'][0].mainEntityOfPage,canonical);
 assert.ok(read('sitemap.xml').includes('<loc>'+canonical+'</loc>'));
 const hub=read((lang==='en'?'':lang+'/')+'guides/index.html');
 assert.ok(hub.includes(`href="${route(lang)}"`));assert.match(hub,/id="media-kolfat-complete-guide"/);
 if(lang==='en')assert.ok(hub.includes('MEDIA KOLFAT 2.0 Complete User Guide'));
 for(const chapter of data.chapters){
  assert.equal(chapter.tips.length,en.chapters.find(c=>c.id===chapter.id).tips.length);
  for(const key of ['title','intro','outcome']){assert.ok(chapter[key]);if(lang!=='en')assert.notEqual(chapter[key],en.chapters.find(c=>c.id===chapter.id)[key]);}
 }
 for(const [i,s] of steps.entries()){
  assert.ok(page.includes(`id="${s.id}"`));assert.ok(s.text&&s.caption);
  if(lang!=='en'){assert.notEqual(s.text,baseline[i].text);assert.notEqual(s.caption,baseline[i].caption);}
 }
 const ids=new Set([...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
 for(const m of page.matchAll(/(?:href|src)="([^"?#]+)(?:\?[^"#]*)?(?:#([^"]*))?"/g)){
  const [_,url]=m;if(!url.startsWith('/'))continue;
  assert.ok(existsSync(new URL(url.slice(1)+(url.endsWith('/')?'index.html':''),root)),url);
 }
 for(const m of page.matchAll(/href="#([^"]+)"/g))assert.ok(ids.has(m[1]),m[1]);
 assert.doesNotMatch(page,/C:\\Users\\|demo\\profile|data_directory|\.sqlite3/i);
});
