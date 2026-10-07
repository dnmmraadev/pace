# 0001: Modular architecture for continued PACE development

Date: 2026-10-07. Status: Accepted.

PACE has one React/Vite renderer and a small Electron host. The renderer previously concentrated page markup, reusable components, state and navigation in App.tsx; Labs.tsx imported shared components from App, creating a circular dependency.

We organize renderer code by feature, retain an application composition layer, and separate pure domain rules from browser storage and exports. Reusable interface primitives live in shared/ui. Learning content and localization retain dedicated directories. A repository check resolves relative imports, rejects forbidden layer dependencies and detects cycles, including type-only imports.

The application controller coordinates the existing workspace session. Pages receive explicit typed props. Local interaction state remains in its owning component. We keep React's built-in state tools and the existing Node test runner. We do not need a monorepo, additional state library or backend at this size.

The refactor preserves all content, persistence keys and IDs, the desktop protocol origin and existing user flows. It does not introduce a storage schema migration or redesign. Browser regression tests and a native restart test validate these contracts.

CodeGraph provides a local, regenerable code index for context retrieval and dependency analysis. AGENTS.md and this decision record provide durable instructions and rationale. The graph database is ignored and is not a substitute for tests or a guarantee of automatic conversation memory.

References: [React component decomposition](https://react.dev/learn/thinking-in-react), [React state structure](https://react.dev/learn/choosing-the-state-structure), [Electron security](https://www.electronjs.org/docs/latest/tutorial/security), [Playwright practices](https://playwright.dev/docs/best-practices), [CodeGraph configuration](https://colbymchenry.github.io/codegraph/getting-started/configuration/).
