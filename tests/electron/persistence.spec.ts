import { _electron as electron, expect, test } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { emptyProgress } from '../../src/domain/learning';
import { PREFERENCES_KEY } from '../../src/shared/storage/preferences';
import { createProfile, PROFILE_KEY } from '../../src/shared/storage/profile';
import { STORAGE_KEY } from '../../src/shared/storage/progress';

test('native isolation, keyboard navigation and progress survive an Electron restart', async () => {
  const profileDir = await mkdtemp(path.join(tmpdir(), 'pace-electron-test-'));
  if (
    path.dirname(profileDir) !== path.resolve(tmpdir()) ||
    !path.basename(profileDir).startsWith('pace-electron-test-')
  )
    throw new Error('Unexpected QA profile path');
  const launch = () =>
    electron.launch({
      ...(process.env.PACE_PACKAGED_EXECUTABLE
        ? { executablePath: process.env.PACE_PACKAGED_EXECUTABLE, args: [] }
        : { args: ['.'] }),
      env: { ...process.env, PACE_TEST_PROFILE: profileDir },
    });
  let app: Awaited<ReturnType<typeof launch>> | undefined;
  const progress = {
    ...emptyProgress(),
    completed: ['inventory'],
    lastLesson: 'occupancy',
    diagnostic: true,
  };
  try {
    app = await launch();
    let window = await app.firstWindow();
    await expect(window).toHaveURL('pace://app/index.html');
    expect(
      await window.evaluate(() => {
        const globals = globalThis as typeof globalThis & { require?: unknown; process?: unknown };
        return { require: typeof globals.require, process: typeof globals.process };
      }),
    ).toEqual({ require: 'undefined', process: 'undefined' });
    await window.evaluate(
      ({ progress, profile, keys }) => {
        localStorage.setItem(keys.progress, JSON.stringify(progress));
        localStorage.setItem(keys.profile, JSON.stringify(profile));
        localStorage.setItem(
          keys.preferences,
          JSON.stringify({ version: 1, language: 'es', theme: 'dark' }),
        );
      },
      {
        progress,
        profile: createProfile('PACE QA'),
        keys: { progress: STORAGE_KEY, profile: PROFILE_KEY, preferences: PREFERENCES_KEY },
      },
    );
    await window.reload();
    await expect(window.getByRole('dialog')).toHaveCount(0);
    await window.keyboard.press('Control+k');
    await expect(window.getByRole('dialog')).toBeVisible();
    await window.keyboard.press('Escape');
    await expect(window.getByRole('dialog')).toHaveCount(0);
    await app.close();
    app = await launch();
    window = await app.firstWindow();
    await expect(window.getByRole('button', { name: 'Editar perfil' })).toContainText('PACE QA');
    expect(
      await window.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY),
    ).toEqual(progress);
    await expect(window.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(window.locator('html')).toHaveAttribute('lang', 'es-MX');
    await window.getByLabel('Comando local').fill('/practice');
    await window.getByLabel('Comando local').press('Enter');
    const practice = window.locator('#variable-practice');
    const prompt = await practice.locator('.question-title').innerText();
    const values = prompt.match(
      /(\d+) habitaciones, (\d+) fuera de servicio.* durante (\d+) noches/,
    )!;
    await practice
      .getByPlaceholder('Escribe tu respuesta')
      .fill(String((Number(values[1]) - Number(values[2])) * Number(values[3])));
    await practice.getByRole('button', { name: 'Comprobar respuesta', exact: true }).click();
    await expect(practice.getByRole('status')).toContainText('Correcto.');
    const practiced = await window.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!),
      STORAGE_KEY,
    );
    expect(practiced.attempts[0].instance.generatorVersion).toBe(1);
    expect(practiced.completed).toEqual(progress.completed);
    await app.close();
    app = await launch();
    window = await app.firstWindow();
    expect(
      await window.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY),
    ).toEqual(practiced);
  } finally {
    await app?.close();
    // Only remove the exact temporary profile created by this test.
    await rm(profileDir, { recursive: true, force: true });
  }
});
