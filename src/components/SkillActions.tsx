"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import type { Dictionary } from "@/i18n/dictionaries/en";

interface SkillActionsProps {
  skillId: string;
  skillUserId: string | null | undefined;
  locale: string;
  dict: Dictionary;
}

export default function SkillActions({
  skillId,
  skillUserId,
  locale,
  dict,
}: SkillActionsProps) {
  const { user, loading } = useAuth();
  const prefix = locale === "en" ? "" : `/${locale}`;
  const t = dict.skillActions;

  if (loading) return null;

  const isAuthor = !!(user && skillUserId && user.id === skillUserId);
  const isLoggedIn = !!user;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Author: Edit button */}
      {isAuthor && (
        <Link
          href={`${prefix}/skill/${skillId}/edit`}
          className="rounded-lg border border-accent bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          {t.edit}
        </Link>
      )}

      {/* Non-author logged in: Suggest Edit */}
      {isLoggedIn && !isAuthor && (
        <Link
          href={`${prefix}/skill/${skillId}/suggest`}
          className="rounded-lg border border-accent px-4 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
        >
          {dict.pulls.suggest}
        </Link>
      )}

      {/* Not logged in: Sign in to suggest */}
      {!isLoggedIn && (
        <Link
          href={`${prefix}/login`}
          className="rounded-lg border border-border px-4 py-1.5 text-sm text-text-muted transition-colors hover:border-accent/50 hover:text-text-secondary"
        >
          {t.signInToEdit}
        </Link>
      )}

      {/* View History (always visible) */}
      <Link
        href={`${prefix}/skill/${skillId}/versions`}
        className="rounded-lg border border-border px-4 py-1.5 text-sm text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary"
      >
        {t.viewHistory}
      </Link>

      {/* PRs (only visible to skill creator) */}
      {isAuthor && (
        <Link
          href={`${prefix}/skill/${skillId}/pulls`}
          className="rounded-lg border border-border px-4 py-1.5 text-sm text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary"
        >
          {t.pendingPRs}
        </Link>
      )}
    </div>
  );
}
