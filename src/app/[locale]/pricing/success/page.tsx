import { getDictionary } from "@/i18n/get-dictionary";
import { isValidLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; skillId?: string }>;
}

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const { type } = await searchParams;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const prefix = locale === "en" ? "" : `/${locale}`;
  const t = dict.paymentSuccess;

  const isSubscription = type === "subscription";

  return (
    <>
      <Header locale={locale as Locale} dict={dict} />
      <main className="flex flex-1 items-center justify-center bg-bg-primary px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <svg
              className="h-8 w-8 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mb-4 font-serif text-3xl text-text-primary">
            {t.title}
          </h1>
          <p className="mb-8 text-text-secondary">
            {isSubscription
              ? t.subscriptionDescription
              : t.purchaseDescription}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`${prefix}/`}
              className="rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              {t.cta}
            </Link>
            <Link
              href={`${prefix}/`}
              className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-bg-card"
            >
              {t.browsePremium}
            </Link>
          </div>
        </div>
      </main>
      <Footer locale={locale as Locale} dict={dict} />
    </>
  );
}
