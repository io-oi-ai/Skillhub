"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { PullRequest, Skill } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries/en";

const STATUS_STYLES: Record<string, string> = {
  open: "bg-green-50 text-green-700 border-green-200",
  merged: "bg-purple-50 text-purple-700 border-purple-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function PullRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [pr, setPr] = useState<PullRequest | null>(null);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [dict, setDict] = useState<Dictionary | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewComment, setReviewComment] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const locale = (params.locale as string) || "en";
  const id = params.id as string;
  const prId = params.prId as string;
  const prefix = locale === "en" ? "" : `/${locale}`;

  useEffect(() => {
    async function load() {
      const [prRes, skillRes, dictModule] = await Promise.all([
        fetch(`/api/skills/${id}/pulls/${prId}`),
        fetch(`/api/skills/${id}`),
        locale === "zh"
          ? import("@/i18n/dictionaries/zh")
          : import("@/i18n/dictionaries/en"),
      ]);
      if (prRes.ok) setPr(await prRes.json());
      if (skillRes.ok) setSkill(await skillRes.json());
      setDict(dictModule.default);
      setLoading(false);
    }
    load();
  }, [id, prId, locale]);

  const handleAction = async (action: "merge" | "reject") => {
    setActionLoading(action);
    setError("");
    try {
      const res = await fetch(`/api/skills/${id}/pulls/${prId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: reviewComment || undefined }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Failed to ${action}`);
      }
      // Reload PR
      const prRes = await fetch(`/api/skills/${id}/pulls/${prId}`);
      if (prRes.ok) setPr(await prRes.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : `Failed to ${action}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || !dict) {
    return (
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-border" />
          <div className="h-48 rounded-xl bg-border" />
        </div>
      </main>
    );
  }

  if (!pr) {
    return (
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center text-text-muted">
          Pull request not found
        </div>
      </main>
    );
  }

  const t = dict.pulls;
  const isSkillOwner = !!(user && skill && user.id === skill.userId);
  const statusLabel =
    pr.status === "open" ? t.open : pr.status === "merged" ? t.merged : t.rejected;

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">{pr.title}</h1>
            <span
              className={`rounded-md border px-2 py-0.5 text-xs ${STATUS_STYLES[pr.status]}`}
            >
              {statusLabel}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm text-text-muted">
            <span className="flex items-center gap-1">
              {pr.author?.avatarUrl && (
                <img
                  src={pr.author.avatarUrl}
                  alt=""
                  className="h-5 w-5 rounded-full"
                />
              )}
              {t.by} {pr.author?.displayName || pr.author?.username || "Unknown"}
            </span>
            <span>#{pr.id}</span>
            <span>{new Date(pr.createdAt).toLocaleDateString()}</span>
          </div>
          {pr.message && (
            <p className="mt-3 text-sm text-text-secondary">{pr.message}</p>
          )}
        </div>

        {/* Changed content preview */}
        <div className="mb-6 space-y-4">
          <h2 className="text-lg font-medium text-text-primary">Proposed Changes</h2>
          <div className="space-y-3 rounded-xl border border-border bg-bg-card p-6">
            <div>
              <span className="text-xs font-medium text-text-muted">Name</span>
              <p className="text-sm text-text-primary">{pr.name}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-text-muted">Description</span>
              <p className="text-sm text-text-primary">{pr.description}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-text-muted">Roles</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {pr.roles.map((r) => (
                  <span key={r} className="rounded bg-bg-primary px-2 py-0.5 text-xs text-text-secondary">
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-medium text-text-muted">Scenes</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {pr.scenes.map((s) => (
                  <span key={s} className="rounded bg-bg-primary px-2 py-0.5 text-xs text-text-secondary">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            {pr.tags.length > 0 && (
              <div>
                <span className="text-xs font-medium text-text-muted">Tags</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {pr.tags.map((tag) => (
                    <span key={tag} className="rounded bg-bg-primary px-2 py-0.5 text-xs text-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span className="text-xs font-medium text-text-muted">Content</span>
              <pre className="mt-1 max-h-64 overflow-auto rounded-lg bg-bg-primary p-3 font-mono text-xs text-text-secondary">
                {pr.content}
              </pre>
            </div>
          </div>
        </div>

        {/* Review comment */}
        {pr.reviewComment && (
          <div className="mb-6 rounded-xl border border-border bg-bg-card p-4">
            <span className="text-xs font-medium text-text-muted">Review Comment</span>
            <p className="mt-1 text-sm text-text-secondary">{pr.reviewComment}</p>
          </div>
        )}

        {/* Actions for skill owner */}
        {isSkillOwner && pr.status === "open" && (
          <div className="space-y-4 rounded-xl border border-border bg-bg-card p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                {t.reviewComment}
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={2}
                placeholder={t.reviewComment}
                className="w-full rounded-lg border border-border bg-bg-primary px-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleAction("merge")}
                disabled={!!actionLoading}
                className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {actionLoading === "merge" ? "..." : t.merge}
              </button>
              <button
                onClick={() => handleAction("reject")}
                disabled={!!actionLoading}
                className="rounded-lg border border-red-200 px-5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {actionLoading === "reject" ? "..." : t.reject}
              </button>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        )}

        {/* Back link */}
        <div className="mt-6">
          <button
            onClick={() => router.push(`${prefix}/skill/${id}/pulls`)}
            className="text-sm text-text-muted hover:text-text-primary"
          >
            &larr; {t.title}
          </button>
        </div>
      </div>
    </main>
  );
}
