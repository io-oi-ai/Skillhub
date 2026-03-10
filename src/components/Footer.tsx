import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Footer({ dict }: FooterProps) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-text-muted">
          &copy; {new Date().getFullYear()} SkillHubs
        </p>
        <p className="text-sm text-text-muted">
          {dict.footer.tagline}
        </p>
      </div>
    </footer>
  );
}
