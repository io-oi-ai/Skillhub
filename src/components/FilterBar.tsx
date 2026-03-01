"use client";

import type { Role, Scene } from "@/lib/types";
import { ROLE_LABELS, SCENE_LABELS } from "@/lib/types";

interface FilterBarProps {
  selectedRole: Role | null;
  selectedScene: Scene | null;
  onRoleChange: (role: Role | null) => void;
  onSceneChange: (scene: Scene | null) => void;
}

export default function FilterBar({
  selectedRole,
  selectedScene,
  onRoleChange,
  onSceneChange,
}: FilterBarProps) {
  const roles = Object.entries(ROLE_LABELS) as [Role, string][];
  const scenes = Object.entries(SCENE_LABELS) as [Scene, string][];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-text-muted">
          Role
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
            All
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
          Scene
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
            All
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
