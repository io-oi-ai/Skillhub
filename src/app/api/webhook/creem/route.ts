import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/creem";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("creem-signature");

    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[webhook/creem] CREEM_WEBHOOK_SECRET is not set");
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

    if (
      !signature ||
      !verifyWebhookSignature(payload, signature, webhookSecret)
    ) {
      console.error("[webhook/creem] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(payload);
    const eventType: string = event.eventType || event.event_type;
    console.log(
      `[webhook/creem] event: ${eventType}`,
      JSON.stringify(event).slice(0, 800)
    );

    switch (eventType) {
      case "checkout.completed":
        await handleCheckoutCompleted(event);
        break;
      case "subscription.active":
      case "subscription.paid":
        await handleSubscriptionActive(event);
        break;
      case "subscription.canceled":
      case "subscription.scheduled_cancel":
        await handleSubscriptionCanceled(event, eventType);
        break;
      case "subscription.expired":
      case "subscription.past_due":
        await handleSubscriptionFailed(event, eventType);
        break;
      default:
        console.log(`[webhook/creem] Unhandled event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook/creem] Unhandled error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

// ── Retry helper for transient DB errors ────────────────────────────────

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      const isTransient = code === "P1001" || code === "P1002";
      if (!isTransient || i === retries - 1) throw err;
      console.log(
        `[webhook/creem] Transient DB error (${code}), retrying in ${delayMs}ms... (${i + 1}/${retries})`
      );
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw new Error("unreachable");
}

// ── Payload helpers ─────────────────────────────────────────────────────

function getSubscriptionId(event: Record<string, unknown>): string | undefined {
  const obj = event.object as Record<string, unknown> | undefined;
  const sub = obj?.subscription as Record<string, unknown> | undefined;
  return (sub?.id as string) || (obj?.id as string);
}

function getCustomerId(event: Record<string, unknown>): string | undefined {
  const obj = event.object as Record<string, unknown> | undefined;
  const customer = obj?.customer as Record<string, unknown> | undefined;
  return customer?.id as string | undefined;
}

function getProductId(event: Record<string, unknown>): string | undefined {
  const obj = event.object as Record<string, unknown> | undefined;
  const product = obj?.product as Record<string, unknown> | undefined;
  return product?.id as string | undefined;
}

function getMetadata(
  event: Record<string, unknown>
): Record<string, string> | undefined {
  const obj = event.object as Record<string, unknown> | undefined;
  return obj?.metadata as Record<string, string> | undefined;
}

function getPeriodEnd(event: Record<string, unknown>): string | null {
  const obj = event.object as Record<string, unknown> | undefined;
  const sub = (obj?.subscription as Record<string, unknown>) || obj;
  const dateStr =
    (sub?.current_period_end_date as string) ||
    (sub?.current_period_end as string);
  return dateStr ? new Date(dateStr).toISOString() : null;
}

// Monthly plan: 10 downloads, Yearly plan: 15 downloads
function getDownloadsForPlan(plan: string | undefined): number {
  return plan === "yearly" ? 15 : 10;
}

// ── Event Handlers ──────────────────────────────────────────────────────

async function handleCheckoutCompleted(event: Record<string, unknown>) {
  const metadata = getMetadata(event);
  const userId = metadata?.userId;
  const checkoutType = metadata?.type; // 'subscription' | 'skill_purchase'

  if (!userId) {
    console.error(
      "[webhook/creem] Missing userId in checkout.completed metadata"
    );
    return;
  }

  if (checkoutType === "skill_purchase") {
    await handleSkillPurchase(userId, metadata);
    return;
  }

  // Default: subscription checkout
  await handleSubscriptionCheckout(userId, event, metadata);
}

async function handleSkillPurchase(
  userId: string,
  metadata: Record<string, string>
) {
  const skillId = metadata.skillId;
  const price = parseInt(metadata.price || "0", 10);

  if (!skillId) {
    console.error("[webhook/creem] Missing skillId in skill_purchase metadata");
    return;
  }

  const supabase = createSupabaseAdmin();

  await withRetry(async () => {
    const { error } = await supabase.from("skill_purchases").upsert(
      {
        user_id: userId,
        skill_id: skillId,
        provider: "creem",
        external_order_id: metadata.checkoutId || null,
        price,
        source: "purchase",
      },
      { onConflict: "user_id,skill_id" }
    );

    if (error) throw error;
  });

  console.log(
    `[webhook/creem] Skill ${skillId} purchased by user ${userId} for ${price} cents`
  );
}

async function handleSubscriptionCheckout(
  userId: string,
  event: Record<string, unknown>,
  metadata: Record<string, string> | undefined
) {
  const customerId = getCustomerId(event);
  const subscriptionId = getSubscriptionId(event);
  const productId = getProductId(event);
  const periodEnd = getPeriodEnd(event);
  const plan = metadata?.plan;

  console.log("[webhook/creem] checkout.completed (subscription):", {
    userId,
    customerId,
    subscriptionId,
    productId,
  });

  const supabase = createSupabaseAdmin();

  // Upsert subscription record
  if (subscriptionId) {
    await withRetry(async () => {
      const { error } = await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          provider: "creem",
          external_subscription_id: subscriptionId,
          external_customer_id: customerId || "",
          product_id: productId || "",
          status: "active",
          current_period_end: periodEnd,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "external_subscription_id" }
      );
      if (error) throw error;
    });
  }

  // Upgrade user to Pro + set download quota
  const downloads = getDownloadsForPlan(plan);
  await withRetry(async () => {
    const { error } = await supabase
      .from("profiles")
      .update({
        plan: "pro",
        subscription_downloads_remaining: downloads,
        subscription_downloads_reset_at: periodEnd,
      })
      .eq("id", userId);
    if (error) throw error;
  });

  console.log(`[webhook/creem] User ${userId} upgraded to Pro (${plan})`);
}

async function handleSubscriptionActive(event: Record<string, unknown>) {
  const subscriptionId = getSubscriptionId(event);
  if (!subscriptionId) return;

  const periodEnd = getPeriodEnd(event);
  const supabase = createSupabaseAdmin();

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "active",
      ...(periodEnd ? { current_period_end: periodEnd } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("external_subscription_id", subscriptionId);

  if (error) {
    console.error(
      `[webhook/creem] Failed to update subscription ${subscriptionId}:`,
      error
    );
  } else {
    console.log(
      `[webhook/creem] Subscription ${subscriptionId} marked active`
    );
  }
}

async function handleSubscriptionCanceled(
  event: Record<string, unknown>,
  eventType: string
) {
  const subscriptionId = getSubscriptionId(event);
  if (!subscriptionId) return;

  const isCanceled = eventType === "subscription.canceled";
  const supabase = createSupabaseAdmin();

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: isCanceled ? "canceled" : "active",
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq("external_subscription_id", subscriptionId);

  if (error) {
    console.error(
      `[webhook/creem] Failed to cancel subscription ${subscriptionId}:`,
      error
    );
  } else {
    console.log(
      `[webhook/creem] Subscription ${subscriptionId} cancel status updated`
    );
  }
}

async function handleSubscriptionFailed(
  event: Record<string, unknown>,
  eventType: string
) {
  const subscriptionId = getSubscriptionId(event);
  if (!subscriptionId) return;

  const supabase = createSupabaseAdmin();

  // Update subscription status
  const { data: sub, error } = await supabase
    .from("subscriptions")
    .update({
      status: eventType === "subscription.expired" ? "expired" : "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("external_subscription_id", subscriptionId)
    .select("user_id")
    .single();

  if (error) {
    console.error(
      `[webhook/creem] Failed to update subscription ${subscriptionId}:`,
      error
    );
    return;
  }

  // Downgrade user to free when subscription expires
  if (eventType === "subscription.expired" && sub?.user_id) {
    await supabase
      .from("profiles")
      .update({
        plan: "free",
        subscription_downloads_remaining: 0,
      })
      .eq("id", sub.user_id);

    console.log(
      `[webhook/creem] User ${sub.user_id} downgraded to free`
    );
  }
}
