import {test,expect} from "@playwright/test";
const routes=["/en/","/fa/","/de/","/ar/","/ja/","/en/Media_Kolfat/","/fa/Media_Kolfat/","/download/","/fa/download/","/about/","/guides/","/tools/","/tools/photo-file/","/tools/security/password-generator/","/tools/networking/time-zone-converter/","/tools/code-data/json-formatter/"];
const base="http://127.0.0.1:8765";
for(const route of routes){
 test("global support header visibly aligned: "+route,async({page})=>{
  for(const width of [1440,390,320]){
   await page.setViewportSize({width,height:width===1440?900:760});
   await page.goto(base+route,{waitUntil:"load"});
   const support=page.locator(".top-nav > .kolfat-support-link");
   await expect(support).toHaveCount(1);
   await expect(support).toBeVisible();
   await expect(support).toHaveAttribute("href","https://ko-fi.com/kolfat_app");
   await expect(support).toHaveAttribute("target","_blank");
   await expect(support).toHaveAttribute("rel","noopener noreferrer");
   await expect(support).toHaveAttribute("aria-label",/Support KOLFAT/);
   const geometry=await support.evaluate(el=>{
    const a=el.getBoundingClientRect(),b=document.querySelector(".top-nav .kolfat-menu summary")?.getBoundingClientRect();
    const text=el.querySelector(".kolfat-support-text");
    return {left:a.left,right:a.right,top:a.top,height:a.height,menuTop:b?.top??-100,menuLeft:b?.left??0,fullLabel:getComputedStyle(text).display!=="none",navFirst:el===el.parentElement.firstElementChild,docWidth:document.documentElement.scrollWidth};
   });
   expect(geometry.navFirst).toBe(true);
   expect(geometry.left).toBeGreaterThanOrEqual(-2);
   expect(geometry.right).toBeLessThanOrEqual(width+2);
   expect(Math.abs(geometry.top-geometry.menuTop)).toBeLessThanOrEqual(8);
   expect(geometry.right).toBeLessThanOrEqual(geometry.menuLeft+3);
   expect(geometry.fullLabel).toBe(width>640);
   expect(geometry.docWidth).toBeLessThanOrEqual(width+5);
  }
 });
}
