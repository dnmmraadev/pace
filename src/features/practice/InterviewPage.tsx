import { Lock } from 'lucide-react';
import { lessons, type Question } from '../../data/curriculum';
import { interview } from '../../data/scenarios';
import type { Lesson } from '../../domain/content';
import { type Progress } from '../../domain/learning';
import { es } from '../../i18n/es';

import { SectionTitle } from '../../shared/ui/SectionTitle';
import { QuestionForm } from '../lessons/QuestionForm';

type Props = {
  p: Progress;
  interviewUnlocked: boolean;
  nextLesson: Lesson;
  openLesson: (id: string) => void;
  submit: (q: Question, answer: string, topic?: string, rationale?: string) => void;
};
export function InterviewPage({ p, interviewUnlocked, nextLesson, openLesson, submit }: Props) {
  return (
    <>
      <SectionTitle
        eyebrow={es('MODULE 12')}
        title={es('Interview Lab')}
        description={es(
          'Commit to an answer before seeing the explanation. Practice the calculation and the reasoning.',
        )}
      />
      {es(
        !interviewUnlocked ? (
          <div className="empty-state">
            <Lock size={28} />
            <h2>{es('Build the evidence first')}</h2>
            <p>
              {es('Complete all ')}
              {es(lessons.length)}
              {es(' lessons and submit the independent capstone to unlock the interview lab.')}
            </p>
            <p>
              {es(p.completed.length + ' lessons completed · Capstone')}{' '}
              {es(p.capstone ? 'submitted' : 'not submitted')}
            </p>
            <button className="primary" onClick={() => openLesson(nextLesson.id)}>
              {es('Continue learning')}
            </button>
          </div>
        ) : (
          interview.map((q) => (
            <QuestionForm key={q.id} q={q} onAnswer={(v) => submit(q, v, 'interview')} />
          ))
        ),
      )}
    </>
  );
}
