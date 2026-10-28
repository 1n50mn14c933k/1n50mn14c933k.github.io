import {test,expect} from "@playwright/test";const routes=["/en/","/fa/","/ar/","/en/Media_Kolfat/","/download/","/fa/download/","/tools/","/tools/security/password-generator/"];for(const route of routes){test("consistent menu icons and footer "+route,async({page})=>{for(const width of [1440,390]){await page.setViewportSize({width,height:900});await page.goto("http://127.0.0.1:8765"+route);await expect(page.locator("footer.kf-global-footer")).toHaveCount(1);await expect(page.locator(".kf-footer-links a")).toHaveCount(5);await expect(page.locator(".kf-footer-links")).not.toContainText("YouTube");await expect(page.locator(".kf-footer-links")).not.toContainText("TikTok");await expect(page.locator(".kf-footer-links")).not.toContainText("X");const all=await page.locator(".kf-footer-links a").evaluateAll(items=>items.map(a=>a.getAttribute("href")));expect(all[4]).toBe("mailto:contact@kolfat.app");await page.locator(".kolfat-menu > summary").click();const menu=page.locator(".kolfat-menu-panel");await expect(menu.locator("a")).not.toHaveCount(0);expect(await menu.locator("a").count()).toBeGreaterThanOrEqual(12);const dims=await page.evaluate(()=>({w:document.documentElement.scrollWidth,footer:document.querySelector(".kf-global-footer").getBoundingClientRect().toJSON()}));expect(dims.w).toBeLessThanOrEqual(width+5);expect(dims.footer.left).toBeGreaterThanOrEqual(-2);expect(dims.footer.right).toBeLessThanOrEqual(width+2);}});}
/* Verify the original header wordmark remains untouched and the mascot is rendered. */
for (const route of ["/en/","/fa/","/de/Media_Kolfat/","/tools/","/guides/"]) {
  test("KOLFAT wordmark and crossed-arms maid visible "+route, async ({page}) => {
    await page.goto("http://127.0.0.1:8765"+route, {waitUntil:"load"});
    const brand=page.locator(".site-logo, .header .header-inner > .brand").first();
    const wordmark=brand.locator('img[src*="/assets/kolfat-logo.webp"]');
    const maid=brand.locator("img.kf-header-maid");
    await expect(wordmark).toHaveCount(1);
    await expect(maid).toHaveCount(1);
    await expect(maid).toBeVisible();
    expect(await maid.evaluate(img=>img.complete&&img.naturalWidth>0&&img.naturalHeight>0)).toBe(true);
    expect(await maid.evaluate(img=>img.getAttribute("src"))).toContain("/assets/kolfat-maid-header.webp");
    const a=await maid.boundingBox(),b=await wordmark.boundingBox();
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(a.x+a.width).toBeLessThanOrEqual(b.x+3);
    expect(await wordmark.getAttribute("src")).toContain("/assets/kolfat-logo.webp?v=d2c25ec0");
  });
}

/* Regression: consistent brand dimensions without changing artwork or support headings. */
test("KOLFAT header stays uniform across pages",async({page})=>{
 for(const width of [1440,390,350]){
  await page.setViewportSize({width,height:900});
  const sizes=[];
  for(const route of ["/en/","/download/","/support/","/de/support/","/tools/"]){
   await page.goto("http://127.0.0.1:8765"+route);
   const brand=page.locator(".site-logo,.header .header-inner > .brand").first();
   const word=brand.locator('img[src*="kolfat-logo.webp"]');
   const maid=brand.locator("img.kf-header-maid");
   await expect(word).toBeVisible();await expect(maid).toBeVisible();
   const a=await word.boundingBox(),b=await maid.boundingBox();
   expect(a).not.toBeNull();expect(b).not.toBeNull();
   sizes.push([Math.round(a.width),Math.round(b.width),Math.round(b.height)]);
   if(route.includes("/support/"))await expect(page.locator("main .eyebrow")).toHaveCount(0);
  }
  expect(new Set(sizes.map(x=>x.join(","))).size).toBe(1);
  expect(sizes[0][0]).toBe(width>640?154:width>360?120:100);
 }
});
