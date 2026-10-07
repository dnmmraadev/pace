import { lessons } from '../../data/curriculum';
import { mastery, state, type Progress } from '../../domain/learning';
import { es } from '../../i18n/es';

import { SectionTitle } from '../../shared/ui/SectionTitle';

type Props = {
  p: Progress;
  mastered: number;
  openLesson: (id: string) => void;
  navigate: (name: string) => void;
};
export function ProgressPage({ p, mastered, openLesson, navigate }: Props) {
  return (
    <>
      <SectionTitle
        eyebrow={es('YOUR LEARNING RECORD')}
        title={es('Completion is not mastery.')}
        description={es(
          'Mastery uses the latest response to each distinct question. At least five different checks and 80% correctness are required. Reviews remain scheduled even as evidence improves.',
        )}
      />
      <div className="metric-strip">
        <div>
          <span>{es('Completed lessons')}</span>
          <strong>
            {es(p.completed.length)}
            <small>
              {es(' / ')}
              {es(lessons.length)}
            </small>
          </strong>
        </div>
        <div>
          <span>{es('Mastered topics')}</span>
          <strong>
            {es(mastered)}
            <small>
              {es(' / ')}
              {es(lessons.length)}
            </small>
          </strong>
        </div>
        <div>
          <span>{es('Exercise attempts')}</span>
          <strong>{es(p.attempts.length)}</strong>
        </div>
      </div>
      {es(
        lessons.map((x) => (
          <button className="lesson-row" key={x.id} onClick={() => openLesson(x.id)}>
            <span>
              {es(x.title)}
              <small>
                {es(p.completed.includes(x.id) ? 'Lesson completed' : 'Lesson not completed')}
                {es(' · ')}
                {es(state(p, x.id))}
              </small>
            </span>
            <progress value={mastery(p, x.id)} max={100} />
            <span className="mono">
              {es(mastery(p, x.id))}
              {es('%')}
            </span>
          </button>
        )),
      )}
      <h2>{es('Independent capstone')}</h2>
      <p>
        {es(
          p.capstone
            ? `Submitted · ${p.capstone.score}% objective calculation score. Written judgment requires comparison with the analyst rubric.`
            : 'Not submitted. Your independent report is a separate readiness milestone.',
        )}
      </p>
      <button className="subtle" onClick={() => navigate('Capstone')}>
        {es('Open capstone')}
      </button>
    </>
  );
}
