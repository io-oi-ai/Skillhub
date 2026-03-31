import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { isProProfile } from "@/lib/billing";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { user, error } = await requireAuth();
  if (error || !user) {
    return NextResponse.json({
      subscribed: false,
      plan: "free",
      status: "inactive",
    });
  }

  const { data: profile } = await createSupabaseAdmin()
    .from("profiles")
    .select("is_pro, subscription_plan, subscription_status, subscription_order_id, subscription_current_period_ends_at")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    subscribed: isProProfile(profile),
    plan: profile?.subscription_plan ?? "free",
    status: profile?.subscription_status ?? "inactive",
    orderId: profile?.subscription_order_id ?? null,
    currentPeriodEndsAt: profile?.subscription_current_period_ends_at ?? null,
  });
}
