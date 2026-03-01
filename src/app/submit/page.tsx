import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubmitForm from "@/components/SubmitForm";

export const metadata: Metadata = {
  title: "提交 Skill",
  description: "创建并分享你的 AI Skill 到 SkillHub 平台",
};

export default function SubmitPage() {
  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-text-primary">
              提交 Skill
            </h1>
            <p className="text-text-secondary">
              填写以下信息，生成标准的 Markdown
              文件。你可以复制或下载后提交给我们收录。
            </p>
          </div>
          <SubmitForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
