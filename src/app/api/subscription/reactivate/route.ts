import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { issuePancakeSessionToken, getPancakeBuyerSession } from "@/lib/pancake";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST() {
  const { user, error } = await requireAuth();
  if (error || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabase = createSupabaseAdmin();
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_order_id, subscription_status")
    .eq("id", user.id)
    .single();

  if (!profile?.subscription_order_id) {
    return NextResponse.json(
      { error: "No subscription found" },
      { status: 400 }
    );
  }

  if (profile.subscription_status !== "canceling") {
    return NextResponse.json(
      { error: "Subscription is not in canceling status" },
      { status: 400 }
    );
  }

  try {
    if (!user.email) {
      throw new Error("User email not found");
    }

    const { token } = await issuePancakeSessionToken(user.email);
    const buyer = getPancakeBuyerSession(token);

    const { orderId, status } = await buyer.reactivateSubscription({
      orderId: profile.subscription_order_id,
    });

    console.log("[subscription/reactivate] Reactivated subscription:", {
      userId: user.id,
      orderId,
      status,
    });

    return NextResponse.json({
      orderId,
      status,
      message: "Your subscription has been restored",
    });
  } catch (err) {
    console.error("[subscription/reactivate] Failed to reactivate subscription:", err);
    const message = err instanceof Error ? err.message : "Failed to reactivate subscription";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
