import { useState } from 'react';
import { type Question } from '../../data/curriculum';
import { questionCopy } from '../../domain/content';
import { competencyName, isCompetency } from '../../domain/practice';
import { grade } from '../../domain/learning';
import { es } from '../../i18n/es';
import { usePreferences } from '../../shared/storage/preferences';
export function QuestionForm({
  q,
  onAnswer,
  label = 'Check answer',
}: {
  q: Question;
  onAnswer: (v: string, rationale?: string) => void;
  label?: string;
}) {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);
  const [reason, setReason] = useState('');
  const { language } = usePreferences();
  const copy = questionCopy(q, language);
  const open = q.kind === 'open';
  const needsReason = q.id.endsWith('-s');
  const ok = grade(q, value);
  const options = q.options
    ? [...q.options].sort((a, b) => {
        const hash = (s: string) =>
          [...(s + q.id)].reduce((n, c) => (n * 31 + c.charCodeAt(0)) | 0, 0);
        return hash(a) - hash(b);
      })
    : null;
  return (
    <form
      className="question"
      onSubmit={(e) => {
        e.preventDefault();
        if (
          !sent &&
          value.trim() &&
          (!open || value.trim().length >= 30) &&
          (!needsReason || reason.trim().length >= 15)
        ) {
          setSent(true);
          onAnswer(value, reason);
        }
      }}
    >
      <label className="question-title" htmlFor={q.id}>
        {q.copy ? copy.prompt : es(q.prompt)}
      </label>
      {q.concept && isCompetency(q.concept) && (
        <p className="muted">
          {es('Skill being practiced')}: {competencyName(q.concept, language)}
        </p>
      )}
      {es(
        open ? (
          <textarea
            id={q.id}
            rows={5}
            value={value}
            disabled={sent}
            onChange={(e) => setValue(e.target.value)}
            placeholder={es(
              'Describe the evidence, a hypothesis, your action and how you would monitor it.',
            )}
            minLength={30}
            required
          />
        ) : options ? (
          <fieldset disabled={sent}>
            <legend className="sr-only">{es('Choose one response')}</legend>
            {es(
              options.map((o) => (
                <label className={'choice ' + (value === o ? 'selected' : '')} key={o}>
                  <input
                    type="radio"
                    name={q.id}
                    value={o}
                    checked={value === o}
                    onChange={() => setValue(o)}
                  />
                  <span>{q.copy ? (copy.options?.[q.options!.indexOf(o)] ?? o) : es(o)}</span>
                </label>
              )),
            )}
          </fieldset>
        ) : (
          <div className="answer-line">
            <input
              id={q.id}
              autoComplete="off"
              inputMode="decimal"
              value={value}
              disabled={sent}
              onChange={(e) => setValue(e.target.value)}
              placeholder={es('Enter your answer')}
              required
            />
            <span className="mono muted">{es(q.unit)}</span>
          </div>
        ),
      )}
      {open && (
        <small>
          {es(
            'Write at least 30 characters. Your reasoning is saved for self-review, not automatically graded.',
          )}
        </small>
      )}
      {es(
        needsReason && (
          <label className="reason-label">
            {es('Defend your decision with evidence')}
            <textarea
              rows={3}
              disabled={sent}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={es('What evidence supports your action, and what would you monitor?')}
            />
            <small>
              {es(
                'At least 15 characters. Compare your reasoning with the feedback; it is not automatically graded.',
              )}
            </small>
          </label>
        ),
      )}
      {es(
        !sent ? (
          <button
            className="primary"
            disabled={
              !value.trim() ||
              (open && value.trim().length < 30) ||
              (needsReason && reason.trim().length < 15)
            }
          >
            {es(open ? 'Commit response' : label)}
          </button>
        ) : (
          <div role="status" className={'feedback ' + (open || ok ? 'correct' : 'incorrect')}>
            <strong>
              {es(
                open ? 'Response saved. Compare your reasoning.' : ok ? 'Correct.' : 'Not quite.',
              )}
            </strong>{' '}
            {q.copy ? copy.explanation : es(q.explanation)}
            {open && (
              <>
                <h3>{es('Self-review checklist')}</h3>
                <ul>
                  {copy.rubric?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <h3>{es('One defensible model response')}</h3>
                <p>{copy.modelAnswer}</p>
                <p>
                  {es(
                    'Other decisions can be defensible when supported by evidence and a monitoring plan.',
                  )}
                </p>
              </>
            )}
            {es(
              !open && !ok && (
                <span className="review-note">
                  {es('Added to your Review Queue. A mistake is useful evidence, not a penalty.')}
                </span>
              ),
            )}
          </div>
        ),
      )}
    </form>
  );
}
