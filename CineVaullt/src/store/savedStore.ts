import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Movie } from "../types/movie.types";

interface SavedState {
  savedItems: Movie[];
  saveItem: (item: Movie) => void;
  removeItem: (id: number) => void;
  clearAll: () => void;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set) => ({
      savedItems: [],

      saveItem: (item) =>
        set((state) => {
          const alreadySaved = state.savedItems.some(
            (savedItem) => savedItem.id === item.id
          );

          if (alreadySaved) {
            return state;
          }

          return {
            savedItems: [...state.savedItems, item],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          savedItems: state.savedItems.filter(
            (item) => item.id !== id
          ),
        })),

      clearAll: () =>
        set({
          savedItems: [],
        }),
    }),
    {
      name: "cinevault-saved-movies",
    }
  )
);