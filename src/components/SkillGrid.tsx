"use client";

import { useState, useMemo } from "react";
import type { Skill, Role, Scene } from "@/lib/types";
import SkillCard from "./SkillCard";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";

interface SkillGridProps {
  skills: Skill[];
}

export default function SkillGrid({ skills }: SkillGridProps) {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);

  const filtered = useMemo(() => {
    return skills.filter((skill) => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <FilterBar
        selectedRole={selectedRole}
        selectedScene={selectedScene}
        onRoleChange={setSelectedRole}
        onSceneChange={setSelectedScene}
      />

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-text-muted">没有找到匹配的 Skill</p>
          <p className="mt-2 text-sm text-text-muted">
            尝试调整搜索关键词或筛选条件
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
}
