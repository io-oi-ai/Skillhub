const CREEM_API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://api.creem.io/v1"
    : "https://test-api.creem.io/v1";

function getApiKey(): string {
  const key = process.env.CREEM_API_KEY;
  if (!key) throw new Error("CREEM_API_KEY is not set");
  return key;
}

interface CreateCheckoutParams {
  productId: string;
  successUrl: string;
  requestId?: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

interface CheckoutResponse {
  checkout_url: string;
  id: string;
  request_id?: string;
}

export async function createCheckout({
  productId,
  successUrl,
  requestId,
  customerId,
  metadata,
}: CreateCheckoutParams): Promise<CheckoutResponse> {
  const body: Record<string, unknown> = {
    product_id: productId,
    success_url: successUrl,
  };

  if (requestId) body.request_id = requestId;
  if (customerId) body.customer_id = customerId;
  if (metadata) body.metadata = metadata;

  const res = await fetch(`${CREEM_API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      "x-api-key": getApiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Creem checkout error: ${res.status} ${text}`);
  }

  return res.json();
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require("crypto") as typeof import("crypto");
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

/**
 * Create a one-time product on Creem (for single skill purchases).
 */
export async function createCheckoutProduct(params: {
  name: string;
  price: number; // cents
  description?: string;
  successUrl?: string;
}): Promise<{ id: string }> {
  const body: Record<string, unknown> = {
    name: params.name,
    billing_type: "one_time",
    price: params.price,
    currency: "USD",
  };
  if (params.description) body.description = params.description;

  const res = await fetch(`${CREEM_API_BASE}/products`, {
    method: "POST",
    headers: {
      "x-api-key": getApiKey(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Creem product creation error: ${res.status} ${text}`);
  }

  return res.json();
}

// Creem Product IDs for SkillHub subscriptions
export const CREEM_PRODUCTS = {
  PRO_MONTHLY: process.env.CREEM_PRODUCT_PRO_MONTHLY ?? "prod_7QBbqkkeWKss4KWg4z7J0Q",
  PRO_YEARLY: process.env.CREEM_PRODUCT_PRO_YEARLY ?? "prod_4pZlBKfvrEjnRzRiDbOuy7",
} as const;
