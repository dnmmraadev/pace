<img src="public/brand/pace-logo.png" alt="PACE" width="240">

# PACE

A desktop learning workstation for Hotel Revenue Management, from hotel operations knowledge to junior Revenue Analyst practice.

PACE 0.3.0 uses short lessons, variable calculations, commercial decisions and spaced review. All hotel data is synthetic: a roughly 900-room resort is the main environment, with a 180-room corporate hotel and 64-room leisure property for transfer practice. It is a training tool, not a production revenue system or professional certification.

![PACE desktop workspace](docs/assets/workspace.png)

All 17 lessons now include a bilingual study objective, focused reading, worked reasoning, interpretation, a commercial action and an ungraded reflection before independent practice. See [the applied research report](docs/research-revenue-learning.es.md) for sources, design decisions and limitations. Study guides are editable in src/data/studyGuides.ts; existing progress and question identifiers remain compatible.

## What you can do

- Follow 17 lesson loops, with detailed foundations in mental models, metrics, booking behavior and forecasting.
- Practice 16 quantitative competencies with reproducible, unseen numbers, plus three contextual reasoning checks.
- Calculate KPIs, compare booking snapshots and transform reservation-level CSV data into a management summary using Excel.
- Compare segment booking curves, forecast assumptions, wash, error, bias and scenario ranges.
- Work through a morning revenue workflow, meeting pack and independent capstone.
- Track completion separately from demonstrated mastery; revisit weak concepts.
- Export synthetic CSV datasets for practice in Excel.
- Use the command composer and Ctrl/Cmd + K to navigate.
- Practice 30 bilingual interview questions across 15 junior analyst categories, available from the start. Commit open answers before seeing a rubric and one defensible model response.
- Use an optional eight-question diagnostic covering calculations, decisions and data to choose a starting lesson.

PACE supports neutral Latin American Spanish and English and is optimized for desktop study, with a responsive browser layout for phones and tablets. On narrow screens, use the menu to open navigation and the context button to open lesson references; tables scroll horizontally within their own area. The Windows executable remains the desktop distribution. Use the adjacent theme and ES/ENG language buttons in the upper-right toolbar. Both controls are also available during onboarding. Both preferences are stored on this device separately from learning progress. A short Spanish onboarding asks for your preferred name and optional professional context and learning goal, then introduces the learning loop. You can skip it or edit your profile from the sidebar. Profile details and progress stay separately on your computer. No account, backend or AI API is required.

## Download the Windows desktop application

The latest published release is **0.2.0**. [Download PACE 0.2.0 for Windows x64](https://github.com/dnmmraadev/pace/releases/download/v0.2.0/PACE-0.2.0-Windows.exe), then launch the portable executable. The **0.3.0 source and local package** contain the new learning behavior described here; this change does not publish a GitHub release. The Windows build is unsigned and stores progress locally.

See the [release notes and checksum](https://github.com/dnmmraadev/pace/releases/tag/v0.2.0) and the [version policy](docs/versioning.md) for current product limitations and future compatibility rules.

## Run from source

Use Node.js 22.13 or newer and npm. Node.js 22 is the documented development baseline.

    git clone https://github.com/dnmmraadev/pace.git
    cd pace
    npm ci
    npm run dev

Open the local address printed by Vite. To launch the Windows desktop application:

    npm run desktop

To build a portable Windows x64 executable:

    npm run desktop:package

The executable is written to ../builds/0.3.0/package/PACE-0.3.0-Windows.exe. It runs without Node.js or a development server. Source builds require an Electron download during installation. See [desktop setup](docs/desktop.md) for packaging and storage details. Packaged macOS and Linux applications have not been verified.

## Check a change

    npm test
    npm run build
    npx playwright install chromium
    npm run test:browser

The browser check starts a local server when needed. See [development](docs/development.md) for test scope and an installed-Chrome alternative.

## Learning and data boundaries

Each concept needs at least five distinct generated instances and 80% first-attempt accuracy within its most recent eight distinct instances. A repeated prompt, changed question ID or correction after feedback adds no mastery evidence. A lesson is proficient only when all its mapped competencies meet that rule. Completion, fixed-question history, application/transfer calculations and ungraded reasoning remain separate. These scores are explainable learning heuristics without established psychometric validity.

Existing 0.2.0 saved progress remains readable under the same version-1 storage key: completion, answers, reviews and capstone are retained. Historical fixed answers no longer establish proficiency; learners need fresh variable evidence. Incorrect answers enter a concept review queue; three correct unseen instances after the due time advance a simple 1 / 3 / 7-day schedule. See [assessment and content](docs/learning-content.md) for details and limitations.

Written reasoning is retained for comparison with model responses, but is not automatically assessed for commercial quality. Capstone objective scoring and written self-review serve different purposes. Local progress is not a cloud backup and browser progress does not automatically transfer into the desktop application.

## Local commands

| Command   | Action                        |
| --------- | ----------------------------- |
| /next     | Continue the learning session |
| /review   | Open the review queue         |
| /formula  | Open the formula reference    |
| /glossary | Open the glossary             |
| /progress | View completion and mastery   |
| /practice | Open the practice lab         |
| /reset    | Start the progress-reset flow |

## Documentation

| Guide                                                                 | Purpose                                                        |
| --------------------------------------------------------------------- | -------------------------------------------------------------- |
| [CodeGraph](docs/codegraph.md)                                        | Local code context, indexing and affected tests                |
| [Architecture decisions](docs/decisions/0001-modular-architecture.md) | Modular organization and dependency rules                      |
| [Architecture](docs/architecture.md)                                  | Renderer, content, progress and desktop boundaries             |
| [Development](docs/development.md)                                    | Setup, checks and validation                                   |
| [Desktop](docs/desktop.md)                                            | Launching, packaging and troubleshooting                       |
| [Learning content](docs/learning-content.md)                          | Curriculum, synthetic-data rules and assessment model          |
| [Design system](docs/design-system.md)                                | Canonical brand and Graphite / Teal tokens                     |
| [Documentation research](docs/documentation-research.md)              | Sources reviewed and practices adopted                         |
| [Changelog](CHANGELOG.md)                                             | Shipped behavior and limitations                               |
| [Localization](docs/localization.md)                                  | Spanish terminology and persistence-safe display translation   |
| [Versioning](docs/versioning.md)                                      | Version research, compatibility contract and release procedure |

## Contributing, security and rights

Read [CONTRIBUTING](CONTRIBUTING.md) before proposing changes and [SECURITY](SECURITY.md) before reporting sensitive issues. Collaborators should follow the [code of conduct](CODE_OF_CONDUCT.md).

A distribution license has not been selected. The [rights notice](LICENSE) does not grant reuse rights. Third-party dependencies remain under their own licenses.
