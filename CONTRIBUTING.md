# Contributing to PACE

PACE is a bilingual Spanish/English desktop learning workstation. Preserve its content architecture, local progress and keyboard-first workflow.

## Before changing code

Describe the problem in an issue or a small pull request. For substantial product changes, discuss scope with the repository owner first. Include industry references for terminology or formula corrections.

Install dependencies with npm ci. Run npm run check and npm run build for changes to learning logic or shared code. Use npm run test:browser for interaction changes. See [development](docs/development.md) for native-host verification.

## Review checklist

- Explain the problem, resulting behavior and relevant checks.
- Keep content separate from components and preserve persisted identifiers.
- Use the existing design tokens and canonical logo.
- Use only synthetic data; exclude personal information and application profiles.
- Preserve keyboard access, labels and visible focus.
- Do not commit node_modules, generated builds, executables or secrets.
- Add focused tests for meaningful calculation or learning-rule changes.

Follow the [code of conduct](CODE_OF_CONDUCT.md). Contribution review does not itself grant a distribution license; see the [rights notice](LICENSE).

## Structure and context

Read [architecture](docs/architecture.md), [development](docs/development.md) and [CodeGraph](docs/codegraph.md) before structural work. Keep feature code with its feature, pure rules in domain, browser adapters in shared, and native code in desktop. The architecture check enforces these boundaries and prevents circular imports. Record substantial architecture decisions in docs/decisions/.
