import Link from "next/link";
import type { Skill } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

interface MetaSkillCardProps {
  skill: Skill;
  locale: Locale;
  dict: Dictionary;
  skillCount: number;
}

export default function MetaSkillCard({
  skill,
  locale,
  dict,
  skillCount,
}: MetaSkillCardProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  const t = dict.metaSkill;

  return (
    <Link href={`${prefix}/skill/${skill.id}`} className="block">
      <div className="group relative overflow-hidden rounded-2xl border border-transparent bg-gradient-to-r from-accent/10 via-purple-500/10 to-amber-500/10 p-[1px] transition-all hover:shadow-lg hover:shadow-accent/5">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent via-purple-500 to-amber-500 opacity-20 transition-opacity group-hover:opacity-30" />

        {/* Card content */}
        <div className="relative rounded-2xl bg-bg-card px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Icon + Text */}
            <div className="flex items-start gap-4 sm:items-center">
              {/* Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-purple-500 text-white shadow-md">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              </div>

              {/* Text */}
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="font-serif text-xl font-bold text-text-primary group-hover:text-accent sm:text-2xl">
                    {skill.name}
                  </h3>
                  <span className="rounded-full bg-gradient-to-r from-accent to-purple-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                    {t.badge}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
                  {t.subtitle}
                </p>
              </div>
            </div>

            {/* Right: Stats + CTA */}
            <div className="flex items-center gap-4 sm:shrink-0">
              {/* Skill count */}
              <div className="text-center">
                <p className="font-mono text-2xl font-bold text-accent">{skillCount}</p>
                <p className="text-xs text-text-muted">{t.skillCount}</p>
              </div>

              {/* CTA arrow */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-primary text-text-muted transition-all group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
