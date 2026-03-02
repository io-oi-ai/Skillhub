"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PullRequestCard from "@/components/PullRequestCard";
import type { PullRequest, PullRequestStatus } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries/en";

export default function PullRequestsPage() {
  const params = useParams();
  const [pulls, setPulls] = useState<PullRequest[]>([]);
  const [dict, setDict] = useState<Dictionary | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<PullRequestStatus | "all">("all");

  const locale = (params.locale as string) || "en";
  const id = params.id as string;

  useEffect(() => {
    async function load() {
      const [pullsRes, dictModule] = await Promise.all([
        fetch(`/api/skills/${id}/pulls`),
        locale === "zh"
          ? import("@/i18n/dictionaries/zh")
          : import("@/i18n/dictionaries/en"),
      ]);
      if (pullsRes.ok) {
        const data = await pullsRes.json();
        setPulls(data.pulls || []);
      }
      setDict(dictModule.default);
      setLoading(false);
    }
    load();
  }, [id, locale]);

  if (loading || !dict) {
    return (
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-border" />
          <div className="h-32 rounded-xl bg-border" />
        </div>
      </main>
    );
  }

  const t = dict.pulls;
  const filtered =
    statusFilter === "all"
      ? pulls
      : pulls.filter((p) => p.status === statusFilter);

  const tabs: { key: PullRequestStatus | "all"; label: string }[] = [
    { key: "all", label: `All (${pulls.length})` },
    { key: "open", label: `${t.open} (${pulls.filter((p) => p.status === "open").length})` },
    { key: "merged", label: `${t.merged} (${pulls.filter((p) => p.status === "merged").length})` },
    { key: "rejected", label: `${t.rejected} (${pulls.filter((p) => p.status === "rejected").length})` },
  ];

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-text-primary">
          {t.title}
        </h1>

        {/* Status filter tabs */}
        <div className="mb-4 flex gap-1 rounded-lg border border-border bg-bg-primary p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                statusFilter === tab.key
                  ? "bg-bg-card text-text-primary shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* PR list */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-bg-card p-8 text-center text-text-muted">
            {t.noPulls}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((pr) => (
              <PullRequestCard
                key={pr.id}
                pr={pr}
                skillId={id}
                locale={locale}
                dict={dict}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
