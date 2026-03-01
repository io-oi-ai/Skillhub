"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { i18n, localeNames, type Locale } from "@/i18n/config";

interface LanguageSwitcherProps {
  locale: Locale;
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function getPathForLocale(target: Locale) {
    // Strip any existing locale prefix (/en, /zh, etc.) from the pathname
    const localePattern = new RegExp(`^/(${i18n.locales.join("|")})(?=/|$)`);
    const cleanPath = pathname.replace(localePattern, "") || "/";
    if (target === i18n.defaultLocale) return cleanPath;
    return `/${target}${cleanPath}`;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-text-muted hover:text-text-primary"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
        {localeNames[locale]}
        <svg
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[120px] overflow-hidden rounded-lg border border-border bg-bg-card shadow-lg">
          {i18n.locales.map((l) => (
            <Link
              key={l}
              href={getPathForLocale(l)}
              onClick={() => {
                document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000`;
                setOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-bg-primary ${
                l === locale
                  ? "font-medium text-accent"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {l === locale && (
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {l !== locale && <span className="inline-block w-3.5" />}
              {localeNames[l]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
