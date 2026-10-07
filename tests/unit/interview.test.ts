import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lessons } from '../../src/data/curriculum';
import { diagnostic } from '../../src/data/diagnostic';
import { diagnostic as legacyDiagnostic } from '../../src/data/scenarios';
import { interview, interviewCategories } from '../../src/data/interview';
import { grade } from '../../src/domain/learning';

test('interview covers fifteen junior analyst competencies with objective and ungraded open practice', () => {
  assert.equal(interviewCategories.length, 15);
  const ids = new Set(interview.map((q) => q.id));
  assert.equal(ids.size, interview.length);
  for (const [category] of interviewCategories) {
    const questions = interview.filter((q) => q.category === category);
    assert.ok(
      questions.some((q) => q.kind !== 'open'),
      category,
    );
    const open = questions.find((q) => q.kind === 'open');
    assert.ok(open, category);
    assert.equal(open.evidence, 'reflection');
    assert.equal(open.answer, '');
    assert.ok(open.rubric && open.rubric.length >= 2);
    assert.ok(open.modelAnswer && open.modelAnswer.length > 80);
  }
});

test('new interview and diagnostic copy has complete ES and EN prompts, feedback, options and rubrics', () => {
  for (const q of [...interview, ...diagnostic]) {
    assert.ok(q.prompt.length > 10, q.id);
    assert.ok(q.explanation.length > 15, q.id);
    assert.ok(q.copy?.es.prompt, q.id);
    assert.ok(q.copy?.es.explanation, q.id);
    if (q.options) {
      assert.equal(q.copy?.es.options?.length, q.options.length, q.id);
      assert.ok(q.options.includes(String(q.answer)), q.id);
      assert.equal(new Set(q.options).size, q.options.length, q.id);
      assert.ok(grade(q, String(q.answer)), q.id);
    }
    if (q.kind === 'open') {
      assert.equal(q.copy?.es.rubric?.length, q.rubric?.length, q.id);
      assert.ok(q.copy?.es.modelAnswer, q.id);
    }
  }
});

test('eight-question diagnostic routes to valid lessons without treating results as practice mastery', () => {
  assert.equal(diagnostic.length, 8);
  for (const q of diagnostic) {
    assert.ok(
      lessons.some((l) => l.id === q.topic),
      q.id + ': ' + q.topic,
    );
    assert.notEqual(q.evidence, 'generated');
    assert.notEqual(q.kind, 'open');
  }
  assert.equal(new Set(diagnostic.map((q) => q.id)).size, diagnostic.length);
  assert.ok(
    diagnostic.every((q) => !legacyDiagnostic.some((old) => old.id === q.id)),
    'New routing assessments must not reinterpret old question IDs',
  );
});
