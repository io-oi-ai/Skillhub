import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  getPlanProductId,
  getSingleSkillProductId,
  type BillingPlan,
} from "@/lib/billing";
import { getPancakeClient } from "@/lib/pancake";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, productType, buyerEmail, skillId, plan, locale, successPath } = body;

  let resolvedProductId = productId as string | undefined;
  let resolvedProductType = productType as string | undefined;
  let resolvedBuyerEmail = buyerEmail as string | undefined;
  let userId: string | undefined;

  if (plan === "pro_monthly" || plan === "pro_yearly") {
    const { user, error } = await requireAuth();
    if (error || !user) return error!;

    resolvedProductId = getPlanProductId(plan as Exclude<BillingPlan, "free">);
    resolvedProductType = "subscription";
    resolvedBuyerEmail = user.email ?? resolvedBuyerEmail;
    userId = user.id;

    if (!resolvedBuyerEmail) {
      return NextResponse.json({ error: "Missing buyer email" }, { status: 400 });
    }

    await createSupabaseAdmin()
      .from("profiles")
      .update({
        billing_email: resolvedBuyerEmail,
      })
      .eq("id", user.id);
  } else if (plan === "single_skill") {
    resolvedProductId = getSingleSkillProductId();
    resolvedProductType = "onetime";

    const { user } = await requireAuth();
    if (user?.email) {
      resolvedBuyerEmail = user.email;
      userId = user.id;
    }
  }

  if (!resolvedProductId || !resolvedProductType) {
    return NextResponse.json({ error: "Missing productId or productType" }, { status: 400 });
  }

  const client = getPancakeClient();
  const origin = request.nextUrl.origin;
  const localePrefix = locale && locale !== "en" ? `/${locale}` : "";
  const redirectTo =
    typeof successPath === "string" && successPath.startsWith("/")
      ? successPath
      : `${localePrefix}${skillId ? `/skill/${skillId}?paid=1` : "/pricing?checkout=success"}`;

  const session = await client.checkout.createSession({
    storeId: process.env.WAFFO_STORE_ID,
    productId: resolvedProductId,
    productType: resolvedProductType,
    currency: "USD",
    buyerEmail: resolvedBuyerEmail || undefined,
    successUrl: `${origin}/api/checkout/success?redirect_to=${encodeURIComponent(redirectTo)}`,
    metadata: {
      ...(skillId ? { skillId } : {}),
      ...(plan ? { plan } : {}),
      ...(userId ? { userId } : {}),
    },
  });

  return NextResponse.json({
    checkoutUrl: session.checkoutUrl,
    sessionId: session.sessionId,
  });
}
