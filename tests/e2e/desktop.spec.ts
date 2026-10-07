import { expect, test } from '@playwright/test';
import { lessons } from '../../src/data/curriculum';
import { capstoneChecks } from '../../src/data/scenarios';
import { emptyProgress } from '../../src/domain/learning';
import { es } from '../../src/i18n/es';
import { STORAGE_KEY } from '../../src/shared/storage/progress';
test.use({ viewport: { width: 1440, height: 1000 } });
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('pace.profile.v1'))
      localStorage.setItem(
        'pace.profile.v1',
        JSON.stringify({ version: 1, name: '', role: '', goal: '', onboardingComplete: true }),
      );
  });
});

test('interviews require both completed lessons and capstone without changing saved attempts', async ({
  page,
}) => {
  await page.goto('http://127.0.0.1:5173');
  const capstone = { answers: {}, insights: 'Saved report', submitted: 123, score: 0 };
  const attempt = {
    questionId: 'interview-diag-occ',
    topic: 'inventory',
    answer: '80',
    correct: true,
    at: 123,
  };
  for (const [completed, submission, unlocked] of [
    [[], capstone, false],
    [lessons.map((l) => l.id), null, false],
    [lessons.map((l) => l.id), capstone, true],
  ] as const) {
    const progress = {
      ...emptyProgress(),
      completed: [...completed],
      attempts: [attempt],
      capstone: submission,
    };
    await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
      key: STORAGE_KEY,
      value: progress,
    });
    await page.reload();
    await page.getByRole('button', { name: 'Laboratorio de entrevistas', exact: true }).click();
    await expect(page.locator('main form.question')).toHaveCount(unlocked ? 8 : 0);
    if (!unlocked) await expect(page.locator('main .empty-state')).toBeVisible();
    expect(
      await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY),
    ).toEqual(JSON.parse(JSON.stringify(progress)));
  }
});

test('wide workspace alignment, reference focus and interview lock', async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1440 });
  await page.goto('http://127.0.0.1:5173');
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Cambiar a modo oscuro' }).click();
    await page.getByRole('button', { name: 'Laboratorio de práctica', exact: true }).click();
    const caption = await page.locator('main .table-caption').first().boundingBox();
    const table = await page.locator('main .table-scroll').first().boundingBox();
    expect(caption).not.toBeNull();
    expect(table).not.toBeNull();
    expect(caption!.x).toBeCloseTo(table!.x, 1);
    expect(caption!.width).toBeCloseTo(table!.width, 1);
    await page.screenshot({ path: `test-results/aligned-wide-practice-${theme}.png` });
    await page.getByRole('button', { name: 'Hoy', exact: true }).click();
    await page.getByRole('button', { name: 'Continuar sesión', exact: true }).click();
    const warning = await page.locator('main>.callout').boundingBox();
    const example = await page.locator('main>.worked').boundingBox();
    expect(warning!.x).toBeCloseTo(example!.x, 1);
    expect(warning!.width).toBeCloseTo(example!.width, 1);
    await page.screenshot({ path: `test-results/aligned-wide-lesson-${theme}.png` });
    await page.getByRole('button', { name: 'Hoja de fórmulas', exact: true }).click();
    const search = page.locator('.modal-search input');
    await search.focus();
    await expect(page.locator('.modal-search')).toHaveCSS('outline-style', 'solid');
    await expect(search).toHaveCSS('outline-style', 'none');
    await page.screenshot({ path: `test-results/aligned-formulas-${theme}.png` });
    await page.getByRole('button', { name: 'Cerrar diálogo' }).click();
  }
  await page.getByRole('button', { name: 'Laboratorio de entrevistas', exact: true }).click();
  await expect(page.locator('main .empty-state')).toBeVisible();
  await expect(page.locator('main form.question')).toHaveCount(0);
  const progress = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    STORAGE_KEY,
  );
  expect(progress.completed).toEqual([]);
  expect(progress.capstone).toBeFalsy();
  await page.screenshot({ path: 'test-results/interview-locked.png' });
});
test('desktop lesson loop, review, commands, persistence, CSV and screenshots', async ({
  page,
}) => {
  await page.goto('http://127.0.0.1:5173');
  await expect(
    page.getByRole('heading', { name: es('Build the judgment behind the numbers.') }),
  ).toBeVisible();
  await page.screenshot({ path: 'test-results/desktop-today.png', fullPage: true });
  await page.getByRole('button', { name: es('Continue Session'), exact: true }).click();
  await page.getByRole('button', { name: es('Start practice'), exact: true }).click();
  await page.getByPlaceholder(es('Enter your answer')).fill(es('0'));
  await page.getByRole('button', { name: es('Check answer'), exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Se agregó a tu cola de repaso');
  await page.screenshot({ path: 'test-results/desktop-lesson.png', fullPage: true });
  await page.getByLabel('Comando local').fill('/next');
  await page.getByLabel('Comando local').press('Enter');
  await page
    .getByRole('radio', { name: 'La oportunidad de vender esa habitación-noche', exact: true })
    .check();
  await page.getByRole('button', { name: 'Comprobar respuesta', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Correcto.');
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).attempts.at(-1).answer,
      STORAGE_KEY,
    ),
  ).toBe('The opportunity to sell that room night');
  await page.reload();
  await expect(page.getByRole('heading', { name: es('1 topics ready for review') })).toBeVisible();
  for (const [command, title] of [
    ['/review', 'Make weak concepts familiar'],
    ['/progress', 'Completion is not mastery.'],
    ['/practice', 'Work the data. Explain the result.'],
  ]) {
    await page.getByLabel(es('Local command')).fill(command);
    await page.getByLabel(es('Local command')).press(es('Enter'));
    await expect(page.getByRole('heading', { name: es(title), exact: true })).toBeVisible();
  }
  for (const [command, title] of [
    ['/formula', 'Formula Sheet'],
    ['/glossary', 'Glossary'],
    ['/reset', 'Reset progress'],
  ]) {
    await page.getByLabel(es('Local command')).fill(command);
    await page.getByLabel(es('Local command')).press(es('Enter'));
    await expect(page.getByRole('dialog')).toContainText(es(title));
    await page.keyboard.press('Escape');
  }
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByLabel(es('Search Search')).fill('Relaciona ocupacion');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('heading', { name: es('Connect occupancy, ADR and total revenue') }),
  ).toBeVisible();
  await page.getByLabel(es('Local command')).fill(es('/practice'));
  await page.getByLabel(es('Local command')).press(es('Enter'));
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: es('Export CSV'), exact: true }).click();
  expect((await download).suggestedFilename()).toBe('synthetic-forward-dates.csv');
  await page.screenshot({ path: 'test-results/desktop-practice.png', fullPage: true });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.screenshot({ path: 'test-results/desktop-1280.png', fullPage: true });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
});

