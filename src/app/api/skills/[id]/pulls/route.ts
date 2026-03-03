import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createSupabaseServer } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/auth";
import { awardPoints } from "@/lib/points";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");

  let query = supabase
    .from("skill_pull_requests")
    .select(
      `
      id,
      skill_id,
      author_id,
      status,
      title,
      message,
      name,
      description,
      roles,
      scenes,
      tags,
      reviewed_by,
      reviewed_at,
      review_comment,
      created_at,
      updated_at,
      profiles:author_id (
        username,
        display_name,
        avatar_url
      )
    `
    )
    .eq("skill_id", id)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data: pulls, error } = await query;

  if (error) {
    if (error.code === "PGRST204" || error.message?.includes("not find")) {
      return NextResponse.json({ pulls: [] });
    }
    console.error("Failed to fetch pull requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch pull requests" },
      { status: 500 }
    );
  }

  return NextResponse.json({ pulls: pulls || [] });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { user, error: authError } = await requireAuth();
    if (authError) return authError;

    const authSupabase = await createSupabaseServer();

    // Fetch the skill to check ownership
    const { data: skill, error: fetchError } = await authSupabase
      .from("skills")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !skill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    // Verify user is NOT the skill creator
    if (skill.user_id === user!.id) {
      return NextResponse.json(
        {
          error:
            "Skill creators should edit directly instead of creating pull requests",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, message, name, description, content, roles, scenes, tags } =
      body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: title, content" },
        { status: 400 }
      );
    }

    const { data: pr, error: insertError } = await authSupabase
      .from("skill_pull_requests")
      .insert({
        skill_id: id,
        author_id: user!.id,
        status: "open",
        title,
        message: message || null,
        name: name || null,
        description: description || null,
        content,
        roles: roles || null,
        scenes: scenes || null,
        tags: tags || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to create pull request:", insertError);
      return NextResponse.json(
        { error: "Failed to create pull request" },
        { status: 500 }
      );
    }

    // Award points (non-blocking)
    let pointsAwarded = 0;
    try {
      pointsAwarded = await awardPoints(authSupabase, user!.id, "pr_submit", String(pr.id), "pull_request");
    } catch (e) {
      console.error("Points award error:", e);
    }

    return NextResponse.json({ ...pr, pointsAwarded }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
