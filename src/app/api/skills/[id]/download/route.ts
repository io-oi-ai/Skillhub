import { NextRequest, NextResponse } from "next/server";
import { getSkillById } from "@/lib/skills";
import { supabase } from "@/lib/supabase";
import { createSupabaseServer } from "@/lib/supabase-server";
import { awardPoints } from "@/lib/points";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const skill = await getSkillById(id);

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  // Increment download_count
  try {
    const { error: rpcError } = await supabase.rpc("increment_download_count", { skill_id: id });
    if (rpcError) {
      // Fallback: direct update if RPC not available
      await supabase
        .from("skills")
        .update({ download_count: (skill.downloadCount ?? 0) + 1 })
        .eq("id", id);
    }
  } catch {
    // ignore download count errors
  }

  // Award points to skill creator (not the downloader)
  if (skill.userId) {
    const authSupabase = await createSupabaseServer();
    const downloadPoints = 5 + (skill.likesCount || 0);
    await awardPoints(
      authSupabase,
      skill.userId,
      "skill_downloaded",
      id,
      "skill",
      downloadPoints
    );
  }

  return NextResponse.json({ ok: true });
}
