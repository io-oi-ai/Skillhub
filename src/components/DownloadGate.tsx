"use client";

import { useAuth } from "@/hooks/useAuth";
import type { Skill } from "@/lib/types";
import { buildSkillMarkdown } from "@/lib/skill-markdown";
import { isProProfile } from "@/lib/billing";

interface DownloadGateProps {
  skill: Skill;
  downloadLabel: string;
  buyLabel: string;
  size?: "sm" | "md";
}

export default function DownloadGate({ skill, downloadLabel, buyLabel, size = "sm" }: DownloadGateProps) {
  const { profile } = useAuth();
  const isPremium = skill.featured;
  const hasProAccess = isProProfile(profile);

  async function handleDownload(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isPremium && !hasProAccess) {
      // For premium skills, initiate per-download checkout
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "single_skill",
          skillId: skill.id,
          successPath: `${window.location.pathname}?paid=1`,
        }),
      });
      const { checkoutUrl } = await res.json();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
      return;
    }

    // Free download
    const md = buildSkillMarkdown(skill);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${skill.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    fetch(`/api/skills/${skill.id}/download`, { method: "POST" }).catch(() => {});
  }

  const label = isPremium && !hasProAccess ? buyLabel : downloadLabel;

  if (size === "sm") {
    return (
      <button
        onClick={handleDownload}
        title={label}
        className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-primary hover:text-accent"
      >
        {isPremium ? (
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary"
    >
      {isPremium ? (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )}
      {label}
    </button>
  );
}
