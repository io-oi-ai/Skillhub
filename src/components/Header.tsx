import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import LanguageSwitcher from "./LanguageSwitcher";
import AuthButton from "./AuthButton";

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 2h20c1.1 0 2 .9 2 2v26l-12-8-12 8V4c0-1.1.9-2 2-2z"
        fill="currentColor"
      />
      <path d="M20 2h6l-6 6V2z" fill="#f5f5f0" opacity="0.3" />
      <path
        d="M15 6l-5 10h4l-1 10 7-12h-4.5L15 6z"
        fill="#f5f5f0"
      />
    </svg>
  );
}

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Header({ locale, dict }: HeaderProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <header className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`${prefix}/`} className="flex items-center gap-2">
          <LogoIcon className="h-7 w-7 text-text-primary" />
          <span className="font-serif text-2xl font-bold text-text-primary">
            SkillHubs
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href={`${prefix}/guide`}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
          >
            {dict.nav.guide}
          </Link>
          <Link
            href={`${prefix}/leaderboard`}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
          >
            {dict.points.leaderboard}
          </Link>
          <Link
            href={`${prefix}/submit`}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            {dict.nav.submit}
          </Link>
          <LanguageSwitcher locale={locale} />
          <AuthButton locale={locale} dict={dict} />
        </nav>
      </div>
    </header>
  );
}
