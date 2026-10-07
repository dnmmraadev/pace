# Development

## Setup

Use Node.js 22.13+ (22 LTS baseline; Node 24 LTS also supported) and npm. Install with npm ci, then run npm run dev. Launch the Windows application with npm run desktop. Build the portable executable with npm run desktop:package.

## Checks

| Command                    | Purpose                                                                   |
| -------------------------- | ------------------------------------------------------------------------- |
| npm run lint               | ESLint, TypeScript source rules and React hook correctness                |
| npm run format             | Apply Prettier formatting                                                 |
| npm run format:check       | Verify formatting without changing files                                  |
| npm run check:architecture | Resolve renderer imports, reject cycles and forbidden layer dependencies  |
| npm run typecheck          | Check renderer, tests and TypeScript configuration files                  |
| npm test                   | Unit tests for learning rules, serialization, profile and localization    |
| npm run check              | Lint, formatting, architecture, types and unit tests                      |
| npm run build              | Type checks and production renderer build                                 |
| npm run test:browser       | Browser flows at desktop and mobile widths                                |
| npm run test:electron      | Build renderer and test the actual Electron host with a temporary profile |
| npm run desktop:package    | Build a Windows x64 portable package                                      |

For shared or structural changes run npm run check and npm run build. For interaction changes run the relevant browser specs, then the full browser suite when several pages are affected. For native host, origin or desktop storage changes run npm run test:electron and verify packaging. Add focused tests for meaningful new behavior, not merely file moves.

Install browser binaries once with npx playwright install chromium. Playwright starts Vite automatically on 127.0.0.1:5173. To use installed Chrome, set PLAYWRIGHT_CHANNEL=chrome before npm run test:browser. For a single browser spec: npm run test:browser -- tests/e2e/onboarding.spec.ts.

## Adding functionality

1. Put a lesson screen or hook in src/features/lessons/. Put another product feature in its existing feature folder; create a folder only for a distinct responsibility.
2. Put pure assessment rules in src/domain/learning.ts or a focused domain module. Update tests/unit/learning.test.ts for changed behavior.
3. Put reusable interface primitives in src/shared/ui/. Domain modules and shared components must not import src/app.
4. Compose pages and callbacks in src/app; add sidebar entries in src/app/navigation.ts.
5. Put instructional content in src/data/ and its Spanish display catalog in src/i18n/. Preserve IDs and original answer values; extend localization coverage when needed.
6. Use src/styles/theme.css tokens and existing accessible controls. Verify keyboard access, focus, desktop and mobile overflow, theme and language behavior.

For example, a forecasting practice page belongs in src/features/practice/, a new forecast calculation in src/domain/, and its synthetic input in src/data/. A reusable table remains in src/shared/ui/.

## Automation and dependencies

The Linux GitHub job runs quality checks, unit tests, renderer build and browser tests. Electron binary download is skipped in that job. The Windows job downloads Electron, verifies native restart persistence and builds the portable executable. Failures retain test artifacts for seven days. These jobs do not publish releases.

Use npm ci and commit package-lock.json with dependency changes. Review npm audit separately; do not apply forced major dependency upgrades as part of a structural refactor. CodeGraph is optional and is not required by CI or production.

## Restricted environments

scripts/build-portable.ps1 and scripts/vite.portable.mjs remain available for unusual child-process restrictions. Run the PowerShell script from any working directory; it resolves the repository root. The normal npm build is preferred. A renderer build alone does not verify the Windows executable.
