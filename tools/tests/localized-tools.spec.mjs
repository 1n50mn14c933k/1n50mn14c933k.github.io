import {test,expect} from "@playwright/test";
const langs=["de","fr","es","pt","it","ru","zh","ja","hi","fa","ar"];
for(const lang of langs){
test("locale links "+lang,async({page})=>{
await page.setViewportSize({width:390,height:844});
await page.goto("http://127.0.0.1:8765/"+lang+"/tools/");
await expect(page.locator(".kf-category-card")).toHaveCount(4);
await expect(page.locator(".kf-tools-language .lang-list a")).toHaveCount(12);
if(["fa","ar"].includes(lang))await expect(page.locator("html")).toHaveAttribute("dir","rtl");
expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(395);
});
test("password generation "+lang,async({page})=>{
await page.goto("http://127.0.0.1:8765/"+lang+"/tools/security/password-generator/");
await expect(page.locator("main h1")).not.toHaveText("Secure Password Generator");
await page.locator("#run").click();
await expect(page.locator("#output")).not.toBeEmpty();
expect((await page.locator("#output").inputValue()).length).toBe(20);
});
}