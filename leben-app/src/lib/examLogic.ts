import type { Question } from '../types/question';

function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) | 0;
    return ((s >>> 0) / 0x100000000);
  };
}

function shuffle<T>(arr: T[], rng?: () => number): T[] {
  const a = [...arr];
  const rand = rng ?? Math.random;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateExam(general: Question[], land: Question[], ticket?: number): Question[] {
  const rng = ticket != null ? seededRng(ticket * 31337) : undefined;
  const generalPick = shuffle(general, rng).slice(0, 30);
  const landPick = shuffle(land, rng).slice(0, 3);
  return shuffle([...generalPick, ...landPick], rng);
}

export const EXAM_PASS_THRESHOLD = 17;
export const EXAM_TOTAL = 33;
export const EXAM_DURATION_SECONDS = 60 * 60;
