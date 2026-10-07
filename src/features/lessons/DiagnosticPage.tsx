import type { Dispatch, SetStateAction } from 'react';
import { type Question } from '../../data/curriculum';
import { diagnostic } from '../../data/diagnostic';
import { type Progress } from '../../domain/learning';
import { es } from '../../i18n/es';
import { usePreferences } from '../../shared/storage/preferences';

import { SectionTitle } from '../../shared/ui/SectionTitle';
import { QuestionForm } from './QuestionForm';

type Props = {
  submit: (q: Question, answer: string, topic?: string, rationale?: string) => void;
  setP: Dispatch<SetStateAction<Progress>>;
  setModal: Dispatch<SetStateAction<string>>;
  openLesson: (id: string) => void;
};
export function DiagnosticPage({ submit, setP, setModal, openLesson }: Props) {
  const { language } = usePreferences();
  return (
    <>
      <SectionTitle
        eyebrow={es('MODULE 00 · OPTIONAL')}
        title={es('Start with what you know')}
        description={
          language === 'es'
            ? 'Ocho preguntas breves sobre métricas, reservas, decisiones y datos. Recomiendan un punto de inicio; no bloquean contenido ni demuestran dominio.'
            : 'Eight short checks on metrics, bookings, decisions and data. They recommend a starting point; they never block content or establish mastery.'
        }
      />
      {es(
        diagnostic.map((q) => (
          <QuestionForm key={q.id} q={q} onAnswer={(v) => submit(q, v, q.topic)} />
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
