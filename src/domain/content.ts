export type Question = {
  id: string;
  prompt: string;
  answer: number | string;
  options?: string[];
  explanation: string;
  unit?: string;
  tolerance?: number;
  kind?: 'open';
  concept?: string;
  topic?: string;
  category?: string;
  evidence?: 'generated' | 'application' | 'transfer' | 'reflection';
  instance?: {
    generatorVersion: 1;
    concept: string;
    seed: number;
    signature: string;
    parameters: Record<string, number | string>;
  };
  rubric?: string[];
  modelAnswer?: string;
  copy?: { es: QuestionCopy };
};
export type QuestionCopy = {
  prompt: string;
  explanation: string;
  options?: string[];
  rubric?: string[];
  modelAnswer?: string;
};
export function questionCopy(q: Question, language: 'es' | 'en'): QuestionCopy {
  return language === 'es' && q.copy ? q.copy.es : q;
}
export type Lesson = {
  id: string;
  module: number;
  title: string;
  minutes: number;
  concept: string;
  formula: string;
  example: string;
  mistake: string;
  questions: Question[];
  scenario: Question;
  terms: string[];
};
