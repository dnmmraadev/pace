import { ChevronRight, Lock } from 'lucide-react';
import { lessons, modules } from '../../data/curriculum';
import { demonstrated, state, type Progress } from '../../domain/learning';
import { es } from '../../i18n/es';

import { SectionTitle } from '../../shared/ui/SectionTitle';

type Props = {
  p: Progress;
  interviewUnlocked: boolean;
  navigate: (name: string) => void;
  openLesson: (id: string) => void;
};
export function CurriculumPage({ p, interviewUnlocked, navigate, openLesson }: Props) {
  return (
    <>
      <SectionTitle
        eyebrow={es('THE LEARNING PATH')}
        title={es('From operations to analysis')}
        description={es(
          'Complete in order or jump to a topic. Mastery requires at least five distinct checks and 80% correct current evidence.',
        )}
      />
      <button className="subtle" onClick={() => navigate('Diagnostic')}>
        {es('Start diagnostic')}
      </button>
      {es(
        modules.slice(1, 11).map((m, i) => (
          <section className="curriculum-module" key={m}>
            <h2>
              <span className="mono muted">{es(String(i + 1).padStart(2, '0'))}</span> {es(m)}
            </h2>
            {es(
              lessons
                .filter((x) => x.module === i + 1)
                .map((x) => (
                  <button className="lesson-row" key={x.id} onClick={() => openLesson(x.id)}>
                    <span>
                      {es(x.title)}
                      <small>
                        {es(x.minutes)}
                        {es(' min · calculation, retrieval and decision')}
                      </small>
                    </span>
                    <span className={'status ' + (demonstrated(p, x.id) ? 'green' : '')}>
                      {es(state(p, x.id))}
                    </span>
                    <ChevronRight size={16} />
                  </button>
                )),
            )}
          </section>
        )),
      )}
      <button className="lesson-row" onClick={() => navigate('Capstone')}>
        <span>{es('11 · Independent capstone')}</span>
        <ChevronRight size={16} />
      </button>
      <button className="lesson-row" onClick={() => navigate('Interview Lab')}>
        <span>{es('12 · Interview Lab')}</span>
        {es(!interviewUnlocked && <Lock size={15} />)}
      </button>
    </>
  );
}
