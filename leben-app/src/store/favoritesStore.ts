import { create } from 'zustand';
import { KEYS, getItem, setItem } from '../lib/storage';

interface FavoritesState {
  favorites: number[];
  loaded: boolean;
  loadFavorites: () => Promise<void>;
  toggle: (id: number) => Promise<void>;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loaded: false,

  loadFavorites: async () => {
    const favorites = await getItem<number[]>(KEYS.FAVORITES, []);
    set({ favorites, loaded: true });
  },

  toggle: async (id) => {
    const { favorites } = get();
    const next = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    set({ favorites: next });
    await setItem(KEYS.FAVORITES, next);
  },

  isFavorite: (id) => get().favorites.includes(id),

  clearFavorites: async () => {
    set({ favorites: [] });
    await setItem(KEYS.FAVORITES, []);
  },
}));
