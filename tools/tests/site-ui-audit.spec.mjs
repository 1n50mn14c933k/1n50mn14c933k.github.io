import {test,expect} from "@playwright/test";
/* UI-only audit of representative page families in all 12 current languages.
 * Tests geometry and usable navigation, not translation wording or tool behavior. */
const locales=["en","de","fr","es","pt","it","ja","zh","hi","ru","fa","ar"];
const routes=[
 ...locales.map(x=>"/"+x+"/"),
 ...locales.map(x=>"/"+x+"/Media_Kolfat/"),
 ...["/download/","/fa/download/","/ar/download/","/de/download/","/ja/download/","/hi/download/"],
 ...["/about/","/fa/about/","/ar/about/","/guides/","/fa/guides/","/privacy/","/fa/privacy/"],
 ...["/tools/","/tools/photo-file/","/tools/code-data/","/tools/networking/","/tools/security/"],
 ...["/tools/security/password-generator/","/tools/security/sensitive-text-redactor/",
 "/tools/networking/time-zone-converter/","/tools/code-data/json-formatter/","/tools/image-compressor/"]
];
const base="http://127.0.0.1:8765";
for(const route of routes){
 test("UI layout "+route,async({page})=>{
  for(const size of [{width:1440,height:900},{width:390,height:844}]){
   await page.setViewportSize(size);
   await page.goto(base+route,{waitUntil:"load"});
   const info=await page.evaluate(()=>{
    const viewport=window.innerWidth,doc=document.documentElement,heading=document.querySelector("h1"),menu=document.querySelector(".top-nav .kolfat-menu > summary");
    const logo=document.querySelector(".site-logo img,.header .brand img"),header=document.querySelector(".header");
    const rect=x=>x?.getBoundingClientRect();
    const h=rect(heading),l=rect(logo),m=rect(menu),hd=rect(header);
    return {viewport,scrollWidth:doc.scrollWidth,bodyWidth:document.body.scrollWidth,
      heading:heading?.textContent?.trim()||"",h:h&&{left:h.left,right:h.right,width:h.width,top:h.top,bottom:h.bottom},
      logo:l&&{left:l.left,right:l.right,top:l.top},menu:m&&{left:m.left,right:m.right,top:m.top},
      header:hd&&{height:hd.height,left:hd.left,right:hd.right},
      main:!!document.querySelector("main"),font:heading&&getComputedStyle(heading).fontSize
    };
   });
   expect(info.main,route+" missing main").toBe(true);
   expect(info.heading.length,route+" missing heading").toBeGreaterThan(0);
   expect(info.scrollWidth,route+" horizontal overflow at "+size.width).toBeLessThanOrEqual(size.width+5);
   expect(info.bodyWidth,route+" body overflow at "+size.width).toBeLessThanOrEqual(size.width+5);
   if(info.logo){expect(info.logo.left,route+" logo clipped").toBeGreaterThanOrEqual(-2);expect(info.logo.right,route+" logo clipped").toBeLessThan(size.width+2);}
   if(info.menu){expect(info.menu.left,route+" menu clipped").toBeGreaterThanOrEqual(-2);expect(info.menu.right,route+" menu clipped").toBeLessThan(size.width+2);}
   if(info.h){expect(info.h.left,route+" title clipped").toBeGreaterThanOrEqual(-2);expect(info.h.right,route+" title clipped").toBeLessThan(size.width+2);}
  }
 });
}
test("Every tool category is discoverable from compact TOOLS homepage",async({page})=>{
 await page.goto(base+"/tools/");
 const cards=page.locator(".kf-category-card");
 await expect(cards).toHaveCount(4);
 for(const href of ["/tools/photo-file/","/tools/code-data/","/tools/networking/","/tools/security/"])
  await expect(page.locator('.kf-category-card[href="'+href+'"]')).toBeVisible();
});
test("Content pages use consistent full-width branding while maintaining a reading column",async({page})=>{
 for(const route of ["/download/","/fa/download/","/about/","/guides/"]){
  await page.setViewportSize({width:1440,height:900});
  await page.goto(base+route);
  const dims=await page.evaluate(()=>{
   const header=document.querySelector(".header .header-inner")?.getBoundingClientRect();
   const main=document.querySelector("main")?.getBoundingClientRect();
   const logo=document.querySelector(".header .brand img")?.getBoundingClientRect();
   return {header:header&&{left:header.left,right:header.right},main:main&&{left:main.left,right:main.right},logo:logo&&{left:logo.left,right:logo.right}};
  });
  expect(dims.header).not.toBeNull();
  expect(dims.header.left).toBeLessThan(40);
  expect(dims.header.right).toBeGreaterThan(1400);
  expect(dims.main.right-dims.main.left).toBeGreaterThan(900);
  expect(dims.logo.left).toBeLessThan(45);
 }
});
