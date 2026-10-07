# Architecture

PACE has a React / TypeScript renderer built with Vite and a small Electron host. It uses local data and storage, with no application server or remote progress store.

## Source map

| Location                          | Responsibility                                                       |
| --------------------------------- | -------------------------------------------------------------------- |
| src/main.tsx                      | Renderer entry point and global styles                               |
| src/app/App.tsx                   | Workspace composition, topbar, command composer and overlays         |
| src/app/useWorkspaceController.ts | Workspace navigation, session state and application coordination     |
| src/app/layout/                   | Navigation and contextual reference rails                            |
| src/app/navigation.ts             | Workspace navigation definitions                                     |
| src/app/integrations/webmcp.ts    | Optional read-only browser tools                                     |
| src/features/lessons/             | Curriculum, lessons, diagnostic, questions and study material        |
| src/features/practice/            | Practice lab, scenario tables and interview practice                 |
| src/features/capstone/            | Independent capstone and analyst self-review                         |
| src/features/progress/            | Today, mastery and review queue pages                                |
| src/features/profile/             | Onboarding and preference controls                                   |
| src/domain/content.ts             | Lesson and question contracts                                        |
| src/domain/learning.ts            | Pure assessment, mastery and review rules                            |
| src/shared/ui/                    | Brand, tables, headings and accessible dialog primitive              |
| src/shared/storage/               | Local progress, profile and preferences                              |
| src/shared/export/                | CSV serialization and browser download adapter                       |
| src/data/                         | Curriculum, study guides, synthetic scenarios and reference content  |
| src/i18n/                         | Spanish display catalog and terminology                              |
| src/styles/                       | Design tokens and workspace/component styling                        |
| desktop/main.cjs                  | Native window, protocol, security policy and desktop lifecycle       |
| scripts/                          | Architecture/graph checks and restricted-environment build utilities |
| tests/unit/                       | Pure rules, storage contracts and localization coverage              |
| tests/e2e/                        | Browser user flows and responsive layouts                            |
| tests/electron/                   | Native isolation and restart persistence                             |

## Dependency rules

The application composes features and shared modules. Features do not import application composition. Shared modules do not import features or the application. Domain modules depend only on other domain modules and do not use React, localStorage, document or native privileges. Data uses domain types; display translation may read the content and current preferences.

Pages receive typed data and callbacks. The workspace controller coordinates state shared across pages; local form state stays with its component. No extra state-management dependency is required. App is an entry/composition module, never a component barrel.

Run npm run check:architecture to resolve imports, detect circular dependencies and enforce the boundaries. Types stay close to their responsibility: shared content contracts in domain/content.ts, learning state in domain/learning.ts, and UI props next to their components.

## Learning state and compatibility

A response is evaluated against structured content, recorded with stable question and concept identifiers, and used to update mastery and review scheduling. Lesson completion is separate. Views use the same persisted progress model.

Keep the legacy localStorage key revenue-desk.progress.v1, plus pace.profile.v1 and pace.preferences.v1. Lesson, question and concept identifiers and answer values are persistence contracts. Change them only with an explicit migration and compatibility tests. Display translation must not change persisted identifiers, choices or CSV source values.

Browser and desktop origins use separate storage. No synchronization or backup mechanism is provided. The native restart test uses its own temporary PACE_TEST_PROFILE and never the user's ordinary profile.

## Desktop boundary

Packaged renderer files use the stable pace://app origin, which keeps storage independent of extraction paths. Electron retains sandboxing and context isolation with Node integration disabled. Native privileges stay in desktop/. Future native integration needs a narrow validated bridge rather than Electron imports in renderer components.

Browser tests exercise the renderer; they do not prove native packaging. The Windows CI job additionally runs the native restart test and builds the portable package.

## Content and context

All embedded reservation and hotel data is synthetic. CSV exports are practice datasets. Written scenario reasoning is retained without an automatic essay grader. Capstone numeric scoring does not assess the quality of a business recommendation.

CodeGraph keeps a regenerable local code index in ignored .codegraph/. Consult docs/codegraph.md for retrieval commands. Durable architecture decisions live in docs/decisions/ and working instructions in AGENTS.md. See [the modular architecture decision](decisions/0001-modular-architecture.md).
