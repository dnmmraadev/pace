import { useState } from 'react';
import type { Question, Lesson } from '../../domain/content';
import { interview, interviewCategories } from '../../data/interview';
import type { Progress } from '../../domain/learning';
import { usePreferences } from '../../shared/storage/preferences';
import { SectionTitle } from '../../shared/ui/SectionTitle';
import { QuestionForm } from '../lessons/QuestionForm';

type Props = {
  p: Progress;
  interviewUnlocked: boolean;
  nextLesson: Lesson;
  openLesson: (id: string) => void;
  submit: (q: Question, answer: string, topic?: string, rationale?: string) => void;
};
export function InterviewPage({ submit }: Props) {
  const { language } = usePreferences();
  const [category, setCategory] = useState<string>(interviewCategories[0][0]);
  const spanish = language === 'es';
  return (
    <>
      <SectionTitle
        eyebrow="MODULE 12"
        title="Interview Lab"
        description={
          spanish
            ? 'Practica entrevistas de analista junior con casos sintéticos. Responde antes de consultar la explicación. Las respuestas abiertas se revisan con criterios; no reciben calificación automática.'
            : 'Practice junior analyst screening with synthetic cases. Commit before viewing feedback. Open answers use a self-review checklist; they are not automatically graded.'
        }
      />
      <div className="panel">
        <label htmlFor="interview-category">
          {spanish ? 'Competencia de entrevista' : 'Interview competency'}
        </label>
        <select
          id="interview-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {interviewCategories.map(([id, en, es]) => (
            <option key={id} value={id}>
              {spanish ? es : en}
            </option>
          ))}
        </select>
        <p>
          {spanish
            ? 'El laboratorio está disponible desde el inicio. Usa tus propias palabras: evidencia → hipótesis → acción → seguimiento. El ejemplo de respuesta es una posibilidad defendible, no un guion obligatorio.'
            : 'The lab is available from the start. Use your own words: evidence → hypothesis → action → monitoring. A model response is one defensible possibility, not a required script.'}
        </p>
      </div>
      {interview
        .filter((q) => q.category === category)
        .map((q) => (
          <QuestionForm
            key={q.id}
            q={q}
            onAnswer={(value, rationale) => submit(q, value, 'interview', rationale)}
          />
        ))}
    </>
  );
}
