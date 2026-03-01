import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubmitForm from "@/components/SubmitForm";
import { i18n, isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

interface Props {
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
    title: dict.metadata.submit.title,
    description: dict.metadata.submit.description,
    alternates: {
      canonical: `${baseUrl}/submit`,
      languages: {
        en: `${baseUrl}/submit`,
        "zh-CN": `${baseUrl}/zh/submit`,
      },
    },
  };
}

export default async function SubmitPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-text-primary">
              {dict.submitPage.title}
            </h1>
            <p className="text-text-secondary">
              {dict.submitPage.description}
            </p>
          </div>
          <SubmitForm dict={dict} />
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
