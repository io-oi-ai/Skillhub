import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { i18n, isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import Script from "next/script";
import { AuthProvider } from "@/components/AuthProvider";
import { PostHogProvider } from "@/components/PostHogProvider";
import { JsonLd } from "@/components/JsonLd";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const baseUrl = "https://skillhubs.cc";

  return {
    title: {
      default: dict.metadata.home.title,
      template: "%s | SkillHubs",
    },
    description: dict.metadata.home.description,
    keywords: dict.metadata.home.keywords as unknown as string[],
    icons: {
      icon: { url: "/favicon.svg", type: "image/svg+xml" },
      apple: "/apple-icon.png",
    },
    openGraph: {
      title: dict.metadata.home.ogTitle,
      description: dict.metadata.home.ogDescription,
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      siteName: "SkillHubs",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "SkillHubs — Discover the Best AI Agent Skills",
        },
      ],
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        en: baseUrl,
        "zh-CN": `${baseUrl}/zh`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const gaId = process.env.NEXT_PUBLIC_GA_ID; // GA4 Measurement ID (G-XXXX)
  const gscToken = process.env.NEXT_PUBLIC_GSC_VERIFICATION; // Search Console 验证 token

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"}>
      <head>
        {/* Google Search Console 域名/前缀验证(meta 标签法),token 在 GSC 后台获取 */}
        {gscToken ? (
          <meta name="google-site-verification" content={gscToken} />
        ) : null}
      </head>
      <body className="min-h-screen antialiased">
        {/* GA4 (gtag.js) —— 有 Measurement ID 才加载 */}
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        ) : null}
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "SkillHubs",
          url: "https://skillhubs.cc",
          logo: "https://skillhubs.cc/og-image.png",
          description: "A curated marketplace of AI agent skills and workflows for every industry and role.",
          foundingDate: "2025",
          sameAs: [
            "https://github.com/io-oi-ai/Skillhub",
            "https://linkedin.com/company/helloskillhubs",
          ],
        }} />
        <PostHogProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">{children}</div>
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
