import { WaffoPancake } from "@waffo/pancake-ts";

/**
 * Create a custom fetch wrapper that injects X-Environment header
 * Each request gets its own closure to avoid concurrency issues
 */
function createCustomFetch(testMode: boolean): typeof fetch {
  return (input: URL | RequestInfo, init?: RequestInit): Promise<Response> => {
    const headers = new Headers(init?.headers);

    // 注入 X-Environment header 以切换测试环境
    if (testMode) {
      headers.set("X-Environment", "test");
    }

    console.log("[Pancake Client] Fetch with X-Environment:", testMode ? "test" : "prod");

    return fetch(input, { ...init, headers });
  };
}

/**
 * Get Pancake client for production or test environment
 * Each call creates a fresh client to avoid concurrency issues with test mode
 */
export function getPancakeClient(testMode: boolean = false): WaffoPancake {
  console.log("[getPancakeClient] Creating client with testMode:", testMode);

  return new WaffoPancake({
    merchantId: process.env.WAFFO_MERCHANT_ID!,
    privateKey: process.env.WAFFO_PRIVATE_KEY!,
    // 为每个 client 创建独立的 fetch wrapper，避免全局状态竞态
    fetch: createCustomFetch(testMode),
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
