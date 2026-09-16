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
      { error: "No active subscription found" },
      { status: 400 }
    );
  }

  if (profile.subscription_status === "canceled") {
    return NextResponse.json(
      { error: "Subscription is already canceled" },
      { status: 400 }
    );
  }

  try {
    if (!user.email) {
      throw new Error("User email not found");
    }

    const { token } = await issuePancakeSessionToken(user.email);
    const buyer = getPancakeBuyerSession(token);

    const { orderId, status } = await buyer.cancelSubscription({
      orderId: profile.subscription_order_id,
    });

    console.log("[subscription/cancel] Canceled subscription:", {
      userId: user.id,
      orderId,
      newStatus: status,
    });

    return NextResponse.json({
      orderId,
      status,
      message: status === "canceling"
        ? "Your subscription will be canceled at the end of the current billing period"
        : "Your subscription has been canceled",
    });
  } catch (err) {
    console.error("[subscription/cancel] Failed to cancel subscription:", err);
    const message = err instanceof Error ? err.message : "Failed to cancel subscription";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
