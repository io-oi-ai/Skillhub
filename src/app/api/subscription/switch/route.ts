import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getPlanProductId, type BillingPlan } from "@/lib/billing";
import { getPancakeClient } from "@/lib/pancake";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { newPlan, locale, successPath, testMode } = body as {
    newPlan?: string;
    locale?: string;
    successPath?: string;
    testMode?: boolean;
  };

  if (!newPlan || (newPlan !== "pro_monthly" && newPlan !== "pro_yearly")) {
    return NextResponse.json(
      { error: "Invalid plan" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdmin();
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan, subscription_order_id, billing_email")
    .eq("id", user.id)
    .single();

  if (!profile?.subscription_order_id || profile.subscription_plan === newPlan) {
    return NextResponse.json(
      { error: "Invalid subscription state for switching" },
      { status: 400 }
    );
  }

  try {
    const productId = getPlanProductId(newPlan as Exclude<BillingPlan, "free">);
    if (!productId) {
      throw new Error(`No product ID found for plan ${newPlan}`);
    }

    const client = getPancakeClient();
    // testMode flag is stored in metadata for webhook processing
    // TODO: Implement test mode parameter in Pancake checkout API call when SDK supports it
    const origin = request.nextUrl.origin;
    const localePrefix = locale && locale !== "en" ? `/${locale}` : "";
    const redirectTo = successPath || `${localePrefix}/pricing?plan=${newPlan}&checkout=success`;

    const session = await client.checkout.anonymous.create({
      productId,
      currency: "USD",
      successUrl: `${origin}/api/checkout/success?redirect_to=${encodeURIComponent(redirectTo)}`,
      metadata: {
        plan: newPlan,
        userId: user.id,
        switchFrom: profile.subscription_plan,
        oldOrderId: profile.subscription_order_id,
        testMode: testMode ? "true" : "false",
      },
    });

    console.log("[subscription/switch] Created plan switch checkout:", {
      userId: user.id,
      fromPlan: profile.subscription_plan,
      toPlan: newPlan,
      testMode,
      checkoutUrl: session.checkoutUrl,
    });

    return NextResponse.json({
      checkoutUrl: session.checkoutUrl,
      sessionId: session.sessionId,
      message: `You will be charged for the ${newPlan === "pro_yearly" ? "annual" : "monthly"} plan`,
    });
  } catch (err) {
    console.error("[subscription/switch] Failed to create plan switch checkout:", err);
    const message = err instanceof Error ? err.message : "Failed to create checkout";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
