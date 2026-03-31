export type BillingPlan = "free" | "pro_monthly" | "pro_yearly";
export type BillingStatus =
  | "inactive"
  | "active"
  | "canceling"
  | "canceled"
  | "past_due";

export interface BillingProfile {
  billing_email?: string | null;
  is_pro?: boolean | null;
  subscription_plan?: BillingPlan | null;
  subscription_status?: BillingStatus | null;
  subscription_order_id?: string | null;
  subscription_current_period_ends_at?: string | null;
}

export const BILLING_PRICES = {
  free: "$0",
  pro_monthly: "$9.99",
  pro_yearly: "$99",
  single_skill: "$0.99",
} as const;

export function getPlanProductId(plan: Exclude<BillingPlan, "free">) {
  if (plan === "pro_monthly") {
    return process.env.WAFFO_PRO_MONTHLY_PRODUCT_ID!;
  }

  return process.env.WAFFO_PRO_YEARLY_PRODUCT_ID!;
}

export function getSingleSkillProductId() {
  return process.env.WAFFO_DOWNLOAD_PRODUCT_ID!;
}

export function getPlanFromProductId(productId: string): BillingPlan | null {
  if (productId === process.env.WAFFO_PRO_MONTHLY_PRODUCT_ID) {
    return "pro_monthly";
  }

  if (productId === process.env.WAFFO_PRO_YEARLY_PRODUCT_ID) {
    return "pro_yearly";
  }

  return null;
}

export function isProProfile(profile: BillingProfile | null | undefined) {
  return Boolean(profile?.is_pro && profile.subscription_status !== "past_due");
}

export function getBillingReturnPath(plan: BillingPlan, locale: string) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${prefix}/pricing?plan=${plan}&checkout=success`;
}
