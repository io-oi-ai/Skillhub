import { createWaffoClient } from "./waffo";
import { TaxCategory } from "@waffo/pancake-ts";
import { createCheckoutProduct } from "./creem";
import { createSupabaseAdmin } from "./supabase-admin";

/**
 * Create payment platform products for a paid skill.
 * Called when a paid skill is first published or when price changes.
 * Returns the created product IDs.
 */
export async function provisionSkillProduct(skill: {
  id: string;
  name: string;
  description: string;
  price: number; // cents
}): Promise<{ waffoProductId?: string; creemProductId?: string }> {
  const result: { waffoProductId?: string; creemProductId?: string } = {};
  const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://skillhubs.cc"}/pricing/success?type=skill&skillId=${skill.id}`;

  // Create Waffo one-time product
  try {
    const waffoProductId = await createWaffoOnetimeProduct(skill, successUrl);
    result.waffoProductId = waffoProductId;
  } catch (e) {
    console.error("[provision] Failed to create Waffo product:", e);
  }

  // Create Creem one-time product
  try {
    const creemProductId = await createCreemOnetimeProduct(skill, successUrl);
    result.creemProductId = creemProductId;
  } catch (e) {
    console.error("[provision] Failed to create Creem product:", e);
  }

  // Save product IDs to database
  if (result.waffoProductId || result.creemProductId) {
    const admin = createSupabaseAdmin();
    await admin
      .from("skills")
      .update({
        ...(result.waffoProductId
          ? { waffo_product_id: result.waffoProductId }
          : {}),
        ...(result.creemProductId
          ? { creem_product_id: result.creemProductId }
          : {}),
      })
      .eq("id", skill.id);
  }

  return result;
}

async function createWaffoOnetimeProduct(
  skill: { id: string; name: string; description: string; price: number },
  successUrl: string
): Promise<string> {
  const client = createWaffoClient();
  const storeId = process.env.WAFFO_STORE_ID;
  if (!storeId) throw new Error("WAFFO_STORE_ID not set");

  const { product } = await client.onetimeProducts.create({
    storeId,
    name: `Skill: ${skill.name}`,
    prices: {
      USD: {
        amount: (skill.price / 100).toFixed(2),
        taxCategory: TaxCategory.DigitalGoods,
      },
    },
    description: skill.description,
    successUrl,
    metadata: { skillId: skill.id },
  });

  return product.id;
}

async function createCreemOnetimeProduct(
  skill: { id: string; name: string; description: string; price: number },
  successUrl: string
): Promise<string> {
  const product = await createCheckoutProduct({
    name: `Skill: ${skill.name}`,
    price: skill.price,
    description: skill.description,
    successUrl,
  });

  return product.id;
}
