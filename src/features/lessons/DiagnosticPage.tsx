import type { Dispatch, SetStateAction } from 'react';
import { type Question } from '../../data/curriculum';
import { diagnostic } from '../../data/scenarios';
import { type Progress } from '../../domain/learning';
import { es } from '../../i18n/es';

import { SectionTitle } from '../../shared/ui/SectionTitle';
import { QuestionForm } from './QuestionForm';

type Props = {
  submit: (q: Question, answer: string, topic?: string, rationale?: string) => void;
  setP: Dispatch<SetStateAction<Progress>>;
  setModal: Dispatch<SetStateAction<string>>;
  openLesson: (id: string) => void;
};
export function DiagnosticPage({ submit, setP, setModal, openLesson }: Props) {
  return (
    <>
      <SectionTitle
        eyebrow={es('MODULE 00 · OPTIONAL')}
        title={es('Start with what you know')}
        description={es(
          'Five quick checks. These guide acceleration; they never block access or establish mastery by themselves.',
        )}
      />
      {es(
        diagnostic.map((q, i) => (
          <QuestionForm
            key={q.id}
            q={q}
            onAnswer={(v) =>
              submit(q, v, ['occupancy', 'adr', 'revpar', 'pickup', 'forecast-rooms'][i])
            }
          />
        )),
      )}
      <button
        className="primary"
        onClick={() => {
          setP((p) => ({ ...p, diagnostic: true }));
          setModal('Diagnostic results');
        }}
      >
        {es('See learning recommendations')}
      </button>
      <button className="text-button" onClick={() => openLesson('inventory')}>
        {es('Skip diagnostic and start learning')}
      </button>
    </>
  );
}
