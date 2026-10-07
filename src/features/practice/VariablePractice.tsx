import { useState } from 'react';
import { conceptEvidence, type Progress } from '../../domain/learning';
import {
  competencies,
  competencyName,
  generatePractice,
  type Competency,
} from '../../domain/practice';
import type { Question } from '../../domain/content';
import { es } from '../../i18n/es';
import { usePreferences } from '../../shared/storage/preferences';
import { QuestionForm } from '../lessons/QuestionForm';

export function VariablePractice({
  progress,
  onAnswer,
}: {
  progress: Progress;
  onAnswer: (q: Question, answer: string, topic?: string, rationale?: string) => void;
}) {
  const { language } = usePreferences();
  const [concept, setConcept] = useState<Competency>('available-room-nights');
  const [q, setQuestion] = useState(() =>
    generatePractice('available-room-nights', progress.attempts.length + 1),
  );
  const [submitted, setSubmitted] = useState(false);
  const [sequence, setSequence] = useState(progress.attempts.length + 1);
  const evidence = conceptEvidence(progress, concept);
  const next = (value: Competency = concept) => {
    const seed = Math.max(sequence + 1, progress.attempts.length + 1);
    setSequence(seed);
    setConcept(value);
    setQuestion(generatePractice(value, seed));
    setSubmitted(false);
  };
  return (
    <section className="session-panel" id="variable-practice">
      <h2>{es('Variable practice')}</h2>
      <p>
        {es(
          'First submissions across distinct data count toward proficiency. Repeating an identical item or correcting it after feedback does not add evidence.',
        )}
      </p>
      <label>
        {es('Practice competency')}{' '}
        <select value={concept} onChange={(e) => next(e.target.value as Competency)}>
          {(Object.keys(competencies) as Competency[]).map((c) => (
            <option key={c} value={c}>
              {competencyName(c, language)}
            </option>
          ))}
        </select>
      </label>
      <p className="mono">
        {es('Distinct instances')}: {evidence.distinct} / 5 · {es('First-attempt accuracy')}:{' '}
        {evidence.accuracy}% · {es(evidence.proficient ? 'Proficient' : 'More evidence needed')}
      </p>
      <QuestionForm
        key={q.id}
        q={q}
        onAnswer={(answer, rationale) => {
          onAnswer(q, answer, q.topic, rationale);
          setSubmitted(true);
        }}
      />
      <button className="subtle" disabled={!submitted} onClick={() => next()}>
        {es('New problem')}
      </button>
    </section>
  );
}
