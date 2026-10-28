import {test,expect} from "@playwright/test";
const routes=["/en/","/fa/","/de/","/ar/","/ja/","/en/Media_Kolfat/","/fa/Media_Kolfat/","/download/","/fa/download/","/about/","/guides/","/tools/","/tools/photo-file/","/tools/security/password-generator/","/tools/networking/time-zone-converter/","/tools/code-data/json-formatter/"];
const base="http://127.0.0.1:8765";
for (const route of routes) {
 test("global maid Ko-fi CTA is responsive: "+route,async({page})=>{
  for (const width of [1440,390,320]) {
   await page.setViewportSize({width,height:width===1440?900:760});
   await page.goto(base+route,{waitUntil:"load"});
   const desktop=page.locator(".top-nav > a.kolfat-support-link");
   const mobile=page.locator(".top-nav > button.kolfat-support-mobile-toggle");
   const panel=page.locator(".top-nav > .kolfat-support-mobile-panel");
   await expect(desktop).toHaveCount(1);
   await expect(mobile).toHaveCount(1);
   await expect(desktop).toHaveAttribute("href","https://ko-fi.com/kolfat_app");
   await expect(desktop).toHaveAttribute("target","_blank");
   await expect(desktop).toHaveAttribute("rel","noopener noreferrer");
   await expect(desktop).toHaveAttribute("aria-label",/🧹🪣❤️/);
   await expect(desktop).toHaveAttribute("title",/🧹🪣❤️/);
   const control=width>900?desktop:mobile;
   await expect(control).toBeVisible();
   await expect(width>900?mobile:desktop).toBeHidden();
   const geometry=await control.evaluate(el=>{
    const a=el.getBoundingClientRect(),b=document.querySelector(".top-nav .kolfat-menu summary")?.getBoundingClientRect();
    return {left:a.left,right:a.right,top:a.top,menuTop:b?.top??-100,menuLeft:b?.left??0,docWidth:document.documentElement.scrollWidth};
   });
   expect(geometry.left).toBeGreaterThanOrEqual(-2);
   expect(geometry.right).toBeLessThanOrEqual(width+2);
   expect(Math.abs(geometry.top-geometry.menuTop)).toBeLessThanOrEqual(8);
   expect(geometry.right).toBeLessThanOrEqual(geometry.menuLeft+3);
   expect(geometry.docWidth).toBeLessThanOrEqual(width+5);
   if (width<=900) {
    await expect(mobile).toHaveText("🧹🪣❤️");
    await expect(mobile).toHaveAttribute("aria-expanded","false");
    await expect(panel).toBeHidden();
    await mobile.click();
    await expect(mobile).toHaveAttribute("aria-expanded","true");
    await expect(panel).toBeVisible();
    const donate=panel.locator("a.kolfat-support-mobile-donate");
    await expect(donate).toHaveAttribute("href","https://ko-fi.com/kolfat_app");
    await expect(donate).toHaveAttribute("rel","noopener noreferrer");
    await expect(donate).toContainText("🧹🪣❤️");
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(mobile).toHaveAttribute("aria-expanded","false");
   }
  }
 });
}
