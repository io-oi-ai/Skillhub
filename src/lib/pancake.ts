import { WaffoPancake } from "@waffo/pancake-ts";

let prodClient: WaffoPancake | null = null;
let testClient: WaffoPancake | null = null;

/**
 * Custom fetch wrapper to inject X-Environment header for test mode
 */
function createFetchWithEnvironment(testMode: boolean): typeof fetch {
  return (input: URL | RequestInfo, init?: RequestInit): Promise<Response> => {
    const headers = new Headers(init?.headers);
    if (testMode) {
      headers.set("X-Environment", "test");
    }
    return fetch(input, { ...init, headers });
  };
}

export function getPancakeClient(testMode: boolean = false): WaffoPancake {
  // When testMode is enabled, use test environment
  if (testMode) {
    if (!testClient) {
      testClient = new WaffoPancake({
        merchantId: process.env.WAFFO_MERCHANT_ID!,
        privateKey: process.env.WAFFO_PRIVATE_KEY!,
        // Use custom fetch that injects X-Environment: test header
        fetch: createFetchWithEnvironment(true),
      });
    }
    return testClient;
  }

  // Default to production client
  if (!prodClient) {
    prodClient = new WaffoPancake({
      merchantId: process.env.WAFFO_MERCHANT_ID!,
      privateKey: process.env.WAFFO_PRIVATE_KEY!,
      // Use custom fetch with no environment header (defaults to prod)
      fetch: createFetchWithEnvironment(false),
    });
  }
  return prodClient;
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
