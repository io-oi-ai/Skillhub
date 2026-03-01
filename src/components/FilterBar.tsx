"use client";

import type { Role, Scene } from "@/lib/types";

interface FilterBarProps {
  selectedRole: Role | null;
  selectedScene: Scene | null;
  onRoleChange: (role: Role | null) => void;
  onSceneChange: (scene: Scene | null) => void;
  roleLabels: Record<string, string>;
  sceneLabels: Record<string, string>;
  filterLabels: { roleLabel: string; sceneLabel: string; all: string };
}

export default function FilterBar({
  selectedRole,
  selectedScene,
  onRoleChange,
  onSceneChange,
  roleLabels,
  sceneLabels,
  filterLabels,
}: FilterBarProps) {
  const roles = Object.entries(roleLabels) as [Role, string][];
  const scenes = Object.entries(sceneLabels) as [Scene, string][];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-text-muted">
          {filterLabels.roleLabel}
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onRoleChange(null)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              selectedRole === null
                ? "border-accent bg-accent text-white"
                : "border-border text-text-secondary hover:border-text-muted hover:text-text-primary"
            }`}
          >
            {filterLabels.all}
          </button>
          {roles.map(([value, label]) => (
            <button
              key={value}
              onClick={() =>
                onRoleChange(selectedRole === value ? null : value)
              }
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                selectedRole === value
                  ? "border-accent bg-accent text-white"
                  : "border-border text-text-secondary hover:border-text-muted hover:text-text-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-text-muted">
          {filterLabels.sceneLabel}
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSceneChange(null)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              selectedScene === null
                ? "border-accent bg-accent text-white"
                : "border-border text-text-secondary hover:border-text-muted hover:text-text-primary"
            }`}
          >
            {filterLabels.all}
          </button>
          {scenes.map(([value, label]) => (
            <button
              key={value}
              onClick={() =>
                onSceneChange(selectedScene === value ? null : value)
              }
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                selectedScene === value
                  ? "border-accent bg-accent text-white"
                  : "border-border text-text-secondary hover:border-text-muted hover:text-text-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
