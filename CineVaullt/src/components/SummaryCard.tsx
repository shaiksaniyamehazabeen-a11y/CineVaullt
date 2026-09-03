interface SummaryCardProps {
  title: string;
  value: string | number;
  description: string;
}

function SummaryCard({
  title,
  value,
  description,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <h3 className="mt-2 text-3xl font-bold">
        {value}
      </h3>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

export default SummaryCard;