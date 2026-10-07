# Learning content and assessment

## Curriculum

| Module | Focus                               |
| ------ | ----------------------------------- |
| 0      | Non-blocking diagnostic             |
| 1      | Revenue Management mental model     |
| 2      | Core hotel metrics                  |
| 3      | Booking behavior and snapshots      |
| 4      | Demand and forecasting              |
| 5      | Pricing, yield and inventory        |
| 6      | Segmentation and distribution       |
| 7      | Benchmarking and market performance |
| 8      | Spreadsheet analysis simulations    |
| 9      | Daily analyst workflow              |
| 10     | Revenue meeting                     |
| 11     | Independent capstone                |
| 12     | Interview practice                  |

The application includes 17 lesson loops, including 11 lessons across Modules 1–4. Later modules have initial instructional and practice content; this does not imply every advanced topic has equal depth.

## Editing content

Use src/data/curriculum.ts for explanations, formulas, worked examples, calculation exercises, retrieval questions and scenario decisions. Use the related data files for shared reference material and synthetic tables.

Keep learner-facing instructional text in neutral Latin American Spanish; preserve established Revenue Management terms. Preserve identifiers referenced by saved progress. Every scored question needs an unambiguous expected answer, appropriate numeric tolerance where applicable, and explanatory feedback. Written scenario rationales should support comparison with a strong analyst response without claiming automatic qualitative scoring.

## Mastery and review

- Completion is tracked separately from mastery.
- Concept proficiency uses the first submission on each distinct generated parameter signature, across lessons and the practice lab.
- Each concept requires at least five distinct instances and 80% raw accuracy within the latest eight. Repeating identical data (even under a different question ID) or correcting a response adds no evidence. A topic is proficient only when every mapped competency is proficient.
- An incorrect response makes its concept due for review immediately.
- Three correct, globally unseen generated instances submitted after the due time advance the simple spacing sequence to 1, 3 and then 7 days.
- Additional early practice does not advance the spacing interval.
- Fixed questions remain canonical retrieval, diagnostic and application material, separately from generated evidence.
- Interview practice is available immediately: 30 questions in 15 categories, with one objective and one open question per category. Open responses are committed and saved before revealing a checklist and one model response; they are never automatically graded.
- Objective application and transfer indicators count first submissions per case question, separately from mastery. Written reflections and capstone self-review are separate evidence of reasoning, without an automatic correctness score.

The mastery and spacing rules are practical heuristics with no established psychometric or certification validity. Learners may continue while weak concepts remain in review. Completion and calculation proficiency alone do not establish commercial judgment or job readiness.

## Variable practice and persistence

src/domain/practice.ts provides pure seeded version-1 generators for available room nights, occupancy, ADR, RevPAR, Pickup, Pace, lead time, LOS, forecast rooms, forecast revenue, unconstrained demand, channel net revenue, percent change, MPI, ARI and RGI. Three additional contextual checks cover contribution, reconciliation and evidence versus hypotheses. src/domain/learning.ts maps these competencies to all 17 lesson loops. Lesson sessions start with variable calculation practice, retain canonical retrieval and decisions, and add related competency or mixed review. The lab allows repeated new instances without repeating lesson reading.

Each generated attempt stores concept, generator version, seed, parameter values and signature. Seeds are deterministic; no runtime random source is used. Seed plus competency reproduces the item, and signature deduplication prevents identical data from advancing mastery. Generator versions must be preserved or explicitly migrated if their rules change.

The version-1 progress key and existing identifiers remain unchanged. Optional attempt metadata, concept review identifiers and written reflections are additive. Legacy completion, attempts, reviews and capstone remain readable without rewriting storage; old fixed-question mastery is reinterpreted as history, visibly explained in Progress. Numeric input accepts common Spanish decimal-comma and English formats.

## Diagnostic, analyst assignments and transfer

The optional eight-item diagnostic covers metrics, booking behavior, pricing, distribution, forecasting, data quality, Excel and interpretation. It recommends lesson starts from missed questions, never locks content and does not establish mastery.

src/data/analystAssignments.ts contains the raw-to-summary assignment, channel lookup, transparent forecast and transfer cases. Export both CSVs, open them in Excel, clean the rows and build the requested management summary, then enter or compare results in PACE. Tasks cover filters, sorting, SUMIFS, COUNTIFS, XLOOKUP, IF/IFERROR, pivots, weighted ADR, percent variance, channel production, occupancy/RevPAR, snapshot Pickup and reconciliation. Power Query is introduced as a repeatable transformation workflow. PACE checks selected results, not the learner's actual workbook or Excel technique. Deliberately invalid raw rows are labeled as a cleaning exercise.

The forecast assignment uses an urban segment booking curve, existing-booking wash, future gross Pickup and separate future-booking losses. It distinguishes OTB, budget, forecast and actual, plus signed error/bias and scenarios. Segment rates and demand assumptions are explicit; revenue beyond capacity requires an inventory/mix decision rather than arbitrary proportional scaling. This teaching model is not an RMS or universal forecast method. Historical comparisons can fail with event, mix or calendar changes.

Transfer cases use a 180-room urban corporate hotel and 64-room leisure property with different booking windows, mix and price levels. Learners calculate unfamiliar KPIs and reason about need/compression dates, groups and displacement, channel costs, room types, MinLOS/CTA, wash and introductory overbooking risk. Open-ended decisions allow multiple evidence-supported answers and require monitoring; they do not teach occupancy-only pricing rules.

## Synthetic data conventions

The main context is a resort with about 900 rooms. Explain the period and available inventory before calculating occupancy. Examples use USD and room accommodation revenue allocations; taxes and non-room revenue are excluded unless a question explicitly introduces total revenue. Paid-room examples exclude complimentary rooms.

Distinguish small reservation samples from full-property production. Label stay dates, booking dates and snapshot dates explicitly. Net forecast pickup already accounts for losses where the exercise defines it that way; do not deduct cancellations twice.

Never present synthetic data as records from an actual hotel.

## Terminology validation

Use authoritative industry sources and write original explanations. Starting references include [HSMAI](https://academy.hsmai.org/revenue/), [IDeaS](https://ideas.com/), [STR benchmarking](https://str.com/sites/default/files/The-Ultimate-Guide-to-Hotel-Benchmarking.pdf), [SiteMinder](https://www.siteminder.com/r/revenue-management/) and [Cloudbeds](https://www.cloudbeds.com/revenue-management/). Prefer standard definitions and identify vendor-specific behavior when relevant.

Changes to calculations or scheduling should include a focused test. Content corrections should include the supporting source and explain any changed assumptions.
