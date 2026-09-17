import { WaffoPancake } from "@waffo/pancake-ts";

let client: WaffoPancake | null = null;

/**
 * Custom fetch wrapper to inject X-Environment header
 * This enables test mode by sending the header to Pancake API
 */
let testModeEnabled = false;

function createCustomFetch(): typeof fetch {
  return (input: URL | RequestInfo, init?: RequestInit): Promise<Response> => {
    const headers = new Headers(init?.headers);

    // 如果启用了 test mode，注入 header
    if (testModeEnabled) {
      headers.set("X-Environment", "test");
    }

    return fetch(input, { ...init, headers });
  };
}

export function getPancakeClient(testMode: boolean = false): WaffoPancake {
  // 更新全局 test mode 状态
  if (testMode !== testModeEnabled) {
    testModeEnabled = testMode;
    // 重置 client 以使用新的 fetch
    client = null;
  }

  // 创建或重用 client
  if (!client) {
    client = new WaffoPancake({
      merchantId: process.env.WAFFO_MERCHANT_ID!,
      privateKey: process.env.WAFFO_PRIVATE_KEY!,
      // 使用自定义 fetch，它会根据 testModeEnabled 动态注入 header
      fetch: createCustomFetch(),
    });
  }

  return client;
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
