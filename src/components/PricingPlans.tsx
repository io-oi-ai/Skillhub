"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { BILLING_PRICES, isProProfile, type BillingPlan } from "@/lib/billing";
import { useAuth } from "@/hooks/useAuth";
import PricingCard from "./PricingCard";

interface PricingPlansProps {
  locale: Locale;
  dict: Dictionary;
}

export default function PricingPlans({ locale, dict }: PricingPlansProps) {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const withTrial = false;
  const prefix = locale === "en" ? "" : `/${locale}`;
  const p = dict.pricing;
  const currentPlan = profile?.subscription_plan ?? "free";
  const hasPro = isProProfile(profile);

  async function handleCheckout(plan: Exclude<BillingPlan, "free">) {
    if (!user) {
      router.push(`${prefix}/login?next=${encodeURIComponent(`${prefix}/pricing`)}`);
      return;
    }

    try {
      setPendingPlan(plan);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          locale,
          withTrial,
          successPath: `${prefix}/pricing?plan=${plan}&checkout=success`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error(error);
      setPendingPlan(null);
    }
  }

  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <PricingCard
          name={p.free.name}
          price={p.free.price}
          description={p.free.description}
          features={p.free.features}
          cta={currentPlan === "free" ? p.free.cta : p.monthly.cta}
          disabled={loading}
        />
        <PricingCard
          name={p.monthly.name}
          price={BILLING_PRICES.pro_monthly}
          period={p.monthly.period}
          description={p.monthly.description}
          features={p.monthly.features}
          cta={currentPlan === "pro_monthly" && hasPro ? p.free.cta : p.monthly.cta}
          badge={p.monthly.badge}
          highlighted
          disabled={loading || (hasPro && currentPlan === "pro_monthly")}
          loading={pendingPlan === "pro_monthly"}
          onSelect={() => void handleCheckout("pro_monthly")}
        />
        <PricingCard
          name={p.yearly.name}
          price={BILLING_PRICES.pro_yearly}
          period={p.yearly.period}
          description={p.yearly.description}
          features={p.yearly.features}
          cta={currentPlan === "pro_yearly" && hasPro ? p.free.cta : p.yearly.cta}
          badge={p.yearly.badge}
          disabled={loading || (hasPro && currentPlan === "pro_yearly")}
          loading={pendingPlan === "pro_yearly"}
          onSelect={() => void handleCheckout("pro_yearly")}
        />
      </div>

      <div className="mt-10 rounded-xl border border-border bg-bg-card p-6 text-center">
        <h3 className="font-serif text-lg font-semibold text-text-primary">{p.perDownload.title}</h3>
        <p className="mt-1 text-sm text-text-secondary">{p.perDownload.description}</p>
        <p className="mt-2 text-2xl font-bold text-text-primary">
          {BILLING_PRICES.single_skill}{" "}
          <span className="text-sm font-normal text-text-muted">{p.perDownload.unit}</span>
        </p>
      </div>
    </>
  );
}
