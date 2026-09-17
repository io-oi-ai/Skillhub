import { WaffoPancake } from "@waffo/pancake-ts";

/**
 * Get Pancake client for production or test environment
 * Injects X-Environment header via custom fetch wrapper
 *
 * Pancake 用 X-Environment header 来区分测试/生产环境
 * SDK 默认不注入，所以需要自定义 fetch wrapper
 */
export function getPancakeClient(testMode: boolean = false): WaffoPancake {
  const merchantId = process.env.WAFFO_MERCHANT_ID!;
  const privateKey = process.env.WAFFO_PRIVATE_KEY!;

  const environment = testMode ? "test" : "prod";
  console.log(`[getPancakeClient] Using ${environment.toUpperCase()} environment`);

  // 创建自定义 fetch wrapper，注入 X-Environment header
  const customFetch: typeof fetch = async (input, init) => {
    const headers = new Headers(init?.headers || {});
    headers.set("X-Environment", environment);

    return fetch(input, {
      ...init,
      headers,
    });
  };

  return new WaffoPancake({
    merchantId,
    privateKey,
    fetch: customFetch as typeof fetch,
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
