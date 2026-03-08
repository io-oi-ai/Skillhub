import { NextRequest, NextResponse } from "next/server";
import { getAllSkills, type SkillSort } from "@/lib/skills";
import { supabase } from "@/lib/supabase";
import { createSupabaseServer } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";
import { awardPoints } from "@/lib/points";
import { validateSkillInput } from "@/lib/validation";
import type { Role, Scene } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const role = searchParams.get("role") as Role | null;
  const scene = searchParams.get("scene") as Scene | null;
  const q = searchParams.get("q");
  const sort = (searchParams.get("sort") || "latest") as SkillSort;
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 200)));

  const { skills, total } = await getAllSkills({ sort, page, pageSize, role, scene, q });

  // Return concise list without full content
  const result = skills.map(({ content, ...rest }) => rest);

  return NextResponse.json({
    count: total,
    page,
    pageSize,
    skills: result,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAuth();
    if (authError) return authError;

    const authSupabase = await createSupabaseServer();

    const body = await request.json();

    const validation = validateSkillInput(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name, description, roles, scenes, tags, content } = validation.sanitized!;

    // Get author name from profiles table, fallback to body.author
    let author = validation.sanitized!.author || "";
    if (user) {
      const { data: profile } = await authSupabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", user.id)
        .single();

      if (profile) {
        author = profile.display_name || profile.username || author;
      }
    }

    if (!author) {
      return NextResponse.json(
        { error: "Author name is required" },
        { status: 400 }
      );
    }

    // Generate id from name: lowercase, replace non-alphanumeric/chinese with hyphens
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!id) {
      return NextResponse.json(
        { error: "Could not generate a valid id from the name" },
        { status: 400 }
      );
    }

    const row = {
      id,
      name,
      description,
      author,
      roles,
      scenes,
      version: "1.0.0",
      updated_at: new Date().toISOString().split("T")[0],
      tags: tags || [],
      featured: false,
      source: null,
      content: content || `# ${name}\n\n${description}`,
      likes_count: 0,
      user_id: user!.id,
    };

    const { data, error } = await authSupabase
      .from("skills")
      .upsert(row, { onConflict: "id" })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to create skill:", error);
      return NextResponse.json(
        { error: "Failed to create skill" },
        { status: 500 }
      );
    }

    // Award points (non-blocking)
    let pointsAwarded = 0;
    try {
      pointsAwarded += await awardPoints(authSupabase, user!.id, "skill_create", data.id, "skill");

      // Check if this is the user's first skill
      const { count } = await authSupabase
        .from("skills")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      if (count === 1) {
        pointsAwarded += await awardPoints(authSupabase, user!.id, "skill_create_first", data.id, "skill");
      }
    } catch (e) {
      console.error("Points award error:", e);
    }

    return NextResponse.json({ id: data.id, pointsAwarded }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
