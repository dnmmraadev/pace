import { test, expect } from '@playwright/test';
import { emptyProgress } from '../src/lib/learning';
import { STORAGE_KEY } from '../src/lib/progress';
import { PROFILE_KEY } from '../src/lib/profile';
import { PREFERENCES_KEY } from '../src/lib/preferences';
test.use({ viewport: { width: 1440, height: 1000 } });

test('theme and language switch without losing an active answer or saved progress', async ({ page }) => {
  const progress = { ...emptyProgress(), completed: ['inventory'] };
  await page.addInitScript(({ key, value, profile }) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem(profile, JSON.stringify({ version: 1, name: 'Ana', role: '', goal: '', onboardingComplete: true }));
  }, { key: STORAGE_KEY, value: progress, profile: PROFILE_KEY });
  await page.goto('http://127.0.0.1:5173');
  await page.getByRole('button', { name: 'Cambiar a modo oscuro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('combobox', { name: 'Idioma', exact: true }).selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('button', { name: 'Continue Session', exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/preferences-dark-english.png' });
  await page.getByRole('button', { name: 'Continue Session', exact: true }).click();
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await page.getByPlaceholder('Enter your answer').fill('75');
  await page.getByRole('combobox', { name: 'Language', exact: true }).selectOption('es');
  await expect(page.getByPlaceholder('Escribe tu respuesta')).toHaveValue('75');
  await page.screenshot({ path: 'test-results/preferences-dark-lesson.png' });
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-MX');
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY)).toMatchObject({ completed: ['inventory'], attempts: [] });
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!), PREFERENCES_KEY)).toMatchObject({ theme: 'dark', language: 'es' });
  await page.getByRole('button', { name: 'Cambiar a modo claro' }).click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect.poll(()=>page.locator('html').evaluate(el=>getComputedStyle(el).getPropertyValue('--bg-primary').trim())).toBe('#FFFFFF');
  await page.waitForTimeout(150);
  await page.screenshot({ path: 'test-results/preferences-light-1280.png' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test('onboarding and profile labels follow the selected language', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173');
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('combobox', { name: 'Idioma', exact: true }).selectOption('en');
  await expect(dialog).toContainText('Welcome to PACE');
  await dialog.getByRole('button', { name: 'Switch to dark mode' }).click();
  await dialog.getByLabel('Name or preferred name').fill('Alex');
  await dialog.getByLabel('Goal').selectOption('analyst');
  await dialog.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(dialog).toContainText('Calculate, interpret and decide.');
  await dialog.getByRole('button', { name: 'Enter PACE' }).click();
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await expect(dialog.getByLabel('Name or preferred name')).toHaveValue('Alex');
  await dialog.getByRole('combobox', { name: 'Language', exact: true }).selectOption('es');
  await expect(dialog.getByLabel('Nombre o nombre preferido')).toHaveValue('Alex');
  await expect(dialog.getByLabel('Objetivo')).toHaveValue('analyst');
  await page.screenshot({ path: 'test-results/preferences-dark-profile.png' });
});
