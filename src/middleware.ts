import { NextRequest, NextResponse } from "next/server";
import { i18n } from "./i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already has a locale prefix
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // If it starts with /en (default locale), redirect to clean URL
    if (
      pathname.startsWith(`/${i18n.defaultLocale}/`) ||
      pathname === `/${i18n.defaultLocale}`
    ) {
      const cleanPath = pathname.replace(`/${i18n.defaultLocale}`, "") || "/";
      const url = request.nextUrl.clone();
      url.pathname = cleanPath;
      return NextResponse.redirect(url);
    }
    // Non-default locale (e.g., /zh/...) — let it through
    return NextResponse.next();
  }

  // No locale prefix — detect preferred locale for first visit or rewrite to default
  const acceptLanguage = request.headers.get("accept-language") || "";
  const prefersChinese =
    acceptLanguage.includes("zh") &&
    !acceptLanguage.match(/en[^;]*;q=\d\.\d.*zh/) &&
    acceptLanguage.indexOf("zh") < acceptLanguage.indexOf("en");

  // Check if user has a locale cookie preference
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

  let locale: string = i18n.defaultLocale;
  if (cookieLocale && i18n.locales.includes(cookieLocale as (typeof i18n.locales)[number])) {
    locale = cookieLocale;
  } else if (prefersChinese) {
    locale = "zh";
  }

  if (locale !== i18n.defaultLocale) {
    // Redirect to the locale-prefixed URL
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // Default locale — rewrite internally to /en/... without changing the URL
  const url = request.nextUrl.clone();
  url.pathname = `/${i18n.defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
