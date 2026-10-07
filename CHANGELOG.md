# Changelog

## 0.3.0 — 2026-10-07 (prepared locally; not published)

- Add deterministic seeded practice for 16 quantitative competencies and three contextual checks; canonical questions no longer count as variable mastery evidence.
- Assess concepts on first submissions across at least five distinct generated instances with 80% accuracy in the latest eight; repeated data cannot inflate mastery or advance review.
- Preserve version-1 saved completion, answers, reviews and capstone, adding reproducible exercise metadata and ungraded reflections without a destructive migration.
- Expand the bilingual Interview Lab to 30 questions in 15 categories, with committed open responses, rubrics and non-required model answers; access is available from the start.
- Expand the optional diagnostic to eight checks spanning metrics, booking behavior, pricing, distribution, forecast, data quality, Excel and interpretation.
- Add downloadable reservation/channel datasets, a raw-to-summary Excel assignment, segment booking curves, visible forecast uncertainty and two transfer contexts (180-room urban and 64-room leisure hotels).
- Separate completion, concept evidence, due review, application, transfer and written reflection in progress reporting.
- Organize the renderer into app, feature, domain, shared and style modules; remove the App/Labs circular dependency.
- Separate pure learning rules from storage and CSV downloads while preserving local progress and identifiers.
- Add lint, formatting, architecture checks, test/configuration type checks and browser/native Windows CI validation.
- Add an Electron restart persistence test and local CodeGraph context workflow with durable project instructions.

- Expand all 17 lessons with bilingual study objectives, topic-specific reading, stepwise worked examples, interpretation, actions, ungraded reflection and references before independent practice.
- Document Revenue Management and learning-design research; preserve canonical questions, formulas and progress identifiers. Session time estimate is now approximately 12 minutes.
- Preserve the complete A in light mode by clipping original analytical bars to their stepped footprint rather than a rectangular region that overlaps the wordmark.
- Align all main-workspace sections to one content column, including table captions and lesson warnings; use a single focus outline around reference search.
- Make interview practice accessible from the start; preserve existing interview history.
- Consistent header icon alignment and logo dimensions across themes; adjacent theme and ES/ENG language buttons in the top toolbar.
- Responsive phone/tablet browser workspace with navigation and context dialogs, scrollable analytical tables and touch-friendly study controls.
- PACE logo blends into each theme without a surrounding tile: lettering follows the text token and analytical bars retain their original colors.

## 0.2.0 — 2026-10-03

- Publish the current feature baseline without a prerelease suffix; future releases use plain MAJOR.MINOR.PATCH numbers.
- Versioned local build output under builds/<version>/package and updated download links.
- Same learning functionality as 0.2.0-beta.1, with unchanged progress schema, identifiers and Electron security.

## 0.2.0-beta.1 — 2026-10-03

- Persistent light/dark theme and Spanish/English controls in the desktop toolbar and onboarding; language changes preserve active answers and learning progress.

- Optional Spanish onboarding with preferred name, professional context and learning objective; editable device-local profile independent of learning progress.

- White Gold Dark Accent semantic theme, accessible text/focus and monochrome display of the existing logo.
- Complete Spanish learner interface and instructional content, with stable IDs, choice values and saved progress.
- Accent-insensitive Spanish search, Spanish desktop menus and localized analytical table labels.
- Localization coverage and desktop compatibility checks.

## 0.1.0-beta.1 — 2026-10-03

First public evaluation release. The previous 1.0.0 package value was an unpublished development placeholder; see [versioning](docs/versioning.md).

- English desktop Revenue Management learning workstation with synthetic resort data.
- Guided lessons, calculation feedback, retrieval questions and scenario practice.
- Separate completion/mastery tracking with a local spaced-review queue.
- Formula and glossary references, spreadsheet exercises and CSV export.
- Daily workflow, meeting, capstone and interview practice.
- PACE Graphite / Teal branding and canonical supplied logo.
- Windows x64 portable desktop packaging with persistent local progress.
- Repository setup, architecture, contribution, security and content documentation.

Known limits: written commercial reasoning uses model-response comparison rather than automatic essay grading; progress has no cloud backup or browser-to-desktop transfer; packaged macOS/Linux targets are unverified; no mobile product or certification is provided.
