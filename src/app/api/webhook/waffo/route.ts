import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@/lib/waffo";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signatureHeader = request.headers.get("x-waffo-signature");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let event: any;
    try {
      event = verifyWebhook(payload, signatureHeader);
    } catch (err) {
      console.error("[webhook/waffo] Invalid signature:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log(
      `[webhook/waffo] event: ${event.eventType}`,
      JSON.stringify(event).slice(0, 800)
    );

    switch (event.eventType) {
      case "order.completed":
        await handleOrderCompleted(event);
        break;
      case "subscription.activated":
        await handleSubscriptionActivated(event);
        break;
      case "subscription.payment_succeeded":
        // Renewal — subscription stays active
        break;
      case "subscription.canceling":
        await handleSubscriptionCanceling(event);
        break;
      case "subscription.canceled":
        await handleSubscriptionCanceled(event);
        break;
      default:
        console.log(`[webhook/waffo] Unhandled event: ${event.eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook/waffo] Unhandled error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

// ── Event Handlers ──────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleOrderCompleted(event: any) {
  const data = event.data;
  const orderId = data?.orderId as string | undefined;
  const buyerEmail = data?.buyerEmail as string | undefined;

  if (!orderId || !buyerEmail) {
    console.error(
      "[webhook/waffo] order.completed: missing orderId or buyerEmail"
    );
    return;
  }

  const supabase = createSupabaseAdmin();

  // Find user by email via auth.users
  const { data: authData } = await supabase.auth.admin.listUsers();
  const authUser = authData?.users?.find((u) => u.email === buyerEmail);

  if (!authUser) {
    console.error(
      `[webhook/waffo] order.completed: no user with email ${buyerEmail}`
    );
    return;
  }

  // Check metadata to determine if this is a skill purchase or subscription
  const metadata = data?.metadata as Record<string, string> | undefined;

  if (metadata?.type === "skill_purchase" && metadata?.skillId) {
    // Single skill purchase via Waffo
    const { error } = await supabase.from("skill_purchases").upsert(
      {
        user_id: authUser.id,
        skill_id: metadata.skillId,
        provider: "waffo",
        external_order_id: orderId,
        price: parseInt(metadata.price || "0", 10),
        source: "purchase",
      },
      { onConflict: "user_id,skill_id" }
    );

    if (error) {
      console.error("[webhook/waffo] Failed to record skill purchase:", error);
    } else {
      console.log(
        `[webhook/waffo] Skill ${metadata.skillId} purchased by ${authUser.id}`
      );
    }
    return;
  }

  // Subscription order
  await upgradeUser(supabase, authUser.id, orderId, buyerEmail);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionActivated(event: any) {
  const data = event.data;
  const orderId = data?.orderId as string | undefined;
  const buyerEmail = data?.buyerEmail as string | undefined;

  if (!orderId || !buyerEmail) {
    console.error(
      "[webhook/waffo] subscription.activated: missing orderId or buyerEmail"
    );
    return;
  }

  const supabase = createSupabaseAdmin();

  const { data: authData } = await supabase.auth.admin.listUsers();
  const authUser = authData?.users?.find((u) => u.email === buyerEmail);

  if (!authUser) {
    console.error(
      `[webhook/waffo] subscription.activated: no user with email ${buyerEmail}`
    );
    return;
  }

  await upgradeUser(supabase, authUser.id, orderId, buyerEmail);
}

async function upgradeUser(
  supabase: ReturnType<typeof createSupabaseAdmin>,
  userId: string,
  orderId: string,
  buyerEmail: string
) {
  // Upsert subscription record
  const { error: subError } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      provider: "waffo",
      external_subscription_id: orderId,
      external_customer_id: buyerEmail,
      product_id: "",
      status: "active",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "external_subscription_id" }
  );

  if (subError) {
    console.error("[webhook/waffo] Failed to upsert subscription:", subError);
  }

  // Upgrade user plan + set download quota (default 10)
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      plan: "pro",
      subscription_downloads_remaining: 10,
    })
    .eq("id", userId);

  if (profileError) {
    console.error("[webhook/waffo] Failed to upgrade user:", profileError);
  } else {
    console.log(
      `[webhook/waffo] User ${userId} upgraded to Pro (order: ${orderId})`
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionCanceling(event: any) {
  const data = event.data;
  const orderId = data?.orderId as string | undefined;
  if (!orderId) return;

  const supabase = createSupabaseAdmin();

  const { error } = await supabase
    .from("subscriptions")
    .update({
      cancel_at_period_end: true,
      updated_at: new Date().toISOString(),
    })
    .eq("external_subscription_id", orderId);

  if (error) {
    console.error(
      `[webhook/waffo] Failed to mark canceling for ${orderId}:`,
      error
    );
  } else {
    console.log(
      `[webhook/waffo] Subscription ${orderId} set to cancel at period end`
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionCanceled(event: any) {
  const data = event.data;
  const orderId = data?.orderId as string | undefined;
  if (!orderId) return;

  const supabase = createSupabaseAdmin();

  // Get user_id from subscription
  const { data: sub, error: fetchError } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("external_subscription_id", orderId)
    .select("user_id")
    .single();

  if (fetchError || !sub) {
    console.error(
      `[webhook/waffo] Subscription ${orderId} not found for cancel event`
    );
    return;
  }

  // Downgrade user
  await supabase
    .from("profiles")
    .update({
      plan: "free",
      subscription_downloads_remaining: 0,
    })
    .eq("id", sub.user_id);

  console.log(
    `[webhook/waffo] User ${sub.user_id} downgraded to free (order canceled: ${orderId})`
  );
}
