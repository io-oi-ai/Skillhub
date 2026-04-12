import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { i18n } from "./i18n/config";
import { checkRateLimit, RATE_LIMITS } from "./lib/rate-limit";

const SEVEN_DAYS = 60 * 60 * 24 * 7; // 604800 seconds

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co; font-src 'self';"
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}

async function updateSupabaseSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              maxAge: SEVEN_DAYS,
              path: "/",
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
            });
          });
        },
      },
    }
  );
  try {
    await supabase.auth.getUser();
  } catch {
    // Supabase auth fetch failed (network issue) — continue without session refresh
  }
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

  // Webhook endpoints: skip rate limiting and session refresh (they have their own auth)
  if (pathname.startsWith("/api/webhook/")) {
    return addSecurityHeaders(NextResponse.next());
  }

  // For API routes: rate limiting + session refresh + security headers
  if (pathname.startsWith("/api/") || pathname.startsWith("/auth/")) {
    const ip = getClientIP(request);
    const method = request.method;

    // Determine rate limit tier
    const isWrite = method === "POST" || method === "PUT" || method === "DELETE";
    const isLike = pathname.includes("/api/likes/");
    const isDownload = pathname.includes("/download");

    const tier = isLike ? "like" : isDownload ? "download" : isWrite ? "write" : "read";
    const config = isLike
      ? RATE_LIMITS.like
      : isDownload
        ? RATE_LIMITS.download
        : isWrite
          ? RATE_LIMITS.write
          : RATE_LIMITS.read;

    const rateLimitKey = `${ip}:${tier}`;
    const result = checkRateLimit(rateLimitKey, config);

    if (!result.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(config.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(config.limit));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));

    return addSecurityHeaders(await updateSupabaseSession(request, response));
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
    return addSecurityHeaders(await updateSupabaseSession(request, nonDefaultResponse));
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
  return addSecurityHeaders(await updateSupabaseSession(request, rewriteResponse));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
