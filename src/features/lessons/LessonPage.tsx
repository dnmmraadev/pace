import type { Dispatch, SetStateAction } from 'react';
import { lessons, modules, type Question } from '../../data/curriculum';
import type { Lesson } from '../../domain/content';
import { es } from '../../i18n/es';
import { StudyNotes, StudyReflection, WorkedExample } from './StudyMaterial';

import { SectionTitle } from '../../shared/ui/SectionTitle';
import { QuestionForm } from './QuestionForm';

type Props = {
  l: Lesson;
  step: number;
  lessonQs: Question[];
  mixed: Lesson | undefined;
  currentQ: Question | undefined;
  sessionKey: number;
  answered: boolean;
  setStep: Dispatch<SetStateAction<number>>;
  setAnswered: Dispatch<SetStateAction<boolean>>;
  submit: (q: Question, answer: string, topic?: string, rationale?: string) => void;
  finish: () => void;
  navigate: (name: string) => void;
};
export function LessonPage({
  l,
  step,
  lessonQs,
  mixed,
  currentQ,
  sessionKey,
  answered,
  setStep,
  setAnswered,
  submit,
  finish,
  navigate,
}: Props) {
  return (
    <>
      <div className="lesson-top">
        <span className="eyebrow">{es(modules[l.module])}</span>
        <span className="mono muted">
          {es(step === 0 ? 'CONCEPT' : `${step} / ${lessonQs.length} CHECKS`)}
        </span>
      </div>
      <SectionTitle
        eyebrow={es(`LESSON ${lessons.indexOf(l) + 1} · ${l.minutes} MIN`)}
        title={es(l.title)}
      />
      <div className="step-track" aria-label={es('Learning stages')}>
        {es(
          ['Learn', 'Calculate', 'Retrieve', 'Decide', 'Mastery'].map((v, i) => (
            <span
              key={v}
              className={
                (step === 0 ? 0 : step === 1 ? 1 : step < 5 ? 2 : step === 5 ? 3 : 4) === i
                  ? 'on'
                  : ''
              }
            >
              {es(String(i + 1).padStart(2, '0'))} {es(v)}
            </span>
          )),
        )}
      </div>
      {es(
        step === 0 ? (
          <>
            <StudyNotes lesson={l} />
            <div className="formula-block">
              <span className="eyebrow">{es('THE FRAMEWORK')}</span>
              <pre>{es(l.formula)}</pre>
            </div>
            <WorkedExample lesson={l} />
            <div className="callout">
              <strong>{es('Watch for this')}</strong>
              <p>{es(l.mistake)}</p>
            </div>
            <StudyReflection lessonId={l.id} />
            {es(
              l.module >= 8 && (
                <button className="subtle" onClick={() => navigate('Practice Lab')}>
                  {es('Open the synthetic analysis tables')}
                </button>
              ),
            )}
            <div className="lesson-actions">
              <span className="muted">{es('Close the reference. Try it from memory.')}</span>
              <button
                className="primary"
                onClick={() => {
                  setStep(1);
                  setAnswered(false);
                }}
              >
                {es('Start practice')}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="exercise-heading">
              <span className="eyebrow">
                {es(
                  step === 1
                    ? 'CALCULATE'
                    : step === 5
                      ? 'MAKE A REVENUE DECISION'
                      : step > 5
                        ? 'MIXED REVIEW · ' + mixed?.title
                        : 'RETRIEVE FROM MEMORY',
                )}
              </span>
              <span className="tag">{es('LOW-STAKES PRACTICE')}</span>
            </div>
            {es(
              currentQ && (
                <QuestionForm
                  key={`${sessionKey}-${step}`}
                  q={currentQ}
                  onAnswer={(v, r) => submit(currentQ, v, step > 5 ? mixed!.id : l.id, r)}
                />
              ),
            )}
            <div className="lesson-actions">
              <button
                className="subtle"
                onClick={() => {
                  setStep(0);
                  setAnswered(false);
                }}
              >
                {es('Revisit concept')}
              </button>
              <button
                className="primary"
                disabled={!answered}
                onClick={() => {
                  if (step === lessonQs.length) finish();
                  else {
                    setStep((s) => s + 1);
                    setAnswered(false);
                  }
                }}
              >
                {es(step === lessonQs.length ? 'Finish mastery check' : 'Continue')}
              </button>
            </div>
          </>
        ),
      )}
    </>
  );
}
