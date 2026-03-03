import { NextRequest, NextResponse } from "next/server";
import { getAllSkills } from "@/lib/skills";
import { supabase } from "@/lib/supabase";
import { createSupabaseServer } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";
import { awardPoints } from "@/lib/points";
import type { Role, Scene } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const role = searchParams.get("role") as Role | null;
  const scene = searchParams.get("scene") as Scene | null;
  const q = searchParams.get("q");

  let skills = await getAllSkills();

  if (role) {
    skills = skills.filter((s) => s.roles.includes(role));
  }
  if (scene) {
    skills = skills.filter((s) => s.scenes.includes(scene));
  }
  if (q) {
    const query = q.toLowerCase();
    skills = skills.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  // Return concise list without full content
  const result = skills.map(({ content, ...rest }) => rest);

  return NextResponse.json({
    count: result.length,
    skills: result,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await requireAuth();
    if (authError) return authError;

    const authSupabase = await createSupabaseServer();

    const body = await request.json();

    const { name, description, roles, scenes, tags, content } = body;

    if (!name || !description || !roles?.length || !scenes?.length) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, description, roles, scenes",
        },
        { status: 400 }
      );
    }

    // Get author name from profiles table, fallback to body.author
    let author = body.author;
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
