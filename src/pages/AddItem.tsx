import { useState } from "react";
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

  const handleImagePreview = () => {
    setImagePreview(imageUrl || "");
  };

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

      // Add movie to the movie store
      addMovie(newMovie);

      // Optimistically save the movie
      saveItem(newMovie);

      toast.success("Movie added successfully! 🎬");

      reset();
      setImagePreview("");

      navigate("/saved");
    } catch {
      toast.error("Failed to add movie. Please try again.");
    }
  };

  return (
    <main className="page-container">
      <section className="form-page">
        <div className="form-header">
          <h1>Add Movie</h1>
          <p>Add a new movie to your CineVault collection.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="movie-form">
          {/* Movie Name */}
          <div className="form-group">
            <label htmlFor="name">Movie Name *</label>

            <input
              id="name"
              type="text"
              placeholder="Enter movie name"
              {...register("name")}
            />

            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>

          {/* Movie Image URL */}
          <div className="form-group">
            <label htmlFor="image">Movie Image URL</label>

            <input
              id="image"
              type="url"
              placeholder="https://example.com/movie-poster.jpg"
              {...register("image")}
              onBlur={handleImagePreview}
            />

            {errors.image && (
              <p className="error-message">{errors.image.message}</p>
            )}

            <p className="form-help">
              Paste a valid movie poster image URL.
            </p>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Movie poster preview"
                className="image-preview"
                onError={() => setImagePreview("")}
              />
            )}
          </div>

          {/* Summary */}
          <div className="form-group">
            <label htmlFor="summary">Summary *</label>

            <textarea
              id="summary"
              rows={4}
              placeholder="Enter movie summary"
              {...register("summary")}
            />

            {errors.summary && (
              <p className="error-message">{errors.summary.message}</p>
            )}
          </div>

          {/* Rating */}
          <div className="form-group">
            <label htmlFor="rating">Rating *</label>

            <input
              id="rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              {...register("rating", {
                valueAsNumber: true,
              })}
            />

            {errors.rating && (
              <p className="error-message">{errors.rating.message}</p>
            )}
          </div>

          {/* Language */}
          <div className="form-group">
            <label htmlFor="language">Language *</label>

            <input
              id="language"
              type="text"
              placeholder="Example: Telugu"
              {...register("language")}
            />

            {errors.language && (
              <p className="error-message">{errors.language.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status">Status *</label>

            <select id="status" {...register("status")}>
              <option value="planned">Planned</option>
              <option value="watching">Watching</option>
              <option value="watched">Watched</option>
            </select>

            {errors.status && (
              <p className="error-message">{errors.status.message}</p>
            )}
          </div>

          {/* Genres */}
          <div className="form-group">
            <label htmlFor="genres">Genres *</label>

            <input
              id="genres"
              type="text"
              placeholder="Romance, Drama, Action"
              {...register("genres")}
            />

            {errors.genres && (
              <p className="error-message">{errors.genres.message}</p>
            )}

            <p className="form-help">
              Separate multiple genres with commas.
            </p>
          </div>

          {/* Premiered Date */}
          <div className="form-group">
            <label htmlFor="premiered">Premiered Date</label>

            <input
              id="premiered"
              type="date"
              {...register("premiered")}
            />

            {errors.premiered && (
              <p className="error-message">{errors.premiered.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Movie..." : "Add Movie"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                reset();
                setImagePreview("");
              }}
            >
              Clear Form
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/saved")}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AddItem;