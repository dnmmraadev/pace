import { expect, test } from '@playwright/test';
import { emptyProgress } from '../../src/domain/learning';
import { PROFILE_KEY } from '../../src/shared/storage/profile';
import { PREFERENCES_KEY } from '../../src/shared/storage/preferences';
import { STORAGE_KEY } from '../../src/shared/storage/progress';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(
    ({ profile, preferences, progress, value }) => {
      if (!localStorage.getItem(progress)) localStorage.setItem(progress, JSON.stringify(value));
      localStorage.setItem(
        profile,
        JSON.stringify({ version: 1, name: 'Ana', role: '', goal: '', onboardingComplete: true }),
      );
      if (!localStorage.getItem(preferences))
        localStorage.setItem(
          preferences,
          JSON.stringify({ version: 1, theme: 'light', language: 'en' }),
        );
    },
    {
      profile: PROFILE_KEY,
      preferences: PREFERENCES_KEY,
      progress: STORAGE_KEY,
      value: { ...emptyProgress(), completed: ['inventory'] },
    },
  );
  await page.goto('http://127.0.0.1:5173');
});

test('unseen calculation practice, first-attempt evidence and bilingual persistence', async ({
  page,
}) => {
  await page.getByLabel('Local command').fill('/practice');
  await page.getByLabel('Local command').press('Enter');
  const practice = page.locator('#variable-practice');
  await practice.getByLabel('Practice competency').selectOption('occupancy');
  const prompts = new Set<string>();
  for (let i = 0; i < 5; i++) {
    const prompt = await practice.locator('.question-title').innerText();
    prompts.add(prompt);
    const numbers = prompt.match(/(\d+) paid room nights sold out of (\d+) available/)!;
    await practice
      .getByPlaceholder('Enter your answer')
      .fill(i === 0 ? '0' : String((Number(numbers[1]) / Number(numbers[2])) * 100));
    await practice.getByRole('button', { name: 'Check answer', exact: true }).click();
    await expect(practice.getByRole('status')).toContainText(i === 0 ? 'Divide' : 'Correct.');
    if (i < 4) await practice.getByRole('button', { name: 'New problem' }).click();
  }
  expect(prompts.size).toBe(5);
  await expect(practice).toContainText('Distinct instances: 5 / 5');
  await expect(practice).toContainText('80% · Proficient');
  await page.reload();
  await page.getByLabel('Local command').fill('/practice');
  await page.getByLabel('Local command').press('Enter');
  await practice.getByLabel('Practice competency').selectOption('occupancy');
  await expect(practice).toContainText('80% · Proficient');
  await practice.getByPlaceholder('Enter your answer').fill('75');
  await page.getByRole('button', { name: 'Switch to Spanish', exact: true }).click();
  await expect(practice.getByPlaceholder('Escribe tu respuesta')).toHaveValue('75');
  await expect(practice).toContainText('Ocupación');
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY);
  expect(saved.completed).toEqual(['inventory']);
  expect(saved.attempts).toHaveLength(5);
});

test('interview reasoning reveals rubric only after commitment and stays ungraded', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Interview Lab', exact: true }).click();
  await expect(page.getByLabel('Interview competency')).toBeVisible();
  const open = page.locator('form.question').filter({ has: page.locator('textarea') });
  await expect(page.getByRole('heading', { name: 'Self-review checklist' })).toHaveCount(0);
  await open
    .locator('textarea')
    .fill(
      'Compare the relevant evidence, investigate cancellations, propose an action and monitor net revenue and pickup.',
    );
  await open.getByRole('button', { name: 'Commit response' }).click();
  await expect(open.getByRole('heading', { name: 'Self-review checklist' })).toBeVisible();
  await expect(open.getByRole('heading', { name: 'One defensible model response' })).toBeVisible();
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY);
  expect(saved.attempts).toHaveLength(0);
  expect(saved.reflections).toHaveLength(1);
  await page.getByRole('button', { name: 'Switch to Spanish', exact: true }).click();
  await expect(open).toContainText('Lista de autoevaluación');
});

test('Excel export and an unfamiliar urban transfer calculation are available on narrow screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel('Local command').fill('/practice');
  await page.getByLabel('Local command').press('Enter');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export raw reservations' }).click();
  expect((await download).suggestedFilename()).toBe('pace-synthetic-reservations-030.csv');
  await page.getByRole('tab', { name: 'Commercial transfer', exact: true }).click();
  await expect(page.locator('main')).toContainText('Synthetic 180-room hotel');
  await expect(page.locator('main')).toContainText('64');
  const q = page.locator('form.question').filter({ hasText: 'occupancy' }).first();
  await q.getByPlaceholder('Enter your answer').fill('60');
  await q.getByRole('button', { name: 'Check answer' }).click();
  await expect(q.getByRole('status')).toContainText('Correct.');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
});

test('short diagnostic includes reasoning and routes a missed competency without locking lessons', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Take the optional 8-question diagnostic' }).click();
  await expect(page.locator('form.question')).toHaveCount(8);
  const first = page.locator('form.question').first();
  await first.getByRole('radio', { name: 'Occupancy 80%; ADR USD 200', exact: true }).check();
  await first.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(first.getByRole('status')).toContainText('Not quite.');
  await page.getByRole('button', { name: 'See learning recommendations' }).click();
  const recommendations = page.getByRole('dialog');
  await expect(recommendations.locator('.lesson-row')).toHaveCount(8);
  await recommendations.locator('.lesson-row').first().click();
  await expect(page.getByRole('heading', { name: 'Study guide', exact: true })).toBeVisible();
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY);
  expect(saved.lastLesson).toBe('occupancy');
  expect(saved.completed).toEqual(['inventory']);
});
