import type { Movie } from "../types/movie.types";

export interface TvMazeShow {
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

export interface TvMazeSearchResult {
  score: number;
  show: TvMazeShow;
}

export function mapTvMazeShowToMovie(
  show: TvMazeShow
): Movie {
  return {
    id: show.id,
    name: show.name,
    image:
      show.image?.medium ??
      show.image?.original,
    summary: show.summary
  ? show.summary.replace(/<[^>]*>/g, "")
  : "No description available.",
    rating:
      show.rating?.average ?? 0,
    language:
      show.language ?? "Unknown",
    status: "planned",
    genres: show.genres ?? [],
    premiered: show.premiered,
  };
}

export function mapTvMazeShowsToMovies(
  shows: TvMazeShow[]
): Movie[] {
  return shows.map(mapTvMazeShowToMovie);
}

export function mapTvMazeSearchResultsToMovies(
  results: TvMazeSearchResult[]
): Movie[] {
  return results
    .filter((result) => result.show)
    .map((result) =>
      mapTvMazeShowToMovie(result.show)
    );
}