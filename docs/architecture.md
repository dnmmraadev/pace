# Architecture

PACE has a React / TypeScript renderer built with Vite and a small Electron host. There is no application server or remote progress store.

## Source map

| Location | Responsibility |
| --- | --- |
| src/App.tsx | Workstation shell, navigation, lesson interaction and overlays |
| src/Labs.tsx | Practical workflows, capstone and interview surfaces |
| src/data/curriculum.ts | Structured lessons, questions and worked examples |
| src/data/scenarios.ts | Synthetic practice data and scenarios |
| src/data/formulas.ts | Formula reference |
| src/data/glossary.ts | Terminology reference |
| src/lib/learning.ts | Assessment and review rules |
| src/lib/progress.ts | Local state and persistence |
| src/lib/webmcp.ts | Optional feature-detected read-only browser tools |
| src/theme.css | Centralized design tokens |
| src/style.css | Component and layout styling |
| desktop/main.cjs | Native window, application protocol and desktop lifecycle |
| electron-builder.json | Windows packaging configuration |

## Learning state

A response is evaluated against structured content, recorded with its question and concept identifiers, and used to update mastery and review scheduling. Lesson completion is a separate action. Views read the same persisted progress model.

The existing localStorage key is revenue-desk.progress.v1. Its legacy name is retained for compatibility. Stable lesson, question and concept identifiers are persistence contracts: rename them only with a migration plan.

## Desktop boundary

Production renderer files are served through the stable pace://app origin, which allows progress to survive application restarts. The Electron renderer uses sandboxing and context isolation with Node integration disabled. Keep native privileges outside renderer components.

The optional browser-tool integration is read-only and depends on browser support; it is not an AI service. Runtime availability is not guaranteed.

## Data boundary

All embedded reservation and hotel data is synthetic. CSV exports are learning datasets, not operational hotel reports. Written scenario reasoning is retained without an automatic essay grader. Capstone numeric scoring does not prove the quality of a business recommendation.

Browser and desktop origins use separate storage. No synchronization or backup mechanism is provided.

