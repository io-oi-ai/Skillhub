import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <h1 className="mb-4 text-6xl font-bold text-text-muted">404</h1>
        <p className="mb-8 text-lg text-text-secondary">页面未找到</p>
        <Link
          href="/"
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          返回首页
        </Link>
      </main>
      <Footer />
    </>
  );
}
