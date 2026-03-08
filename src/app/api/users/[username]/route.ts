import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, points, bio, website, created_at")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Fetch user's skills
  const { data: skills } = await supabase
    .from("skills")
    .select("id, name, description, author, roles, scenes, version, updated_at, tags, featured, source, likes_count, download_count, user_id")
    .eq("user_id", profile.id)
    .order("updated_at", { ascending: false });

  // Count PRs submitted
  const { count: prCount } = await supabase
    .from("skill_pull_requests")
    .select("id", { count: "exact", head: true })
    .eq("author_id", profile.id);

  return NextResponse.json({
    profile: {
      id: profile.id,
      username: profile.username,
      displayName: profile.display_name,
      avatarUrl: profile.avatar_url,
      points: profile.points,
      bio: profile.bio ?? null,
      website: profile.website ?? null,
      createdAt: profile.created_at,
    },
    skills: skills ?? [],
    prCount: prCount ?? 0,
  });
}
