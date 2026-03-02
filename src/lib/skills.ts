import { supabase } from "./supabase";
import type { Skill } from "./types";

interface SkillRow {
  id: string;
  name: string;
  description: string;
  author: string;
  roles: string[];
  scenes: string[];
  version: string;
  updated_at: string;
  tags: string[];
  featured: boolean;
  source: string | null;
  content: string;
  likes_count: number;
  user_id: string | null;
}

function rowToSkill(row: SkillRow): Skill {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    author: row.author,
    roles: row.roles as Skill["roles"],
    scenes: row.scenes as Skill["scenes"],
    version: row.version,
    updatedAt: row.updated_at,
    tags: row.tags,
    featured: row.featured,
    source: row.source as Skill["source"],
    content: row.content,
    likesCount: row.likes_count,
    userId: row.user_id,
  };
}

export async function getAllSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch skills:", error);
    return [];
  }

  return (data as SkillRow[]).map(rowToSkill);
}

export async function getSkillById(id: string): Promise<Skill | null> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return rowToSkill(data as SkillRow);
}
