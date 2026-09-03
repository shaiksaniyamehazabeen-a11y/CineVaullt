import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Movie } from "../types/movie.types";

interface MovieState {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
  removeMovie: (id: number) => void;
}

export const useMovieStore = create<MovieState>()(
  persist(
    (set) => ({
      movies: [],

      addMovie: (movie) =>
        set((state) => ({
          movies: [...state.movies, movie],
        })),

      removeMovie: (id) =>
        set((state) => ({
          movies: state.movies.filter(
            (movie) => movie.id !== id
          ),
        })),
    }),
    {
      name: "cinevault-movies",
    }
  )
);