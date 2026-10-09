import {chromium} from '@playwright/test';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
for(const [label,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto('http://127.0.0.1:4321/service/');
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`docs/service-preview/${label}-default.png`,fullPage:true});
  await page.locator('[data-service-toggle]').first().click();
  await page.screenshot({path:`docs/service-preview/${label}-collapsed.png`,fullPage:true});
  await page.close();
}
await browser.close();
