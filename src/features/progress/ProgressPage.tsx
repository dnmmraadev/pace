import { lessons } from '../../data/curriculum';
import {
  mastery,
  state,
  conceptEvidence,
  applicationEvidence,
  type Progress,
} from '../../domain/learning';
import { competencies, competencyName, topicCompetencies } from '../../domain/practice';
import { usePreferences } from '../../shared/storage/preferences';
import { es } from '../../i18n/es';

import { SectionTitle } from '../../shared/ui/SectionTitle';

type Props = {
  p: Progress;
  mastered: number;
  openLesson: (id: string) => void;
  navigate: (name: string) => void;
};
export function ProgressPage({ p, mastered, openLesson, navigate }: Props) {
  const { language } = usePreferences();
  const application = applicationEvidence(p, 'application'),
    transfer = applicationEvidence(p, 'transfer');
  return (
    <>
      <SectionTitle
        eyebrow={es('YOUR LEARNING RECORD')}
        title={es('Completion is not mastery.')}
        description={es(
          'Each competency needs at least five distinct instances and 80% first-attempt accuracy in the most recent eight. This is an explainable learning heuristic, not a validated certification.',
        )}
      />
      <p>
        {es(
          'Previous completion, answers and capstone are retained. Fixed questions remain practice history; new variable evidence is needed for proficiency.',
        )}
      </p>
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
      <div className="metric-strip">
        <div>
          {es('Application checks')}
          <strong>
            {application.correct} / {application.distinct}
          </strong>
        </div>
        <div>
          {es('Transfer checks')}
          <strong>
            {transfer.correct} / {transfer.distinct}
          </strong>
        </div>
        <div>
          {es('Written reflections')}
          <strong>{p.reflections?.length ?? 0}</strong>
        </div>
      </div>
      <button className="subtle" onClick={() => navigate('Practice Lab')}>
        {es('Practice with new data')}
      </button>
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
              <small>
                {(topicCompetencies[x.id] ?? [])
                  .map((c) => `${competencyName(c, language)}: ${conceptEvidence(p, c).distinct}/5`)
                  .join(' · ')}
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
      <h2>{es('Concept evidence')}</h2>
      {Object.keys(competencies).map((c) => {
        const e = conceptEvidence(p, c);
        return (
          <div className="reference-row" key={c}>
            <strong>{competencyName(c, language)}</strong>
            <p>
              {es('Distinct instances')}: {e.distinct} · {es('First-attempt accuracy')}:{' '}
              {e.accuracy}% · {es(e.proficient ? 'Proficient' : 'More evidence needed')}
            </p>
          </div>
        );
      })}
      <p>
        {es(
          'Your commercial judgment is assessed through committed reasoning and self-review. Calculation proficiency alone does not establish job readiness.',
        )}
      </p>
      {(p.reflections ?? []).length > 0 && (
        <details>
          <summary>{es('Written reflections')}</summary>
          {p.reflections?.slice(-10).map((r, i) => (
            <div className="reference-row" key={`${r.questionId}-${r.at}-${i}`}>
              <p>{r.answer}</p>
            </div>
          ))}
        </details>
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
