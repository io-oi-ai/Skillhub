import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Footer({ locale, dict }: FooterProps) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-text-muted">
          &copy; {new Date().getFullYear()} SkillHubs
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-text-muted">
          <Link href={`${prefix}/pricing`} className="transition-colors hover:text-text-secondary">
            {dict.footer.pricing}
          </Link>
          <Link href={`${prefix}/privacy`} className="transition-colors hover:text-text-secondary">
            {dict.footer.privacy}
          </Link>
          <Link href={`${prefix}/terms`} className="transition-colors hover:text-text-secondary">
            {dict.footer.terms}
          </Link>
          <a href="mailto:support@skillhubs.cc" className="transition-colors hover:text-text-secondary">
            {dict.footer.contact}
          </a>
          <a
            href="https://github.com/io-oi-ai/Skillhub"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-text-secondary"
          >
            {dict.footer.github}
          </a>
          <span>{dict.footer.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
