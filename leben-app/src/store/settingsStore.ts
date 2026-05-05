import { create } from 'zustand';
import { KEYS, getItem, setItem } from '../lib/storage';
import type { LangCode } from '../types/question';

type Theme = 'light' | 'dark' | 'system';
type FontSize = 'small' | 'medium' | 'large';

interface SettingsState {
  lang: LangCode;
  theme: Theme;
  fontSize: FontSize;
  loaded: boolean;
  loadSettings: () => Promise<void>;
  setLang: (lang: LangCode) => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
  setFontSize: (size: FontSize) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  lang: 'de',
  theme: 'system',
  fontSize: 'medium',
  loaded: false,

  loadSettings: async () => {
    const [lang, theme, fontSize] = await Promise.all([
      getItem<LangCode>(KEYS.LANG, 'de'),
      getItem<Theme>(KEYS.THEME, 'system'),
      getItem<FontSize>(KEYS.FONT_SIZE, 'medium'),
    ]);
    set({ lang, theme, fontSize, loaded: true });
  },

  setLang: async (lang) => {
    set({ lang });
    await setItem(KEYS.LANG, lang);
  },

  setTheme: async (theme) => {
    set({ theme });
    await setItem(KEYS.THEME, theme);
  },

  setFontSize: async (fontSize) => {
    set({ fontSize });
    await setItem(KEYS.FONT_SIZE, fontSize);
  },
}));
