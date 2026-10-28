import { test, expect } from "@playwright/test";

/* Regression for the visual overlap visible on Privacy, Terms and Disclaimer.
 * Check actual rendered geometry, not only image/title existence or viewport overflow.
 * Covers all translated versions and both desktop and mobile widths.
 */
const languages = ["en", "de", "fr", "es", "pt", "it", "ja", "zh", "hi", "ru", "fa", "ar"];
const families = ["privacy", "terms", "disclaimer", "licenses", "support"];
const base = "http://127.0.0.1:8765";
const routeOf = (lang, family) => (lang === "en" ? "/" : "/" + lang + "/") + family + "/";

for (const family of families) {
  test("fixed header does not cover the " + family + " title in any language", async ({page}) => {
    test.setTimeout(120000);
    for (const lang of languages) {
      for (const width of [1144, 390]) {
        await page.setViewportSize({width, height: 900});
        const route = routeOf(lang, family);
        await page.goto(base + route, {waitUntil: "load"});
        const bounds = await page.evaluate(() => {
          const h1 = document.querySelector("main h1");
          const logo = document.querySelector("body > a.site-logo, body > a.guide-site-logo");
          const line = document.querySelector(".kf-global-top-rule");
          const sticky = document.querySelector("body > .header");
          const nav = document.querySelector(".top-nav");
          const rect = el => el?.getBoundingClientRect();
          const h = rect(h1), l = rect(logo), divider = rect(line), st = rect(sticky), n = rect(nav);
          return {
            titleTop: h?.top ?? null, titleBottom: h?.bottom ?? null,
            topbarBottom: Math.max(l?.bottom ?? 0, divider?.bottom ?? 0, st?.bottom ?? 0, n?.bottom ?? 0),
            horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
            h1: h1?.textContent?.trim() ?? "",
            logoPresent: !!logo || !!sticky
          };
        });
        expect(bounds.h1.length, route + " missing title").toBeGreaterThan(0);
        expect(bounds.logoPresent, route + " missing header").toBe(true);
        expect(bounds.titleTop, route + " must clear fixed header with 24px gap at " + width)
          .toBeGreaterThanOrEqual(bounds.topbarBottom + 24);
        expect(bounds.horizontalOverflow, route + " horizontal overflow").toBeLessThanOrEqual(5);
      }
    }
  });
}

test("homepage, product, Tools and sticky pages keep their existing layouts", async({page})=>{
  test.setTimeout(60000);
  for (const route of ["/en/","/fa/","/en/Media_Kolfat/","/download/","/tools/","/tools/security/password-generator/","/guides/"]) {
    for (const width of [1144,390]) {
      await page.setViewportSize({width,height:900});
      await page.goto(base+route,{waitUntil:"load"});
      const info=await page.evaluate(()=>{
        const title=document.querySelector("main h1")?.getBoundingClientRect();
        const logo=document.querySelector(".site-logo,.guide-site-logo,.header")?.getBoundingClientRect();
        return { title:!!title,logo:!!logo,overflow:document.documentElement.scrollWidth-innerWidth };
      });
      expect(info.title,route).toBe(true);
      expect(info.logo,route).toBe(true);
      expect(info.overflow,route).toBeLessThanOrEqual(5);
    }
  }
});
