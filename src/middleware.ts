import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { i18n } from "./i18n/config";

async function updateSupabaseSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
  await supabase.auth.getUser();
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // For API and auth routes, only refresh Supabase session
  if (pathname.startsWith("/api/") || pathname.startsWith("/auth/")) {
    const response = NextResponse.next();
    return updateSupabaseSession(request, response);
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
    // Non-default locale (e.g., /zh/...) — refresh session and let it through
    const nonDefaultResponse = NextResponse.next();
    return updateSupabaseSession(request, nonDefaultResponse);
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
    const redirectResponse = NextResponse.redirect(url);
    return updateSupabaseSession(request, redirectResponse);
  }

  // Default locale — rewrite internally to /en/... without changing the URL
  const url = request.nextUrl.clone();
  url.pathname = `/${i18n.defaultLocale}${pathname}`;
  const rewriteResponse = NextResponse.rewrite(url);
  return updateSupabaseSession(request, rewriteResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
