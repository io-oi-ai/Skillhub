import {
  WaffoPancake,
  verifyWebhook,
  type CreateCheckoutSessionParams,
} from "@waffo/pancake-ts";

export { verifyWebhook, type CreateCheckoutSessionParams };

export function createWaffoClient() {
  return getWaffoClient();
}

function getWaffoClient() {
  const merchantId = process.env.WAFFO_MERCHANT_ID;
  const privateKey = process.env.WAFFO_PRIVATE_KEY;

  if (!merchantId) throw new Error("WAFFO_MERCHANT_ID is not set");
  if (!privateKey) throw new Error("WAFFO_PRIVATE_KEY is not set");

  return new WaffoPancake({ merchantId, privateKey });
}

export interface WaffoCheckoutParams {
  productId: string;
  currency?: string;
  successUrl?: string;
  metadata?: Record<string, string>;
}

export interface WaffoCheckoutResult {
  checkoutUrl: string;
  sessionId: string;
}

export async function createWaffoCheckout(
  params: WaffoCheckoutParams
): Promise<WaffoCheckoutResult> {
  const client = getWaffoClient();

  const session = await client.checkout.anonymous.create({
    productId: params.productId,
    currency: params.currency ?? "USD",
    successUrl: params.successUrl,
    metadata: params.metadata,
  });

  return { checkoutUrl: session.checkoutUrl, sessionId: session.sessionId };
}

// Waffo product IDs (configured via env vars in Waffo dashboard)
export const WAFFO_PRODUCTS = {
  PRO_MONTHLY: process.env.WAFFO_PRODUCT_PRO_MONTHLY ?? "",
  PRO_YEARLY: process.env.WAFFO_PRODUCT_PRO_YEARLY ?? "",
} as const;

