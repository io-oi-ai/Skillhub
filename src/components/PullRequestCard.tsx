"use client";

import Link from "next/link";
import type { PullRequest } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries/en";

interface PullRequestCardProps {
  pr: PullRequest;
  skillId: string;
  locale: string;
  dict: Dictionary;
}

const STATUS_STYLES: Record<string, string> = {
  open: "bg-green-50 text-green-700 border-green-200",
  merged: "bg-purple-50 text-purple-700 border-purple-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function PullRequestCard({
  pr,
  skillId,
  locale,
  dict,
}: PullRequestCardProps) {
  const t = dict.pulls;
  const prefix = locale === "en" ? "" : `/${locale}`;

  const statusLabel =
    pr.status === "open"
      ? t.open
      : pr.status === "merged"
        ? t.merged
        : t.rejected;

  return (
    <Link
      href={`${prefix}/skill/${skillId}/pulls/${pr.id}`}
      className="block rounded-lg border border-border bg-bg-card p-4 transition-colors hover:border-accent/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary truncate">
              {pr.title}
            </span>
            <span
              className={`shrink-0 rounded-md border px-2 py-0.5 text-xs ${STATUS_STYLES[pr.status]}`}
            >
              {statusLabel}
            </span>
          </div>

          {pr.message && (
            <p className="mt-1 text-sm text-text-secondary line-clamp-2">
              {pr.message}
            </p>
          )}

          <div className="mt-2 flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              {pr.author?.avatarUrl && (
                <img
                  src={pr.author.avatarUrl}
                  alt=""
                  className="h-4 w-4 rounded-full"
                />
              )}
              {t.by} {pr.author?.displayName || pr.author?.username || "Unknown"}
            </span>
            <span>#{pr.id}</span>
            <span>{new Date(pr.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
