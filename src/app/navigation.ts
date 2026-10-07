import {
  Activity,
  BookOpen,
  BookText,
  BriefcaseBusiness,
  Calculator,
  ChartNoAxesCombined,
  FlaskConical,
  RotateCcw,
} from 'lucide-react';
export const nav = [
  ['Today', Activity],
  ['Curriculum', BookOpen],
  ['Review Queue', RotateCcw],
  ['Practice Lab', FlaskConical],
  ['Formula Sheet', Calculator],
  ['Glossary', BookText],
  ['Interview Lab', BriefcaseBusiness],
  ['Progress', ChartNoAxesCombined],
] as const;
