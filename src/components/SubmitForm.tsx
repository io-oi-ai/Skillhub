"use client";

import { useState } from "react";
import type { Role, Scene } from "@/lib/types";
import { ROLE_LABELS, SCENE_LABELS } from "@/lib/types";

export default function SubmitForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [generated, setGenerated] = useState("");

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

  const roleEntries = Object.entries(ROLE_LABELS) as [Role, string][];
  const sceneEntries = Object.entries(SCENE_LABELS) as [Scene, string][];

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          Skill 名称 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：周报自动生成"
          className="w-full rounded-lg border border-border bg-bg-card px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          简短描述 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="用一句话描述这个 Skill 的功能"
          className="w-full rounded-lg border border-border bg-bg-card px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {/* Roles */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          适用职业 / 角色 <span className="text-red-400">*</span>
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
          技能场景 <span className="text-red-400">*</span>
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
          作者 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="你的名字"
          className="w-full rounded-lg border border-border bg-bg-card px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          标签（用逗号分隔）
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="例如：周报、自动化、效率"
          className="w-full rounded-lg border border-border bg-bg-card px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {/* Content */}
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">
          详细内容（Markdown 格式）
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          placeholder={"# Skill 名称\n\n## 使用场景\n\n描述这个 Skill 适用的场景...\n\n## 使用方法\n\n1. 第一步\n2. 第二步"}
          className="w-full rounded-lg border border-border bg-bg-card px-4 py-2.5 font-mono text-sm text-text-primary placeholder-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {/* Generate */}
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
          生成 Markdown 文件
        </button>
      </div>

      {/* Result */}
      {generated && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-text-primary">
              生成结果
            </h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary"
              >
                复制
              </button>
              <button
                onClick={downloadFile}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-accent/50 hover:text-text-primary"
              >
                下载 .md 文件
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
