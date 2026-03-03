import { NextRequest, NextResponse } from "next/server";
import { getSkillById } from "@/lib/skills";
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

  // Award points to skill creator (not the downloader)
  if (skill.userId) {
    const supabase = await createSupabaseServer();
    const downloadPoints = 5 + (skill.likesCount || 0);
    await awardPoints(
      supabase,
      skill.userId,
      "skill_downloaded",
      id,
      "skill",
      downloadPoints
    );
  }

  return NextResponse.json({ ok: true });
}
