import { verifyWebhook } from "@waffo/pancake-ts";
import { getPlanFromProductId, type BillingPlan } from "@/lib/billing";
import { createSupabaseAdmin, type Json } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  // Critical: read as raw text, not JSON — per skill guidance
  const body = await request.text();
  const sig = request.headers.get("x-waffo-signature");

  try {
    const parsedBody = JSON.parse(body) as { data?: Record<string, unknown> };
    const event = verifyWebhook(body, sig);
    const supabase = createSupabaseAdmin();
    const orderId =
      typeof event.data.orderId === "string" ? event.data.orderId : "";
    const buyerEmail =
      typeof event.data.buyerEmail === "string" ? event.data.buyerEmail : "";
    const productName =
      typeof event.data.productName === "string" ? event.data.productName : null;
    const currency =
      typeof event.data.currency === "string" ? event.data.currency : null;
    const amount =
      typeof event.data.amount === "number" ? event.data.amount : null;
    const taxAmount =
      typeof event.data.taxAmount === "number" ? event.data.taxAmount : null;
    const productId =
      typeof parsedBody.data?.productId === "string" ? parsedBody.data.productId : null;
    const plan = productId ? getPlanFromProductId(productId) : null;
    const metadata =
      parsedBody.data?.metadata &&
      typeof parsedBody.data.metadata === "object" &&
      !Array.isArray(parsedBody.data.metadata)
        ? (parsedBody.data.metadata as Record<string, unknown>)
        : {};
    const orderMetadata = (parsedBody.data ?? {}) as Json;
    const metadataUserId =
      typeof metadata.userId === "string" ? metadata.userId : null;
    const metadataPlan =
      typeof metadata.plan === "string" ? (metadata.plan as BillingPlan) : null;
    const metadataWithTrial =
      metadata.withTrial === true || metadata.withTrial === "true";
    const currentPeriodEndsAt =
      typeof parsedBody.data?.currentPeriodEndsAt === "string"
        ? parsedBody.data.currentPeriodEndsAt
        : null;
    const profileQuery = supabase
      .from("profiles")
      .select("id")
      .limit(1);
    const { data: profile } = metadataUserId
      ? await profileQuery.eq("id", metadataUserId).maybeSingle()
      : await profileQuery.eq("billing_email", buyerEmail).maybeSingle();

    const normalizedStatus = (() => {
      switch (event.eventType) {
        case "subscription.activated":
        case "subscription.payment_succeeded":
        case "subscription.updated":
        case "subscription.uncanceled":
          return "active";
        case "subscription.canceling":
          return "canceling";
        case "subscription.canceled":
          return "canceled";
        case "subscription.past_due":
          return "past_due";
        case "order.completed":
          return "completed";
        default:
          return "received";
      }
    })();

    const productType = event.eventType.startsWith("subscription.") ? "subscription" : "onetime";

    await supabase.from("billing_orders").upsert(
      [{
        order_id: orderId,
        user_id: profile?.id ?? null,
        buyer_email: buyerEmail,
        product_id: productId,
        product_type: productType,
        product_name: productName,
        currency,
        amount,
        tax_amount: taxAmount,
        status: normalizedStatus,
        environment: event.mode,
        event_id: event.eventId,
        metadata: orderMetadata,
        paid_at: event.timestamp,
        updated_at: new Date().toISOString(),
      }],
      { onConflict: "order_id" }
    );

    console.log(`[Pancake Webhook] ${event.eventType}`, {
      orderId: event.data.orderId,
      buyerEmail,
      amount,
      mode: event.mode,
      userId: metadataUserId,
      plan: metadataPlan ?? plan,
      withTrial: metadataWithTrial,
    });

    switch (event.eventType) {
      case "order.completed":
        break;
      case "subscription.activated":
      case "subscription.payment_succeeded":
      case "subscription.updated":
      case "subscription.uncanceled":
        if (profile?.id) {
          await supabase
            .from("profiles")
            .update({
              is_pro: true,
              subscription_plan: metadataPlan ?? plan ?? "pro_monthly",
              subscription_status: "active",
              subscription_order_id: orderId,
              subscription_current_period_ends_at: currentPeriodEndsAt,
              pro_since: event.timestamp,
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);
        }
        break;
      case "subscription.canceling":
        if (profile?.id) {
          await supabase
            .from("profiles")
            .update({
              is_pro: true,
              subscription_status: "canceling",
              subscription_order_id: orderId,
              subscription_current_period_ends_at: currentPeriodEndsAt,
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);
        }
        break;
      case "subscription.canceled":
        if (profile?.id) {
          await supabase
            .from("profiles")
            .update({
              is_pro: false,
              subscription_plan: "free",
              subscription_status: "canceled",
              subscription_order_id: orderId,
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);
        }
        break;
      case "subscription.past_due":
        if (profile?.id) {
          await supabase
            .from("profiles")
            .update({
              is_pro: false,
              subscription_status: "past_due",
              subscription_order_id: orderId,
              updated_at: new Date().toISOString(),
            })
            .eq("id", profile.id);
        }
        break;
    }

    return new Response("OK");
  } catch (err) {
    console.error("[Pancake Webhook] Verification failed:", err);
    return new Response("Invalid signature", { status: 401 });
  }
}
