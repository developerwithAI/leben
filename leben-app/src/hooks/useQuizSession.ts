import { useState, useRef } from 'react';
import { useProgressStore } from '../store/progressStore';
import type { Question } from '../types/question';

interface UseQuizSessionOptions {
  questions: Question[];
  mode: 'learn' | 'exam';
  wrapAround?: boolean;
  onComplete?: (sessionAnswers: Record<number, number>, timeSeconds: number) => void;
}

interface UseQuizSessionReturn {
  current: Question | null;
  index: number;
  selectedAnswer: number | null;
  sessionAnswers: Record<number, number>;
  correct: number;
  answered: number;
  isEmpty: boolean;
  handleAnswer: (idx: number) => Promise<void>;
  goNext: () => void;
  goPrev: () => void;
  reset: () => void;
}

export function useQuizSession({ questions, mode, wrapAround, onComplete }: UseQuizSessionOptions): UseQuizSessionReturn {
  const { setAnswer } = useProgressStore();
  const startTimeRef = useRef(Date.now());

  const [index, setIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [sessionAnswers, setSessionAnswers] = useState<Record<number, number>>({});

  const current = questions[index] ?? null;
  const correct = questions.filter((q) => sessionAnswers[q.id] === q.correct).length;
  const answered = Object.keys(sessionAnswers).length;
  const isEmpty = questions.length === 0;

  const handleAnswer = async (idx: number) => {
    if (selectedAnswer !== null || !current) return;
    setSelectedAnswer(idx);
    setSessionAnswers((prev) => ({ ...prev, [current.id]: idx }));
    if (mode === 'learn') {
      await setAnswer(current.id, idx === current.correct ? 'correct' : 'wrong');
    }
  };

  const goNext = () => {
    if (index === questions.length - 1) {
      if (wrapAround) {
        reset();
      } else {
        const timeSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
        onComplete?.(sessionAnswers, timeSeconds);
      }
    } else {
      setSelectedAnswer(null);
      setIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    setSelectedAnswer(null);
    setIndex((i) => Math.max(0, i - 1));
  };

  const reset = () => {
    setIndex(0);
    setSelectedAnswer(null);
    setSessionAnswers({});
    startTimeRef.current = Date.now();
  };

  return { current, index, selectedAnswer, sessionAnswers, correct, answered, isEmpty, handleAnswer, goNext, goPrev, reset };
}
