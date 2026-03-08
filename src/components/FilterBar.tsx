"use client";

import type { Role, Scene } from "@/lib/types";

export type SortOption = "latest" | "popular" | "most_downloaded";

interface FilterBarProps {
  selectedRole: Role | null;
  selectedScene: Scene | null;
  onRoleChange: (role: Role | null) => void;
  onSceneChange: (scene: Scene | null) => void;
  roleLabels: Record<string, string>;
  sceneLabels: Record<string, string>;
  filterLabels: { roleLabel: string; sceneLabel: string; all: string };
  sortOption?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  sortLabels?: { label: string; latest: string; popular: string; mostDownloaded: string };
  selectedCollection?: string | null;
  onCollectionChange?: (collection: string | null) => void;
  collectionLabels?: Record<string, string>;
}

export default function FilterBar({
  selectedRole,
  selectedScene,
  onRoleChange,
  onSceneChange,
  roleLabels,
  sceneLabels,
  filterLabels,
  sortOption = "latest",
  onSortChange,
  sortLabels,
  selectedCollection,
  onCollectionChange,
  collectionLabels,
}: FilterBarProps) {
  const roles = Object.entries(roleLabels) as [Role, string][];
  const scenes = Object.entries(sceneLabels) as [Scene, string][];
  const collections = collectionLabels
    ? Object.entries(collectionLabels).filter(([k]) => k !== "label" && k !== "all")
    : [];

  return (
    <div className="space-y-4">
      {/* Sort */}
      {onSortChange && sortLabels && (
        <div className="flex items-center gap-2">
          <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-text-muted">
            {sortLabels.label}
          </h3>
          <div className="flex gap-2">
            {(
              [
                ["latest", sortLabels.latest],
                ["popular", sortLabels.popular],
                ["most_downloaded", sortLabels.mostDownloaded],
              ] as [SortOption, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => onSortChange(value)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  sortOption === value
                    ? "border-accent bg-accent text-white"
                    : "border-border text-text-secondary hover:border-text-muted hover:text-text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collection */}
      {onCollectionChange && collectionLabels && collections.length > 0 && (
        <div>
          <h3 className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-text-muted">
            {collectionLabels.label}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCollectionChange(null)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                selectedCollection === null
                  ? "border-accent bg-accent text-white"
                  : "border-border text-text-secondary hover:border-text-muted hover:text-text-primary"
              }`}
            >
              {collectionLabels.all}
            </button>
            {collections.map(([value, label]) => (
              <button
                key={value}
                onClick={() =>
                  onCollectionChange(selectedCollection === value ? null : value)
                }
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  selectedCollection === value
                    ? "border-accent bg-accent text-white"
                    : "border-border text-text-secondary hover:border-text-muted hover:text-text-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

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
