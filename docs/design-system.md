# PACE — White Gold Dark Accent

The canonical logo remains public/brand/pace-logo.png. Its wordmark geometry is preserved. The asset supplies the lettering alpha mask, colored with the current primary text token. The bars' stepped footprint is excluded from that mask so theme-dependent lettering does not overlap the original analytical bars. Those bars are displayed unchanged in color through the same stepped footprint. A rectangular bar crop would also include the A's left stroke and leave a white fragment in light mode. Explicit logo dimensions prevent theme changes from shifting its geometry. The mark has no surrounding background, border, padding or shadow; it blends into both themes without changing the image file.

## Semantic tokens

The source of truth is src/styles/theme.css. Components use semantic variables; compatibility aliases keep the existing component architecture unified.

| Role                           | Value or derivation                                  |
| ------------------------------ | ---------------------------------------------------- |
| Primary background / surface   | #FFFFFF                                              |
| Secondary background / surface | #F7F6F3                                              |
| Subtle border / separators     | #E2DDD6                                              |
| Primary gold                   | #C9A227                                              |
| Deep gold                      | #886F3D                                              |
| Primary dark                   | #0F1419                                              |
| Secondary text                 | #46515B                                              |
| Muted text                     | #626C75                                              |
| Success                        | #23734B                                              |
| Warning                        | #865C13                                              |
| Error                          | #B33B38                                              |
| Information                    | #315D84                                              |
| Soft accent / status surfaces  | Light color mixes derived from the tokens            |
| Focus ring                     | Deep gold for visible contrast on white              |
| Control border                 | Dark / separator mix for readable control boundaries |

White dominates the central workspace. Near-white supports the rails and command surface. Gold marks selection, primary actions and progress; deep gold provides readable small interactive text. Primary gold is not used as small body text on white. Gold buttons use dark text. Status colors retain their distinct meaning.

## Component language

Use compact sans-serif instructions and selective monospace readouts, formulas and commands. Numerical data uses tabular numerals and aligned columns. Keep thin separators and 4–6px radii, with a restrained dialog shadow. Table headers may wrap; dates and numeric values stay on one line. Long formulas wrap in contextual panels.

Adjacent buttons in the top toolbar switch light/dark appearance and Spanish/English. Language is a direct ES/ENG toggle rather than a dropdown. Toolbar icons share centered control dimensions; the onboarding retains both preference controls.

All direct workspace sections share centered inline margins, including warnings and dataset captions. Their vertical spacing remains component-specific. Reference search draws its focus ring around the entire search control, including its icon.

The Interview Lab requires completion of every core lesson and submission of the independent capstone. The temporary testing override has been removed from both development and compiled builds. Existing learning records and interview attempts are preserved.

Preserve the three-part desktop workstation and collapsible right context panel. At widths of 1000px and below, navigation and contextual references open as native modal dialogs. Both reuse the desktop content; main tables scroll within their own boundaries. Touch targets, forms, stacked exercise layouts and dynamic viewport height support phone/tablet study. Buttons and fields have short functional transitions; reduced-motion settings disable them. Keyboard focus remains visible, including the command composer and scrollable tables.

See [localization](localization.md) for terminology and display-value compatibility rules.
