import { useState } from 'react';
import { type Question } from '../../data/curriculum';
import { grade } from '../../domain/learning';
import { es } from '../../i18n/es';
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
        if (!sent && value.trim() && (!needsReason || reason.trim().length >= 15)) {
          setSent(true);
          onAnswer(value, reason);
        }
      }}
    >
      <label className="question-title" htmlFor={q.id}>
        {es(q.prompt)}
      </label>
      {es(
        options ? (
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
                  <span>{es(o)}</span>
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
            disabled={!value.trim() || (needsReason && reason.trim().length < 15)}
          >
            {es(label)}
          </button>
        ) : (
          <div role="status" className={'feedback ' + (ok ? 'correct' : 'incorrect')}>
            <strong>{es(ok ? 'Correct.' : 'Not quite.')}</strong> {es(q.explanation)}
            {es(
              !ok && (
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
