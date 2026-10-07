import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lessons } from '../../src/data/curriculum';
import { capstoneChecks, channelMix } from '../../src/data/scenarios';
import { studyGuides, studySources } from '../../src/data/studyGuides';
import { demonstrated, emptyProgress, grade, mastery, record } from '../../src/domain/learning';
import { csv } from '../../src/shared/export/csv';
import { loadProgress, saveProgress, STORAGE_KEY } from '../../src/shared/storage/progress';
test('numeric grading handles currency, percent, zero, tolerance and invalid values', () => {
  const q = { id: 'n', prompt: 'test', answer: 250, explanation: '' };
  assert.ok(grade(q, '$250.00'));
  assert.ok(!grade(q, ''));
  assert.ok(!grade(q, 'text'));
  assert.ok(grade({ ...q, answer: 0 }, '0'));
  assert.ok(grade({ ...q, answer: 55.56, tolerance: 0.05 }, '55.6%'));
});
test('one memorized answer cannot confer mastery; five distinct checks can', () => {
  let p = emptyProgress();
  const l = lessons[0];
  for (let i = 0; i < 10; i++) p = record(p, l.id, l.questions[0], String(l.questions[0].answer));
  assert.equal(mastery(p, l.id), 100);
  assert.equal(demonstrated(p, l.id), false);
  for (const q of [...l.questions, l.scenario]) p = record(p, l.id, q, String(q.answer));
  assert.ok(demonstrated(p, l.id));
  assert.equal(p.completed.length, 0);
});
test('errors are immediately due; spacing advances only on due review with three distinct correct answers', () => {
  let p = emptyProgress();
  const l = lessons[0];
  const start = 1_000_000;
  p = record(p, l.id, l.questions[0], 'wrong', start);
  assert.equal(p.reviews[0].due, start);
  for (let i = 0; i < 3; i++)
    p = record(p, l.id, l.questions[i], String(l.questions[i].answer), start + i + 1);
  assert.equal(p.reviews[0].interval, 1);
  const due = p.reviews[0].due;
  for (let i = 0; i < 3; i++)
    p = record(p, l.id, l.questions[i], String(l.questions[i].answer), start + 10 + i);
  assert.equal(p.reviews[0].due, due);
  for (let i = 0; i < 3; i++)
    p = record(p, l.id, l.questions[i], String(l.questions[i].answer), due + i);
  assert.equal(p.reviews[0].interval, 3);
  p = record(p, l.id, l.questions[0], 'wrong', due + 10);
  assert.equal(p.reviews[0].interval, 0);
  assert.equal(p.reviews[0].due, due + 10);
});
test('latest evidence replaces old errors for mastery without deleting attempt history', () => {
  let p = emptyProgress();
  const l = lessons[0];
  for (const q of [...l.questions, l.scenario]) p = record(p, l.id, q, 'wrong');
  assert.equal(mastery(p, l.id), 0);
  for (const q of l.questions) p = record(p, l.id, q, String(q.answer));
  assert.equal(mastery(p, l.id), 80);
  assert.ok(demonstrated(p, l.id));
  assert.equal(p.attempts.length, 9);
});
test('progress persists including rationale, capstone, review dates and lesson completion', () => {
  const mem = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    value: { getItem: (k: string) => mem.get(k), setItem: (k: string, v: string) => mem.set(k, v) },
    configurable: true,
  });
  const p = record(emptyProgress(), 'inventory', lessons[0].questions[0], '0', 123, 'My reasoning');
  p.completed = ['inventory'];
  p.capstone = { answers: { a: '1' }, insights: 'test report', score: 80, submitted: 123 };
  assert.ok(saveProgress(p));
  assert.deepEqual(loadProgress(), p);
  mem.set(STORAGE_KEY, 'broken json');
  assert.deepEqual(loadProgress(), emptyProgress());
});
test('CSV preserves quotes, commas, zero and headers', () => {
  assert.equal(csv([{ name: 'Room, "A"', value: 0 }]), '"name","value"\r\n"Room, ""A""","0"');
});
test('every lesson has the complete learning loop with unique question identifiers', () => {
  const ids = new Set();
  for (const l of lessons) {
    assert.ok(l.concept && l.formula && l.example && l.mistake);
    assert.equal(l.questions.length, 4);
    for (const q of [...l.questions, l.scenario]) {
      assert.ok(!ids.has(q.id));
      ids.add(q.id);
      assert.ok(q.explanation);
      if (q.options) assert.ok(q.options.includes(String(q.answer)));
    }
  }
  for (let m = 1; m <= 10; m++) assert.ok(lessons.some((l) => l.module === m));
});
test('capstone source totals reconcile to keyed calculations', () => {
  assert.equal(
    channelMix.reduce((s, r) => s + r.rooms, 0),
    720,
  );
  assert.equal(
    channelMix.reduce((s, r) => s + r.revenue, 0),
    192000,
  );
  assert.equal(capstoneChecks.find((q) => q.id === 'cap-net')?.answer, 84000 - 15120);
});

test('every lesson has substantive bilingual study notes and worked reasoning', () => {
  assert.deepEqual(Object.keys(studyGuides).sort(), lessons.map((l) => l.id).sort());
  for (const lesson of lessons) {
    const guide = studyGuides[lesson.id];
    assert.equal(guide.sections.length, 2);
    assert.equal(guide.steps.length, 3);
    for (const language of ['es', 'en'] as const) {
      for (const section of guide.sections) {
        assert.ok(section.title[language].trim());
        assert.ok(section.body[language].split(/\s+/).length >= 30);
      }
      for (const copy of [
        guide.objective,
        ...guide.steps,
        guide.interpretation,
        guide.action,
        guide.reflection,
      ])
        assert.ok(copy[language].trim());
    }
    assert.ok(guide.sources.length);
    guide.sources.forEach((id) => assert.ok(studySources[id].url.startsWith('https://')));
  }
});