test('Spanish desktop views, legacy progress, reference search and analytical tables', async ({
  page,
}) => {
  test.setTimeout(90000);
  const legacy = {
    ...emptyProgress(),
    completed: lessons.map((l) => l.id),
    attempts: [
      {
        questionId: 'inventory-r1',
        topic: 'inventory',
        answer: 'The opportunity to sell that room night',
        correct: true,
        at: 123,
      },
    ],
    reviews: [{ topic: 'pickup', due: 1, interval: 0 }],
    capstone: {
      answers: Object.fromEntries(capstoneChecks.map((q) => [q.id, String(q.answer)])),
      insights: 'Original saved report\nLine 2\nLine 3\nLine 4\nLine 5',
      submitted: 123,
      score: 100,
      reflection: ['Compression'],
    },
  };
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: STORAGE_KEY,
    value: legacy,
  });
  await page.goto('http://127.0.0.1:5173');
  const capture = async (name: string) => {
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1),
    ).toBeTruthy();
    const visible = await page.locator('main').innerText();
    expect(visible).not.toMatch(
      /\b(Continue Session|Completed lessons|Your calculations|Check answer|Your review queue|Next review|Room revenue|Acquisition cost|Yesterday|Choose one response)\b/,
    );
    await page.screenshot({ path: 'test-results/spanish-' + name + '.png', fullPage: true });
  };
  for (const [name, slug] of [
    ['Hoy', 'today'],
    ['Ruta de aprendizaje', 'curriculum'],
    ['Cola de repaso', 'review'],
    ['Progreso', 'progress'],
    ['Laboratorio de entrevistas', 'interview'],
    ['Laboratorio de práctica', 'practice'],
  ]) {
    await page.locator('.left-rail nav').getByRole('button', { name, exact: true }).click();
    await capture(slug);
  }
  await page.getByRole('tab', { name: 'Análisis en Excel', exact: true }).click();
  await page.locator('main').getByRole('combobox').selectOption('Direct');
  await expect(page.locator('main').getByRole('combobox')).toHaveValue('Direct');
  await expect(page.locator('tbody')).not.toContainText(/\bDirect\b/);
  await page.getByLabel('Crear resumen por canal tipo tabla dinámica').check();
  await capture('excel');
  await page.getByRole('tab', { name: 'Revisión matutina y reunión', exact: true }).click();
  await capture('meeting');
  await page.locator('.module-tree summary').nth(11).click();
  await capture('capstone');
  await expect(page.getByLabel('Incluí: compresión')).toBeChecked();
  await page.locator('.module-tree summary').nth(0).click();
  await capture('diagnostic');
  for (const [command, label, query, result] of [
    ['/glossary', 'Glosario', 'ocupacion', 'Ocupación'],
    ['/formula', 'Hoja de fórmulas', 'pronostico', 'Pronóstico de habitaciones'],
  ]) {
    await page.getByLabel('Comando local').fill(command);
    await page.getByLabel('Comando local').press('Enter');
    await page.getByRole('dialog').getByRole('textbox').fill(query);
    await expect(
      page.getByRole('dialog').getByRole('heading', { name: result, exact: true }),
    ).toBeVisible();
    await page.screenshot({ path: 'test-results/spanish-' + label + '.png' });
    await page.keyboard.press('Escape');
  }
  for (const l of lessons) {
    await page.keyboard.press('Control+k');
    await page.getByLabel('Buscar en PACE').fill(es(l.title));
    await page
      .getByRole('dialog')
      .getByRole('button')
      .filter({ has: page.getByText(es(l.title), { exact: true }) })
      .click();
    await expect(page.getByRole('heading', { name: es(l.title), exact: true })).toBeVisible();
    await expect(page.locator('.prose')).toContainText(es(l.concept));
    await expect(page.getByRole('region', { name: 'Objetivo de aprendizaje' })).toBeVisible();
    await expect(page.locator('.study-material>section')).toHaveCount(2);
    await expect(page.locator('.worked-steps li')).toHaveCount(3);
    await expect(page.locator('.worked-reading dt')).toHaveCount(2);
    await expect(page.locator('.study-reflection')).toContainText('Esta reflexión no se califica');
    await expect(page.locator('main form.question')).toHaveCount(0);
    await capture('lesson-' + l.id);
  }
  await page.setViewportSize({ width: 1280, height: 800 });
  await capture('laptop');
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY);
  expect(saved.attempts[0].answer).toBe(legacy.attempts[0].answer);
  expect(saved.capstone.reflection).toEqual(['Compression']);
});
