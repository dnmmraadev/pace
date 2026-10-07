import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

async function check(files: Record<string, string>) {
  const root = await mkdtemp(path.join(tmpdir(), 'pace-architecture-test-'));
  assert.equal(path.dirname(root), path.resolve(tmpdir()));
  assert.ok(path.basename(root).startsWith('pace-architecture-test-'));
  try {
    for (const [file, content] of Object.entries(files)) {
      const target = path.join(root, file);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, content);
    }
    return spawnSync(process.execPath, ['scripts/check-architecture.mjs', root], {
      encoding: 'utf8',
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test('architecture check detects relative cycles including type-only edges on Windows', async () => {
  const result = await check({
    'src/domain/a.ts': "import type { B } from './b'; export type A = { value: B };",
    'src/domain/b.ts': "import type { A } from './a'; export type B = { value: A };",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Circular dependency:.*src\/domain\/a.ts.*src\/domain\/b.ts/);
});

test('architecture check rejects features that depend on app composition', async () => {
  const result = await check({
    'src/app/shell.ts': 'export const shell = 1;',
    'src/features/example/page.ts':
      "import { shell } from '../../app/shell'; export const page = shell;",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /feature cannot import application composition/);
});

test('architecture check accepts an app composed from independent features and domain', async () => {
  const result = await check({
    'src/domain/model.ts': 'export const value = 1;',
    'src/features/example/page.ts':
      "import { value } from '../../domain/model'; export const page = value;",
    'src/app/shell.ts':
      "import { page } from '../features/example/page'; export const shell = page;",
  });
  assert.equal(result.status, 0, result.stderr);
});
