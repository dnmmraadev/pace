# Working on PACE

## Context and CodeGraph

- Work from the repository root. Read docs/architecture.md and docs/development.md for the current map and commands.
- Use the installed CodeGraph CLI to recover code context before reading large source files: `npm run graph:status`, then `codegraph context "your task" --no-code --max-nodes 8`.
- Run `npm run graph:index` when the index is missing or after restructuring/configuration changes. Run `npm run graph:sync` after ordinary edits, then `npm run graph:check`.
- Use `codegraph impact SYMBOL` and `codegraph affected src/path.ts --json` to inspect dependencies and select focused tests. Verify important conclusions against source; a graph is an aid, not proof of correctness.
- CodeGraph is optional for building and CI. If unavailable, use targeted `rg` searches and disclose the limitation. Do not install or alter global agent integrations incidentally.
- Keep `.codegraph/` local and ignored. Preserve durable project decisions in docs/decisions/, not generated graph dumps or conversation logs.

## Boundaries

- src/app composes the workspace. Features must not import app modules.
- Put a feature's pages, components and hooks in src/features/<feature>. Shared modules must not import features or app.
- src/domain contains types and pure learning rules; it must not import React, browser APIs, data fixtures or storage.
- src/data contains synthetic learning content; src/i18n handles display translation. Never translate persisted IDs or answer values.
- Browser persistence belongs in src/shared/storage; CSV serialization/downloads in src/shared/export. Native privileges stay in desktop/.
- Preserve `revenue-desk.progress.v1`, `pace.profile.v1`, `pace.preferences.v1`, the `pace://app` origin, and lesson/question/concept IDs. Storage changes need a migration and compatibility tests.
- Use existing design tokens and components. Keep keyboard access, mobile layouts and Spanish/English behavior.
- Prefer existing architecture and dependencies. Do not add backend, authentication or AI services during routine refactoring.

## Validation and efficiency

- Search narrowly with `rg`; batch independent reads and avoid large output or repeated checks.
- Run `npm run check` and `npm run build` for shared or structural changes. Run relevant browser tests for UI changes; run `npm run test:electron` for native host or origin/persistence changes.
- `npm run check:architecture` enforces import boundaries and detects cycles. Keep it passing.
- Use focused meaningful tests. Use subagents only when independent workstreams justify them.
- Do not commit dependencies, builds, executables, local profiles, secrets or generated graph databases.
