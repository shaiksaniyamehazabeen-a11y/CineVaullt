function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Image skeleton */}
      <div className="h-64 bg-gray-200 dark:bg-gray-700" />

      {/* Content skeleton */}
      <div className="space-y-4 p-5">
        <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

        <div className="h-5 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="flex gap-3 pt-4">
          <div className="h-10 flex-1 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 w-24 rounded-lg bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;