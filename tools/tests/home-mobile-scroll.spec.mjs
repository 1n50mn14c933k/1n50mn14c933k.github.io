import { test, expect } from "@playwright/test";

// Use a touchscreen context, not only a mouse-wheel check.
test.use({ hasTouch: true });
const base = "http://127.0.0.1:8765";
const locales = ["en","de","fr","es","pt","it","ja","zh","hi","ru","fa","ar"];

for (const lang of locales) {
  test("mobile homepage scrolls by finger and keeps downloads reachable: "+lang,async({page,browserName})=>{
    test.setTimeout(45000);
    for (const size of [{width:390,height:844},{width:320,height:640}]) {
      await page.setViewportSize(size);
      await page.goto(base+"/"+lang+"/",{waitUntil:"load"});
      const state = await page.evaluate(()=>{
        const root=document.documentElement;
        const hero=document.querySelector(".hero");
        const copy=document.querySelector(".hero-copy");
        const footer=document.querySelector("footer.kf-global-footer");
        const styles=getComputedStyle(root);
        return {
          available:root.scrollHeight-innerHeight,
          overflowY:styles.overflowY,
          heroPosition:getComputedStyle(hero).position,
          heroHeight:hero.getBoundingClientRect().height,
          copyPosition:getComputedStyle(copy).position,
          footerPresent:!!footer,
          downloads:document.querySelectorAll(".kf-home-downloads a.kf-download-button").length
        };
      });
      expect(state.downloads,lang+" download links").toBe(2);
      expect(state.footerPresent).toBe(true);
      expect(state.available,lang+" must have scroll range at "+size.width).toBeGreaterThan(70);
      expect(state.overflowY,lang+" must not lock vertical scroll").not.toBe("hidden");
      expect(state.heroPosition).toBe("relative");
      expect(state.copyPosition).toBe("relative");
      await page.evaluate(()=>window.scrollTo(0,160));
      await expect.poll(()=>page.evaluate(()=>window.scrollY),{timeout:3000}).toBeGreaterThan(20);
      await page.evaluate(()=>window.scrollTo(0,0));
      if (browserName==="chromium" && size.width===390 && ["en","fa","ar"].includes(lang)) {
        const cdp=await page.context().newCDPSession(page);
        const x=Math.floor(size.width*0.58);
        await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y:Math.floor(size.height*.78)}]});
        for(const y of [580,530,480,430,380,320]) {
          await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x,y}]});
          await page.waitForTimeout(25);
        }
        await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
        await expect.poll(()=>page.evaluate(()=>window.scrollY),{timeout:3000}).toBeGreaterThan(20);
        await cdp.detach();
      }
      const links=page.locator(".kf-home-downloads a.kf-download-button");
      await links.last().scrollIntoViewIfNeeded();
      await expect(links.last()).toBeVisible();
      const rect=await links.last().boundingBox();
      expect(rect.y,lang+" download visible on "+size.width).toBeGreaterThanOrEqual(-2);
      expect(rect.y+rect.height,lang+" download above bottom controls")
        .toBeLessThanOrEqual(size.height+2);
    }
  });
}
