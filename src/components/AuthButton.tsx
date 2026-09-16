"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getLevel } from "@/lib/points";
import { isProProfile } from "@/lib/billing";
import { handleTestModeActivationClick, isPancakeTestModeEnabled } from "@/lib/test-mode";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

interface AuthButtonProps {
  locale: Locale;
  dict: Dictionary;
}

const TEST_ACTIVATION_CLICKS = 5;

export default function AuthButton({ locale, dict }: AuthButtonProps) {
  const { user, profile, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [testModeClicks, setTestModeClicks] = useState(0);
  const [testModeEnabled, setTestModeEnabled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const prefix = locale === "en" ? "" : `/${locale}`;

  useEffect(() => {
    setTestModeEnabled(isPancakeTestModeEnabled());
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-border" />
    );
  }

  if (!user) {
    return (
      <Link
        href={`${prefix}/login`}
        className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-accent hover:text-white"
      >
        {dict.auth.signIn}
      </Link>
    );
  }

  const avatarUrl =
    profile?.avatar_url || user.user_metadata?.avatar_url || null;
  const displayName =
    profile?.display_name ||
    user.user_metadata?.full_name ||
    user.email ||
    "U";
  const hasPro = isProProfile(profile);
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border bg-bg-card transition-colors hover:border-text-muted"
        aria-label="User menu"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-sm font-medium text-text-primary">
            {initial}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-lg border border-border bg-bg-card shadow-lg">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium text-text-primary">
              {displayName}
            </p>
            {user.email && (
              <p className="truncate text-xs text-text-muted">{user.email}</p>
            )}
            {profile && (
              <p className="mt-1 text-xs text-accent">
                ⚡ {profile.points} {dict.points.toast.pts} · {dict.points.levels[getLevel(profile.points).name.en.toLowerCase() as keyof typeof dict.points.levels]}
              </p>
            )}
            {hasPro && (
              <p className="mt-1 text-xs font-medium text-amber-600">PRO</p>
            )}
          </div>
          <Link
            href={`${prefix}/pricing`}
            onClick={() => setOpen(false)}
            className="block w-full px-4 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-bg-primary hover:text-text-primary"
          >
            {dict.pricing.nav}
          </Link>

          {/* Hidden test mode activation button */}
          <button
            onClick={() => {
              const result = handleTestModeActivationClick();
              setTestModeClicks(TEST_ACTIVATION_CLICKS - result.clicksRemaining);
              setTestModeEnabled(isPancakeTestModeEnabled());
              if (result.activated) {
                console.log('%c✅ Test Mode Activated!', 'color: #10b981; font-size: 14px; font-weight: bold');
              }
            }}
            className={`w-full px-4 py-2 text-left text-xs transition-colors ${
              testModeEnabled
                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'text-text-muted hover:bg-bg-primary hover:text-text-secondary'
            }`}
            title={testModeEnabled ? '🧪 Test Mode Active' : '🧪 Click 5 times to enable Test Mode'}
          >
            {testModeEnabled ? '🧪 Test Mode: ACTIVE' : `🧪 Pancake Test Mode (${testModeClicks}/5)`}
          </button>

          <button
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-bg-primary hover:text-text-primary"
          >
            {dict.auth.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
