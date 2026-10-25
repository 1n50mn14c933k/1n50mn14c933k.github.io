import {test,expect} from "@playwright/test";
const sizes=[
 {width:2048,height:1152},
 {width:1440,height:900},
 {width:1366,height:768},
 {width:980,height:900},
 {width:720,height:800},
 {width:390,height:844},
 {width:320,height:720}
];
for(const size of sizes) {
 test(`Persian title matches English font size at ${size.width}x${size.height}`,async({page})=>{
  await page.setViewportSize(size);
  await page.goto("http://127.0.0.1:8765/en/");
  const en=await page.locator(".hero-copy h1").evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
  await page.goto("http://127.0.0.1:8765/fa/");
  await expect(page.locator(".fa-hero-title .fa-title-line")).toHaveCount(2);
  const fa=await page.locator(".fa-hero-title").evaluate(el=>{
   const second=el.querySelector(".fa-title-line--long");
   const parent=el.closest(".hero-copy");
   const rect=parent.getBoundingClientRect();
   const range=document.createRange();range.selectNodeContents(second);
   const textRect=range.getBoundingClientRect();
   return {
    font:parseFloat(getComputedStyle(el).fontSize),
    childFont:parseFloat(getComputedStyle(second).fontSize),
    lineHeight:parseFloat(getComputedStyle(el).lineHeight),
    left:textRect.left,right:textRect.right,
    parentLeft:rect.left,parentRight:rect.right,
    phraseWidth:textRect.width
   };
  });
  expect(fa.font).toBeCloseTo(en,1);
  expect(fa.childFont).toBeCloseTo(fa.font,1);
  expect(fa.lineHeight/fa.font).toBeGreaterThan(1.2);
  expect(fa.left).toBeGreaterThanOrEqual(fa.parentLeft-2);
  expect(fa.right).toBeLessThanOrEqual(fa.parentRight+2);
 });
}
