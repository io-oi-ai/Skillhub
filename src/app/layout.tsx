import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SkillHub — 发现最好的 AI Agent Skills",
    template: "%s | SkillHub",
  },
  description:
    "面向各行业、各职业的 AI 工作流集合站，浏览、搜索和分享高质量的 AI Skills",
  keywords: [
    "AI Skills",
    "AI 工作流",
    "AI 效率",
    "AI 工具",
    "提示词",
    "Agent",
  ],
  openGraph: {
    title: "SkillHub — 发现最好的 AI Agent Skills",
    description:
      "面向各行业、各职业的 AI 工作流集合站，让 AI 真正融入你的日常工作",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
