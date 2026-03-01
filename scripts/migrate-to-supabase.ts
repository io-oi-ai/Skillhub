/**
 * 一次性迁移脚本：将 content/skills/*.md 导入 Supabase skills 表
 *
 * 运行方式：npx tsx scripts/migrate-to-supabase.ts
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SKILLS_DIR = path.join(process.cwd(), "content/skills");

async function main() {
  const files = fs
    .readdirSync(SKILLS_DIR)
    .filter((f) => f.endsWith(".md"));

  console.log(`Found ${files.length} skill files`);

  const rows = files.map((file) => {
    const raw = fs.readFileSync(path.join(SKILLS_DIR, file), "utf-8");
    const { data, content } = matter(raw);

    return {
      id: file.replace(/\.md$/, ""),
      name: data.name as string,
      description: data.description as string,
      author: data.author as string,
      roles: (data.roles || []) as string[],
      scenes: (data.scenes || []) as string[],
      version: (data.version || "1.0.0") as string,
      updated_at: (data.updatedAt || new Date().toISOString().slice(0, 10)) as string,
      tags: (data.tags || []) as string[],
      featured: (data.featured || false) as boolean,
      source: (data.source || null) as string | null,
      content: content.trim(),
      likes_count: 0,
    };
  });

  const { data, error } = await supabase
    .from("skills")
    .upsert(rows, { onConflict: "id" })
    .select("id");

  if (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }

  console.log(`Successfully migrated ${data.length} skills to Supabase`);
}

main();
