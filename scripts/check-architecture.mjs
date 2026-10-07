import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.tsx?$/.test(file)) files.push(file);
  }
}
walk(path.join(root, 'src'));
const graph = new Map();
const errors = [];
const label = (file) => path.relative(root, file).replaceAll('\\', '/');
for (const file of files) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  const dependencies = [];
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
    if (!statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const specifier = statement.moduleSpecifier.text;
    const resolved = ts.resolveModuleName(
      specifier,
      file,
      { moduleResolution: ts.ModuleResolutionKind.Bundler },
      ts.sys,
    ).resolvedModule;
    if (specifier.startsWith('.') && !resolved && !specifier.endsWith('.css')) {
      errors.push(`${label(file)}: unresolved import ${specifier}`);
    }
    // TypeScript uses slash paths even on Windows; normalize before graph lookup.
    const resolvedFile = resolved && path.resolve(resolved.resolvedFileName);
    if (resolvedFile && files.includes(resolvedFile)) dependencies.push(resolvedFile);
    const target = resolved ? label(resolved.resolvedFileName) : specifier;
    const own = label(file);
    if (
      own.startsWith('src/domain/') &&
      (!target.startsWith('src/domain/') || !specifier.startsWith('.'))
    ) {
      errors.push(`${own}: domain must depend only on domain modules (${target})`);
    }
    if (own.startsWith('src/features/') && target.startsWith('src/app/')) {
      errors.push(`${own}: feature cannot import application composition (${target})`);
    }
    if (own.startsWith('src/shared/') && /^(src\/app\/|src\/features\/)/.test(target)) {
      errors.push(`${own}: shared module cannot import app or features (${target})`);
    }
    if (specifier === 'electron' || specifier.startsWith('node:')) {
      errors.push(`${own}: native privileges belong in desktop/ (${specifier})`);
    }
  }
  graph.set(file, dependencies);
}
const visited = new Set();
const active = new Set();
function visit(file, trail) {
  if (active.has(file)) {
    errors.push(`Circular dependency: ${[...trail, file].map(label).join(' -> ')}`);
    return;
  }
  if (visited.has(file)) return;
  active.add(file);
  for (const dependency of graph.get(file) ?? []) visit(dependency, [...trail, file]);
  active.delete(file);
  visited.add(file);
}
for (const file of files) visit(file, []);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(`Architecture OK: ${files.length} source files, no cycles or forbidden imports.`);
