import { verifyWebhook } from "@waffo/pancake-ts";
import { getPlanFromProductId } from "@/lib/billing";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  // Critical: read as raw text, not JSON — per skill guidance
  const body = await request.text();
  const sig = request.headers.get("x-waffo-signature");

  try {
    const parsedBody = JSON.parse(body) as { data?: Record<string, unknown> };
    const event = verifyWebhook(body, sig);
    const supabase = createSupabaseAdmin();
    const productId =
      typeof parsedBody.data?.productId === "string" ? parsedBody.data.productId : null;
    const plan = productId ? getPlanFromProductId(productId) : null;
    const currentPeriodEndsAt =
      typeof parsedBody.data?.currentPeriodEndsAt === "string"
        ? parsedBody.data.currentPeriodEndsAt
        : null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("billing_email", event.data.buyerEmail)
      .maybeSingle();

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
      {
        order_id: event.data.orderId,
        user_id: profile?.id ?? null,
        buyer_email: event.data.buyerEmail,
        product_id: productId,
        product_type: productType,
        product_name: event.data.productName,
        currency: event.data.currency,
        amount: event.data.amount,
        tax_amount: event.data.taxAmount,
        status: normalizedStatus,
        environment: event.mode,
        event_id: event.eventId,
        metadata: parsedBody.data ?? {},
        paid_at: event.timestamp,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "order_id" }
    );

    console.log(`[Pancake Webhook] ${event.eventType}`, {
      orderId: event.data.orderId,
      buyerEmail: event.data.buyerEmail,
      amount: event.data.amount,
      mode: event.mode,
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
              subscription_plan: plan ?? "pro_monthly",
              subscription_status: "active",
              subscription_order_id: event.data.orderId,
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
              subscription_order_id: event.data.orderId,
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
              subscription_order_id: event.data.orderId,
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
              subscription_order_id: event.data.orderId,
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
