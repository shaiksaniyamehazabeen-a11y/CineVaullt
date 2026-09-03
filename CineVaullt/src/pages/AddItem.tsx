import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  itemSchema,
  type ItemForm,
} from "../schemas/itemSchema";

import { useMovieStore } from "../store/movieStore";
import { useSavedStore } from "../store/savedStore";

import type { Movie } from "../types/movie.types";

function AddItem() {
  const navigate = useNavigate();

  const addMovie = useMovieStore(
    (state) => state.addMovie
  );

  const saveItem = useSavedStore(
    (state) => state.saveItem
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ItemForm>({
    resolver: zodResolver(itemSchema),

    defaultValues: {
      name: "",
      summary: "",
      rating: 0,
      language: "",
      status: "planned",
      genres: "",
      premiered: "",
    },
  });

  const onSubmit = async (data: ItemForm) => {
    /*
     * Omit<ItemForm, "id"> represents form data
     * before an id is generated.
     */
    const formData: Omit<ItemForm, "id"> = data;

    /*
     * Mock POST request.
     * In a real backend, this would be:
     * await api.post("/shows", formData);
     */
    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    /*
     * Convert form data into the Movie type.
     */
    const newMovie: Movie = {
      id: Date.now(),

      name: formData.name.trim(),

      summary: formData.summary.trim(),

      rating: formData.rating,

      language: formData.language.trim(),

      status: formData.status,

      genres: formData.genres
        .split(",")
        .map((genre) => genre.trim())
        .filter(Boolean),

      premiered:
        formData.premiered || undefined,
    };

    /*
     * Optimistic update:
     * Add the movie immediately to the local stores.
     */
    addMovie(newMovie);
    saveItem(newMovie);

    /*
     * Show success notification.
     */
    toast.success("Movie added successfully!", {
      description: `${newMovie.name} has been added to your saved movies.`,
    });

    /*
     * Clear the form.
     */
    reset();

    /*
     * Navigate to Saved page.
     */
    navigate("/saved", { replace: true });
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Add Movie
        </h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Add a new movie to CineVault.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        {/* Movie Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block font-medium"
          >
            Movie Name
          </label>

          <input
            id="name"
            type="text"
            {...register("name")}
            placeholder="Enter movie name"
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Summary */}
        <div>
          <label
            htmlFor="summary"
            className="mb-2 block font-medium"
          >
            Summary
          </label>

          <textarea
            id="summary"
            {...register("summary")}
            rows={4}
            placeholder="Enter movie summary"
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
          />

          {errors.summary && (
            <p className="mt-1 text-sm text-red-600">
              {errors.summary.message}
            </p>
          )}
        </div>

        {/* Rating */}
        <div>
          <label
            htmlFor="rating"
            className="mb-2 block font-medium"
          >
            Rating
          </label>

          <input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="10"
            {...register("rating", {
              valueAsNumber: true,
            })}
            placeholder="0 - 10"
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
          />

          {errors.rating && (
            <p className="mt-1 text-sm text-red-600">
              {errors.rating.message}
            </p>
          )}
        </div>

        {/* Language */}
        <div>
          <label
            htmlFor="language"
            className="mb-2 block font-medium"
          >
            Language
          </label>

          <input
            id="language"
            type="text"
            {...register("language")}
            placeholder="Example: English"
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
          />

          {errors.language && (
            <p className="mt-1 text-sm text-red-600">
              {errors.language.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="mb-2 block font-medium"
          >
            Status
          </label>

          <select
            id="status"
            {...register("status")}
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="planned">
              Planned
            </option>

            <option value="watching">
              Watching
            </option>

            <option value="watched">
              Watched
            </option>
          </select>

          {errors.status && (
            <p className="mt-1 text-sm text-red-600">
              {errors.status.message}
            </p>
          )}
        </div>

        {/* Genres */}
        <div>
          <label
            htmlFor="genres"
            className="mb-2 block font-medium"
          >
            Genres
          </label>

          <input
            id="genres"
            type="text"
            {...register("genres")}
            placeholder="Example: Drama, Action, Romance"
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
          />

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Separate multiple genres with commas.
          </p>

          {errors.genres && (
            <p className="mt-1 text-sm text-red-600">
              {errors.genres.message}
            </p>
          )}
        </div>

        {/* Premiered */}
        <div>
          <label
            htmlFor="premiered"
            className="mb-2 block font-medium"
          >
            Premiered
          </label>

          <input
            id="premiered"
            type="date"
            {...register("premiered")}
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
          />

          {errors.premiered && (
            <p className="mt-1 text-sm text-red-600">
              {errors.premiered.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Adding Movie..."
              : "Add Movie"}
          </button>

          <button
            type="button"
            onClick={() => reset()}
            disabled={isSubmitting}
            className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddItem;