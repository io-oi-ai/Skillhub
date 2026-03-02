"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import SkillFormFields from "@/components/SkillFormFields";
import type { Role, Scene, Skill } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries/en";

function EditFormInner({ skill, dict, locale }: { skill: Skill; dict: Dictionary; locale: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState(skill.name);
  const [description, setDescription] = useState(skill.description);
  const [roles, setRoles] = useState<Role[]>(skill.roles);
  const [scenes, setScenes] = useState<Scene[]>(skill.scenes);
  const [tags, setTags] = useState(skill.tags.join(", "));
  const [content, setContent] = useState(skill.content);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const prefix = locale === "en" ? "" : `/${locale}`;

  const isValid = name && description && roles.length > 0 && scenes.length > 0;

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);
    setError("");

    const tagList = tags
      .split(/[,，、]/)
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/skills/${skill.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          roles,
          scenes,
          tags: tagList,
          content,
          message: message || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      router.push(`${prefix}/skill/${skill.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.id !== skill.userId) {
    return (
      <div className="rounded-xl border border-border bg-bg-card p-8 text-center text-text-muted">
        You don&apos;t have permission to edit this skill.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SkillFormFields
        dict={dict}
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        roles={roles}
        setRoles={setRoles}
        scenes={scenes}
        setScenes={setScenes}
        tags={tags}
        setTags={setTags}
        content={content}
        setContent={setContent}
        hideAuthor
      />

      {/* Version Message */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          {dict.versions.message}
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={dict.versions.message}
          className="w-full rounded-lg border border-border bg-bg-card px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={!isValid || saving}
          className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-colors ${
            isValid && !saving
              ? "bg-accent text-white hover:bg-accent-hover"
              : "cursor-not-allowed bg-border text-text-muted"
          }`}
        >
          {saving ? dict.edit.saving : dict.edit.save}
        </button>
        <button
          onClick={() => router.back()}
          className="rounded-lg border border-border px-6 py-2.5 text-sm text-text-secondary transition-colors hover:border-accent/50"
        >
          Cancel
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

export default function EditSkillPage() {
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [dict, setDict] = useState<Dictionary | null>(null);
  const [loading, setLoading] = useState(true);

  const locale = (params.locale as string) || "en";
  const id = params.id as string;

  useEffect(() => {
    async function load() {
      const [skillRes, dictModule] = await Promise.all([
        fetch(`/api/skills/${id}`),
        locale === "zh"
          ? import("@/i18n/dictionaries/zh")
          : import("@/i18n/dictionaries/en"),
      ]);
      if (skillRes.ok) {
        setSkill(await skillRes.json());
      }
      setDict(dictModule.default);
      setLoading(false);
    }
    load();
  }, [id, locale]);

  if (loading || authLoading || !dict) {
    return (
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-border" />
          <div className="h-64 rounded-xl bg-border" />
        </div>
      </main>
    );
  }

  if (!skill) {
    return (
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center text-text-muted">
          Skill not found
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-text-primary">
          {dict.edit.title}
        </h1>
        <EditFormInner skill={skill} dict={dict} locale={locale} />
      </div>
    </main>
  );
}
