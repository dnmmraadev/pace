import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  analystRows,
  bookingCurve,
  channelLookup,
  cleanAnalystRows,
  excelQuestions,
  financeControl,
  forecastQuestions,
  forecastSegments,
  forecastSummary,
  summarizeAnalystRows,
  transferCases,
} from '../../src/data/analystAssignments';

test('raw analyst assignment isolates invalid rows while retaining real cancellation records', () => {
  const clean = cleanAnalystRows(analystRows);
  assert.equal(clean.length, 18);
  assert.equal(new Set(clean.map((r) => r.id)).size, 18);
  assert.equal(clean.filter((r) => r.cancelled).length, 2);
  assert.equal(cleanAnalystRows([{ ...analystRows[0], booked: '2026-02-30' }]).length, 0);
  assert.equal(cleanAnalystRows([{ ...analystRows[0], arrival: '2026-09-31' }]).length, 0);
  const current = summarizeAnalystRows(analystRows, '2026-09-08');
  const prior = summarizeAnalystRows(analystRows, '2026-09-01');
  assert.equal(current.production.length, 16);
  assert.equal(prior.production.length, 12);
  assert.ok(current.occupancy > 0 && current.occupancy <= 100);
  assert.equal(
    current.channels.reduce((n, ch) => n + ch.rooms, 0),
    current.rooms,
  );
  const independentlyComputedRooms = clean
    .filter((r) => !r.cancelled)
    .reduce(
      (n, r) => n + (r.rooms * (Date.parse(r.departure) - Date.parse(r.arrival))) / 86400000,
      0,
    );
  assert.equal(current.rooms, independentlyComputedRooms);
  const independentlyComputedNet = current.production.reduce(
    (n, r) =>
      n +
      ((r.rooms * (Date.parse(r.departure) - Date.parse(r.arrival))) / 86400000) *
        r.nightlyRate *
        (1 - channelLookup.find((ch) => ch.channel === r.channel)!.acquisition),
    0,
  );
  assert.equal(current.net, independentlyComputedNet);
  assert.ok(Math.abs((financeControl - 300) / 1.16 - current.revenue) < 0.000001);
  const expected: Record<string, number> = {
    'assignment-clean-1': 4,
    'assignment-rooms-1': current.rooms,
    'assignment-adr-1': current.revenue / current.rooms,
    'assignment-occ-1': (current.rooms / (900 * 3)) * 100,
    'assignment-revpar-1': current.revenue / (900 * 3),
    'assignment-pickup-1': current.rooms - prior.rooms,
    'assignment-net-1': independentlyComputedNet,
    'assignment-variance-1': ((current.rooms - prior.rooms) / prior.rooms) * 100,
    'assignment-reconcile-1': current.revenue,
  };
  for (const q of excelQuestions.filter((q) => q.kind !== 'open'))
    assert.equal(q.answer, expected[q.id]);
});

test('forecast separates existing wash and future losses, caps rooms without inventing revenue mix', () => {
  const forecast = forecastSummary(forecastSegments, 180);
  assert.equal(forecast.rooms, 160);
  assert.equal(forecast.demand, 160);
  assert.equal(forecast.revenue, 25360);
  assert.deepEqual(
    forecastSummary(
      [{ segment: 'x', otb: 175, grossPickup: 30, existingWash: 2, pickupLoss: 3, adr: 200 }],
      180,
    ),
    { demand: 200, rooms: 180, revenue: null },
  );
  assert.equal(forecastSummary([], 180).rooms, 0);
  assert.equal(bookingCurve.at(-1)!.corporate, forecastSegments[0].otb);
  const answers: Record<string, number> = {
    'forecast-segments-1': 160,
    'forecast-revenue-segments-1': 25360,
    'forecast-error-1': 2,
    'forecast-bias-1': 25 / 3,
    'forecast-low-1': 139,
    'forecast-high-1': 180,
  };
  for (const q of forecastQuestions) assert.equal(q.answer, answers[q.id]);
});

test('transfer assessments use distinct small hotels and committed reflection with bilingual rubrics', () => {
  assert.equal(transferCases.length, 2);
  const questions = [
    ...excelQuestions,
    ...forecastQuestions,
    ...transferCases.flatMap((s) => s.questions),
  ];
  assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
  for (const q of questions) {
    assert.ok(q.prompt.length > 10);
    assert.ok(q.copy?.es.prompt && q.copy.es.prompt.length > 10);
    if (q.kind === 'open') {
      assert.equal(q.evidence, 'reflection');
      assert.equal(q.answer, '');
      assert.equal(q.rubric?.length, 4);
      assert.equal(q.copy?.es.rubric?.length, 4);
      assert.ok(q.modelAnswer && q.copy?.es.modelAnswer);
    } else {
      assert.ok(Number.isFinite(q.answer));
      assert.ok(q.explanation && q.copy?.es.explanation);
    }
  }
  assert.equal(transferCases[0].questions[0].answer, (108 / 180) * 100);
  assert.equal(transferCases[1].questions[0].answer, (60 * 240) / 64);
  assert.equal(transferCases[1].questions[1].answer, 225 * 0.88);
});
