import { WaffoPancake } from "@waffo/pancake-ts";

let prodClient: WaffoPancake | null = null;
let testClient: WaffoPancake | null = null;

export function getPancakeClient(testMode: boolean = false): WaffoPancake {
  // When testMode is enabled, use test credentials (if configured)
  if (testMode && process.env.WAFFO_TEST_MERCHANT_ID && process.env.WAFFO_TEST_PRIVATE_KEY) {
    if (!testClient) {
      testClient = new WaffoPancake({
        merchantId: process.env.WAFFO_TEST_MERCHANT_ID,
        privateKey: process.env.WAFFO_TEST_PRIVATE_KEY,
      });
    }
    return testClient;
  }

  // Default to production client
  if (!prodClient) {
    prodClient = new WaffoPancake({
      merchantId: process.env.WAFFO_MERCHANT_ID!,
      privateKey: process.env.WAFFO_PRIVATE_KEY!,
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
