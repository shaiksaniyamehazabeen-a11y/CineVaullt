import {
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import SummaryCard from "../components/SummaryCard";
import ItemCard from "../components/ItemCard";
import { useSavedStore } from "../store/savedStore";
import { useTheme } from "../context/ThemeContext";

function Dashboard() {
  const savedItems = useSavedStore(
    (state) => state.savedItems
  );

  const saveItem = useSavedStore(
    (state) => state.saveItem
  );

  const removeItem = useSavedStore(
    (state) => state.removeItem
  );

  const { theme, toggleTheme } = useTheme();

  // Stores the last refreshed time without causing
  // unnecessary re-renders.
  const lastRefreshed = useRef(
    new Date().toLocaleTimeString()
  );

  // Calculate dashboard statistics
  const statistics = useMemo(() => {
    const watchedMovies = savedItems.filter(
      (movie) => movie.status === "watched"
    );

    const watchingMovies = savedItems.filter(
      (movie) => movie.status === "watching"
    );

    const plannedMovies = savedItems.filter(
      (movie) => movie.status === "planned"
    );

    const totalRating = savedItems.reduce(
      (total, movie) => total + movie.rating,
      0
    );

    const averageRating =
      savedItems.length > 0
        ? (totalRating / savedItems.length).toFixed(1)
        : "0.0";

    return {
      total: savedItems.length,
      watched: watchedMovies.length,
      watching: watchingMovies.length,
      planned: plannedMovies.length,
      averageRating,
    };
  }, [savedItems]);

  // Display only the five most recent saved movies
  const recentMovies = useMemo(() => {
    return savedItems.slice(-5).reverse();
  }, [savedItems]);

  // Save movie
  const handleSave = useCallback(
    (movie: (typeof savedItems)[number]) => {
      saveItem(movie);

      toast.success("Movie saved", {
        description: `${movie.name} was added to your collection.`,
      });
    },
    [saveItem]
  );

  // Remove movie
  const handleRemove = useCallback(
    (id: number) => {
      removeItem(id);

      toast.success("Movie removed");
    },
    [removeItem]
  );

  return (
    <section className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-blue-600 dark:text-blue-400">
            Welcome to CineVault
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Your Movie Dashboard
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Track your saved movies and discover
            something new.
          </p>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Last refreshed: {lastRefreshed.current}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border px-4 py-2 font-medium transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {theme === "light"
              ? "🌙 Dark Mode"
              : "☀️ Light Mode"}
          </button>

          <Link
            to="/browse"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Browse Movies
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Saved"
          value={statistics.total}
          description="Movies in your collection"
        />

        <SummaryCard
          title="Watched"
          value={statistics.watched}
          description="Movies you completed"
        />

        <SummaryCard
          title="Watching"
          value={statistics.watching}
          description="Movies in progress"
        />

        <SummaryCard
          title="Average Rating"
          value={statistics.averageRating}
          description="Average movie rating"
        />
      </div>

      {/* Recent Movies */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Recently Saved
            </h2>

            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Your five most recently saved movies.
            </p>
          </div>

          {savedItems.length > 0 && (
            <Link
              to="/saved"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              View All
            </Link>
          )}
        </div>

        {recentMovies.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-3 text-5xl">
              🎬
            </div>

            <h3 className="text-xl font-semibold">
              No Saved Movies Yet
            </h3>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Browse movies and save your favorites
              to see them here.
            </p>

            <Link
              to="/browse"
              className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              Explore Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentMovies.map((movie) => (
              <ItemCard
                key={movie.id}
                item={movie}
                isSaved={true}
                onSave={handleSave}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;