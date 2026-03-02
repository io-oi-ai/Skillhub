"use client";

import type { SkillVersion } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries/en";

interface VersionTimelineProps {
  versions: SkillVersion[];
  currentVersion: string;
  isAuthor: boolean;
  onRollback?: (versionId: number) => void;
  rolling?: number | null;
  dict: Dictionary;
}

export default function VersionTimeline({
  versions,
  currentVersion,
  isAuthor,
  onRollback,
  rolling,
  dict,
}: VersionTimelineProps) {
  const t = dict.versions;

  if (versions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-bg-card p-8 text-center text-text-muted">
        {t.noHistory}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {versions.map((v, i) => (
        <div key={v.id} className="relative flex gap-4">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div
              className={`h-3 w-3 rounded-full border-2 ${
                i === 0
                  ? "border-accent bg-accent"
                  : "border-border bg-bg-card"
              }`}
            />
            {i < versions.length - 1 && (
              <div className="w-px flex-1 bg-border" />
            )}
          </div>

          {/* Content */}
          <div className="pb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-primary">
                v{v.version}
              </span>
              {v.version === currentVersion && i === 0 && (
                <span className="rounded bg-accent/10 px-1.5 py-0.5 text-xs text-accent">
                  {t.current}
                </span>
              )}
            </div>

            {v.message && (
              <p className="mt-1 text-sm text-text-secondary">{v.message}</p>
            )}

            <div className="mt-1 flex items-center gap-3 text-xs text-text-muted">
              {v.author && (
                <span className="flex items-center gap-1">
                  {v.author.avatarUrl && (
                    <img
                      src={v.author.avatarUrl}
                      alt=""
                      className="h-4 w-4 rounded-full"
                    />
                  )}
                  {v.author.displayName || v.author.username}
                </span>
              )}
              <span>{new Date(v.createdAt).toLocaleDateString()}</span>
            </div>

            {isAuthor && onRollback && i > 0 && (
              <button
                onClick={() => onRollback(v.id)}
                disabled={rolling === v.id}
                className="mt-2 rounded border border-border px-2.5 py-1 text-xs text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary disabled:opacity-50"
              >
                {rolling === v.id ? "..." : t.rollback}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
