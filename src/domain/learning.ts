import type { Question } from './content';
import { competencyTopic, isCompetency, topicCompetencies } from './practice';
export type Attempt = {
  questionId: string;
  topic: string;
  correct: boolean;
  answer: string;
  at: number;
  rationale?: string;
  concept?: string;
  evidence?: Question['evidence'];
  instance?: Question['instance'];
};
export type Review = { topic: string; due: number; interval: number; concept?: string };
export type Progress = {
  version: 1;
  completed: string[];
  attempts: Attempt[];
  reviews: Review[];
  lastLesson: string;
  diagnostic: boolean;
  reflections?: { questionId: string; topic: string; answer: string; at: number }[];
  capstone: null | {
    answers: Record<string, string>;
    insights: string;
    submitted: number;
    score: number;
    reflection?: string[];
  };
};
export const emptyProgress = (): Progress => ({
  version: 1,
  completed: [],
  attempts: [],
  reviews: [],
  lastLesson: 'inventory',
  diagnostic: false,
  capstone: null,
});
export function grade(q: Question, value: string) {
  if (q.kind === 'open' || !value.trim()) return false;
  return typeof q.answer === 'number'
    ? Number.isFinite(numericAnswer(value)) &&
        Math.abs(numericAnswer(value) - q.answer) <= (q.tolerance ?? 0.01)
    : value === q.answer;
}
function numericAnswer(value: string) {
  let cleaned = value.replace(/[$%\s]/g, '');
  if (/^[-+]?\d+,\d{1,2}$/.test(cleaned)) cleaned = cleaned.replace(',', '.');
  else if (/^[-+]?\d{1,3}(\.\d{3})+,\d{1,2}$/.test(cleaned))
    cleaned = cleaned.replaceAll('.', '').replace(',', '.');
  else cleaned = cleaned.replaceAll(',', '');
  return cleaned === '' ? NaN : Number(cleaned);
}
/** First submissions on unique data, recent eight instances, independently per competency. */
export function conceptEvidence(p: Progress, concept: string) {
  const first = new Map<string, Attempt>();
  for (const a of p.attempts) {
    if (
      a.evidence !== 'generated' ||
      a.concept !== concept ||
      a.instance?.generatorVersion !== 1 ||
      !a.instance.signature
    )
      continue;
    if (!first.has(a.instance.signature)) first.set(a.instance.signature, a);
  }
  const recent = [...first.values()].slice(-8);
  const correct = recent.filter((a) => a.correct).length;
  const accuracy = recent.length ? Math.round((correct / recent.length) * 100) : 0;
  return {
    distinct: recent.length,
    totalDistinct: first.size,
    correct,
    accuracy,
    proficient: recent.length >= 5 && correct / recent.length >= 0.8,
  };
}
export function mastery(p: Progress, topic: string) {
  const concepts = topicCompetencies[topic] ?? [];
  return concepts.length
    ? Math.round(
        concepts.reduce((sum, c) => sum + conceptEvidence(p, c).accuracy, 0) / concepts.length,
      )
    : 0;
}
export function demonstrated(p: Progress, topic: string) {
  const concepts = topicCompetencies[topic] ?? [];
  return concepts.length > 0 && concepts.every((c) => conceptEvidence(p, c).proficient);
}
export function applicationEvidence(p: Progress, evidence: 'application' | 'transfer') {
  const first = new Map<string, Attempt>();
  for (const a of p.attempts)
    if (a.evidence === evidence && !first.has(a.questionId)) first.set(a.questionId, a);
  const attempts = [...first.values()];
  return { distinct: attempts.length, correct: attempts.filter((a) => a.correct).length };
}
export function state(p: Progress, topic: string) {
  if (p.reviews.some((r) => r.topic === topic && r.due <= Date.now())) return 'Needs review';
  if (demonstrated(p, topic)) return 'Mastered';
  if (p.attempts.some((a) => a.topic === topic)) return 'Practicing';
  if (p.completed.includes(topic) || p.lastLesson === topic) return 'Learning';
  return 'Not started';
}
export function record(
  p: Progress,
  topic: string,
  q: Question,
  answer: string,
  now = Date.now(),
  rationale?: string,
): Progress {
  topic = q.topic ?? topic;
  if (q.kind === 'open')
    return {
      ...p,
      reflections: [...(p.reflections ?? []), { questionId: q.id, topic, answer, at: now }],
    };
  const correct = grade(q, answer);
  const attempts = [
    ...p.attempts,
    {
      questionId: q.id,
      topic,
      correct,
      answer,
      at: now,
      rationale,
      ...(q.concept ? { concept: q.concept } : {}),
      ...(q.evidence ? { evidence: q.evidence } : {}),
      ...(q.instance ? { instance: q.instance } : {}),
    },
  ];
  let reviews = p.reviews;
  const reviewTopic = topicCompetencies[topic]
    ? topic
    : q.concept && isCompetency(q.concept)
      ? competencyTopic(q.concept)
      : 'workflow';
  const reviewConcept = q.concept && isCompetency(q.concept) ? q.concept : undefined;
  // Diagnostic/application tags can be broader than the generated competency catalog.
  // Keep those as topic review so future generated practice can resolve them.
  const matches = (r: Review) =>
    r.topic === reviewTopic &&
    (!r.concept || !isCompetency(r.concept) || r.concept === reviewConcept);
  const existing = reviews.find(matches);
  const unseen =
    q.instance && !p.attempts.some((a) => a.instance?.signature === q.instance?.signature);
  if (!correct) {
    reviews = [
      ...reviews.filter((r) => !matches(r)),
      {
        topic: reviewTopic,
        ...(reviewConcept ? { concept: reviewConcept } : {}),
        due: now,
        interval: 0,
      },
    ];
  } else if (existing && existing.due <= now && unseen && q.evidence === 'generated') {
    const first = new Map<string, Attempt>();
    for (const a of attempts)
      if (
        a.evidence === 'generated' &&
        a.concept === q.concept &&
        a.instance &&
        !first.has(a.instance.signature)
      )
        first.set(a.instance.signature, a);
    const recent = [...first.values()].filter((a) => a.at >= existing.due).slice(-3);
    if (recent.length === 3 && recent.every((a) => a.correct)) {
      const interval = existing.interval === 0 ? 1 : existing.interval === 1 ? 3 : 7;
      reviews = [
        ...reviews.filter((r) => !matches(r)),
        { topic: reviewTopic, concept: q.concept, due: now + interval * 86400000, interval },
      ];
    }
  }
  return { ...p, attempts, reviews };
}
export function closeReview(p: Progress, topic: string, _now = Date.now()): Progress {
  const review = p.reviews.find((r) => r.topic === topic);
  if (review && review.interval >= 7 && demonstrated(p, topic))
    return { ...p, reviews: p.reviews.filter((r) => r.topic !== topic) };
  return p;
}
