import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-text-primary">
            SkillHub
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Skills
          </Link>
          <Link
            href="/submit"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Submit
          </Link>
        </nav>
      </div>
    </header>
  );
}
