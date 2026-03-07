"use client";

import type { Skill } from "@/lib/types";
import { buildSkillMarkdown } from "@/lib/skill-markdown";

interface DownloadButtonProps {
  skill: Skill;
  label: string;
  size?: "sm" | "md";
}

export default function DownloadButton({ skill, label, size = "sm" }: DownloadButtonProps) {
  function handleDownload(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const md = buildSkillMarkdown(skill);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${skill.id}.md`;
    a.click();
    URL.revokeObjectURL(url);

    // Award points to skill creator (fire-and-forget)
    fetch(`/api/skills/${skill.id}/download`, { method: "POST" }).catch(() => {});
  }

  if (size === "sm") {
    return (
      <button
        onClick={handleDownload}
        title={label}
        className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-primary hover:text-accent"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      {label}
    </button>
  );
}
