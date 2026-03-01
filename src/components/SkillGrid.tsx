"use client";

import { useState, useMemo } from "react";
import type { Skill, Role, Scene } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import SkillCard from "./SkillCard";
import MetaSkillCard from "./MetaSkillCard";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";

const META_SKILL_ID = "skillhub-agent";

interface SkillGridProps {
  skills: Skill[];
  locale: Locale;
  dict: Dictionary;
}

export default function SkillGrid({ skills, locale, dict }: SkillGridProps) {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);

  const metaSkill = skills.find((s) => s.id === META_SKILL_ID);
  const regularSkillCount = skills.filter((s) => s.id !== META_SKILL_ID).length;

  const filtered = useMemo(() => {
    return skills
      .filter((skill) => skill.id !== META_SKILL_ID)
      .filter((skill) => {
        if (selectedRole && !skill.roles.includes(selectedRole)) {
          return false;
        }
        if (selectedScene && !skill.scenes.includes(selectedScene)) {
          return false;
        }
        if (search) {
          const q = search.toLowerCase();
          return (
            skill.name.toLowerCase().includes(q) ||
            skill.description.toLowerCase().includes(q) ||
            skill.tags.some((tag) => tag.toLowerCase().includes(q))
          );
        }
        return true;
      });
  }, [skills, search, selectedRole, selectedScene]);

  const roleLabels = dict.roles as Record<string, string>;
  const sceneLabels = dict.scenes as Record<string, string>;

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={dict.search.placeholder}
        />
      </div>

      <FilterBar
        selectedRole={selectedRole}
        selectedScene={selectedScene}
        onRoleChange={setSelectedRole}
        onSceneChange={setSelectedScene}
        roleLabels={roleLabels}
        sceneLabels={sceneLabels}
        filterLabels={dict.filter}
      />

      {/* Meta Skill — always visible at top when no search/filter active */}
      {metaSkill && !search && !selectedRole && !selectedScene && (
        <MetaSkillCard
          skill={metaSkill}
          locale={locale}
          dict={dict}
          skillCount={regularSkillCount}
        />
      )}

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-text-muted">{dict.skillGrid.noResults}</p>
          <p className="mt-2 text-sm text-text-muted">
            {dict.skillGrid.noResultsHint}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              locale={locale}
              roleLabels={roleLabels}
              sceneLabels={sceneLabels}
              featuredLabel={dict.skillCard.featured}
              downloadLabel={dict.skillCard.download}
            />
          ))}
        </div>
      )}
    </div>
  );
}
