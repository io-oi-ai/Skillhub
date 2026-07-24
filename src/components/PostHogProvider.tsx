"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

// SkillHub 分析埋点(PostHog)。用独立 project(与 Pancake 数据隔离)。
// key 通过 NEXT_PUBLIC_POSTHOG_KEY 注入;未配置时静默不初始化(本地/预览环境不报错、不误发数据)。
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return; // 无 key → 不初始化,避免向错误 project 发数据
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: true, // 自动 pageview(SPA 路由切换也捕获)
      capture_pageleave: true,
      autocapture: true, // 自动捕获点击/表单交互,当天即可看漏斗
      person_profiles: "identified_only", // 匿名访客不建 person,省额度
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
