import { lessons, modules, type Question } from '../data/curriculum';
import { formulas } from '../data/formulas';
import { glossary } from '../data/glossary';
import { capstoneChecks, capstoneRubric, diagnostic, interview } from '../data/scenarios';
import { getPreferences } from '../shared/storage/preferences';
import { lessonCopy, type QuestionCopy } from './lessons.es';
import { preferencesCopy } from './preferences.es';
import {
  capstoneCopy,
  diagnosticCopy,
  formulaCopy,
  glossaryCopy,
  interviewCopy,
  moduleCopy,
  rubricCopy,
} from './reference.es';
import { uiCopy } from './ui.es';

// Translate display values, never persisted IDs, answers, filters or CSV source fields.
export const catalog: Record<string, string> = { ...uiCopy, ...preferencesCopy };
const add = (source: string, target: string) => {
  catalog[source] = target;
};
const question = (source: Question, target: QuestionCopy) => {
  add(source.prompt, target[0]);
  add(source.explanation, target[1]);
  if (source.options) {
    if (source.options.length !== target[2]?.length)
      throw new Error('Incomplete question localization: ' + source.id);
    source.options.forEach((option, i) => add(option, target[2]![i]));
  }
};
for (const source of lessons) {
  const target = lessonCopy[source.id];
  if (!target || source.questions.length !== target[5].length)
    throw new Error('Incomplete lesson localization: ' + source.id);
  [source.title, source.concept, source.formula, source.example, source.mistake].forEach(
    (text, i) => add(text, target[i] as string),
  );
  // Today displays the first sentence of the current concept.
  add(source.concept.split('. ')[0] + '.', target[1].split('. ')[0] + '.');
  source.questions.forEach((q, i) => question(q, target[5][i]));
  question(source.scenario, target[6]);
}
if (
  Object.keys(glossary).length !== glossaryCopy.length ||
  formulas.length !== formulaCopy.length ||
  modules.length !== moduleCopy.length
)
  throw new Error('Incomplete reference localization');
Object.entries(glossary).forEach(([key, definition], i) => {
  add(key, glossaryCopy[i][0]);
  add(definition, glossaryCopy[i][1]);
});
formulas.forEach((row, i) => row.forEach((text, j) => add(text, formulaCopy[i][j])));
modules.forEach((text, i) => add(text, moduleCopy[i]));
diagnostic.forEach((q, i) => question(q, diagnosticCopy[i]));
interview.slice(diagnostic.length).forEach((q, i) => question(q, interviewCopy[i]));
capstoneChecks.forEach((q, i) => question(q, capstoneCopy[i]));
capstoneRubric.forEach((row, i) => row.forEach((text, j) => add(text, rubricCopy[i][j])));

const lowerCatalog = new Map(
  Object.entries(catalog).map(([key, value]) => [key.toLowerCase(), value]),
);
const dynamic = (text: string): string | undefined => {
  let match: RegExpMatchArray | null;
  if ((match = text.match(/^(\d+) topics ready for review$/)))
    return match[1] === '1' ? '1 tema listo para repasar' : match[1] + ' temas listos para repasar';
  if ((match = text.match(/^(\d+) lessons completed · Capstone$/)))
    return (
      match[1] +
      (match[1] === '1'
        ? ' lección completada · Caso integrador'
        : ' lecciones completadas · Caso integrador')
    );
  if ((match = text.match(/^Module (\d+)$/))) return 'Módulo ' + match[1];
  if ((match = text.match(/^LESSON (\d+) · (\d+) MIN$/)))
    return 'LECCIÓN ' + match[1] + ' · ' + match[2] + ' MIN';
  if ((match = text.match(/^(\d+) \/ (\d+) CHECKS$/)))
    return match[1] + ' / ' + match[2] + ' PREGUNTAS';
  if ((match = text.match(/^MIXED REVIEW · (.*)$/))) return 'REPASO COMBINADO · ' + es(match[1]);
  if ((match = text.match(/^Next review: (.*)$/))) return 'Próximo repaso: ' + match[1];
  if ((match = text.match(/^Search (.*)$/)))
    return match[1] === 'Search' ? 'Buscar en PACE' : 'Buscar: ' + es(match[1]);
  if (
    (match = text.match(
      /^Submitted · (\d+)% objective calculation score\. Written judgment requires comparison with the analyst rubric\.$/,
    ))
  )
    return (
      'Entregado · ' +
      match[1] +
      '% en cálculos objetivos. El criterio escrito debe compararse con la rúbrica de análisis.'
    );
  if (
    (match = text.match(
      /^The current filter totals \$(.*)\. A SUMIFS or a pivot value aggregation should reconcile to that result\.$/,
    ))
  )
    return (
      'El filtro actual suma $' +
      match[1] +
      '. Una suma con SUMIFS o una tabla dinámica debe conciliar con ese resultado.'
    );
  if ((match = text.match(/^RevPAR \$(.*) · Room revenue \$(.*)$/)))
    return 'RevPAR $' + match[1] + ' · Ingreso de habitaciones $' + match[2];
  if (
    (match = text.match(
      /^(\d+) rubric areas remain unconfirmed in your self-review\. Review missed calculations and improve your report in Excel before treating this as readiness evidence\.$/,
    ))
  )
    return (
      match[1] +
      (match[1] === '1'
        ? ' área de la rúbrica sigue sin confirmar'
        : ' áreas de la rúbrica siguen sin confirmar') +
      ' en tu autoevaluación. Revisa los errores de cálculo y mejora tu reporte en Excel antes de usarlo como evidencia de preparación.'
    );
  // Combined labels in progress, feedback and review readouts.
  if ((match = text.match(/^(.*) · target ≥80%$/))) return es(match[1]) + ' · meta ≥80%';
  return undefined;
};

export function es<T>(value: T): T {
  if (typeof value !== 'string' || getPreferences().language === 'en') return value;
  const text = value
    .trim()
    .split(String.fromCharCode(92) + 'n')
    .join(String.fromCharCode(10));
  const translated = catalog[text] ?? dynamic(text) ?? lowerCatalog.get(text.toLowerCase());
  if (translated === undefined) return value; // Names, acronyms, codes and technical examples remain intact.
  const copy =
    text === text.toLowerCase() && !catalog[text] ? translated.toLowerCase() : translated;
  return (value.slice(0, value.length - value.trimStart().length) +
    copy +
    value.slice(value.trimEnd().length)) as T;
}
export const fold = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
