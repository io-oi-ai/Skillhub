"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { useAuth } from "@/components/AuthProvider";
import { isPancakeTestModeEnabled } from "@/lib/test-mode";

interface SubscriptionStatus {
  subscribed: boolean;
  plan: string;
  status: string;
  orderId: string | null;
  currentPeriodEndsAt: string | null;
}

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export default function PricingContent({ dict, locale }: Props) {
  const [isYearly, setIsYearly] = useState(true);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testModeEnabled, setTestModeEnabled] = useState(false);
  const [clicksRemaining, setClicksRemaining] = useState(0);
  const { user } = useAuth();

  const prefix = locale === "en" ? "" : `/${locale}`;
  const t = dict.pricing;

  // 初始化 Pancake Test Mode 状态
  useEffect(() => {
    setTestModeEnabled(isPancakeTestModeEnabled());
  }, []);

  useEffect(() => {
    if (!user) return;

    async function fetchStatus() {
      try {
        const res = await fetch("/api/subscription/status");
        const data = await res.json();
        setSubscriptionStatus(data);
      } catch (err) {
        console.error("Failed to fetch subscription status:", err);
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [user]);

  async function handleCheckout(plan: "monthly" | "yearly") {
    if (!user) {
      window.location.href = `${prefix}/login`;
      return;
    }
    setIsLoading(plan);
    try {
      const testModeValue = isPancakeTestModeEnabled();
      console.log('[PricingContent] handleCheckout testMode:', testModeValue);
      console.log('[PricingContent] localStorage testMode:', localStorage.getItem('skillhub_pancake_test_mode_enabled'));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "subscription",
          plan,
          testMode: testModeValue,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.assign(data.url);
      } else {
        alert(data.error || "Checkout failed. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(null);
    }
  }

  async function handleCancel() {
    setActionLoading("cancel");
    try {
      const res = await fetch("/api/subscription/cancel", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      setMessage({
        type: "success",
        text: data.message || "Subscription canceled",
      });

      const statusRes = await fetch("/api/subscription/status");
      setSubscriptionStatus(await statusRes.json());
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to cancel subscription",
      });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReactivate() {
    setActionLoading("reactivate");
    try {
      const res = await fetch("/api/subscription/reactivate", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reactivate subscription");
      }

      setMessage({
        type: "success",
        text: data.message || "Subscription restored",
      });

      const statusRes = await fetch("/api/subscription/status");
      setSubscriptionStatus(await statusRes.json());
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to reactivate subscription",
      });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSwitch(newPlan: "pro_monthly" | "pro_yearly") {
    setActionLoading(`switch-${newPlan}`);
    try {
      const res = await fetch("/api/subscription/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPlan,
          locale,
          successPath: `${prefix}/pricing?switched=1`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate plan switch");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to switch plan",
      });
    } finally {
      setActionLoading(null);
    }
  }

  const isPro = subscriptionStatus?.subscribed && subscriptionStatus?.plan !== "free";
  const isCanceling = subscriptionStatus?.status === "canceling";
  const planName = subscriptionStatus?.plan === "pro_yearly" ? "Pro (Annual)" : "Pro (Monthly)";

  return (
    <section className="min-h-screen bg-bg-primary px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Show subscription management if user is Pro */}
        {user && isPro && (
          <div className="mb-12 rounded-xl border border-border bg-bg-card p-6">
            <div className="flex items-center justify-between gap-6 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary mb-1">
                  {planName}
                </h2>
                {isCanceling ? (
                  <p className="text-sm text-orange-600">
                    Cancels on {new Date(subscriptionStatus!.currentPeriodEndsAt!).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="text-sm text-text-secondary">
                    Renews on {new Date(subscriptionStatus!.currentPeriodEndsAt!).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="text-right text-xs text-accent font-medium bg-accent/10 px-3 py-1 rounded">
                PRO
              </div>
            </div>

            {message && (
              <div
                className={`mb-4 rounded-lg p-3 text-sm ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {!isCanceling && (
                <>
                  <button
                    onClick={() =>
                      handleSwitch(
                        subscriptionStatus!.plan === "pro_yearly" ? "pro_monthly" : "pro_yearly"
                      )
                    }
                    disabled={actionLoading !== null}
                    className="rounded-lg border border-border bg-bg-primary px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-card disabled:opacity-50"
                  >
                    {actionLoading?.startsWith("switch")
                      ? "Switching..."
                      : `Switch to ${subscriptionStatus!.plan === "pro_yearly" ? "Monthly" : "Annual"}`}
                  </button>

                  <button
                    onClick={handleCancel}
                    disabled={actionLoading !== null}
                    className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    {actionLoading === "cancel" ? "Canceling..." : "Cancel Subscription"}
                  </button>
                </>
              )}

              {isCanceling && (
                <button
                  onClick={handleReactivate}
                  disabled={actionLoading !== null}
                  className="rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50"
                >
                  {actionLoading === "reactivate" ? "Restoring..." : "Restore Subscription"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-serif text-4xl text-text-primary sm:text-5xl">
            {t.title}{" "}
            <span className="italic text-accent">{t.titleHighlight}</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            {t.subtitle}
          </p>
        </div>

        {/* Billing Toggle - Only show if not Pro */}
        {!isPro && (
          <div className="mb-12 flex justify-center">
            <div className="inline-flex items-center rounded-full border border-border bg-bg-card p-1">
              <button
                onClick={() => setIsYearly(false)}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                  !isYearly
                    ? "bg-bg-primary text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {t.billingToggle.monthly}
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-all ${
                  isYearly
                    ? "bg-bg-primary text-text-primary shadow-sm"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {t.billingToggle.yearly}
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                  {t.billingToggle.savePercent}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Free Plan */}
          <div className="flex h-full flex-col rounded-2xl border border-border bg-bg-card p-8">
            <div className="mb-6">
              <h3 className="mb-2 text-xl font-semibold text-text-primary">
                {t.freePlan.name}
              </h3>
              <p className="text-sm text-text-secondary">
                {t.freePlan.description}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-text-primary">
                  {t.freePlan.price}
                </span>
              </div>
              <p className="mt-1 text-sm text-text-muted">{t.freePlan.period}</p>
            </div>

            <ul className="mb-8 flex-grow space-y-3">
              {t.freePlan.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-text-secondary"
                >
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={`${prefix}/login`}
              className="block w-full rounded-lg border border-border py-3 text-center text-sm font-medium text-text-primary transition-colors hover:bg-bg-primary"
            >
              {t.freePlan.cta}
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-accent p-8 ring-2 ring-accent">
            {/* Badge - Click to activate Pancake Test Mode */}
            <div className="absolute right-4 top-4">
              <button
                onClick={() => {
                  const result = handlePancakeTestModeActivationClick();
                  setTestModeEnabled(isPancakeTestModeEnabled());
                  setClicksRemaining(result.clicksRemaining);
                  if (result.activated) {
                    setMessage({
                      type: "success",
                      text: "🧪 Pancake Test Mode enabled - use test card: 4242 4242 4242 4242"
                    });
                  }
                }}
                className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/30 cursor-pointer group relative"
                title={testModeEnabled ? "✅ Test Mode Active" : `Click ${clicksRemaining || 5} more times to enable Test Mode`}
              >
                {testModeEnabled ? (
                  <>
                    <span className="inline-block mr-1">🧪</span>
                    {t.proPlan.badge}
                  </>
                ) : (
                  t.proPlan.badge
                )}
                {!testModeEnabled && clicksRemaining > 0 && clicksRemaining < 5 && (
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white/20 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {clicksRemaining} more clicks
                  </span>
                )}
              </button>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-xl font-semibold text-white">
                {t.proPlan.name}
              </h3>
              <p className="text-sm text-white/70">{t.proPlan.description}</p>
            </div>

            <div className="mb-6">
              {isYearly ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">
                      {t.proPlan.yearlyPrice}
                    </span>
                    <span className="text-white/60">
                      {t.proPlan.yearlyPeriod}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/80">
                    {t.proPlan.yearlySave}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">
                      {t.proPlan.price}
                    </span>
                    <span className="text-white/60">{t.proPlan.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-white/80">
                    {t.proPlan.monthlyNote}
                  </p>
                </>
              )}
            </div>

            <ul className="mb-8 flex-grow space-y-3">
              {t.proPlan.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-white/90"
                >
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-white/80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {!isPro && (
              <button
                onClick={() => handleCheckout(isYearly ? "yearly" : "monthly")}
                disabled={isLoading !== null}
                className="w-full rounded-lg bg-white py-3 text-center text-sm font-medium text-accent transition-colors hover:bg-white/90 disabled:opacity-50"
              >
                {isLoading ? "..." : t.proPlan.cta}
              </button>
            )}
          </div>
        </div>

        {/* Single Purchase Note */}
        <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-border bg-bg-card p-6 text-center">
          <h3 className="mb-2 text-lg font-semibold text-text-primary">
            {t.singlePurchase.title}
          </h3>
          <p className="mb-4 text-sm text-text-secondary">
            {t.singlePurchase.description}
          </p>
          <Link
            href={`${prefix}/`}
            className="inline-block rounded-lg border border-accent px-6 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/5"
          >
            {t.singlePurchase.cta}
          </Link>
        </div>

        {/* Money-Back Guarantee */}
        <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-3">
            <svg
              className="h-6 w-6 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-text-primary">
              {t.guarantee.title}
            </h3>
          </div>
          <p className="text-sm text-text-secondary">
            {t.guarantee.description}
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-center text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            {t.trust.ssl}
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            {t.trust.secure}
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {t.trust.refund}
          </span>
        </div>
      </div>
    </section>
  );
}
