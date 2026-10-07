import { Clock } from 'lucide-react';
import { findLesson, lessons } from '../../data/curriculum';
import type { Lesson } from '../../domain/content';
import type { Review } from '../../domain/learning';
import { type Progress } from '../../domain/learning';
import { es } from '../../i18n/es';
import { type Profile } from '../../shared/storage/profile';

import { SectionTitle } from '../../shared/ui/SectionTitle';

type Props = {
  profile: Profile | null;
  nextLesson: Lesson;
  due: Review[];
  p: Progress;
  mastered: number;
  openLesson: (id: string) => void;
  navigate: (name: string) => void;
};
export function TodayPage({ profile, nextLesson, due, p, mastered, openLesson, navigate }: Props) {
  return (
    <>
      <SectionTitle
        eyebrow={
          profile?.name ? `${es('YOUR SESSION')} · ${profile.name}` : es('YOUR LEARNING SESSION')
        }
        title={es('Build the judgment behind the numbers.')}
        description={es(
          'A practical path from hotel operations to revenue analysis. One concept, one calculation, one decision at a time.',
        )}
      />
      <div className="session-panel">
        <div className="session-meta">
          <span className="eyebrow">
            {es('UP NEXT · MODULE ')}
            {es(String(nextLesson.module).padStart(2, '0'))}
          </span>
          <span>
            <Clock size={14} />
            {es(' About ')}
            {es(nextLesson.minutes)}
            {es(' min')}
          </span>
        </div>
        <h2>{es(nextLesson.title)}</h2>
        <p>
          {es(
            nextLesson.id === 'inventory'
              ? 'Start with the room night: the unit behind every revenue decision. You already know hotel operations. Now put that knowledge to work analytically.'
              : nextLesson.concept.split('. ')[0] + '.',
          )}
        </p>
        <div className="session-flow">
          <span>{es('Learn')}</span>
          <span>{es('Retrieve')}</span>
          <span>{es('Calculate')}</span>
          <span>{es('Decide')}</span>
        </div>
        <button className="primary" onClick={() => openLesson(nextLesson.id)}>
          {es('Continue Session')}
        </button>
        {es(
          !p.diagnostic && (
            <button className="text-button" onClick={() => navigate('Diagnostic')}>
              {es('Take the optional 8-question diagnostic')}
            </button>
          ),
        )}
      </div>
      <div className="today-grid">
        <section>
          <div className="eyebrow">{es('REVISIT')}</div>
          <h3>
            {es(
              due.length ? `${due.length} topics ready for review` : 'Your review queue is clear',
            )}
          </h3>
          <p>
            {es(
              due.length
                ? 'Revisit weak concepts with fresh retrieval before continuing.'
                : 'Incorrect responses will return here. No streaks, no penalties.',
            )}
          </p>
          <button className="subtle" onClick={() => navigate('Review Queue')}>
            {es('Open Review Queue')}
          </button>
        </section>
        <section>
          <div className="eyebrow">{es('FOCUS')}</div>
          <h3>
            {es(
              p.reviews.length ? findLesson(p.reviews[0].topic)?.title : 'Establish your baseline',
            )}
          </h3>
          <p>
            {es(
              p.reviews.length
                ? 'This concept needs more evidence. Practice explaining the answer, not only calculating it.'
                : 'Complete the diagnostic or begin the first lesson to identify your weak concepts.',
            )}
          </p>
        </section>
      </div>
      <section className="readiness">
        <div>
          <div className="eyebrow">{es('ANALYST READINESS')}</div>
          <h3>
            {es(mastered)}
            {es(' of ')}
            {es(lessons.length)}
            {es(' topics mastered')}
          </h3>
        </div>
        <span className="mono">
          {es(Math.round((mastered / lessons.length) * 100))}
          {es('%')}
        </span>
        <progress value={mastered} max={lessons.length} />
        <p>
          {es(
            'Readiness evidence: topic mastery, independent capstone and a reasoned analyst report. Completion alone is not job readiness.',
          )}
        </p>
      </section>
    </>
  );
}
