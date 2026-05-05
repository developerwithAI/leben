import type { Question, LangCode } from '../types/question';

export function getQuestion(
  q: Question,
  lang: LangCode
): { question: string; answers: [string, string, string, string]; explanation: string } {
  if (lang === 'de') {
    return { question: q.question_de, answers: q.answers_de, explanation: q.explanation_de };
  }
  const t = q.translations[lang];
  if (t) return t;
  return { question: q.question_de, answers: q.answers_de, explanation: q.explanation_de };
}
