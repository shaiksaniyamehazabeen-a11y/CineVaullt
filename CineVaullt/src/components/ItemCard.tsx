import { memo } from "react";
import { Link } from "react-router-dom";

import type { Movie } from "../types/movie.types";
import Badge from "./Badge";

interface ItemCardProps {
  item: Movie;
  isSaved: boolean;
  onSave: (movie: Movie) => void;
  onRemove: (id: number) => void;
}

function ItemCard({
  item,
  isSaved,
  onSave,
  onRemove,
}: ItemCardProps) {
  const imageUrl =
    item.image ||
    "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <article className="movie-card">
      <img
        src={imageUrl}
        alt={item.name}
        className="movie-card-image"
      />

      <div className="movie-card-content">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="movie-card-title">
            {item.name}
          </h3>

          <span className="movie-rating">
            ⭐ {item.rating.toFixed(1)}
          </span>
        </div>

        <Badge status={item.status} />

        <p className="movie-card-summary">
          {item.summary}
        </p>

        <div className="movie-card-actions">
          <Link
            to={`/browse/${item.id}`}
            className="details-button"
          >
            View Details
          </Link>

          {isSaved ? (
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="remove-button"
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSave(item)}
              className="save-button"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(ItemCard);