import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import abstracts from '../src/data/publication-abstracts.json' with {type:'json'};
import publications from '../src/data/publications.json' with {type:'json'};

test('all 22 full abstracts match their publications and keep source labels',async({page})=>{
  await page.goto('publications/');
  await expect(page.locator('.publication-entry')).toHaveCount(31);
  await expect(page.locator('.publication-abstract')).toHaveCount(22);
  for (const item of abstracts) {
    const entry=page.locator(`#${item.publicationId}`);
    const disclosure=entry.locator('details');
    await expect(disclosure).not.toHaveAttribute('open');
    await entry.locator('summary').click();
    await expect(disclosure).toHaveAttribute('open','');
    expect(await entry.locator('.abstract-content p').textContent()).toBe(item.abstract);
    await expect(entry.locator('.abstract-hide')).toBeVisible();
    await expect(entry.locator('.abstract-show')).not.toBeVisible();
    await entry.locator('summary').click();
    await expect(entry.locator('.abstract-content')).not.toBeVisible();
  }
  await expect(page.locator('#pub-2026-01 .abstract-content h4')).toHaveText('Study summary');
  await expect(page.locator('#pub-2009-19 .abstract-content h4')).toHaveText('Summary');
  const expectedOrder=[...publications].sort((a,b)=>b.year-a.year).map(p=>p.id);
  expect(await page.locator('.publication-entry').evaluateAll(entries=>entries.map(entry=>entry.id))).toEqual(expectedOrder);
});

test('keyboard toggles bar and label; filtering preserves a working disclosure',async({page})=>{
  await page.goto('publications/');
  const entry=page.locator('#pub-2026-01');
  const summary=entry.locator('summary');
  await expect(entry).toHaveCSS('border-left-color','rgb(181, 196, 207)');
  await summary.focus();await page.keyboard.press('Enter');
  await expect(entry.locator('details')).toHaveAttribute('open','');
  await expect(entry).toHaveCSS('border-left-color','rgb(223, 149, 80)');
  await expect(entry).toHaveCSS('border-left-width','6px');
  const accessibility=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(accessibility.violations).toEqual([]);
  await page.keyboard.press('Space');
  await expect(entry.locator('details')).not.toHaveAttribute('open');
  await summary.click();
  await page.getByRole('searchbox',{name:'Search publications',exact:true}).fill('Sleep paralysis');
  await expect(entry).not.toBeVisible();
  await expect(page.locator('[data-archive-item]:visible')).toHaveCount(1);
  await page.locator('#pub-2020-10 summary').click();
  await expect(page.locator('#pub-2020-10 .abstract-content')).toBeVisible();
  await page.getByRole('button',{name:'Clear filters'}).click();
  await expect(entry.locator('.abstract-content')).toBeVisible();
  await expect(page.locator('[data-archive-item]:visible')).toHaveCount(31);
});

test('publication links, removals, and unchanged remaining citations',async({page})=>{
  await page.goto('publications/');
  await expect(page.locator('#pub-2007-23')).toHaveCount(0);
  await expect(page.locator('.publication-entry .tag')).toHaveCount(0);
  await expect(page.locator('.publication-entry .citation-links a[href*="scholar.google.com"]')).toHaveCount(31);
  await expect(page.locator('.publication-entry a[href*="pubmed"],.publication-entry a[href$=".pdf"]')).toHaveCount(0);
  for(const id of ['pub-2005-27','pub-2004-28']) {
    const entry=page.locator(`#${id}`);
    await expect(entry.locator('a[href^="https://doi.org/"]')).toHaveCount(0);
    const href=await entry.getByRole('link',{name:/Google Scholar/}).getAttribute('href');
    const query=new URL(href!).searchParams.get('q')!;
    expect(query).toContain('"Benham"');
    expect(query).toContain(id==='pub-2004-28'?'"Hypnosis"':'"The truth and the hype of hypnosis"');
    if(id==='pub-2004-28')expect(query).toContain('"Oken"');
  }
  for(const publication of publications)await expect(page.locator(`#${publication.id} .citation-text`)).toHaveText(publication.citation);
});

test('expanded abstracts fit mobile and work without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:4321/publications/');
  const entry=page.locator('#pub-2024-05');
  await entry.locator('summary').click();
  await expect(entry.locator('.abstract-hide')).toBeVisible();
  expect(await entry.locator('.abstract-content p').textContent()).toBe(abstracts.find(item=>item.publicationId==='pub-2024-05')!.abstract);
  for(const width of [390,320]) {
    await page.setViewportSize({width,height:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await entry.locator('summary').click();
  await expect(entry.locator('.abstract-content')).not.toBeVisible();
  await context.close();
});
