import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const locales = ["en","de","es","fa","ar","fr","it","pt","hi","ja","ru","zh"];
const slugs = [
  "organize-photos-by-date", "organize-large-photo-library",
  "find-duplicate-photos-safely", "organize-photos-from-phone-and-usb",
  "photo-organizer-for-windows", "copy-vs-move-safely",
  "photos-without-capture-dates", "recover-interrupted-organization",
  "understand-activity-reports"
];
const prefix = lang => lang === "en" ? "" : lang + "/";
const route = (lang, slug = "") => "/" + prefix(lang) + "guides/" + (slug ? slug + "/" : "");
const file = (lang, slug = "") => join(process.cwd(), prefix(lang) + "guides/" + (slug ? slug + "/" : "") + "index.html");

test("all 12 guide hubs and 108 practical articles use one consistent visual loader", () => {
  for (const lang of locales) {
    const hub = readFileSync(file(lang), "utf8");
    expect((hub.match(/<article class="card"/g) || []).length, lang).toBe(10);
    for (const slug of ["", ...slugs]) {
      const content = readFileSync(file(lang, slug), "utf8");
      expect(content, lang + "/" + slug).toContain('/assets/guides-loader.js?v=20261101-parity1');
      expect(content, lang + "/" + slug).toContain('/assets/nav-dropdown.js?v=20261101-guides-parity1');
      expect(content, lang + "/" + slug).not.toContain('guides-visual.css?v=20261101-refresh3');
      expect((content.match(/guides-loader\.js\?v=20261101-parity1/g)||[]).length, lang + "/" + slug).toBe(1);
      if (lang === "fa" || lang === "ar") expect(content).toMatch(/<html[^>]*dir="rtl"/);
      if (slug === "recover-interrupted-organization" || slug === "understand-activity-reports") {
        if (lang !== "en") expect(content).toContain("/assets/localized-content.css");
      }
    }
  }
});

test("localized guide UI renders same visuals without English-only workflow labels", async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  const failures = [];
  for (const lang of locales) {
    await page.goto("http://127.0.0.1:8765" + route(lang), {waitUntil:"load"});
    await expect(page.locator(".kf-guide-card")).toHaveCount(10);
    await expect(page.locator(".kf-guides-section-head")).toBeVisible();
    await page.goto("http://127.0.0.1:8765" + route(lang, "understand-activity-reports"), {waitUntil:"load"});
    await expect(page.locator(".kf-guide-example-card")).toHaveCount(3);
    await expect(page.locator(".kf-guide-roadmap")).toBeVisible();
    await expect(page.locator(".kf-guide-checklist")).toBeVisible();
    await expect(page.locator(".kf-guide-workflow-visual")).toBeVisible();
    const details = await page.evaluate(() => ({
      dir: getComputedStyle(document.documentElement).direction,
      labels: [...document.querySelectorAll(".kf-workflow-node strong")].map(e => e.textContent.trim()),
      grid: getComputedStyle(document.querySelector(".kf-guide-example-grid")).display,
    }));
    expect(details.dir, lang).toBe(["fa","ar"].includes(lang) ? "rtl" : "ltr");
    expect(details.grid, lang).toBe("grid");
    expect(details.labels, lang).toHaveLength(3);
    if(lang !== "en") expect(details.labels, lang).not.toContain("Read report");
  }
  expect(failures).toHaveLength(0);
});
