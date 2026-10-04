import assert from 'node:assert/strict';
import {test} from 'node:test';
import {catalog, es, fold} from '../src/i18n/es';
import {lessons, modules} from '../src/data/curriculum';
import {glossary} from '../src/data/glossary';
import {formulas} from '../src/data/formulas';
import {diagnostic, interview, capstoneChecks, capstoneRubric, reservations} from '../src/data/scenarios';
import {emptyProgress, record, grade, csv} from '../src/lib/learning';
import {STORAGE_KEY} from '../src/lib/progress';

test('Spanish catalog covers the complete instructional and reference content',()=>{
  const covered=(text:string)=>assert.ok(Object.hasOwn(catalog,text),'Missing Spanish copy: '+text);
  modules.forEach(covered);
  for(const l of lessons) {
    [l.title,l.concept,l.formula,l.example,l.mistake,...l.terms].forEach(covered);
    for(const q of [...l.questions,l.scenario]) [q.prompt,q.explanation,...(q.options||[])].forEach(covered);
  }
  [...diagnostic,...interview,...capstoneChecks].forEach(q=>[q.prompt,q.explanation,...(q.options||[])].forEach(covered));
  Object.entries(glossary).flat().forEach(covered);
  formulas.flat().forEach(covered);
  capstoneRubric.flat().forEach(covered);
  for(const target of Object.values(catalog))assert.ok(typeof target==='string'&&target.trim());
});

test('Spanish display preserves original choice values, saved IDs and CSV codes',()=>{
  const q=lessons[0].questions[1];
  assert.equal(es(q.prompt),'¿Qué oportunidad vence cada noche?');
  assert.equal(es(q.options![0]),'La oportunidad de vender esa habitación-noche');
  assert.equal(q.answer,'The opportunity to sell that room night');
  assert.ok(grade(q,q.answer as string));
  const progress=record(emptyProgress(),'inventory',q,q.answer as string,123);
  assert.equal(progress.attempts[0].answer,q.answer);
  assert.equal(progress.attempts[0].questionId,'inventory-r1');
  assert.equal(STORAGE_KEY,'revenue-desk.progress.v1');
  assert.match(csv(reservations),/"channel"/);
  assert.match(csv(reservations),/"Confirmed"/);
  assert.equal(es('Direct'),'Directo');
});

test('Navigation, dynamic feedback, accents and technical formulas are consistent',()=>{
  assert.equal(es('Today'),'Hoy');
  assert.equal(es('Forecast'),'Pronóstico');
  assert.equal(es('3 topics ready for review'),'3 temas listos para repasar');
  assert.equal(fold('Ocupación'),'ocupacion');
  assert.equal(es('RevPAR $200 · Room revenue $180,000'),'RevPAR $200 · Ingreso de habitaciones $180,000');
  assert.equal(es(formulas[17][1]),formulas[17][1]);
  assert.equal(es('Harbor Point Resort'),'Harbor Point Resort');
});
