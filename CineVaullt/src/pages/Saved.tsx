import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useSavedStore } from "../store/savedStore";
import type { MovieStatus } from "../types/movie.types";
import Badge from "../components/Badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const movieStatuses: MovieStatus[] = [
  "watched",
  "watching",
  "planned",
];

function Saved() {
  const savedItems = useSavedStore(
    (state) => state.savedItems
  );

  const removeItem = useSavedStore(
    (state) => state.removeItem
  );

  const clearAll = useSavedStore(
    (state) => state.clearAll
  );

  const [isDialogOpen, setIsDialogOpen] =
    useState(false);

  const totalSaved = savedItems.length;

  // Dynamic browser tab title
  useEffect(() => {
    document.title = `CineVault — ${totalSaved} Saved ${
      totalSaved === 1 ? "Item" : "Items"
    }`;

    return () => {
      document.title = "CineVault";
    };
  }, [totalSaved]);

  // Summary using reduce()
  const statusSummary = useMemo(() => {
    return savedItems.reduce<
      Record<MovieStatus, number>
    >(
      (summary, movie) => {
        summary[movie.status] += 1;
        return summary;
      },
      {
        watched: 0,
        watching: 0,
        planned: 0,
      }
    );
  }, [savedItems]);

  // Remove one saved movie
  const handleRemove = (
    id: number,
    name: string
  ) => {
    removeItem(id);

    toast.success("Movie removed", {
      description: `${name} was removed from your saved movies.`,
    });
  };

  // Clear all saved movies
  const handleClearAll = () => {
    clearAll();
    setIsDialogOpen(false);

    toast.success("All movies cleared", {
      description:
        "All saved movies have been removed.",
    });
  };

  return (
    <section className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Saved Movies
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Movies you have saved to your CineVault
            collection.
          </p>
        </div>

        {totalSaved > 0 && (
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Empty State */}
      {totalSaved === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-3 text-5xl">
            🎬
          </div>

          <h2 className="text-xl font-semibold">
            No Saved Movies
          </h2>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            You haven't saved any movies yet.
          </p>
        </div>
      ) : (
        <>
          {/* Saved Movies Table */}
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Movie</TableHead>

                  <TableHead>
                    Language
                  </TableHead>

                  <TableHead>
                    Rating
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead>
                    Genres
                  </TableHead>

                  <TableHead className="text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {savedItems.map((movie) => (
                  <TableRow key={movie.id}>
                    <TableCell className="font-medium">
                      {movie.name}
                    </TableCell>

                    <TableCell>
                      {movie.language}
                    </TableCell>

                    <TableCell>
                      ⭐ {movie.rating.toFixed(1)}
                    </TableCell>

                    <TableCell>
                      <Badge
                        status={movie.status}
                      />
                    </TableCell>

                    <TableCell>
                      {movie.genres.length > 0
                        ? movie.genres.join(", ")
                        : "No genres"}
                    </TableCell>

                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(
                            movie.id,
                            movie.name
                          )
                        }
                        className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      >
                        Remove
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">
                Saved Movies Summary
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Total Saved Movies:{" "}
                <span className="font-semibold">
                  {totalSaved}
                </span>
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead>
                      Count
                    </TableHead>

                    <TableHead>
                      Percentage
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {movieStatuses.map(
                    (status) => {
                      const count =
                        statusSummary[status];

                      const percentage =
                        totalSaved > 0
                          ? (
                              (count /
                                totalSaved) *
                              100
                            ).toFixed(1)
                          : "0.0";

                      return (
                        <TableRow
                          key={status}
                        >
                          <TableCell>
                            <Badge
                              status={status}
                            />
                          </TableCell>

                          <TableCell className="font-medium">
                            {count}
                          </TableCell>

                          <TableCell>
                            {percentage}%
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {/* Clear All Confirmation Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-dialog-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
          >
            <h2
              id="clear-dialog-title"
              className="text-xl font-bold"
            >
              Clear All Saved Movies?
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Are you sure you want to remove all{" "}
              {totalSaved} saved{" "}
              {totalSaved === 1
                ? "movie"
                : "movies"}
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setIsDialogOpen(false)
                }
                className="rounded-lg border px-4 py-2 font-medium transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Saved;