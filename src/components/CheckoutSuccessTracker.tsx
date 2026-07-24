"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

// 转化闭环关键事件:支付成功页挂载时上报 checkout_succeeded(带订阅/单买类型)。
// 放在 pricing/success 页(server component)里作为客户端子组件。只报一次。
export function CheckoutSuccessTracker({ type }: { type?: string }) {
  useEffect(() => {
    posthog.capture("checkout_succeeded", {
      type: type === "subscription" ? "subscription" : "one_time",
    });
  }, [type]);

  return null;
}
