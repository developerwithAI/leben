export type LangCode = 'de' | 'ru' | 'uk' | 'en' | 'tr' | 'ar' | 'fa' | 'fr';

export const RTL_LANGS: ReadonlySet<LangCode> = new Set(['ar', 'fa']);

export interface Translation {
  question: string;
  answers: [string, string, string, string];
  explanation: string;
}

export interface Question {
  id: number;
  land: string;
  number: number;
  question_de: string;
  answers_de: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  explanation_de: string;
  category?: string;
  imageKey?: string;
  translations: Partial<Record<Exclude<LangCode, 'de'>, Translation>>;
}

export interface ExamResult {
  id: string;
  land: string;
  date: string;
  score: number;
  total: number;
  passed: boolean;
  timeSeconds: number;
  answers: Record<number, number>;
}
