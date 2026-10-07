import { useState } from 'react';
import type { Question } from '../../domain/content';
import type { Progress } from '../../domain/learning';
import {
  analystRows,
  analystSources,
  bookingCurve,
  channelLookup,
  excelBrief,
  excelQuestions,
  excelSteps,
  financeControl,
  forecastBrief,
  forecastContext,
  forecastQuestions,
  forecastSegments,
  transferCases,
  type AssignmentCopy,
} from '../../data/analystAssignments';
import { downloadCSV } from '../../shared/export/downloadCSV';
import { getPreferences } from '../../shared/storage/preferences';
import { DataTable } from '../../shared/ui/DataTable';
import { QuestionForm } from '../lessons/QuestionForm';

export function AnalystAssignments({
  progress,
  onAnswer,
}: {
  progress: Progress;
  onAnswer: (q: Question, answer: string, topic?: string, rationale?: string) => void;
}) {
  const [section, setSection] = useState('excel');
  const language = getPreferences().language;
  const text = (copy: AssignmentCopy) => copy[language];
  const t = (es: string, en: string) => (language === 'es' ? es : en);
  const checks = (questions: Question[]) => (
    <div className="exercise-grid">
      {questions.map((q) => (
        <QuestionForm
          key={q.id}
          q={q}
          onAnswer={(answer, rationale) => onAnswer(q, answer, q.topic, rationale)}
        />
      ))}
    </div>
  );
  const attempts = progress.attempts.filter(
    (a) =>
      a.questionId.startsWith('assignment-') ||
      a.questionId.startsWith('forecast-') ||
      a.questionId.startsWith('transfer-'),
  ).length;
  return (
    <section className="card">
      <h2>{t('Asignaciones del analista', 'Analyst assignments')}</h2>
      <p>
        {t(
          'Casos sintéticos para aplicar habilidades. Los cálculos cuentan como aplicación o transferencia; los textos se revisan con rúbrica, sin calificación automática. El dominio requiere también ejemplos cuantitativos nuevos.',
          'Synthetic cases for applying skills. Calculations count as application or transfer; written answers use a rubric without automatic grading. Proficiency also requires new quantitative examples.',
        )}
      </p>
      <p>
        {t(
          'Intentos de cálculo registrados en estas asignaciones:',
          'Recorded calculation attempts in these assignments:',
        )}{' '}
        {attempts}
      </p>
      <div className="tabs" role="tablist" aria-label={t('Asignaciones', 'Assignments')}>
        {[
          ['excel', t('Excel: del Raw al resumen', 'Excel: raw to summary')],
          ['forecast', t('Forecast y supuestos', 'Forecast and assumptions')],
          ['transfer', t('Transferencia comercial', 'Commercial transfer')],
        ].map(([id, name]) => (
          <button
            key={id}
            role="tab"
            aria-selected={section === id}
            className={section === id ? 'selected' : ''}
            onClick={() => setSection(id)}
          >
            {name}
          </button>
        ))}
      </div>
      {section === 'excel' && (
        <>
          <h3>
            {t(
              'Entrega: resumen para la reunión de Revenue',
              'Deliverable: Revenue meeting summary',
            )}
          </h3>
          <p>{text(excelBrief)}</p>
          <div className="button-row">
            <button onClick={() => downloadCSV('pace-synthetic-reservations-030.csv', analystRows)}>
              {t('Exportar reservas Raw', 'Export raw reservations')}
            </button>
            <button onClick={() => downloadCSV('pace-synthetic-channels-030.csv', channelLookup)}>
              {t('Exportar lookup de canales', 'Export channel lookup')}
            </button>
          </div>
          <ol>
            {excelSteps.map((step, index) => (
              <li key={index}>{text(step).replace(/^\d\. /, '')}</li>
            ))}
          </ol>
          <p>
            {t('Control financiero sintético, USD:', 'Synthetic Finance control, USD:')}{' '}
            {financeControl.toFixed(2)}
          </p>
          <details>
            <summary>
              {t(
                'Vista previa del Raw: incluye errores intencionales',
                'Raw preview: includes intentional errors',
              )}
            </summary>
            <DataTable
              headers={[
                'ID',
                'booked',
                'arrival',
                'departure',
                'rooms',
                'nightlyRate',
                'channel',
                'cancelled',
                'roomType',
              ]}
              rows={analystRows.map((r) => [
                r.id,
                r.booked,
                r.arrival,
                r.departure,
                r.rooms,
                r.nightlyRate,
                r.channel,
                r.cancelled,
                r.roomType,
              ])}
            />
            <p>
              {t(
                'Los nombres de columnas son claves técnicas del CSV. booked = fecha de reserva; arrival = llegada; departure = salida; rooms = habitaciones; nightlyRate = tarifa por noche; channel = canal; cancelled = fecha de cancelación; roomType = tipo. DIRECT: directo; OTA: agencia online; CORPORATE: corporativo; GROUP: grupo; SUITE: suite; STANDARD: estándar; UNKNOWN: desconocido.',
                'Column names are technical CSV keys. booked = booking date; arrival/departure = stay dates; rooms = room count; nightlyRate = rate per room per night; channel = booking channel; cancelled = cancellation date; roomType = room category. DIRECT, OTA, CORPORATE and GROUP are channel codes; SUITE and STANDARD are room categories; UNKNOWN means unmatched.',
              )}
            </p>
          </details>
          {checks(excelQuestions)}
        </>
      )}
      {section === 'forecast' && (
        <>
          <h3>
            {t(
              'Una noche, tres segmentos, incertidumbre visible',
              'One night, three segments, visible uncertainty',
            )}
          </h3>
          <p>{text(forecastBrief)}</p>
          <p>
            {t(
              'Booking curve muestra cómo cambia OTB al acercarse la llegada para la misma fecha de estancia. Wash es la reducción esperada de reservas ya en OTB, por cancelaciones u otras pérdidas definidas. Sirven para estimar lo que falta por reservar y lo que podría perderse; no garantizan demanda ni identifican por sí solos la causa de un cambio.',
              'A booking curve shows how OTB changes as arrival approaches for the same stay date. Wash is the expected reduction of existing OTB from cancellations or other defined losses. They help estimate remaining bookings and possible losses; they do not guarantee demand or independently identify why bookings changed.',
            )}
          </p>
          <DataTable
            headers={[
              t('Días a llegada', 'Days to arrival'),
              t('Corporativo', 'Corporate'),
              t('Ocio', 'Leisure'),
              t('Grupo', 'Group'),
            ]}
            rows={bookingCurve.map((r) => [r.days, r.corporate, r.leisure, r.group])}
          />
          <DataTable
            headers={[
              t('Segmento', 'Segment'),
              'OTB',
              t('Pickup bruto', 'Gross Pickup'),
              t('Wash actual', 'Existing wash'),
              t('Pérdidas futuras', 'Future losses'),
              'ADR',
            ]}
            rows={forecastSegments.map((r) => [
              r.segment === 'Corporate'
                ? t('Corporativo', 'Corporate')
                : r.segment === 'Leisure'
                  ? t('Ocio', 'Leisure')
                  : t('Grupo', 'Group'),
              r.otb,
              r.grossPickup,
              r.existingWash,
              r.pickupLoss,
              r.adr,
            ])}
          />
          <p>{text(forecastContext)}</p>
          <p>
            {t(
              'Modelo didáctico transparente; no es un RMS ni una recomendación universal. El Budget es la meta; OTB son reservas actuales; Forecast estima lo que ocurrirá; Actual es lo realizado. Para evaluar precisión usa también error absoluto y compara el mismo horizonte de pronóstico.',
              'Transparent teaching model; not an RMS or a universal recommendation. Budget is the target; OTB is current bookings; Forecast estimates the outcome; Actual is realized performance. Also use absolute error to assess accuracy and compare the same forecast horizon.',
            )}
          </p>
          {checks(forecastQuestions)}
        </>
      )}
      {section === 'transfer' &&
        transferCases.map((scenario) => (
          <article key={scenario.id}>
            <h3>{text(scenario.title)}</h3>
            <p>{text(scenario.brief)}</p>
            <p>
              {t(
                'Calcula primero; después compromete una recomendación antes de comparar la rúbrica. La respuesta modelo es un ejemplo, no un guion obligatorio.',
                'Calculate first; then commit a recommendation before comparing the rubric. The model answer is an example, not a required script.',
              )}
            </p>
            {checks(scenario.questions)}
          </article>
        ))}
      <p>
        {t(
          'Referencias de conceptos; todos los datos y ejercicios son originales y sintéticos:',
          'Concept references; all data and exercises are original and synthetic:',
        )}{' '}
        {analystSources.map((source) => (
          <span key={source.name}>
            {' '}
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.name}
            </a>{' '}
          </span>
        ))}
      </p>
    </section>
  );
}
