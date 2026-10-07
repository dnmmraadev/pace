import { ArrowUpDown, Download, Filter } from 'lucide-react';
import { useState } from 'react';
import { capstoneRubric, reservations } from '../../data/scenarios';
import type { Question } from '../../domain/content';
import { es } from '../../i18n/es';
import { downloadCSV } from '../../shared/export/downloadCSV';
import { getPreferences } from '../../shared/storage/preferences';
import { DataTable } from '../../shared/ui/DataTable';
import { SectionTitle } from '../../shared/ui/SectionTitle';
import { QuestionForm } from '../lessons/QuestionForm';
const number = (n: number) =>
  n.toLocaleString(getPreferences().language === 'es' ? 'es-MX' : 'en-US', {
    maximumFractionDigits: 2,
  });

import { ChannelTable } from './ChannelTable';
import { ForwardTable } from './ForwardTable';
export function PracticeLab({ onAttempt }: { onAttempt: (q: Question, v: string) => void }) {
  const [tab, setTab] = useState('Forward dates');
  const [channel, setChannel] = useState('All');
  const [confirmed, setConfirmed] = useState(true);
  const [sort, setSort] = useState(false);
  const [clean, setClean] = useState(false);
  const [pivot, setPivot] = useState(false);
  const [occ, setOcc] = useState('');
  const [adr, setAdr] = useState('');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);
  const filtered = reservations
    .filter(
      (r) =>
        (channel === 'All' || r.channel === channel) &&
        (!confirmed || r.status === 'Confirmed') &&
        (!clean || r.roomNights > 0),
    )
    .sort((a, b) => (sort ? b.revenue - a.revenue : a.id.localeCompare(b.id)));
  const rooms = filtered.reduce((a, r) => a + r.roomNights, 0);
  const revenue = filtered.reduce((a, r) => a + r.revenue, 0);
  const groups = [...new Set(filtered.map((r) => r.channel))].map((c) => {
    const rows = filtered.filter((r) => r.channel === c);
    return [
      c,
      rows.length,
      rows.reduce((a, r) => a + r.roomNights, 0),
      rows.reduce((a, r) => a + r.revenue, 0),
    ] as [string, number, number, number];
  });
  const labQ: Question = {
    id: 'excel-live-sum-' + channel + '-' + confirmed + '-' + clean,
    prompt: 'Using the visible filtered rows, calculate total room revenue.',
    answer: revenue,
    unit: 'USD',
    explanation: `The current filter totals $${number(revenue)}. A SUMIFS or a pivot value aggregation should reconcile to that result.`,
  };
  return (
    <>
      <SectionTitle
        eyebrow={es('SYNTHETIC DATA · PRACTICE LAB')}
        title={es('Work the data. Explain the result.')}
        description={es(
          'A focused simulation of an analyst’s workflow. Export the same data to repeat the exercise in Excel.',
        )}
      />
      <div className="tabs" role="tablist" aria-label={es('Practice datasets')}>
        {es(
          ['Forward dates', 'Excel workflow', 'Morning & meeting'].map((t) => (
            <button
              role="tab"
              aria-selected={tab === t}
              className={tab === t ? 'selected' : ''}
              onClick={() => setTab(t)}
              key={t}
            >
              {es(t)}
            </button>
          )),
        )}
      </div>
      {es(
        tab === 'Forward dates' && (
          <>
            <ForwardTable />
            <div className="exercise-grid">
              <QuestionForm
                q={{
                  id: 'lab-pickup',
                  prompt: 'November 14: calculate seven-day net pickup.',
                  answer: 80,
                  unit: 'rooms',
                  explanation: '740 − 660 = +80 rooms.',
                }}
                onAnswer={(v) =>
                  onAttempt({ id: 'lab-pickup', prompt: 'Pickup', answer: 80, explanation: '' }, v)
                }
              />
              <QuestionForm
                q={{
                  id: 'lab-fc',
                  prompt: 'November 18: forecast occupancy using the net pickup assumption.',
                  answer: 55.56,
                  tolerance: 0.05,
                  unit: '%',
                  explanation: '(410 + 90) / 900 × 100 = 55.56%.',
                }}
                onAnswer={(v) =>
                  onAttempt(
                    {
                      id: 'lab-fc',
                      prompt: 'Forecast occupancy',
                      answer: 55.56,
                      tolerance: 0.05,
                      explanation: '',
                    },
                    v,
                  )
                }
              />
            </div>
            <h2>{es('Test a rate and volume assumption')}</h2>
            <p>
              {es(
                'Compare a hypothetical strategy with yesterday’s $213.33 RevPAR. This arithmetic is not an estimate of price elasticity.',
              )}
            </p>
            <div className="inline-fields">
              <label>
                {es('Occupancy (%)')}
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={occ}
                  onChange={(e) => setOcc(e.target.value)}
                />
              </label>
              <label>
                {es('ADR (USD)')}
                <input type="number" min="0" value={adr} onChange={(e) => setAdr(e.target.value)} />
              </label>
              <output>
                {es(
                  occ && adr && +occ >= 0 && +occ <= 100 && +adr >= 0
                    ? `RevPAR $${number((+occ / 100) * +adr)} · Room revenue $${number(((900 * +occ) / 100) * +adr)}`
                    : 'Enter valid rate and occupancy assumptions.',
                )}
              </output>
            </div>
          </>
        ),
      )}
      {es(
        tab === 'Excel workflow' && (
          <>
            <div className="toolbar">
              <label>
                <Filter size={14} />
                {es(' Channel')}
                <select value={channel} onChange={(e) => setChannel(e.target.value)}>
                  {es(
                    ['All', 'Direct', 'OTA', 'Wholesale', 'GDS'].map((c) => (
                      <option key={c} value={c}>
                        {es(c)}
                      </option>
                    )),
                  )}
                </select>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                {es(' Confirmed only')}
              </label>
              <button className="subtle" onClick={() => setSort(!sort)}>
                <ArrowUpDown size={14} />
                {es(sort ? 'Sort by ID' : 'Revenue high to low')}
              </button>
              <button
                className="subtle"
                onClick={() => downloadCSV('synthetic-reservation-sample.csv', filtered)}
              >
                <Download size={14} />
                {es(' Export filtered CSV')}
              </button>
            </div>
            <DataTable
              headers={[
                'ID',
                'Booked',
                'Arrival',
                'Departure',
                'Channel',
                'Segment',
                'Status',
                'Room nights',
                'Revenue $',
              ]}
              rows={filtered.map((r) => [
                r.id,
                r.booked,
                r.arrival,
                r.departure,
                r.channel,
                r.segment,
                r.status,
                r.roomNights,
                r.revenue,
              ])}
            />
            <p className="table-note">
              {es(
                'Synthetic reservation sample, not the full production ledger. One row per reservation; reservations can contain multiple rooms. Do not reconcile its totals to yesterday’s production table.',
              )}
            </p>
            <div className="workflow-controls">
              <label>
                <input
                  type="checkbox"
                  checked={clean}
                  onChange={(e) => setClean(e.target.checked)}
                />
                {es(' Quarantine zero-room-night anomaly R007')}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={pivot}
                  onChange={(e) => setPivot(e.target.checked)}
                />
                {es(' Build channel pivot summary')}
              </label>
            </div>
            {es(
              pivot && (
                <>
                  <DataTable
                    headers={['Channel', 'COUNTIFS rows', 'SUM room nights', 'SUM revenue $']}
                    rows={groups}
                  />
                  <p>
                    {es('Weighted ADR for visible rows: ')}
                    <span className="mono">
                      {es(rooms ? `$${number(revenue / rooms)}` : 'Undefined: zero room nights')}
                    </span>
                    {es('. ')}
                    {es(
                      clean
                        ? 'R007 is excluded pending investigation.'
                        : 'Check R007 before trusting this average.',
                    )}
                  </p>
                </>
              ),
            )}
            <QuestionForm key={labQ.id} q={labQ} onAnswer={(v) => onAttempt(labQ, v)} />
            <div className="formula-block">
              <span className="eyebrow">{es('REPEAT IN EXCEL')}</span>
              <pre>
                {es(
                  '=SUMIFS(Revenue,Channel,"Direct",Status,"Confirmed")\n=COUNTIFS(Channel,"Direct",Status,"Confirmed")\n=Departure-Arrival\n=Arrival-Booked\n=XLOOKUP(Channel,Map[Channel],Map[CostRate],"Unmapped")\n=IF(RoomNights=0,"Investigate","Valid")',
                )}
              </pre>
            </div>
            <p>
              {es(
                'Power Query exercise: import the CSV, set dates and numeric types, trim text, filter status, flag invalid room nights, group by channel, then refresh. Conditional formatting can highlight invalid rows; it must not modify source values.',
              )}
            </p>
          </>
        ),
      )}
      {es(
        tab === 'Morning & meeting' && (
          <>
            <ChannelTable />
            <ForwardTable />
            <h2>{es('Write your analyst note')}</h2>
            <p>
              {es(
                'Identify a risk, an opportunity and a data anomaly. Separate observation, interpretation and recommendation. Include a forecast revision, a pricing action and who should follow up.',
              )}
            </p>
            <label className="sr-only" htmlFor="analyst-note">
              {es('Analyst note')}
            </label>
            <textarea
              id="analyst-note"
              rows={8}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={sent}
              placeholder={es(
                'Observation: …\\nInterpretation: …\\nRecommendation, owner and follow-up: …',
              )}
            />
            <button
              className="primary"
              disabled={note.trim().length < 40 || sent}
              onClick={() => setSent(true)}
            >
              {es('Commit note and compare')}
            </button>
            {es(
              sent && (
                <section className="analyst-review">
                  <h2>{es('A strong analyst response')}</h2>
                  {es(
                    capstoneRubric.map(([title, body]) => (
                      <div key={title}>
                        <h3>{es(title)}</h3>
                        <p>{es(body)}</p>
                      </div>
                    )),
                  )}
                  <p>
                    {es(
                      'Your writing is not automatically graded. Compare evidence, reasoning, trade-offs and ownership.',
                    )}
                  </p>
                  <button className="subtle" onClick={() => setSent(false)}>
                    {es('Revise my note')}
                  </button>
                </section>
              ),
            )}
          </>
        ),
      )}
    </>
  );
}
