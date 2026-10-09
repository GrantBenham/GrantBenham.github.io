import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('service order, initial state, independent toggles, and keyboard controls', async ({page}) => {
  await page.goto('service/');
  const buttons = page.locator('[data-service-toggle]');
  await expect(buttons).toHaveText(['Departmental Service', 'University & College Service', 'Professional Service']);
  await expect(buttons.nth(0)).toHaveAttribute('aria-expanded', 'true');
  await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'false');
  await expect(buttons.nth(2)).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.service-panel:visible')).toHaveCount(1);
  await expect(page.getByRole('link', {name:'Teaching', exact:true}).last()).toHaveAttribute('href','/teaching/');
  await expect(page.getByRole('link', {name:'Laboratory', exact:true})).toHaveAttribute('href','/lab/');
  await buttons.nth(1).focus(); await page.keyboard.press('Enter');
  await buttons.nth(2).focus(); await page.keyboard.press('Space');
  await expect(page.locator('.service-panel:visible')).toHaveCount(3);
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  for (let i=0;i<3;i++) await buttons.nth(i).click();
  await expect(page.locator('.service-panel:visible')).toHaveCount(0);
  for (let i=0;i<3;i++) await expect(buttons.nth(i)).toHaveAttribute('aria-expanded','false');
});

test('service mobile reading width and navigation position', async ({page}) => {
  for (const width of [1440,390,320]) {
    await page.setViewportSize({width,height:844}); await page.goto('service/');
    if (width<700) await page.getByRole('button',{name:'Menu'}).click();
    const labels=await page.locator('nav a').allTextContents();
    expect(labels[labels.indexOf('Software')-1]).toBe('Service');
    await expect(page.getByRole('link',{name:'Service',exact:true})).toHaveAttribute('aria-current','page');
    await page.locator('[data-service-toggle]').nth(1).click();
    await page.locator('[data-service-toggle]').nth(2).click();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
});
