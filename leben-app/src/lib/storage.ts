import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  PROGRESS: '@progress',
  FAVORITES: '@favorites',
  LANG: '@settings.lang',
  THEME: '@settings.theme',
  FONT_SIZE: '@settings.fontSize',
  EXAM_HISTORY: '@exam.history',
  EXAM_COUNT: '@exam_count',
} as const;

export async function getItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
