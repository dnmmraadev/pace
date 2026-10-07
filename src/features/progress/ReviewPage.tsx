import { CheckCircle2 } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { findLesson, type Question } from '../../data/curriculum';
import { mastery, type Progress } from '../../domain/learning';
import { es } from '../../i18n/es';
import { getPreferences } from '../../shared/storage/preferences';

import { SectionTitle } from '../../shared/ui/SectionTitle';
import { QuestionForm } from '../lessons/QuestionForm';

type Props = {
  p: Progress;
  reviewId: string;
  sessionKey: number;
  setReviewId: Dispatch<SetStateAction<string>>;
  setSessionKey: Dispatch<SetStateAction<number>>;
  submit: (q: Question, answer: string, topic?: string, rationale?: string) => void;
  navigate: (name: string) => void;
};
export function ReviewPage({
  p,
  reviewId,
  sessionKey,
  setReviewId,
  setSessionKey,
  submit,
  navigate,
}: Props) {
  return (
    <>
      <SectionTitle
        eyebrow={es('SPACED RETRIEVAL')}
        title={es('Make weak concepts familiar')}
        description={es(
          'Missed concepts return immediately, then after roughly 1, 3 and 7 days of successful practice. This is a simple spacing heuristic, not an optimal schedule.',
        )}
      />
      {es(
        !p.reviews.length ? (
          <div className="empty-state">
            <CheckCircle2 size={28} />
            <h2>{es('No review items yet')}</h2>
            <p>
              {es(
                'Incorrect responses appear here automatically. You can also revisit any topic from the curriculum.',
              )}
            </p>
            <button className="subtle" onClick={() => navigate('Curriculum')}>
              {es('Browse curriculum')}
            </button>
          </div>
        ) : (
          p.reviews.map((r) => (
            <button
              className="lesson-row"
              key={r.topic}
              onClick={() => {
                setReviewId(r.topic);
                setSessionKey((k) => k + 1);
              }}
            >
              <span>
                {es(findLesson(r.topic)?.title)}
                <small>
                  {es(
                    r.due <= Date.now()
                      ? 'Due now'
                      : `Next review: ${new Date(r.due).toLocaleDateString(getPreferences().language === 'es' ? 'es-MX' : 'en-US')}`,
                  )}
                </small>
              </span>
              <span className="mono">
                {es(mastery(p, r.topic))}
                {es('%')}
              </span>
              <span>{es('Practice')}</span>
            </button>
          ))
        ),
      )}
      {es(
        reviewId && (
          <section className="review-session" key={sessionKey}>
            <h2>{es(findLesson(reviewId).title)}</h2>
            <p className="muted">
              {es('Three different correct answers move this topic to its next review interval.')}
            </p>
            {es(
              findLesson(reviewId)
                .questions.slice(0, 3)
                .map((q) => (
                  <QuestionForm key={q.id} q={q} onAnswer={(v) => submit(q, v, reviewId)} />
                )),
            )}
          </section>
        ),
      )}
    </>
  );
}
