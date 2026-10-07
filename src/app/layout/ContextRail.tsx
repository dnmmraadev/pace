import { lessons } from '../../data/curriculum';
import { glossary } from '../../data/glossary';
import type { Lesson } from '../../domain/content';
import { mastery, state, type Progress } from '../../domain/learning';
import { es } from '../../i18n/es';

type Props = {
  setModal: (value: string) => void;
  view: string;
  l: Lesson;
  p: Progress;
  step: number;
  openLesson: (id: string) => void;
};
export function ContextRail({ setModal, view, l, p, step, openLesson }: Props) {
  return (
    <aside className="context-rail">
      <div className="eyebrow">{es('CONTEXT')}</div>
      <h2>{es(view === 'Lesson' ? 'Lesson reference' : 'Your training resort')}</h2>
      {es(
        view === 'Lesson' ? (
          <>
            <div className="context-section">
              <span className="eyebrow">{es('CURRENT MASTERY')}</span>
              <div className="mastery-value">
                {es(mastery(p, l.id))}
                <span>{es('%')}</span>
              </div>
              <progress value={mastery(p, l.id)} max={100} />
              <p>
                {es(state(p, l.id))}
                {es(' · target ≥80%')}
              </p>
            </div>
            <div className="context-section">
              <span className="eyebrow">{es('KEY TERMS')}</span>
              {es(
                l.terms.map((t) => (
                  <div className="term" key={t}>
                    <strong>{es(t)}</strong>
                    <p>{es(glossary[t] || 'See the lesson’s worked example.')}</p>
                  </div>
                )),
              )}
            </div>
            <details className="context-section" open={step === 0}>
              <summary>{es('Formula reference')}</summary>
              <pre>{es(l.formula)}</pre>
            </details>
            <details className="context-section">
              <summary>{es('Common mistake')}</summary>
              <p>{es(l.mistake)}</p>
            </details>
            <div className="context-section">
              <span className="eyebrow">{es('RELATED CONCEPTS')}</span>
              {es(
                lessons
                  .filter((x) => x.id !== l.id && x.terms.some((t) => l.terms.includes(t)))
                  .slice(0, 3)
                  .map((x) => (
                    <button className="related" key={x.id} onClick={() => openLesson(x.id)}>
                      {es(x.title)}
                    </button>
                  )),
              )}
            </div>
          </>
        ) : (
          <>
            <div className="resort-label">
              <span className="mono">{es('RESORT / 001')}</span>
              <h3>{es('Harbor Point Resort')}</h3>
              <p>{es('Fictional full-service, all-inclusive resort')}</p>
            </div>
            <dl className="resort-spec">
              <div>
                <dt>{es('Inventory')}</dt>
                <dd>{es('900 rooms')}</dd>
              </div>
              <div>
                <dt>{es('Currency')}</dt>
                <dd>{es('USD')}</dd>
              </div>
              <div>
                <dt>{es('Data source')}</dt>
                <dd>{es('Synthetic')}</dd>
              </div>
            </dl>
            <div className="context-section">
              <span className="eyebrow">{es('REPORTING CONVENTION')}</span>
              <p>
                {es(
                  'Room revenue is the accommodation allocation, excluding tax and non-room package components.',
                )}
              </p>
              <p>{es('All daily examples assume 900 available rooms unless stated otherwise.')}</p>
            </div>
            <div className="context-section">
              <span className="eyebrow">{es('THE LEARNING LOOP')}</span>
              <ol>
                <li>{es('Learn the concept')}</li>
                <li>{es('Retrieve from memory')}</li>
                <li>{es('Calculate and interpret')}</li>
                <li>{es('Make a decision')}</li>
                <li>{es('Review the evidence')}</li>
              </ol>
            </div>
            <div className="context-section">
              <span className="eyebrow">{es('A NOTE ON YOUR DATA')}</span>
              <p>
                {es(
                  'Every hotel, reservation and result here is invented for training. None represents an actual property.',
                )}
              </p>
            </div>
          </>
        ),
      )}
      <button className="source-button" onClick={() => setModal('Sources and conventions')}>
        {es('Sources & conventions')}
      </button>
    </aside>
  );
}
