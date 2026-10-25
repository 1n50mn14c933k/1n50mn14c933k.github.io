import {test,expect} from "@playwright/test";
const cases=[
["password-generator","password"],["passphrase-generator","passphrase"],["password-strength","strength"],
["jwt-inspector","jwt"],["text-hash-generator","hash"],["secret-leak-scanner","secrets"],
["sensitive-text-redactor","redact"],["text-code-diff","diff"],["unicode-inspector","unicode"],
["punycode-converter","punycode"],["url-safety-inspector","url"],["text-hex-utf8","hex"]
];
for(const [slug,id] of cases){
 test(slug+" button produces an output",async({page})=>{
  await page.goto("http://127.0.0.1:8765/tools/security/"+slug+"/");
  await expect(page.locator("body")).toHaveAttribute("data-security-tool",id);
  await page.locator("#run").click();
  await expect(page.locator("#status")).toContainText("Complete",{timeout:10000});
  await expect(page.locator("#output")).not.toBeEmpty();
  await page.locator("#clear").click();
  await expect(page.locator("#output")).toBeEmpty();
 });
}
test("invalid JWT input yields a meaningful error",async({page})=>{
 await page.goto("http://127.0.0.1:8765/tools/security/jwt-inspector/");
 await page.locator("#source").fill("invalid");
 await page.locator("#run").click();
 await expect(page.locator("#status")).toHaveAttribute("data-kind","error");
});
