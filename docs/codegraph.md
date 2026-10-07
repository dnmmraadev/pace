# CodeGraph project context

PACE uses the locally installed CodeGraph CLI to retrieve focused source context, callers, dependencies and affected tests. It helps a future session rebuild its understanding from the current code. The durable instructions are in AGENTS.md and the rationale in docs/decisions/; the index does not store conversation memory.

## Index lifecycle

Run these commands from the repository root:

    npm run graph:index
    npm run graph:status
    npm run graph:check

After ordinary source edits use npm run graph:sync. After moving files or changing codegraph.json, rebuild with npm run graph:index. The verification checks completed reference resolution, required canonical files, a unique App definition, excluded generated files and learning-test dependencies.

Before moved files are committed, the CLI may report read warnings for removed paths still present in Git's index. npm run graph:check verifies that every current renderer source is included and that indexed paths exist. Rebuild after committing the moves to clear those discovery warnings.

The installed executable must be on PATH. The CLI is optional for npm ci, building and testing; no globally installed software is added by the project. Without CodeGraph, use focused rg searches.

## Retrieve context

    codegraph context "lesson grading progress persistence" --no-code --max-nodes 8
    codegraph query QuestionForm --limit 5
    codegraph node QuestionForm
    codegraph impact record
    codegraph affected src/domain/learning.ts --json

For 0.3.0 assessment changes, start with generatePractice, conceptEvidence and record. The generator catalog/mapping lives in src/domain/practice.ts; persisted contracts live in src/domain/content.ts and learning.ts. Interview/diagnostic and analyst assignment data have separate modules under src/data. See docs/decisions/0002-concept-evidence.md for the assessment and compatibility rationale; the index can be regenerated from source rather than carrying session history.

Use context without code first to narrow the search. Request symbol source only when needed. Treat affected tests as candidates: browser tests can depend on runtime behavior even when an import path is absent. Run native tests explicitly for Electron changes.

## Local artifacts

codegraph.json excludes dependencies, bundles and test output. .gitignore excludes the per-project .codegraph/ database. Do not commit the generated index, query dumps, personal progress or session logs. Every developer can regenerate an index from the checked-out source.

See [CodeGraph configuration](https://colbymchenry.github.io/codegraph/getting-started/configuration/) for ignore behavior and local storage.
