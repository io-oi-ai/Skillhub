import { WaffoPancake } from "@waffo/pancake-ts";

/**
 * Get Pancake client for production or test environment
 * Uses different credentials based on testMode flag
 *
 * 生产和测试环境有不同的 API Key，所以在初始化时就要选择正确的环境
 */
export function getPancakeClient(testMode: boolean = false): WaffoPancake {
  let merchantId: string;
  let privateKey: string;

  if (testMode) {
    // 测试环境使用测试 API Key
    merchantId = process.env.WAFFO_TEST_MERCHANT_ID || process.env.WAFFO_MERCHANT_ID!;
    privateKey = process.env.WAFFO_TEST_PRIVATE_KEY || process.env.WAFFO_PRIVATE_KEY!;
    console.log("[getPancakeClient] 🧪 Using TEST environment credentials");
  } else {
    // 生产环境使用生产 API Key
    merchantId = process.env.WAFFO_MERCHANT_ID!;
    privateKey = process.env.WAFFO_PRIVATE_KEY!;
    console.log("[getPancakeClient] 🏢 Using PRODUCTION environment credentials");
  }

  return new WaffoPancake({
    merchantId,
    privateKey,
  });
}

export async function issuePancakeSessionToken(buyerEmail: string) {
  const pancake = getPancakeClient();
  return pancake.auth.issueSessionToken({
    storeId: process.env.WAFFO_STORE_ID!,
    buyerIdentity: buyerEmail,
  });
}

export function getPancakeBuyerSession(token: string) {
  const pancake = getPancakeClient();
  return pancake.buyer(token);
}
