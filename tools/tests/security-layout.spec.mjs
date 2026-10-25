import {test,expect} from "@playwright/test";
for(const [slug,count] of [["password-generator",5],["sensitive-text-redactor",3]]){
 test(slug+" shows compact selectable tiles without overflow",async({page})=>{
  await page.setViewportSize({width:1024,height:900});
  await page.goto("http://127.0.0.1:8765/tools/security/"+slug+"/");
  await expect(page.locator(".security-grid .security-choice")).toHaveCount(count);
  const result=await page.evaluate(()=>{
   const grid=document.querySelector(".security-grid");
   const items=[...document.querySelectorAll(".security-grid .security-choice")];
   return {columns:getComputedStyle(grid).gridTemplateColumns.split(" ").length,
    items:items.map(item=>{const tile=item.querySelector(".security-tile"),input=item.querySelector('input[type="checkbox"]'),text=item.querySelector(".security-text");
      const a=item.getBoundingClientRect(),b=tile.getBoundingClientRect(),c=text.getBoundingClientRect(),i=input.getBoundingClientRect();
      return {tileWidth:b.width,tileHeight:b.height,inputWidth:i.width,inputHeight:i.height,textInside:c.left>=b.left&&c.right<=b.right+1,inside:a.left>=grid.getBoundingClientRect().left-1&&a.right<=grid.getBoundingClientRect().right+1};})};
  });
  expect(result.columns).toBe(2);
  for(const item of result.items){expect(item.tileWidth).toBeGreaterThan(180);expect(item.tileHeight).toBeLessThan(110);expect(item.inputWidth).toBeLessThanOrEqual(2);expect(item.inputHeight).toBeLessThanOrEqual(2);expect(item.textInside).toBe(true);expect(item.inside).toBe(true);}
  const first=page.locator(".security-choice").first(),checkbox=first.locator("input");
  const was=await checkbox.isChecked();await first.click();expect(await checkbox.isChecked()).toBe(!was);
  await page.setViewportSize({width:375,height:812});
  const mobile=await page.locator(".security-grid").evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(" ").length);
  expect(mobile).toBe(1);
  await page.screenshot({path:"test-results/"+slug+"-tiles.png",fullPage:true});
 });
}
