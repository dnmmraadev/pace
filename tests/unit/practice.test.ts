import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  competencies,
  generatePractice,
  topicCompetencies,
  type Competency,
} from '../../src/domain/practice';
import {
  conceptEvidence,
  demonstrated,
  emptyProgress,
  grade,
  record,
  applicationEvidence,
} from '../../src/domain/learning';
import { loadProgress, saveProgress, STORAGE_KEY } from '../../src/shared/storage/progress';
import { questionCopy } from '../../src/domain/content';

const concepts = Object.keys(competencies) as Competency[];
const num = (p: Record<string, number | string>, key: string) => {
  const value = p[key];
  assert.equal(typeof value, 'number');
  return value as number;
};
function expected(concept: Competency, p: Record<string, number | string>): number | string {
  const n = (key: string) => num(p, key);
  switch (concept) {
    case 'available-room-nights':
      return (n('capacity') - n('closed')) * n('nights');
    case 'occupancy':
      return (n('sold') / n('available')) * 100;
    case 'adr':
      return n('revenue') / n('sold');
    case 'revpar':
      return n('revenue') / n('available');
    case 'pickup':
    case 'pace':
      return n('current') - n('previous');
    case 'lead-time':
      return (Date.parse(String(p.arrival)) - Date.parse(String(p.booking))) / 86400000;
    case 'los':
      return (Date.parse(String(p.departure)) - Date.parse(String(p.arrival))) / 86400000;
    case 'forecast-rooms':
      return Math.min(n('capacity'), n('otb') + n('gross') - n('wash'));
    case 'forecast-revenue':
      return (n('otb') - n('wash')) * n('otbADR') + n('pickup') * n('newADR');
    case 'unconstrained-demand':
      return n('observed') + n('denied') - n('duplicate');
    case 'channel-net-revenue':
      return n('rooms') * n('adr') * (1 - n('commission') / 100) - n('acquisition');
    case 'percent-change':
      return (n('current') / n('previous') - 1) * 100;
    case 'mpi':
      return (n('hotelOccupancy') / n('setOccupancy')) * 100;
    case 'ari':
      return (n('hotelADR') / n('setADR')) * 100;
    case 'rgi':
      return ((n('hotelADR') * n('hotelOccupancy')) / (n('setADR') * n('setOccupancy'))) * 100;
    case 'contribution-decision':
      return n('otaADR') * (1 - n('commission') / 100) > n('directADR') - n('directCost')
        ? 'OTA'
        : 'Direct';
    case 'reconciliation':
      return n('accommodation');
    case 'recommendation-evidence':
      return n('type') === 0 ? 'Observation' : 'Hypothesis';
  }
}
test('all deterministic generators verify independently for 100 seeds and have meaningful bilingual variation', () => {
  for (const concept of concepts) {
    const signatures = new Set<string>(),
      answers = new Set<number | string>();
    for (let seed = 0; seed < 100; seed++) {
      const q = generatePractice(concept, seed);
      assert.deepEqual(q, generatePractice(concept, seed));
      assert.ok(q.instance);
      assert.equal(q.instance.seed, seed);
      assert.equal(q.instance.generatorVersion, 1);
      signatures.add(q.instance.signature);
      answers.add(q.answer);
      const answer = expected(concept, q.instance.parameters);
      if (typeof answer === 'number') {
        assert.ok(Number.isFinite(answer));
        assert.ok(Math.abs(Number(q.answer) - answer) <= 0.006);
      } else assert.equal(q.answer, answer);
      assert.ok(grade(q, String(answer)));
      for (const language of ['es', 'en'] as const) {
        const copy = questionCopy(q, language);
        assert.ok(copy.prompt.length > 20);
        assert.ok(copy.explanation.length > 25);
        if (q.options) assert.equal(copy.options?.length, q.options.length);
      }
      const p = q.instance.parameters;
      if (p.available !== undefined) {
        assert.ok(num(p, 'available') > 0);
        assert.ok(num(p, 'sold') > 0 && num(p, 'sold') <= num(p, 'available'));
      }
      if (concept === 'occupancy') assert.ok(Number(q.answer) >= 0 && Number(q.answer) <= 100);
      if (concept === 'pickup' || concept === 'pace') {
        assert.ok(num(p, 'previous') <= num(p, 'capacity'));
        assert.ok(num(p, 'current') <= num(p, 'capacity'));
      }
      if (concept === 'forecast-rooms')
        assert.ok(Number(q.answer) >= 0 && Number(q.answer) <= num(p, 'capacity'));
      if (concept === 'forecast-revenue') assert.ok(num(p, 'wash') <= num(p, 'otb'));
      if (concept === 'mpi' || concept === 'ari' || concept === 'rgi')
        assert.ok(num(p, 'comparison') > 0);
      if (concept === 'percent-change') assert.ok(num(p, 'previous') > 0);
    }
    assert.ok(signatures.size >= 80, `${concept} has enough distinct data`);
    assert.ok(answers.size >= 2, `${concept} changes answers`);
  }
  assert.equal(Object.keys(topicCompetencies).length, 17);
  for (const seed of [-1, 1.5, NaN, Infinity, 2 ** 32])
    assert.throws(() => generatePractice('occupancy', seed));
});
test('mastery requires five distinct first submissions and does not erase mistakes after feedback', () => {
  let p = emptyProgress();
  const wrong = generatePractice('occupancy', 1);
  p = record(p, 'occupancy', wrong, '0');
  for (let i = 0; i < 20; i++) p = record(p, 'occupancy', wrong, String(wrong.answer));
  assert.equal(conceptEvidence(p, 'occupancy').distinct, 1);
  assert.equal(conceptEvidence(p, 'occupancy').accuracy, 0);
  // A changed ID/seed with identical data is still the same problem instance.
  p = record(
    p,
    'occupancy',
    { ...wrong, id: 'different-id', instance: { ...wrong.instance!, seed: 99 } },
    String(wrong.answer),
  );
  assert.equal(conceptEvidence(p, 'occupancy').distinct, 1);
  for (let seed = 2; seed <= 5; seed++) {
    const q = generatePractice('occupancy', seed);
    p = record(p, 'occupancy', q, String(q.answer));
  }
  assert.equal(demonstrated(p, 'occupancy'), true);
  assert.equal(conceptEvidence(p, 'occupancy').accuracy, 80);
  for (let seed = 6; seed <= 13; seed++) {
    const q = generatePractice('occupancy', seed);
    p = record(p, 'occupancy', q, String(q.answer));
  }
  assert.equal(conceptEvidence(p, 'occupancy').distinct, 8);
  assert.equal(conceptEvidence(p, 'occupancy').accuracy, 100);
});
test('each competency in a lesson needs evidence independently; fixed application scores stay separate', () => {
  let p = emptyProgress();
  for (let seed = 1; seed <= 5; seed++) {
    const q = generatePractice('lead-time', seed);
    p = record(p, 'stay-patterns', q, String(q.answer));
  }
  assert.equal(demonstrated(p, 'stay-patterns'), false);
  for (let seed = 1; seed <= 5; seed++) {
    const q = generatePractice('los', seed);
    p = record(p, 'stay-patterns', q, String(q.answer));
  }
  assert.equal(demonstrated(p, 'stay-patterns'), true);
  const fixed = {
    id: 'case',
    prompt: 'case',
    answer: 60,
    explanation: 'method',
    concept: 'occupancy',
    evidence: 'transfer' as const,
  };
  for (let i = 0; i < 20; i++) p = record(p, 'occupancy', fixed, '60');
  assert.equal(demonstrated(p, 'occupancy'), false);
  assert.deepEqual(applicationEvidence(p, 'transfer'), { correct: 1, distinct: 1 });
});
test('repeating identical items and canonical answers never advances a review interval', () => {
  let p = emptyProgress();
  const q = generatePractice('adr', 1);
  p = record(p, 'adr', q, '0', 100);
  for (let i = 0; i < 10; i++) p = record(p, 'adr', q, String(q.answer), 101 + i);
  assert.equal(p.reviews[0].interval, 0);
  for (let i = 0; i < 10; i++)
    p = record(
      p,
      'adr',
      { id: `fixed-${i}`, prompt: 'fixed', answer: 1, explanation: 'fixed' },
      '1',
      120 + i,
    );
  assert.equal(p.reviews[0].interval, 0);
});
test('old progress remains readable and generated snapshots plus open reflections round-trip locally', () => {
  const memory = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => memory.get(key),
      setItem: (key: string, value: string) => memory.set(key, value),
    },
    configurable: true,
  });
  const legacy = {
    version: 1,
    completed: ['occupancy'],
    attempts: [{ questionId: 'occ-c', topic: 'occupancy', correct: true, answer: '80', at: 1 }],
    reviews: [{ topic: 'occupancy', due: 1, interval: 0 }],
    lastLesson: 'occupancy',
    diagnostic: true,
    capstone: { answers: { a: '1' }, insights: 'saved', submitted: 10, score: 80 },
  };
  memory.set(STORAGE_KEY, JSON.stringify(legacy));
  assert.deepEqual(loadProgress(), legacy);
  assert.equal(demonstrated(loadProgress(), 'occupancy'), false);
  const q = generatePractice('occupancy', 712);
  let p = record(loadProgress(), 'occupancy', q, String(q.answer), 99, 'Evidence');
  p = record(
    p,
    'meeting',
    { id: 'open', kind: 'open', answer: '', prompt: 'Explain', explanation: 'Compare' },
    'Observation, hypothesis, action and monitoring.',
    100,
  );
  assert.equal(p.attempts.length, 2);
  assert.equal(p.reflections?.length, 1);
  assert.ok(saveProgress(p));
  assert.deepEqual(loadProgress(), JSON.parse(JSON.stringify(p)));
  const instance = loadProgress().attempts[1].instance!;
  assert.deepEqual(
    generatePractice(instance.concept as Competency, instance.seed).instance,
    instance,
  );
  assert.equal(grade({ ...q, kind: 'open' }, String(q.answer)), false);
});
test('calculation input accepts decimal commas and currency without accepting empty units', () => {
  const q = { id: 'numeric', prompt: 'test', answer: 80.5, explanation: 'test' };
  assert.ok(grade(q, '80,5%'));
  assert.ok(grade({ ...q, answer: 1234.56 }, '1.234,56'));
  assert.ok(grade({ ...q, answer: 1234.56 }, '$1,234.56'));
  assert.equal(grade({ ...q, answer: 0 }, '$ %'), false);
});

test('broad diagnostic tags enter topic review and can be resolved with new concept instances', () => {
  const q = {
    id: 'diag-pricing',
    topic: 'pricing',
    concept: 'pricing',
    prompt: 'Diagnostic',
    answer: 'Correct',
    explanation: 'Context required',
  };
  let p = record(emptyProgress(), 'pricing', q, 'Wrong', 100);
  assert.equal(p.reviews[0].concept, undefined);
  for (let seed = 1; seed <= 3; seed++) {
    const generated = generatePractice('contribution-decision', seed, 'pricing');
    p = record(p, 'pricing', generated, String(generated.answer), 100 + seed);
  }
  assert.equal(p.reviews[0].interval, 1);
  assert.equal(p.reviews[0].concept, 'contribution-decision');
});
