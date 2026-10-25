import {test,expect} from "@playwright/test";
const roots=["/tools/","/tools/photo-file/","/tools/code-data/","/tools/networking/","/tools/security/"];
const families=[["","exif-cleaner image-compressor image-converter photo-date-detective duplicate-checker batch-file-renamer image-watermark photo-rotator image-to-pdf sha256-verifier qr-code-generator photo-color-palette"],["code-data/","json-formatter yaml-json-converter csv-json-converter xml-formatter base64-encoder url-encoder regex-tester uuid-generator html-entity-converter sql-formatter markdown-preview json-schema-validator"],["networking/","ipv4-subnet-calculator ipv6-prefix-calculator vlsm-subnet-planner ip-range-cidr-converter vlan-ip-planner network-port-reference cron-expression-builder systemd-timer-builder unix-timestamp-converter time-zone-converter linux-chmod-calculator docker-compose-checker"],["security/","password-generator passphrase-generator password-strength jwt-inspector text-hash-generator secret-leak-scanner sensitive-text-redactor text-code-diff unicode-inspector punycode-converter url-safety-inspector text-hex-utf8"]];
const routes=roots.concat(families.flatMap(([prefix,names])=>names.split(" ").map(n=>"/tools/"+prefix+n+"/")));
test("53 Persian routes present",()=>expect(routes.length).toBe(53));
for(const route of routes){
test("Persian page renders: "+route,async({page})=>{
 const errors=[];page.on("pageerror",err=>errors.push(err.message));
 await page.setViewportSize({width:390,height:844});
 await page.goto("http://127.0.0.1:8765/fa"+route);
 await expect(page.locator("html")).toHaveAttribute("lang","fa");
 await expect(page.locator("main h1")).toBeVisible();
 await expect(page.locator(".kf-tools-language .lang-list a")).toHaveCount(3);
 await expect(page.locator("html")).toHaveAttribute("dir","rtl");
 await expect(page.locator("footer.kf-global-footer")).toHaveCount(1);
 if(!roots.includes(route))await expect(page.locator(".kf-i18n-safety")).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(395);
 expect(errors).toEqual([]);
});
}
test("Persian JSON formatting works",async({page})=>{
 await page.goto("http://127.0.0.1:8765/fa/tools/code-data/json-formatter/");
 await page.locator("#source").fill('{"kolfat":1}');
 await page.locator("#run").click();
 await expect(page.locator("#output")).toHaveValue(/"kolfat": 1/);
});
test("Persian password generation works",async({page})=>{
 await page.goto("http://127.0.0.1:8765/fa/tools/security/password-generator/");
 await page.locator("#run").click();
 expect((await page.locator("#output").inputValue()).length).toBe(20);
});
test("English tool can switch to Persian",async({page})=>{
 await page.goto("http://127.0.0.1:8765/tools/security/password-generator/");
 await expect(page.locator('.kf-tools-language a[href="/fa/tools/security/password-generator/"]')).toHaveCount(1);
});
