import { test, expect } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const siteRoot = process.cwd();
function htmlPages(dir, found = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".git" || e.name === "node_modules") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) htmlPages(p, found);
    else if (e.isFile() && e.name === "index.html") found.push(p);
  }
  return found;
}

test("all 458 published HTML pages retain original KOLFAT branding contract", () => {
  const pages = htmlPages(siteRoot);
  let checked = 0, redirects = 0, labels = 0;
  const failures = [];
  for (const file of pages) {
    const html = readFileSync(file, "utf8");
    const route = file.slice(siteRoot.length + 1).replace(/\\/g, "/");
    if (!html.includes("/assets/site-refinements.css")) {
      redirects++;
      continue;
    }
    checked++;
    const logo = html.match(/<a\b[^>]*class="(?:site-logo|brand)"[^>]*>[\s\S]*?<\/a>/i);
    if (!logo || !logo[0].includes('/assets/kolfat-logo.webp?v=d2c25ec0')) failures.push(route + ": original wordmark markup missing");
    if (!/\/assets\/nav-dropdown\.js\?v=20261028-brand-(?:uniform1|all-pages2)/.test(html)) failures.push(route + ": shared script reference missing");
    if (!/\/assets\/nav-dropdown\.css\?v=20261028-brand-(?:uniform1|all-pages2)/.test(html)) failures.push(route + ": shared stylesheet reference missing");
    if (/(^|\/)support\/index\.html$/.test(route) && /<p class="eyebrow">\s*Kolfat\.app\s*<\/p>/i.test(html)) { failures.push(route + ": unwanted orange label"); labels++; }
  }
  expect({ pages: pages.length, checked, redirects }).toEqual({ pages: 462, checked: 458, redirects: 4 });
  expect(failures, failures.slice(0, 30).join("\n")).toEqual([]);
  expect(labels).toBe(0);
});

const languages = ["en","fa","ar","de","fr","es","pt","it","ja","zh","hi","ru"];
const routeFor = (lang, suffix) => {
  if (lang === "en") {
    if (suffix === "home") return "/en/";
    if (suffix === "product") return "/en/Media_Kolfat/";
    return "/" + suffix + "/";
  }
  if (suffix === "home") return "/" + lang + "/";
  if (suffix === "product") return "/" + lang + "/Media_Kolfat/";
  return "/" + lang + "/" + suffix + "/";
};
for (const lang of languages) {
  test("logo placement and identical sizing across "+lang+" page families", async ({ page }) => {
    for (const width of [1440,390]) {
      await page.setViewportSize({ width, height: 900 });
      const measures = [];
      for (const section of ["home","product","download","support","guides"]) {
        const route = routeFor(lang,section);
        await page.goto("http://127.0.0.1:8765"+route, { waitUntil: "load" });
        const brand = page.locator(".site-logo, .header .header-inner > .brand").first();
        const word = brand.locator('img[src="/assets/kolfat-logo.webp?v=d2c25ec0"]');
        const maid = brand.locator("img.kf-header-maid");
        await expect(word).toBeVisible();
        await expect(maid).toBeVisible();
        expect(await maid.evaluate(i => i.complete && i.naturalWidth > 0),route+" image failed").toBe(true);
        const rectA = await maid.boundingBox(), rectB = await word.boundingBox();
        expect(rectA,route).not.toBeNull(); expect(rectB,route).not.toBeNull();
        expect(rectA.x + rectA.width,route+" maid must be left of wordmark").toBeLessThanOrEqual(rectB.x+2);
        const direction = await brand.evaluate(e => getComputedStyle(e).direction);
        expect(direction,route+" must preserve left-right logo sequence").toBe("ltr");
        measures.push([Math.round(rectA.width),Math.round(rectA.height),Math.round(rectB.width)]);
        if (section==="support") await expect(page.locator("main p.eyebrow")).toHaveCount(0);
      }
      expect(new Set(measures.map(a => a.join(","))).size,lang+" "+width+" logo size must match across 5 families").toBe(1);
      expect(measures[0],lang+" "+width).toEqual(width>640?[41,48,154]:[30,36,120]);
    }
  });
}
// The four translated Tools families and full guide articles also use the shared header.
test("translated Tools and article templates match header branding", async ({page}) => {
  for (const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    for (const route of ["/tools/","/tools/code-data/","/tools/networking/","/tools/security/","/de/tools/","/fa/tools/","/fr/tools/","/es/tools/","/guides/organize-photos-by-date/","/fa/guides/organize-photos-by-date/","/de/guides/organize-photos-by-date/","/ar/guides/organize-photos-by-date/","/support/getting-started/"]) {
      await page.goto("http://127.0.0.1:8765"+route,{waitUntil:"load"});
      const brand = page.locator(".site-logo, .header .header-inner > .brand").first();
      const word = brand.locator('img[src="/assets/kolfat-logo.webp?v=d2c25ec0"]');
      const maid = brand.locator("img.kf-header-maid");
      await expect(word).toBeVisible();
      await expect(maid).toBeVisible();
      const a=await maid.boundingBox(),b=await word.boundingBox();
      expect(a,route).not.toBeNull();expect(b,route).not.toBeNull();
      expect(a.x+a.width,route).toBeLessThanOrEqual(b.x+2);
      expect(Math.round(a.width),route).toBe(width>640?41:30);
      expect(Math.round(b.width),route).toBe(width>640?154:120);
    }
  }
});
