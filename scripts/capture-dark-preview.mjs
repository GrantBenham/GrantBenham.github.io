import {chromium} from 'playwright';
import {existsSync} from 'node:fs';
const browser=await chromium.launch(existsSync('/usr/bin/chromium')?{executablePath:'/usr/bin/chromium',args:['--no-sandbox']}:{ });
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
for (const [name,path,fullPage] of [['home','',true],['research','research/',true],['publications','publications/',false],['presentations','presentations/',false],['lab','lab/',false],['teaching','teaching/',false],['software','software/',true]]) {
 await page.goto('http://127.0.0.1:4321/'+path);
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:`docs/dark-preview/${name}-desktop.png`,fullPage});
}
await page.goto('http://127.0.0.1:4321/');
await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:'docs/dark-preview/home-desktop-intro.png'});
await page.setViewportSize({width:390,height:844});
for (const path of ['','publications/','lab/']) {
 await page.goto('http://127.0.0.1:4321/'+path);
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:`docs/dark-preview/${path.split('/')[0]||'home'}-mobile.png`,fullPage:path===''});
}
await page.goto('http://127.0.0.1:4321/');
await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:'docs/dark-preview/home-mobile-intro.png'});
await browser.close();
