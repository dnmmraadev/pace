export type Question = {
  id: string;
  prompt: string;
  answer: number | string;
  options?: string[];
  explanation: string;
  unit?: string;
  tolerance?: number;
};
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
