import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {site} from '../src/config';
const pages=['','research/','publications/','presentations/','lab/','software/','teaching/','service/'];
for (const path of pages) {
  test(`${path || 'home'}: navigation, accessibility, and responsive layout`, async ({page})=>{
    const errors:string[]=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(path);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('nav[aria-label="Main navigation"] a')).toHaveCount(8);
    const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
    for(const width of [1440,768,390,320]) {
      await page.setViewportSize({width,height:900});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}
test('publication search, combined filters, reset, and shared URL',async({page})=>{
  await page.goto('publications/');
  await expect(page.locator('[data-archive-item]:visible')).toHaveCount(31);
  await page.getByRole('searchbox',{name:'Search publications',exact:true}).fill('sensory processing sensitivity');
  await expect(page.locator('[data-archive-item]:visible')).toHaveCount(3);
  await page.getByLabel('Year',{exact:true}).selectOption('2025');
  await expect(page.locator('[data-archive-item]:visible')).toHaveCount(1);
  await expect(page.locator('[data-archive-item]:visible')).toContainText('reduced vagally-mediated');
  await page.reload();
  await expect(page.locator('[data-archive-item]:visible')).toHaveCount(1);
  await page.getByRole('button',{name:'Clear filters'}).click();
  await expect(page.locator('[data-archive-item]:visible')).toHaveCount(31);
  await page.getByLabel('Type',{exact:true}).selectOption('Book chapter');
  await expect(page.locator('[data-archive-item]:visible')).toHaveCount(2);
  await page.getByRole('searchbox',{name:'Search publications',exact:true}).fill('no-such-publication-xyz');
  await expect(page.locator('[data-archive-item]:visible')).toHaveCount(0);
  await expect(page.locator('.empty-results')).toBeVisible();
});
test('presentation filters and complete citation details',async({page})=>{
  await page.goto('presentations/');
  await expect(page.locator('[data-archive-item]:visible')).toHaveCount(123);
  await page.getByLabel('Year',{exact:true}).selectOption('2026');
  await expect(page.locator('[data-archive-item]:visible')).toHaveCount(2);
  await page.getByRole('searchbox',{name:'Search presentations',exact:true}).fill('Wegovy');
  const entry=page.locator('[data-archive-item]:visible');
  await expect(entry).toHaveCount(1);
  await entry.getByText('Full citation',{exact:true}).click();
  await expect(entry.locator('.source-citation p')).toContainText('Nangavaram, A., & Benham, G.');
  await page.getByRole('button',{name:'Clear filters'}).click();
  await page.getByLabel('Type',{exact:true}).selectOption('Poster');
  const count=await page.locator('[data-archive-item]:visible').count();
  expect(count).toBeGreaterThan(50);expect(count).toBeLessThan(123);
});
test('research topic links prefilter the archive',async({page})=>{
  await page.goto('research/');
  await page.getByRole('link',{name:'Browse publications in this theme →'}).nth(1).click();
  await expect(page.getByLabel('Topic',{exact:true})).toHaveValue('Sensitivity & individual differences');
  expect(await page.locator('[data-archive-item]:visible').count()).toBeGreaterThan(0);
  expect(await page.locator('[data-archive-item]:visible').count()).toBeLessThan(31);
});
test('mobile menu opens, navigates, and closes with Escape',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('');
  const button=page.getByRole('button',{name:'Menu'});
  await expect(page.getByRole('navigation',{name:'Main navigation'})).not.toBeVisible();
  await button.click();await expect(button).toHaveAttribute('aria-expanded','true');
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
  await page.keyboard.press('Escape');await expect(button).toHaveAttribute('aria-expanded','false');
  await button.click();await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Lab',exact:true}).click();
  await expect(page.locator('h1')).toHaveText(site.labName);
});
test('CV download and portrait asset resolve',async({request})=>{
  const cv=await request.get(`${site.base}${site.cv}`);expect(cv.status()).toBe(200);expect((await cv.body()).byteLength).toBeGreaterThan(100000);
  const portrait=await request.get(`${site.base}${site.portrait}`);expect(portrait.status()).toBe(200);expect(portrait.headers()['content-type']).toContain('image/webp');
});
test('archives and mobile navigation remain usable without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto(`http://127.0.0.1:4321${site.base}/publications/`);
  await expect(page.locator('[data-archive-item]:visible')).toHaveCount(31);
  await expect(page.getByRole('navigation',{name:'Main navigation'})).toBeVisible();
  await expect(page.locator('form')).not.toBeVisible();
  await page.goto(`http://127.0.0.1:4321${site.base}/presentations/`);
  await expect(page.locator('[data-archive-item]:visible')).toHaveCount(123);
  await context.close();
});
test('migrated PDF, thumbnail, download, and lazy viewer work',async({page,request})=>{
  await page.goto('presentations/?year=2026');
  const entry=page.locator('#presentation-2026-001');
  await entry.scrollIntoViewIfNeeded();
  const thumbnail=entry.locator('img');
  await expect(thumbnail).toBeVisible();
  await expect.poll(()=>thumbnail.evaluate((image:HTMLImageElement)=>image.naturalWidth)).toBeGreaterThan(0);
  const frame=entry.locator('iframe');
  await expect(frame).not.toHaveAttribute('src');
  await entry.getByText('View presentation PDF',{exact:true}).click();
  await expect(frame).toHaveAttribute('src',`${site.base}/presentations/presentation-2026-001.pdf`);
  await expect(frame).toBeVisible();
  const pdf=await request.get(`${site.base}/presentations/presentation-2026-001.pdf`);
  expect(pdf.status()).toBe(200);expect((await pdf.body()).subarray(0,5).toString()).toBe('%PDF-');
  const download=entry.getByRole('link',{name:'Download presentation PDF'});
  await expect(download).toHaveAttribute('download','');
});
test('alumni gallery preserves caption names without duplicate or current-member claims',async({page})=>{
  await page.goto('lab/');
  await expect(page.locator('.alumni-card')).toHaveCount(49);
  await expect(page.locator('.alumni-card h3').filter({hasText:/^Hoshi Perez$/})).toHaveCount(1);
  await expect(page.locator('.alumni-card').filter({hasText:'Madison Rosas'})).toHaveCount(1);
  await expect(page.getByRole('heading',{name:'Lab alumni'})).toBeVisible();
});
test('owner-approved publication corrections retain stable links', async ({page})=>{
  await page.goto('publications/');
  await expect(page.locator('#pub-2020-10')).toContainText('Benham, G. (2022)');
  await expect(page.locator('#pub-2018-12')).toContainText('(2019)');
  await expect(page.locator('#pub-2016-15')).toContainText('(2017)');
  await expect(page.locator('#pub-2006-24 a[href^="https://doi.org/"]')).toHaveAttribute('href','https://doi.org/10.1891/hhci-v4i4a001');
  await expect(page.locator('#pub-2006-24 .content-note')).toHaveCount(0);
  await expect(page.locator('#pub-2025-04')).toContainText('61–72');
});

