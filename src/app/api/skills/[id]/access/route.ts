import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createSupabaseServer();

  // Fetch skill info
  const { data: skill } = await supabase
    .from("skills")
    .select("id, price_type, price, user_id")
    .eq("id", id)
    .single();

  if (!skill) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  // Free skills are accessible to everyone
  if (skill.price_type === "free") {
    return NextResponse.json({ hasAccess: true, reason: "free_skill" });
  }

  // Paid skill — need auth
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ hasAccess: false, reason: "needs_purchase" });
  }

  // Author always has access to their own skill
  if (skill.user_id === user.id) {
    return NextResponse.json({ hasAccess: true, reason: "author" });
  }

  // Check if user has purchased this skill
  const { data: purchase } = await supabase
    .from("skill_purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("skill_id", id)
    .single();

  if (purchase) {
    return NextResponse.json({ hasAccess: true, reason: "purchased" });
  }

  // Check if user has an active subscription with remaining downloads
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_downloads_remaining")
    .eq("id", user.id)
    .single();

  if (
    profile?.plan === "pro" &&
    profile.subscription_downloads_remaining > 0
  ) {
    return NextResponse.json({
      hasAccess: true,
      reason: "subscription",
      remainingDownloads: profile.subscription_downloads_remaining,
    });
  }

  return NextResponse.json({
    hasAccess: false,
    reason: "needs_purchase",
    price: skill.price,
  });
}
