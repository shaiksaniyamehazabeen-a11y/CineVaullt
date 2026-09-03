import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { itemSchema, type ItemForm } from "../schemas/itemSchema";
import type { Movie } from "../types/movie.types";
import { useMovieStore } from "../store/movieStore";
import { useSavedStore } from "../store/savedStore";

function AddItem() {
  const navigate = useNavigate();

  const addMovie = useMovieStore((state) => state.addMovie);
  const saveItem = useSavedStore((state) => state.saveItem);

  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ItemForm>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      image: "",
      summary: "",
      rating: 0,
      language: "",
      status: "planned",
      genres: "",
      premiered: "",
    },
  });

  const imageUrl = watch("image");

  // Update image preview whenever the image URL changes
  useEffect(() => {
    setImagePreview(imageUrl || "");
  }, [imageUrl]);

  const onSubmit = async (data: ItemForm) => {
    try {
      // Mock POST request
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newMovie: Movie = {
        id: Date.now(),
        name: data.name.trim(),
        image: data.image?.trim() || undefined,
        summary: data.summary.trim(),
        rating: data.rating,
        language: data.language.trim(),
        status: data.status,
        genres: data.genres
          .split(",")
          .map((genre) => genre.trim())
          .filter(Boolean),
        premiered: data.premiered || undefined,
      };

      addMovie(newMovie);
      saveItem(newMovie);

      toast.success("Movie added successfully! 🎬", {
        description: `${newMovie.name} was added to your collection.`,
      });

      reset();
      setImagePreview("");

      navigate("/saved");
    } catch {
      toast.error("Failed to add movie. Please try again.");
    }
  };

  const handleClear = () => {
    reset();
    setImagePreview("");
    toast.info("Form cleared");
  };

  return (
    <section className="mx-auto max-w-4xl">
      {/* Page Heading */}
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-purple-600">
          CineVault Collection
        </p>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Add a New Movie
        </h1>

        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Add your favorite movie to your personal collection.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Movie Name */}
          <div>
            <label htmlFor="name" className="form-label">
              Movie Name <span className="text-red-500">*</span>
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter movie name"
              {...register("name")}
              className="form-input"
            />

            {errors.name && (
              <p className="form-error">{errors.name.message}</p>
            )}
          </div>

          {/* Movie Image */}
          <div>
            <label htmlFor="image" className="form-label">
              Movie Poster Image URL
            </label>

            <input
              id="image"
              type="url"
              placeholder="https://example.com/movie-poster.jpg"
              {...register("image")}
              className="form-input"
            />

            <p className="form-help">
              Paste a valid movie poster image URL.
            </p>

            {errors.image && (
              <p className="form-error">{errors.image.message}</p>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Poster Preview
                </p>

                <img
                  src={imagePreview}
                  alt="Movie poster preview"
                  className="h-64 w-44 rounded-xl border border-gray-200 object-cover shadow-md dark:border-gray-600"
                  onError={() => setImagePreview("")}
                />
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="form-label">
              Summary <span className="text-red-500">*</span>
            </label>

            <textarea
              id="summary"
              rows={5}
              placeholder="Enter movie summary"
              {...register("summary")}
              className="form-input resize-none"
            />

            {errors.summary && (
              <p className="form-error">{errors.summary.message}</p>
            )}
          </div>

          {/* Rating and Language */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="rating" className="form-label">
                Rating <span className="text-red-500">*</span>
              </label>

              <input
                id="rating"
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="0 - 10"
                {...register("rating", {
                  valueAsNumber: true,
                })}
                className="form-input"
              />

              {errors.rating && (
                <p className="form-error">{errors.rating.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="language" className="form-label">
                Language <span className="text-red-500">*</span>
              </label>

              <input
                id="language"
                type="text"
                placeholder="Example: Telugu"
                {...register("language")}
                className="form-input"
              />

              {errors.language && (
                <p className="form-error">{errors.language.message}</p>
              )}
            </div>
          </div>

          {/* Status and Genres */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="status" className="form-label">
                Status <span className="text-red-500">*</span>
              </label>

              <select
                id="status"
                {...register("status")}
                className="form-input"
              >
                <option value="planned">Planned</option>
                <option value="watching">Watching</option>
                <option value="watched">Watched</option>
              </select>

              {errors.status && (
                <p className="form-error">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="genres" className="form-label">
                Genres <span className="text-red-500">*</span>
              </label>

              <input
                id="genres"
                type="text"
                placeholder="Romance, Drama, Action"
                {...register("genres")}
                className="form-input"
              />

              <p className="form-help">
                Separate multiple genres with commas.
              </p>

              {errors.genres && (
                <p className="form-error">{errors.genres.message}</p>
              )}
            </div>
          </div>

          {/* Premiered Date */}
          <div>
            <label htmlFor="premiered" className="form-label">
              Premiered Date
            </label>

            <input
              id="premiered"
              type="date"
              {...register("premiered")}
              className="form-input"
            />

            {errors.premiered && (
              <p className="form-error">{errors.premiered.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 dark:border-gray-700 sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Adding Movie..." : "Add Movie"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Clear Form
            </button>

            <button
              type="button"
              onClick={() => navigate("/browse")}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AddItem;