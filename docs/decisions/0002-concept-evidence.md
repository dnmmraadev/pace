# Concept evidence and reproducible practice

Status: accepted for PACE 0.3.0.

The five fixed questions per lesson could be memorized. Completion must remain available without being presented as proficiency, and the local application cannot assess unrestricted commercial reasoning objectively.

Use pure deterministic generators in src/domain/practice.ts. Their version, seed, parameters and signature travel with generated attempts. Each concept uses the first submission on distinct data, across the latest eight instances, requiring at least five and 80% accuracy. Question IDs alone cannot create evidence. A topic requires all mapped concepts. This transparent heuristic has no established psychometric validity.

Fixed questions remain diagnostics, retrieval examples and application cases. Application/transfer first responses are reported separately; open reasoning is committed before a rubric/model response is revealed and is stored without a correctness score. No backend, AI evaluator or new runtime dependency is needed.

Retain the existing version-1 storage key, lesson IDs, historical attempts, review dates and capstone. New fields are optional. Existing fixed-question proficiency is deliberately reinterpreted as history, with learner-facing explanation. No destructive migration runs. Tests cover legacy loading, metadata round trips, duplicate data and independent arithmetic checks over 100 seeds for every generator.

Generated instances remain stable while answering. A new problem explicitly changes the seed. Review scheduling requires three correct unseen first submissions after the due time; repeats and early practice cannot advance intervals. Generator version 1 must remain reproducible when future generators change.

The main resort remains the curriculum environment; two smaller properties test transfer without duplicating lessons. Excel checks validate selected results rather than workbook execution. Forecasts expose assumptions and capacity limits instead of claiming RMS behavior. These limitations belong in product copy and documentation.
