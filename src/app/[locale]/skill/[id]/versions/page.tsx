"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import VersionTimeline from "@/components/VersionTimeline";
import type { SkillVersion, Skill } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries/en";

export default function VersionsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [versions, setVersions] = useState<SkillVersion[]>([]);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [dict, setDict] = useState<Dictionary | null>(null);
  const [loading, setLoading] = useState(true);
  const [rolling, setRolling] = useState<number | null>(null);

  const locale = (params.locale as string) || "en";
  const id = params.id as string;

  useEffect(() => {
    async function load() {
      const [versionsRes, skillRes, dictModule] = await Promise.all([
        fetch(`/api/skills/${id}/versions`),
        fetch(`/api/skills/${id}`),
        locale === "zh"
          ? import("@/i18n/dictionaries/zh")
          : import("@/i18n/dictionaries/en"),
      ]);
      if (versionsRes.ok) {
        const data = await versionsRes.json();
        setVersions(data.versions || []);
      }
      if (skillRes.ok) {
        setSkill(await skillRes.json());
      }
      setDict(dictModule.default);
      setLoading(false);
    }
    load();
  }, [id, locale]);

  const handleRollback = async (versionId: number) => {
    if (!confirm(dict?.versions.rollbackConfirm || "Are you sure?")) return;
    setRolling(versionId);
    try {
      const res = await fetch(`/api/skills/${id}/rollback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      if (res.ok) {
        router.refresh();
        // Reload versions
        const versionsRes = await fetch(`/api/skills/${id}/versions`);
        if (versionsRes.ok) {
          const data = await versionsRes.json();
          setVersions(data.versions || []);
        }
      }
    } finally {
      setRolling(null);
    }
  };

  if (loading || !dict) {
    return (
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-border" />
          <div className="h-64 rounded-xl bg-border" />
        </div>
      </main>
    );
  }

  const isAuthor = !!(user && skill && user.id === skill.userId);

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">
            {dict.versions.title}
          </h1>
          {skill && (
            <span className="text-sm text-text-muted">
              {skill.name} — v{skill.version}
            </span>
          )}
        </div>

        <div className="rounded-xl border border-border bg-bg-card p-6">
          <VersionTimeline
            versions={versions}
            currentVersion={skill?.version || ""}
            isAuthor={isAuthor}
            onRollback={handleRollback}
            rolling={rolling}
            dict={dict}
          />
        </div>
      </div>
    </main>
  );
}
