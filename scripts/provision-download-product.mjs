// One-off: ensure the $0.99 "Skill Download" one-time product exists in Pancake
// and verify a checkout session can be created for it.
// Usage: node --env-file=<path-to-env> scripts/provision-download-product.mjs
import { WaffoPancake, TaxCategory } from "@waffo/pancake-ts";

const client = new WaffoPancake({
  merchantId: process.env.WAFFO_MERCHANT_ID,
  privateKey: process.env.WAFFO_PRIVATE_KEY,
});

const existingId = process.env.WAFFO_DOWNLOAD_PRODUCT_ID;
const storeId = process.env.WAFFO_STORE_ID;

async function tryCheckout(productId) {
  const session = await client.checkout.anonymous.create({
    productId,
    currency: "USD",
    successUrl: "https://skillhubs.cc/api/checkout/success?redirect_to=%2Fpricing%3Fcheckout%3Dsuccess",
    metadata: { plan: "single_skill", probe: "provision-script" },
  });
  return session;
}

if (existingId) {
  try {
    const session = await tryCheckout(existingId);
    console.log("EXISTING product works:", existingId);
    console.log("checkoutUrl:", session.checkoutUrl);
    process.exit(0);
  } catch (e) {
    console.log("Existing product unusable:", existingId, "-", e.message ?? e);
  }
}

console.log("Creating new one-time product in store", storeId, "...");
const { product } = await client.onetimeProducts.create({
  storeId,
  name: "Skill Download",
  description: "One-time purchase of a single SkillHubs skill download.",
  prices: {
    USD: { amount: "0.99", taxCategory: TaxCategory.DigitalGoods },
  },
  successUrl: "https://skillhubs.cc/pricing?plan=single_skill&checkout=success",
  metadata: { purpose: "single_skill_download" },
});
console.log("Created product:", product.id);

try {
  const published = await client.onetimeProducts.publish({ id: product.id });
  console.log("Published:", published.product.id);
} catch (e) {
  console.log("Publish step failed (may not be required):", e.message ?? e);
}

const session = await tryCheckout(product.id);
console.log("Checkout OK for new product.");
console.log("checkoutUrl:", session.checkoutUrl);
console.log("\nSet WAFFO_DOWNLOAD_PRODUCT_ID=" + product.id);
