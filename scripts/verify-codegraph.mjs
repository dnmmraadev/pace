import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function graph(args) {
  // Arguments are fixed internal CLI tokens, never user input or shell expressions.
  if (!args.every((arg) => /^[\w./-]+$/.test(arg))) throw new Error('Unexpected graph argument');
  const windows = process.platform === 'win32';
  const command = windows ? process.env.ComSpec || 'cmd.exe' : 'codegraph';
  const commandArgs = windows ? ['/d', '/s', '/c', ['codegraph.cmd', ...args].join(' ')] : args;
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.error || result.status !== 0)
    throw new Error(result.error?.message || result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
const status = graph(['status', '.', '--json']);
assert(status.initialized && status.index.state === 'complete', 'Run npm run graph:index first.');
assert(
  !status.index.reindexRecommended && status.index.pendingRefs === 0,
  'Rebuild or sync the CodeGraph index.',
);
const files = graph(['files', '--path', '.', '--json']);
assert(
  files.every((file) => existsSync(path.join(root, file.path))),
  'Graph contains removed paths; rebuild it.',
);
function verifySource(dir) {
  for (const entry of readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const file = `${dir}/${entry.name}`;
    if (entry.isDirectory()) verifySource(file);
    else if (/\.tsx?$/.test(file))
      assert(
        files.some((item) => item.path === file),
        `Missing source file: ${file}`,
      );
  }
}
verifySource('src');
assert(
  !files.some((file) =>
    /^(node_modules|dist|test-results|playwright-report|\.sites-runtime)\//.test(file.path),
  ),
  'Generated files entered the graph.',
);
for (const required of [
  'src/app/App.tsx',
  'src/domain/learning.ts',
  'src/shared/storage/progress.ts',
  'desktop/main.cjs',
]) {
  assert(
    files.filter((file) => file.path === required).length === 1,
    `Missing canonical file: ${required}`,
  );
}
const app = graph(['query', 'App', '--kind', 'function', '--path', '.', '--json']);
assert(
  app.filter((item) => item.node.name === 'App' && item.node.filePath === 'src/app/App.tsx')
    .length === 1,
  'App must have exactly one canonical definition.',
);
const affected = graph(['affected', 'src/domain/learning.ts', '--path', '.', '--json']);
for (const test of ['tests/unit/learning.test.ts', 'tests/unit/localization.test.ts']) {
  assert(affected.affectedTests.includes(test), `Missing learning dependency: ${test}`);
}
console.log(
  `CodeGraph OK: ${status.fileCount} files, ${status.nodeCount} symbols, ${status.edgeCount} relationships.`,
);
