import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Skill } from "./types";

const SKILLS_DIR = path.join(process.cwd(), "content/skills");

export function getAllSkills(): Skill[] {
  const files = fs
    .readdirSync(SKILLS_DIR)
    .filter((f) => f.endsWith(".md"));

  const skills: Skill[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(SKILLS_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      id: file.replace(/\.md$/, ""),
      name: data.name,
      description: data.description,
      author: data.author,
      roles: data.roles || [],
      scenes: data.scenes || [],
      version: data.version || "1.0.0",
      updatedAt: data.updatedAt || "",
      tags: data.tags || [],
      featured: data.featured || false,
      source: data.source,
      content,
    };
  });

  return skills.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function getSkillById(id: string): Skill | null {
  const filePath = path.join(SKILLS_DIR, `${id}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    id,
    name: data.name,
    description: data.description,
    author: data.author,
    roles: data.roles || [],
    scenes: data.scenes || [],
    version: data.version || "1.0.0",
    updatedAt: data.updatedAt || "",
    tags: data.tags || [],
    featured: data.featured || false,
    source: data.source,
    content,
  };
}
