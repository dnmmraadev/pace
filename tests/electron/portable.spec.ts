import { chromium, expect, test, type Browser } from '@playwright/test';
import { execFile, spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createProfile, PROFILE_KEY } from '../../src/shared/storage/profile';
import { STORAGE_KEY } from '../../src/shared/storage/progress';

test('portable launcher loads variable practice and saves a calculation in an isolated profile', async () => {
  test.skip(
    !process.env.PACE_PORTABLE_EXECUTABLE,
    'Requires a locally built Windows portable artifact',
  );
  const profile = await mkdtemp(path.join(tmpdir(), 'pace-portable-test-'));
  if (
    path.dirname(profile) !== path.resolve(tmpdir()) ||
    !path.basename(profile).startsWith('pace-portable-test-')
  )
    throw new Error('Unexpected QA profile path');
  // The NSIS bootstrap cannot expose Electron's Node inspector to _electron.launch.
  // Connect to its extracted app's loopback browser endpoint instead.
  const launcher = spawn(process.env.PACE_PORTABLE_EXECUTABLE!, ['--remote-debugging-port=0'], {
    windowsHide: true,
    stdio: 'ignore',
    env: { ...process.env, PACE_TEST_PROFILE: profile },
  });
  let browser: Browser | undefined;
  try {
    let port = '';
    await expect
      .poll(
        async () => {
          try {
            port = (await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split(
              '\n',
            )[0];
          } catch {
            port = '';
          }
          return port;
        },
        { timeout: 30_000 },
      )
      .toMatch(/^\d+$/);
    browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
    const page = browser.contexts()[0].pages()[0];
    await expect(page).toHaveURL('pace://app/index.html');
    await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
      key: PROFILE_KEY,
      value: createProfile('Portable QA'),
    });
    await page.reload();
    await page.getByLabel('Comando local').fill('/practice');
    await page.getByLabel('Comando local').press('Enter');
    const practice = page.locator('#variable-practice');
    const prompt = await practice.locator('.question-title').innerText();
    const numbers = prompt.match(
      /(\d+) habitaciones, (\d+) fuera de servicio.* durante (\d+) noches/,
    )!;
    await practice
      .getByPlaceholder('Escribe tu respuesta')
      .fill(String((Number(numbers[1]) - Number(numbers[2])) * Number(numbers[3])));
    await practice.getByRole('button', { name: 'Comprobar respuesta', exact: true }).click();
    await expect(practice.getByRole('status')).toContainText('Correcto.');
    const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY);
    expect(saved.attempts[0]).toMatchObject({
      correct: true,
      evidence: 'generated',
      instance: { generatorVersion: 1 },
    });
  } finally {
    // Use the owned bootstrap process tree for reliable portable cleanup.
    // Graceful shutdown and restart are tested through the packaged Electron binary.
    if (launcher.exitCode === null && launcher.pid) {
      await new Promise<void>((resolve, reject) => {
        execFile(
          'taskkill',
          ['/PID', String(launcher.pid), '/T', '/F'],
          { windowsHide: true },
          (error) => (error ? reject(error) : resolve()),
        );
      });
    }
    await expect.poll(() => launcher.exitCode, { timeout: 10_000 }).not.toBeNull();
    await browser?.close();
    await rm(profile, { recursive: true, force: true });
  }
});
