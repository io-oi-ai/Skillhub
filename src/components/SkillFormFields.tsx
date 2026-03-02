"use client";

import type { Role, Scene } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries/en";

interface SkillFormFieldsProps {
  dict: Dictionary;
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  roles: Role[];
  setRoles: (v: Role[]) => void;
  scenes: Scene[];
  setScenes: (v: Scene[]) => void;
  tags: string;
  setTags: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  hideAuthor?: boolean;
  author?: string;
  setAuthor?: (v: string) => void;
}

export default function SkillFormFields({
  dict,
  name,
  setName,
  description,
  setDescription,
  roles,
  setRoles,
  scenes,
  setScenes,
  tags,
  setTags,
  content,
  setContent,
  hideAuthor,
  author,
  setAuthor,
}: SkillFormFieldsProps) {
  const t = dict.submitForm;
  const roleLabels = dict.roles as Record<string, string>;
  const sceneLabels = dict.scenes as Record<string, string>;

  const toggleRole = (r: Role) => {
    setRoles(
      roles.includes(r) ? roles.filter((x) => x !== r) : [...roles, r]
    );
  };

  const toggleScene = (s: Scene) => {
    setScenes(
      scenes.includes(s) ? scenes.filter((x) => x !== s) : [...scenes, s]
    );
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

      {/* Author (optional, for create form) */}
      {!hideAuthor && setAuthor && (
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary">
            {t.authorLabel} <span className="text-red-400">{t.required}</span>
          </label>
          <input
            type="text"
            value={author || ""}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={t.authorPlaceholder}
            className="w-full rounded-lg border border-border bg-bg-card px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
          />
        </div>
      )}

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
    </div>
  );
}
