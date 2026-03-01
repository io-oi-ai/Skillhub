import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import LanguageSwitcher from "./LanguageSwitcher";

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
          <span className="font-serif text-2xl font-bold text-text-primary">
            SkillHub
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href={`${prefix}/`}
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            {dict.nav.skills}
          </Link>
          <Link
            href={`${prefix}/submit`}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            {dict.nav.submit}
          </Link>
          <LanguageSwitcher locale={locale} />
        </nav>
      </div>
    </header>
  );
}
