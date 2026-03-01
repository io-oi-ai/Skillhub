import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <h1 className="mb-4 text-6xl font-bold text-text-muted">404</h1>
      <p className="mb-8 text-lg text-text-secondary">Page Not Found</p>
      <Link
        href="/"
        className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Back to Home
      </Link>
    </main>
  );
}
