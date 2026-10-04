# Learning content and assessment

## Curriculum

| Module | Focus |
| --- | --- |
| 0 | Non-blocking diagnostic |
| 1 | Revenue Management mental model |
| 2 | Core hotel metrics |
| 3 | Booking behavior and snapshots |
| 4 | Demand and forecasting |
| 5 | Pricing, yield and inventory |
| 6 | Segmentation and distribution |
| 7 | Benchmarking and market performance |
| 8 | Spreadsheet analysis simulations |
| 9 | Daily analyst workflow |
| 10 | Revenue meeting |
| 11 | Independent capstone |
| 12 | Interview practice |

The application includes 17 lesson loops, including 11 lessons across Modules 1–4. Later modules have initial instructional and practice content; this does not imply every advanced topic has equal depth.

## Editing content

Use src/data/curriculum.ts for explanations, formulas, worked examples, calculation exercises, retrieval questions and scenario decisions. Use the related data files for shared reference material and synthetic tables.

Keep learner-facing instructional text in neutral Latin American Spanish; preserve established Revenue Management terms. Preserve identifiers referenced by saved progress. Every scored question needs an unambiguous expected answer, appropriate numeric tolerance where applicable, and explanatory feedback. Written scenario rationales should support comparison with a strong analyst response without claiming automatic qualitative scoring.

## Mastery and review

- Completion is tracked separately from mastery.
- Demonstrated mastery uses the latest response per distinct question.
- A topic normally needs five distinct responses and at least 80% accuracy.
- An incorrect response makes its concept due for review immediately.
- Three distinct correct review responses after the due time advance the simple spacing sequence to 1, 3 and then 7 days.
- Additional early practice does not advance the spacing interval.
- Interview practice unlocks after all lessons are completed and the capstone is submitted.

The spacing rule is a practical heuristic, not a claim of scientifically optimal intervals. Learners may continue while weak concepts remain in review.

## Synthetic data conventions

The main context is a resort with about 900 rooms. Explain the period and available inventory before calculating occupancy. Examples use USD and room accommodation revenue allocations; taxes and non-room revenue are excluded unless a question explicitly introduces total revenue. Paid-room examples exclude complimentary rooms.

Distinguish small reservation samples from full-property production. Label stay dates, booking dates and snapshot dates explicitly. Net forecast pickup already accounts for losses where the exercise defines it that way; do not deduct cancellations twice.

Never present synthetic data as records from an actual hotel.

## Terminology validation

Use authoritative industry sources and write original explanations. Starting references include [HSMAI](https://academy.hsmai.org/revenue/), [IDeaS](https://ideas.com/), [STR benchmarking](https://str.com/sites/default/files/The-Ultimate-Guide-to-Hotel-Benchmarking.pdf), [SiteMinder](https://www.siteminder.com/r/revenue-management/) and [Cloudbeds](https://www.cloudbeds.com/revenue-management/). Prefer standard definitions and identify vendor-specific behavior when relevant.

Changes to calculations or scheduling should include a focused test. Content corrections should include the supporting source and explain any changed assumptions.

