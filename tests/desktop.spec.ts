import {test,expect} from '@playwright/test';
test.use({viewport:{width:1440,height:1000}});
test('desktop lesson loop, review, commands, persistence, CSV and screenshots',async({page})=>{
await page.goto('http://127.0.0.1:5173');
await expect(page.getByRole('heading',{name:'Build the judgment behind the numbers.'})).toBeVisible();
await page.screenshot({path:'test-results/desktop-today.png',fullPage:true});
await page.getByRole('button',{name:'Continue Session',exact:true}).click();
await page.getByRole('button',{name:'Start practice',exact:true}).click();
await page.getByPlaceholder('Enter your answer').fill('0');
await page.getByRole('button',{name:'Check answer',exact:true}).click();
await expect(page.getByRole('status')).toContainText('Added to your Review Queue');
await page.screenshot({path:'test-results/desktop-lesson.png',fullPage:true});
await page.reload();
await expect(page.getByRole('heading',{name:'1 topics ready for review'})).toBeVisible();
for(const [command,title] of [['/review','Make weak concepts familiar'],['/progress','Completion is not mastery.'],['/practice','Work the data. Explain the result.']]){await page.getByLabel('Local command').fill(command);await page.getByLabel('Local command').press('Enter');await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();}
for(const [command,title] of [['/formula','Formula Sheet'],['/glossary','Glossary'],['/reset','Reset progress']]){await page.getByLabel('Local command').fill(command);await page.getByLabel('Local command').press('Enter');await expect(page.getByRole('dialog')).toContainText(title);await page.keyboard.press('Escape');}
await page.keyboard.press('Control+k');await expect(page.getByRole('dialog')).toBeVisible();await page.getByLabel('Search Search').fill('Connect occupancy');await page.keyboard.press('Tab');await page.keyboard.press('Enter');await expect(page.getByRole('heading',{name:'Connect occupancy, ADR and total revenue'})).toBeVisible();
await page.getByLabel('Local command').fill('/practice');await page.getByLabel('Local command').press('Enter');const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export CSV',exact:true}).click();expect((await download).suggestedFilename()).toBe('synthetic-forward-dates.csv');
await page.screenshot({path:'test-results/desktop-practice.png',fullPage:true});
expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
await page.setViewportSize({width:1280,height:800});await page.screenshot({path:'test-results/desktop-1280.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});

