import type { MovieStatus } from "../types/movie.types";

interface BadgeProps {
  status: MovieStatus;
}

type BadgeStyle = {
  label: string;
  className: string;
};

const badgeStyles: Record<MovieStatus, BadgeStyle> = {
  watched: {
    label: "Watched",
    className: "badge badge-watched",
  },

  watching: {
    label: "Watching",
    className: "badge badge-watching",
  },

  planned: {
    label: "Planned",
    className: "badge badge-planned",
  },
};

function Badge({ status }: BadgeProps) {
  const style = badgeStyles[status];

  return (
    <span className={style.className}>
      {style.label}
    </span>
  );
}

export default Badge;