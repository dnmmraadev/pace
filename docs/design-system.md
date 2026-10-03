# PACE design system

The canonical logo is public/brand/pace-logo.png, supplied by the product owner. Preserve the uppercase wordmark, open geometric A and ascending analytics bars. Do not substitute a CSS-drawn mark.

## Tokens

The source of truth is src/theme.css. Components should use its variables rather than new literal colors.

| Role | Value |
| --- | --- |
| Background | #0B0F14 |
| Surface | #121821 |
| Elevated surface | #18202B |
| Border | #273140 |
| Primary text | #E8EDF2 |
| Secondary text | #9AA7B5 |
| Muted text | #6E7A88 |
| Accent | #4FD1C5 |
| Accent active | #38B2AC |
| Success | #68D391 |
| Warning | #F6AD55 |
| Danger | #FC8181 |

Transparency and mixed colors must derive from these tokens. The supplied logo is an asset, not a token-driven recoloring target.

## Component language

Keep graphite dominant. Use teal for primary interaction, focus, selection and progress. Use success, warning and danger only for semantic states. Use thin borders and radii generally between 4 and 8px. Avoid gradients, decorative motion and repeated floating cards.

Use sans-serif text for instructions and interface labels, with selective monospace for formulas, numerical readouts and commands. Use tabular numerals and consistent alignment in tables.

## Workstation layout

Persistent left navigation, a dominant main workspace and a compact collapsible right context panel form the desktop shell. The logo appears at the top of the navigation. Keep tables legible at ordinary laptop widths. No mobile navigation system is required.

Preserve keyboard navigation, Ctrl/Cmd + K, the local command composer and accessible modal focus behavior. All controls require visible focus and understandable labels.

