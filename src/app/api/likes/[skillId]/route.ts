import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isValidVisitorId } from "@/lib/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ skillId: string }> }
) {
  const { skillId } = await params;
  const visitorId = request.nextUrl.searchParams.get("visitor_id") || "";

  // Get the skill's likes_count
  const { data: skill } = await supabase
    .from("skills")
    .select("likes_count")
    .eq("id", skillId)
    .single();

  // Check if this visitor has liked
  let liked = false;
  if (visitorId) {
    const { data: likeRow } = await supabase
      .from("skill_likes")
      .select("id")
      .eq("skill_id", skillId)
      .eq("visitor_id", visitorId)
      .maybeSingle();

    liked = !!likeRow;
  }

  return NextResponse.json({
    count: skill?.likes_count ?? 0,
    liked,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ skillId: string }> }
) {
  const { skillId } = await params;
  const body = await request.json();
  const visitorId = body.visitor_id;

  if (!visitorId || !isValidVisitorId(visitorId)) {
    return NextResponse.json({ error: "Valid visitor_id required" }, { status: 400 });
  }

  // Check existing like
  const { data: existing } = await supabase
    .from("skill_likes")
    .select("id")
    .eq("skill_id", skillId)
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (existing) {
    // Unlike: delete the row
    await supabase
      .from("skill_likes")
      .delete()
      .eq("skill_id", skillId)
      .eq("visitor_id", visitorId);
  } else {
    // Like: insert a row
    await supabase
      .from("skill_likes")
      .insert({ skill_id: skillId, visitor_id: visitorId });
  }

  // Return updated count
  const { data: skill } = await supabase
    .from("skills")
    .select("likes_count, user_id")
    .eq("id", skillId)
    .single();

  // Award/deduct points to skill author (non-blocking)
  if (skill?.user_id) {
    try {
      if (existing) {
        // Unlike: deduct points from author
        await supabase.rpc("award_points_to_user", {
          target_user_id: skill.user_id,
          p_action: "skill_unliked",
          p_points: -2,
          p_ref_id: skillId,
          p_ref_type: "like",
        });
      } else {
        // Like: award points to author
        await supabase.rpc("award_points_to_user", {
          target_user_id: skill.user_id,
          p_action: "skill_liked",
          p_points: 2,
          p_ref_id: skillId,
          p_ref_type: "like",
        });
      }
    } catch (e) {
      console.error("Points award error:", e);
    }
  }

  return NextResponse.json({
    count: skill?.likes_count ?? 0,
    liked: !existing,
  });
}
