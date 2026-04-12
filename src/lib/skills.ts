import { supabase } from "./supabase";
import type { Skill, Role, Scene } from "./types";

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
  download_count: number;
  user_id: string | null;
  price_type: string;
  price: number;
  waffo_product_id: string | null;
  creem_product_id: string | null;
}

export type SkillSort = "latest" | "popular" | "most_downloaded";

export interface GetSkillsOptions {
  sort?: SkillSort;
  page?: number;
  pageSize?: number;
  role?: Role | null;
  scene?: Scene | null;
  q?: string | null;
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
    downloadCount: row.download_count ?? 0,
    userId: row.user_id,
    priceType: (row.price_type || "free") as Skill["priceType"],
    price: row.price ?? 0,
    waffoProductId: row.waffo_product_id,
    creemProductId: row.creem_product_id,
  };
}

export async function getAllSkills(options: GetSkillsOptions = {}): Promise<{ skills: Skill[]; total: number }> {
  const {
    sort = "latest",
    page = 1,
    pageSize = 200,
    role = null,
    scene = null,
    q = null,
  } = options;

  let query = supabase
    .from("skills")
    .select("*", { count: "exact" });

  // Filters
  if (role) query = query.contains("roles", [role]);
  if (scene) query = query.contains("scenes", [scene]);
  if (q) {
    // Sanitize search query to prevent PostgREST filter injection
    const safeQ = q.replace(/[,.*()\\]/g, "");
    if (safeQ) {
      query = query.or(`name.ilike.%${safeQ}%,description.ilike.%${safeQ}%`);
    }
  }

  // Sort: always put featured first, then sort by criteria
  query = query.order("featured", { ascending: false });

  switch (sort) {
    case "popular":
      query = query.order("likes_count", { ascending: false });
      break;
    case "most_downloaded":
      query = query.order("download_count", { ascending: false });
      break;
    case "latest":
    default:
      query = query.order("updated_at", { ascending: false });
      break;
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Failed to fetch skills:", error);
    return { skills: [], total: 0 };
  }

  return {
    skills: (data as SkillRow[]).map(rowToSkill),
    total: count ?? 0,
  };
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
