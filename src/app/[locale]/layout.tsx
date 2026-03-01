import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { i18n, isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

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
  const baseUrl = "https://skillhub.dev";

  return {
    title: {
      default: dict.metadata.home.title,
      template: "%s | SkillHub",
    },
    description: dict.metadata.home.description,
    keywords: dict.metadata.home.keywords as unknown as string[],
    openGraph: {
      title: dict.metadata.home.ogTitle,
      description: dict.metadata.home.ogDescription,
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
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

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"}>
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
