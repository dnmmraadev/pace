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
    electron.launch({ args: ['.'], env: { ...process.env, PACE_TEST_PROFILE: profileDir } });
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
  } finally {
    await app?.close();
    // Only remove the exact temporary profile created by this test.
    await rm(profileDir, { recursive: true, force: true });
  }
});
