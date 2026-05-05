import { create } from 'zustand';
import { KEYS, getItem, setItem, removeItem } from '../lib/storage';

type AnswerStatus = 'correct' | 'wrong';

interface ProgressState {
  progress: Record<number, AnswerStatus>;
  loaded: boolean;
  loadProgress: () => Promise<void>;
  setAnswer: (id: number, status: AnswerStatus) => Promise<void>;
  resetProgress: () => Promise<void>;
  getCorrectCount: (ids: number[]) => number;
  getWrongIds: (ids: number[]) => number[];
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: {},
  loaded: false,

  loadProgress: async () => {
    const progress = await getItem<Record<number, AnswerStatus>>(KEYS.PROGRESS, {});
    set({ progress, loaded: true });
  },

  setAnswer: async (id, status) => {
    const progress = { ...get().progress, [id]: status };
    set({ progress });
    await setItem(KEYS.PROGRESS, progress);
  },

  resetProgress: async () => {
    set({ progress: {} });
    await removeItem(KEYS.PROGRESS);
  },

  getCorrectCount: (ids) => {
    const { progress } = get();
    return ids.filter((id) => progress[id] === 'correct').length;
  },

  getWrongIds: (ids) => {
    const { progress } = get();
    return ids.filter((id) => progress[id] === 'wrong');
  },
}));
