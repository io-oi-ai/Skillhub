"use client";

import { useRouter } from "next/navigation";
import type { Skill } from "@/lib/types";
import { ROLE_COLORS } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import { getLocalizedSkillCopy } from "@/lib/skill-localization";
import LikeButton from "./LikeButton";
import DownloadButton from "./DownloadButton";

interface SkillCardProps {
  skill: Skill;
  locale: Locale;
  roleLabels: Record<string, string>;
  sceneLabels: Record<string, string>;
  featuredLabel: string;
  downloadLabel: string;
}

export default function SkillCard({
  skill,
  locale,
  roleLabels,
  sceneLabels,
  featuredLabel,
  downloadLabel,
}: SkillCardProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  const router = useRouter();
  const localized = getLocalizedSkillCopy(skill, locale);

  return (
    <div
      onClick={() => router.push(`${prefix}/skill/${skill.id}`)}
      className="group h-full cursor-pointer rounded-xl border border-border bg-bg-card p-5 transition-all hover:border-text-muted hover:shadow-sm"
    >
        <div className="mb-3 flex items-start justify-between">
          <h3 className="font-serif text-lg font-semibold text-text-primary group-hover:text-accent">
            {localized.name}
          </h3>
          {skill.featured && (
            <span className="shrink-0 rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-700 border border-amber-200">
              {featuredLabel}
            </span>
          )}
        </div>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-text-secondary">
          {localized.description}
        </p>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {skill.roles.map((role) => (
            <span
              key={role}
              className={`rounded-md border px-2 py-0.5 text-xs ${ROLE_COLORS[role]}`}
            >
              {roleLabels[role]}
            </span>
          ))}
          {skill.scenes.map((scene) => (
            <span
              key={scene}
              className="rounded-md border border-border bg-bg-primary px-2 py-0.5 text-xs text-text-muted"
            >
              {sceneLabels[scene]}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>SkillHub</span>
          <div className="flex items-center gap-2">
            <DownloadButton skill={skill} label={downloadLabel} size="sm" />
            <LikeButton skillId={skill.id} initialCount={skill.likesCount} size="sm" />
          </div>
        </div>
    </div>
  );
}