test('merged home, stable About link, and compact linked alumni', async ({page}) => {
  await page.goto('');
  await expect(page.getByRole('heading', {name:'Academic biography'})).toBeVisible();
  await expect(page.locator('footer, .wordmark, .home-research, .lab-band')).toHaveCount(0);
  await expect(page.getByRole('link', {name:'Home', exact:true})).toHaveAttribute('aria-current','page');
  await page.goto('about/');
  await expect(page).toHaveURL(/\/#about$/);
  await page.goto('lab/');
  await expect(page.getByRole('heading', {name:'Dr. Jordan Buren',exact:true})).toBeVisible();
  await expect(page.getByRole('link', {name:'Dr. Jordan Buren on LinkedIn'})).toHaveAttribute('href','https://www.linkedin.com/in/jordankenemore');
  await expect(page.getByRole('link', {name:'Madison Rosas on LinkedIn'})).toHaveAttribute('href','https://www.linkedin.com/in/madisonrosas/');
  await expect(page.locator('.alumni-card').filter({has:page.getByRole('heading',{name:'Karla Chapa',exact:true})}).locator('a')).toHaveCount(0);
  for (const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    expect(await page.locator('.alumni-card h3').evaluateAll(names => names.every(name => name.scrollWidth <= 120))).toBe(true);
    expect(await page.locator('.alumni-card img').evaluateAll(images => images.every(image => image.getBoundingClientRect().width === 120))).toBe(true);
  }
});
