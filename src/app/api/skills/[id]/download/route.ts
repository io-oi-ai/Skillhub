import { NextRequest, NextResponse } from "next/server";
import { getSkillById } from "@/lib/skills";
import { supabase } from "@/lib/supabase";
import { createSupabaseServer } from "@/lib/supabase-server";
import { getAuthUser } from "@/lib/auth";
import { awardPoints } from "@/lib/points";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const skill = await getSkillById(id);

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  // ── Paid skill access check ────────────────────────────────────────
  if (skill.priceType === "paid" && skill.price > 0) {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Sign in to download paid skills" },
        { status: 401 }
      );
    }

    // Author can always download their own skill
    if (skill.userId !== user.id) {
      const authSupabase = await createSupabaseServer();

      // Check if already purchased
      const { data: purchase } = await authSupabase
        .from("skill_purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("skill_id", id)
        .single();

      if (!purchase) {
        // Check subscription downloads
        const { data: profile } = await authSupabase
          .from("profiles")
          .select("plan, subscription_downloads_remaining")
          .eq("id", user.id)
          .single();

        if (
          profile?.plan === "pro" &&
          profile.subscription_downloads_remaining > 0
        ) {
          // Deduct subscription download + record as subscription purchase
          const admin = createSupabaseAdmin();
          await admin
            .from("profiles")
            .update({
              subscription_downloads_remaining:
                profile.subscription_downloads_remaining - 1,
            })
            .eq("id", user.id);

          await admin.from("skill_purchases").upsert(
            {
              user_id: user.id,
              skill_id: id,
              provider: "subscription",
              price: 0,
              source: "subscription",
            },
            { onConflict: "user_id,skill_id" }
          );
        } else {
          return NextResponse.json(
            { error: "Purchase required", price: skill.price },
            { status: 403 }
          );
        }
      }
    }
  }

  // ── Increment download_count ───────────────────────────────────────
  try {
    const { error: rpcError } = await supabase.rpc("increment_download_count", { skill_id: id });
    if (rpcError) {
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
