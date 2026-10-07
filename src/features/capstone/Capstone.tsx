import { Download } from 'lucide-react';
import { useState } from 'react';
import { capstoneChecks, capstoneRubric, reservations } from '../../data/scenarios';
import { grade, type Progress } from '../../domain/learning';
import { es } from '../../i18n/es';
import { downloadCSV } from '../../shared/export/downloadCSV';
import { DataTable } from '../../shared/ui/DataTable';
import { SectionTitle } from '../../shared/ui/SectionTitle';

import { ChannelTable } from '../practice/ChannelTable';
import { ForwardTable } from '../practice/ForwardTable';
export function Capstone({
  progress,
  onSubmit,
}: {
  progress: Progress;
  onSubmit: (v: NonNullable<Progress['capstone']>) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>(progress.capstone?.answers || {});
  const [insights, setInsights] = useState(progress.capstone?.insights || '');
  const [reflection, setReflection] = useState<string[]>(progress.capstone?.reflection || []);
  const submitted = progress.capstone;
  const valid =
    capstoneChecks.every((q) => answers[q.id]?.trim()) &&
    insights
      .trim()
      .split('\n')
      .filter((x) => x.trim()).length >= 5;
  return (
    <>
      <SectionTitle
        eyebrow={es('MODULE 11 · INDEPENDENT ATTEMPT')}
        title={es('Take the revenue desk.')}
        description={es(
          'Analyze the synthetic 900-room resort independently. Submit your calculations and at least five commercially relevant insights with recommended actions. Feedback appears only after submission.',
        )}
      />
      <div className="callout brief">
        <strong>{es('Your brief')}</strong>
        <p>
          {es(
            'Review KPIs, future demand, pickup and pace, pricing, channel mix and a simple forecast. Each insight should cite evidence, interpret the business impact and recommend an action. State uncertainty. You may export the datasets to Excel.',
          )}
        </p>
      </div>
      <ChannelTable />
      <ForwardTable />
      <div className="table-caption">
        <span>{es('Data audit extract · separate reservation sample')}</span>
        <button
          className="subtle"
          onClick={() => downloadCSV('synthetic-capstone-reservations.csv', reservations)}
        >
          <Download size={14} />
          {es(' Export sample')}
        </button>
      </div>
      <DataTable
        headers={['ID', 'Arrival', 'Departure', 'Room nights', 'Room revenue $', 'Status']}
        rows={reservations.map((r) => [
          r.id,
          r.arrival,
          r.departure,
          r.roomNights,
          r.revenue,
          r.status,
        ])}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid && !submitted)
            onSubmit({
              answers,
              insights,
              submitted: Date.now(),
              score: Math.round(
                (capstoneChecks.filter((q) => grade(q, answers[q.id])).length /
                  capstoneChecks.length) *
                  100,
              ),
            });
        }}
      >
        <h2>{es('Your calculations')}</h2>
        <div className="capstone-fields">
          {es(
            capstoneChecks.map((q) => (
              <label key={q.id}>
                {es(q.prompt)}
                <div className="answer-line">
                  <input
                    value={answers[q.id] || ''}
                    disabled={!!submitted}
                    required
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  />
                  <span>{es(q.unit)}</span>
                </div>
              </label>
            )),
          )}
        </div>
        <label className="question-title" htmlFor="capstone-insights">
          {es('Your analyst report — at least five insights, one per line')}
        </label>
        <textarea
          id="capstone-insights"
          rows={10}
          required
          value={insights}
          disabled={!!submitted}
          onChange={(e) => setInsights(e.target.value)}
          placeholder={es('Write your independent analysis here.')}
        />
        {es(
          !submitted && (
            <>
              <p className="muted">
                {es(
                  'A minimum of five non-empty lines is required. Calculations are graded; your written judgment is reviewed against an explicit analyst rubric.',
                )}
              </p>
              <button className="primary" disabled={!valid}>
                {es('Submit independent analysis')}
              </button>
            </>
          ),
        )}
      </form>
      {es(
        submitted && (
          <section className="analyst-review">
            <div className="eyebrow">{es('DETAILED REVIEW')}</div>
            <h2>
              {es(submitted.score)}
              {es('% calculation accuracy')}
            </h2>
            <p>
              {es(
                'This score covers only objective calculations. It does not certify the quality of your written recommendations.',
              )}
            </p>
            {es(
              capstoneChecks.map((q) => (
                <div
                  className={
                    'feedback ' + (grade(q, submitted.answers[q.id]) ? 'correct' : 'incorrect')
                  }
                  key={q.id}
                >
                  <strong>
                    {es(q.prompt)}
                    {es(': ')}
                    {es(grade(q, submitted.answers[q.id]) ? 'Correct' : 'Revisit')}
                  </strong>
                  <p>{es(q.explanation)}</p>
                </div>
              )),
            )}
            <h2>{es('Compare your judgment')}</h2>
            <p>
              {es(
                'Mark the reasoning you actually included. Unchecked points are opportunities to strengthen your report.',
              )}
            </p>
            {es(
              capstoneRubric.map(([title, body]) => (
                <div className="rubric" key={title}>
                  <label>
                    <input
                      type="checkbox"
                      checked={reflection.includes(title)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...reflection, title]
                          : reflection.filter((x) => x !== title);
                        setReflection(next);
                        onSubmit({ ...submitted, reflection: next });
                      }}
                    />
                    {es(' I addressed ')}
                    {es(title.toLowerCase())}
                  </label>
                  <p>{es(body)}</p>
                </div>
              )),
            )}
            <p>
              {es(
                capstoneRubric.length -
                  reflection.length +
                  ' rubric areas remain unconfirmed in your self-review. Review missed calculations and improve your report in Excel before treating this as readiness evidence.',
              )}
            </p>
            <button
              className="subtle"
              onClick={() =>
                downloadCSV(
                  'capstone-submission.csv',
                  capstoneChecks
                    .map((q) => ({
                      check: es(q.prompt),
                      response: submitted.answers[q.id],
                      correct: grade(q, submitted.answers[q.id]),
                      explanation: es(q.explanation),
                    }))
                    .concat([
                      {
                        check: es('Written report'),
                        response: submitted.insights,
                        correct: false,
                        explanation: es(
                          'Self-review using the analyst rubric; not automatically scored.',
                        ),
                      },
                    ]),
                )
              }
            >
              <Download size={14} />
              {es(' Export submission')}
            </button>
          </section>
        ),
      )}
    </>
  );
}
