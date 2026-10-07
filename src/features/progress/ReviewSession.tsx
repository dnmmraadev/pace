import { useState } from 'react';
import type { Question } from '../../domain/content';
import type { Progress } from '../../domain/learning';
import { generatePractice, isCompetency, topicCompetencies } from '../../domain/practice';
import { es } from '../../i18n/es';
import { QuestionForm } from '../lessons/QuestionForm';

export function ReviewSession({
  topic,
  concept,
  progress,
  submit,
}: {
  topic: string;
  concept?: string;
  progress: Progress;
  submit: (q: Question, answer: string, topic?: string, rationale?: string) => void;
}) {
  const create = () =>
    Array.from({ length: 3 }, (_, i) =>
      generatePractice(
        concept && isCompetency(concept)
          ? concept
          : (topicCompetencies[topic] ?? ['available-room-nights'])[
              i % (topicCompetencies[topic]?.length ?? 1)
            ],
        progress.attempts.length + i + 1,
        topic,
      ),
    );
  const [batch, setBatch] = useState(create);
  return (
    <>
      <p>{es('Review with three new problems')}</p>
      {batch.map((q) => (
        <QuestionForm key={q.id} q={q} onAnswer={(v, r) => submit(q, v, topic, r)} />
      ))}
      <button
        className="subtle"
        disabled={!batch.every((q) => progress.attempts.some((a) => a.questionId === q.id))}
        onClick={() => setBatch(create())}
      >
        {es('Review with three new problems')}
      </button>
    </>
  );
}
