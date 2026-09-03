import { useCallback, useMemo, useState } from "react";

import useFetch from "../hooks/useFetch";
import useDebounce from "../hooks/useDebounce";

import type { Movie } from "../types/movie.types";

import {
  mapTvMazeShowToMovie,
  mapTvMazeSearchResultsToMovies,
} from "../utils/movieMapper";

import List from "../components/List";
import ItemCard from "../components/ItemCard";
import SkeletonCard from "../components/SkeletonCard";

import { useSavedStore } from "../store/savedStore";
import { useMovieStore } from "../store/movieStore";

interface TvMazeShow {
  id: number;
  name: string;
  image?: {
    medium?: string;
    original?: string;
  };
  summary?: string;
  rating?: {
    average?: number;
  };
  language?: string;
  genres?: string[];
  premiered?: string;
}

interface TvMazeSearchResult {
  score: number;
  show: TvMazeShow;
}

type SortOption = "rating" | "name" | "newest";

function Browse() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [sortBy, setSortBy] =
    useState<SortOption>("rating");

  // Search runs only after the user stops typing
  // for 400 milliseconds.
  const debouncedSearch = useDebounce(search);

  // Saved movies from Zustand
  const savedItems = useSavedStore(
    (state) => state.savedItems
  );

  const saveItem = useSavedStore(
    (state) => state.saveItem
  );

  const removeItem = useSavedStore(
    (state) => state.removeItem
  );

  // Movies added through the Add Movie form
  const addedMovies = useMovieStore(
    (state) => state.movies
  );

  // Build the API endpoint
  const endpoint = debouncedSearch.trim()
    ? `/search/shows?q=${encodeURIComponent(
        debouncedSearch.trim()
      )}`
    : "/shows";

  // Fetch movies from TVMaze
  const {
    data,
    loading,
    error,
  } = useFetch<
    TvMazeShow[] | TvMazeSearchResult[]
  >(endpoint);

  // Convert TVMaze response into our Movie type
  const tvMazeMovies = useMemo<Movie[]>(() => {
    if (!data) {
      return [];
    }

    if (debouncedSearch.trim()) {
      return mapTvMazeSearchResultsToMovies(
        data as TvMazeSearchResult[]
      );
    }

    return (data as TvMazeShow[]).map(
      mapTvMazeShowToMovie
    );
  }, [data, debouncedSearch]);

  // Combine API movies and manually added movies
  const movies = useMemo<Movie[]>(() => {
    const combinedMovies = [
      ...addedMovies,
      ...tvMazeMovies,
    ];

    /*
      Remove invalid movie objects.

      This prevents errors when an old stored movie
      has an undefined name.
    */
    const validMovies = combinedMovies.filter(
      (movie): movie is Movie =>
        Boolean(movie) &&
        typeof movie.name === "string" &&
        movie.name.trim().length > 0
    );

    /*
      Remove duplicate movies by name.

      Manually added movies are kept first.
    */
    return Array.from(
      new Map(
        validMovies.map((movie) => [
          movie.name.trim().toLowerCase(),
          movie,
        ])
      ).values()
    );
  }, [addedMovies, tvMazeMovies]);

  // Create genre dropdown options
  const genres = useMemo(() => {
    const allGenres = movies.flatMap((movie) =>
      Array.isArray(movie.genres)
        ? movie.genres
        : []
    );

    return [
      "All",
      ...Array.from(new Set(allGenres)).sort(),
    ];
  }, [movies]);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    const searchText = debouncedSearch
      .trim()
      .toLowerCase();

    let filtered = [...movies];

    // Filter by genre
    if (genre !== "All") {
      filtered = filtered.filter((movie) =>
        Array.isArray(movie.genres)
          ? movie.genres.includes(genre)
          : false
      );
    }

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter((movie) =>
        movie.name.toLowerCase().includes(searchText)
      );
    }

    // Sort results
    filtered.sort((firstMovie, secondMovie) => {
      if (sortBy === "name") {
        return firstMovie.name.localeCompare(
          secondMovie.name
        );
      }

      if (sortBy === "newest") {
        return (
          new Date(
            secondMovie.premiered ?? 0
          ).getTime() -
          new Date(
            firstMovie.premiered ?? 0
          ).getTime()
        );
      }

      // Highest rating
      return (
        (secondMovie.rating ?? 0) -
        (firstMovie.rating ?? 0)
      );
    });

    return filtered;
  }, [
    movies,
    genre,
    sortBy,
    debouncedSearch,
  ]);

  // Save movie
  const handleSave = useCallback(
    (movie: Movie) => {
      saveItem(movie);
    },
    [saveItem]
  );

  // Remove movie
  const handleRemove = useCallback(
    (id: number) => {
      removeItem(id);
    },
    [removeItem]
  );

  // Reset all filters
  const clearFilters = () => {
    setSearch("");
    setGenre("All");
    setSortBy("rating");
  };

  return (
    <section className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Browse Movies
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Search, filter and sort your movies.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="grid gap-4 rounded-xl border bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:grid-cols-4">
        {/* Search */}
        <div>
          <label
            htmlFor="movie-search"
            className="mb-2 block text-sm font-medium"
          >
            Search Movies
          </label>

          <input
            id="movie-search"
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search movies..."
            className="w-full rounded-lg border px-4 py-2 outline-none focus:border-purple-500 dark:border-gray-600 dark:bg-gray-700"
          />
        </div>

        {/* Genre */}
        <div>
          <label
            htmlFor="genre"
            className="mb-2 block text-sm font-medium"
          >
            Genre
          </label>

          <select
            id="genre"
            value={genre}
            onChange={(event) =>
              setGenre(event.target.value)
            }
            className="w-full rounded-lg border px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
          >
            {genres.map((itemGenre) => (
              <option
                key={itemGenre}
                value={itemGenre}
              >
                {itemGenre}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label
            htmlFor="sort"
            className="mb-2 block text-sm font-medium"
          >
            Sort By
          </label>

          <select
            id="sort"
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value as SortOption
              )
            }
            className="w-full rounded-lg border px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="rating">
              Highest Rating
            </option>

            <option value="name">
              Name
            </option>

            <option value="newest">
              Newest
            </option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={clearFilters}
            className="w-full rounded-lg bg-gray-200 px-4 py-2 font-medium transition hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {debouncedSearch
            ? `Search Results for "${debouncedSearch}"`
            : "All Movies"}
        </h2>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredMovies.length} results
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <SkeletonCard key={index} />
            )
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          <p className="font-semibold">
            Failed to load movies
          </p>

          <p className="mt-2 text-sm">
            {error}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        filteredMovies.length === 0 && (
          <div className="rounded-xl border p-8 text-center dark:border-gray-700">
            <div className="mb-3 text-5xl">
              🎬
            </div>

            <p className="text-lg font-semibold">
              No movies found
            </p>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Reset Filters
            </button>
          </div>
        )}

      {/* Movie List */}
      {!loading &&
        !error &&
        filteredMovies.length > 0 && (
          <List<Movie>
            items={filteredMovies}
            renderItem={(movie) => (
              <ItemCard
                item={movie}
                isSaved={savedItems.some(
                  (saved) => saved.id === movie.id
                )}
                onSave={handleSave}
                onRemove={handleRemove}
              />
            )}
            keyExtractor={(movie) => movie.id}
          />
        )}
    </section>
  );
}

export default Browse;