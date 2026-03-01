"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";

interface LanguageSwitcherProps {
  locale: Locale;
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();

  function getTargetPath() {
    if (locale === "en") {
      // Currently English (clean URL) → switch to /zh/...
      return `/zh${pathname}`;
    }
    // Currently /zh/... → switch to clean URL (English)
    return pathname.replace(/^\/zh/, "") || "/";
  }

  return (
    <Link
      href={getTargetPath()}
      className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-text-muted hover:text-text-primary"
    >
      {locale === "en" ? "中文" : "EN"}
    </Link>
  );
}
