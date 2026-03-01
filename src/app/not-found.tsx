import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
          <h1 className="mb-4 text-6xl font-bold text-gray-400">404</h1>
          <p className="mb-8 text-lg text-gray-500">Page Not Found</p>
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </main>
      </body>
    </html>
  );
}
