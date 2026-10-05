# PACE — White Gold Dark Accent

The canonical logo remains public/brand/pace-logo.png. Its wordmark geometry is preserved. Its original white and teal colors are retained without filters. A fixed graphite brand background makes the canonical asset readable in both light and dark themes; the image file is unchanged.

## Semantic tokens

The source of truth is src/theme.css. Components use semantic variables; compatibility aliases keep the existing component architecture unified.

| Role | Value or derivation |
| --- | --- |
| Primary background / surface | #FFFFFF |
| Secondary background / surface | #F7F6F3 |
| Subtle border / separators | #E2DDD6 |
| Primary gold | #C9A227 |
| Deep gold | #886F3D |
| Primary dark | #0F1419 |
| Secondary text | #46515B |
| Muted text | #626C75 |
| Success | #23734B |
| Warning | #865C13 |
| Error | #B33B38 |
| Information | #315D84 |
| Soft accent / status surfaces | Light color mixes derived from the tokens |
| Focus ring | Deep gold for visible contrast on white |
| Control border | Dark / separator mix for readable control boundaries |

White dominates the central workspace. Near-white supports the rails and command surface. Gold marks selection, primary actions and progress; deep gold provides readable small interactive text. Primary gold is not used as small body text on white. Gold buttons use dark text. Status colors retain their distinct meaning.

## Component language

Use compact sans-serif instructions and selective monospace readouts, formulas and commands. Numerical data uses tabular numerals and aligned columns. Keep thin separators and 4–6px radii, with a restrained dialog shadow. Table headers may wrap; dates and numeric values stay on one line. Long formulas wrap in contextual panels.

Preserve the three-part desktop workstation and collapsible right context panel. At widths of 1000px and below, navigation and contextual references open as native modal dialogs. Both reuse the desktop content; main tables scroll within their own boundaries. Touch targets, forms, stacked exercise layouts and dynamic viewport height support phone/tablet study. Buttons and fields have short functional transitions; reduced-motion settings disable them. Keyboard focus remains visible, including the command composer and scrollable tables.

See [localization](localization.md) for terminology and display-value compatibility rules.
