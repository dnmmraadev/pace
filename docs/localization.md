# Spanish localization

PACE's learner-facing product uses neutral Latin American Spanish with hotel terminology appropriate for Mexico and LATAM.

The catalog lives in src/i18n/: lessons.es.ts contains all lesson copy, reference.es.ts covers glossary/formulas/scenarios, ui.es.ts covers interface labels, and es.ts binds display copy and handles dynamic readouts. The components translate at the presentation boundary.

0.3.0 adds release.es.ts for new UI labels. Generated exercises, the diagnostic, interviews and analyst assignments carry explicit ES/EN copies in their data contracts; choice labels bind by original option index without changing stored values. Broader diagnostic items have new identifiers; legacy diagnostic records retain their original meaning in history.

## Compatibility

Do not translate or rename lesson/question IDs, view keys, command strings, option values, saved answers, reflection keys or dataset field names. Original values remain the grading/filtering/persistence contract; their rendered labels are Spanish. CSV source datasets preserve their technical fields and coded values so existing Excel exercises continue to work. User-entered reports are retained verbatim.

Question choices must retain their original order in the source-to-copy binding. When editing structured content, update its corresponding translation and coverage tests together. Do not repurpose an existing question ID for a new assessment.

Search uses translated titles and descriptions and matches with or without accents. Numeric and review-date readouts use es-MX formatting. English Excel function names and code-facing sample identifiers remain intact; Spanish equivalents are explained in the reference.

## Terminology

Use Revenue Management, Revenue Manager, Revenue Analyst, ADR, RevPAR, TRevPAR, OTB, OTA, GDS, BAR, LOS, MinLOS, Pickup and Pace in their established context. Use pronóstico for forecast, anticipación (lead time), ventana de reservación, conjunto competitivo, condición tarifaria (rate fence), and caso integrador for capstone.

Navigation uses Hoy, Ruta de aprendizaje, Cola de repaso, Laboratorio de práctica, Hoja de fórmulas, Glosario, Laboratorio de entrevistas and Progreso.

## Validation

Run npm test for complete instructional/reference coverage and preservation of choice values, IDs and CSV codes. Run npm run test:browser for Spanish navigation, accent-insensitive search, table filters, CSV export, saved-progress compatibility and all 17 lesson views. Review desktop screenshots for text wrapping and clipping. Electron menu labels are explicitly Spanish; its security configuration stays unchanged.
