"use client";

import { useLike } from "@/hooks/useLike";

interface LikeButtonProps {
  skillId: string;
  initialCount: number;
  size?: "sm" | "md";
}

export default function LikeButton({
  skillId,
  initialCount,
  size = "sm",
}: LikeButtonProps) {
  const { count, liked, toggle } = useLike(skillId, initialCount);

  const isSm = size === "sm";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      className={`inline-flex items-center gap-1 rounded-md border transition-colors ${
        liked
          ? "border-red-200 bg-red-50 text-red-600"
          : "border-border bg-transparent text-text-muted hover:border-red-200 hover:text-red-500"
      } ${isSm ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm"}`}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <svg
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className={isSm ? "h-3.5 w-3.5" : "h-4.5 w-4.5"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      <span>{count}</span>
    </button>
  );
}
