import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useFetch } from "../hooks/useFetch";
import { useMovieStore } from "../store/movieStore";
import { useSavedStore } from "../store/savedStore";

import SkeletonCard from "../components/SkeletonCard";

import type { Movie } from "../types/movie.types";

interface TVMazeShow {
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

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const movieId = Number(id);

  // Check manually added movies first
  const addedMovie = useMovieStore((state) =>
    state.movies.find((movie) => movie.id === movieId)
  );

  const {
    saveItem,
    removeItem,
    savedItems,
  } = useSavedStore();

  const [movie, setMovie] = useState<Movie | null>(
    addedMovie ?? null
  );

  /*
   * If the movie was manually added,
   * we don't need to fetch it from TVMaze.
   *
   * For TVMaze movies, the API request is handled below.
   */
  const apiId = addedMovie ? "1" : movieId;

  const {
    data,
    loading,
    error,
  } = useFetch<TVMazeShow>(
    `/shows/${apiId}`
  );

  // Convert TVMaze data to our Movie type
  useEffect(() => {
    if (addedMovie) {
      setMovie(addedMovie);
      return;
    }

    if (data) {
      const apiMovie: Movie = {
        id: data.id,
        name: data.name,
        image:
          data.image?.original ??
          data.image?.medium,
        summary:
          data.summary
            ?.replace(/<[^>]*>/g, "")
            .trim() || "No summary available.",
        rating: data.rating?.average ?? 0,
        language:
          data.language ?? "Unknown",
        status: "planned",
        genres: data.genres ?? [],
        premiered: data.premiered,
      };

      setMovie(apiMovie);
    }
  }, [data, addedMovie]);

  const isSaved = movie
    ? savedItems.some(
        (savedMovie) => savedMovie.id === movie.id
      )
    : false;

  const handleSave = () => {
    if (!movie) return;

    saveItem(movie);

    toast.success("Movie saved!", {
      description: `${movie.name} was added to your saved movies.`,
    });
  };

  const handleRemove = () => {
    if (!movie) return;

    removeItem(movie.id);

    toast.success("Movie removed", {
      description: `${movie.name} was removed from your saved movies.`,
    });
  };

  if (loading && !addedMovie) {
    return (
      <section className="space-y-6">
        <h1 className="text-3xl font-bold">
          Movie Details
        </h1>

        <SkeletonCard />
      </section>
    );
  }

  if (error && !addedMovie) {
    return (
      <section className="space-y-6">
        <h1 className="text-3xl font-bold">
          Movie Details
        </h1>

        <p className="text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() => navigate("/browse")}
          className="rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white hover:bg-purple-700"
        >
          Back to Browse
        </button>
      </section>
    );
  }

  if (!movie) {
    return (
      <section className="space-y-6">
        <h1 className="text-3xl font-bold">
          Movie Details
        </h1>

        <p className="text-gray-500 dark:text-gray-400">
          Movie not found.
        </p>

        <button
          type="button"
          onClick={() => navigate("/browse")}
          className="rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white hover:bg-purple-700"
        >
          Back to Browse
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/browse")}
        className="rounded-lg border px-4 py-2 font-medium transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
      >
        ← Back to Browse
      </button>

      {/* Movie Details */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="grid gap-8 p-6 md:grid-cols-[300px_1fr]">
          {/* Image */}
          <div>
            {movie.image ? (
              <img
                src={movie.image}
                alt={movie.name}
                className="w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700">
                No Image
              </div>
            )}
          </div>

          {/* Information */}
          <div className="space-y-5">
            <div>
              <h1 className="text-3xl font-bold">
                {movie.name}
              </h1>

              {movie.premiered && (
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Premiered: {movie.premiered}
                </p>
              )}
            </div>

            {/* Rating */}
            <div>
              <span className="font-semibold">
                Rating:
              </span>{" "}
              ⭐ {movie.rating || "N/A"}
            </div>

            {/* Language */}
            <div>
              <span className="font-semibold">
                Language:
              </span>{" "}
              {movie.language}
            </div>

            {/* Status */}
            <div>
              <span className="font-semibold">
                Status:
              </span>{" "}
              <span className="capitalize">
                {movie.status}
              </span>
            </div>

            {/* Genres */}
            {movie.genres.length > 0 && (
              <div>
                <span className="font-semibold">
                  Genres:
                </span>

                <div className="mt-2 flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div>
              <h2 className="mb-2 text-xl font-semibold">
                Summary
              </h2>

              <p className="leading-7 text-gray-600 dark:text-gray-300">
                {movie.summary}
              </p>
            </div>

            {/* Save / Remove */}
            <div className="pt-2">
              {isSaved ? (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
                >
                  Remove from Saved
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-700"
                >
                  ❤️ Save Movie
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ItemDetail;