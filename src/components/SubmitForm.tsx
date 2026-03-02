"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import type { Role, Scene } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries/en";

interface SubmitFormProps {
  dict: Dictionary;
  locale: string;
}

export default function SubmitForm({ dict, locale }: SubmitFormProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [generated, setGenerated] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishMsg, setPublishMsg] = useState("");

  const prefix = locale === "en" ? "" : `/${locale}`;
  const t = dict.submitForm;
  const roleLabels = dict.roles as Record<string, string>;
  const sceneLabels = dict.scenes as Record<string, string>;

  const toggleRole = (r: Role) => {
    setRoles((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  const toggleScene = (s: Scene) => {
    setScenes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const isValid = name && description && roles.length > 0 && scenes.length > 0 && author;

  const generateMarkdown = () => {
    const tagList = tags
      .split(/[,，、]/)
      .map((t) => t.trim())
      .filter(Boolean);

    const md = `---
name: "${name}"
description: "${description}"
author: "${author}"
roles: [${roles.map((r) => `"${r}"`).join(", ")}]
scenes: [${scenes.map((s) => `"${s}"`).join(", ")}]
version: "1.0.0"
updatedAt: "${new Date().toISOString().split("T")[0]}"
tags: [${tagList.map((t) => `"${t}"`).join(", ")}]
---

${content || `# ${name}\n\n${description}`}
`;
    setGenerated(md);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generated);
  };

  const downloadFile = () => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
      .replace(/^-|-$/g, "");
    const blob = new Blob([generated], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug || "skill"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const publishToDatabase = async () => {
    setPublishing(true);
    setPublishMsg("");

    const tagList = tags
      .split(/[,，、]/)
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          author,
          roles,
          scenes,
          tags: tagList,
          content: content || `# ${name}\n\n${description}`,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Unknown error");
      }

      const { id } = await res.json();
      setPublishMsg(t.publishSuccess);
      setTimeout(() => {
        router.push(`/${locale}/skill/${id}`);
      }, 1500);
    } catch {
      setPublishMsg(t.publishError);
    } finally {
      setPublishing(false);
    }
  };

  const roleEntries = Object.entries(roleLabels) as [Role, string][];
  const sceneEntries = Object.entries(sceneLabels) as [Scene, string][];

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          {t.nameLabel} <span className="text-red-400">{t.required}</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.namePlaceholder}
          className="w-full rounded-lg border border-border bg-bg-card px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          {t.descLabel} <span className="text-red-400">{t.required}</span>
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.descPlaceholder}
          className="w-full rounded-lg border border-border bg-bg-card px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {/* Roles */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          {t.rolesLabel} <span className="text-red-400">{t.required}</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {roleEntries.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleRole(value)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                roles.includes(value)
                  ? "border-accent bg-accent/20 text-accent-hover"
                  : "border-border text-text-secondary hover:border-accent/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Scenes */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          {t.scenesLabel} <span className="text-red-400">{t.required}</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {sceneEntries.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleScene(value)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                scenes.includes(value)
                  ? "border-accent bg-accent/20 text-accent-hover"
                  : "border-border text-text-secondary hover:border-accent/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Author */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          {t.authorLabel} <span className="text-red-400">{t.required}</span>
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder={t.authorPlaceholder}
          className="w-full rounded-lg border border-border bg-bg-card px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          {t.tagsLabel}
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder={t.tagsPlaceholder}
          className="w-full rounded-lg border border-border bg-bg-card px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {/* Content */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          {t.contentLabel}
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          placeholder={t.contentPlaceholder}
          className="w-full rounded-lg border border-border bg-bg-card px-4 py-2.5 font-mono text-sm text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={generateMarkdown}
          disabled={!isValid}
          className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-colors ${
            isValid
              ? "bg-accent text-white hover:bg-accent-hover"
              : "cursor-not-allowed bg-border text-text-muted"
          }`}
        >
          {t.generate}
        </button>
        {!authLoading && !user ? (
          <Link
            href={`${prefix}/login`}
            className="rounded-lg border border-accent px-6 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
          >
            {dict.auth.signIn} → {t.publish}
          </Link>
        ) : (
          <button
            onClick={publishToDatabase}
            disabled={!isValid || publishing}
            className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-colors ${
              isValid && !publishing
                ? "border border-accent text-accent hover:bg-accent/10"
                : "cursor-not-allowed border border-border text-text-muted"
            }`}
          >
            {publishing ? t.publishing : t.publish}
          </button>
        )}
      </div>
      {publishMsg && (
        <p className={`text-sm ${publishMsg === t.publishSuccess ? "text-green-500" : "text-red-400"}`}>
          {publishMsg}
        </p>
      )}

      {/* Result */}
      {generated && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-text-primary">
              {t.result}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary"
              >
                {t.copy}
              </button>
              <button
                onClick={downloadFile}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary"
              >
                {t.download}
              </button>
            </div>
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-bg-primary p-4 font-mono text-sm text-text-secondary">
            {generated}
          </pre>
        </div>
      )}
    </div>
  );
}
