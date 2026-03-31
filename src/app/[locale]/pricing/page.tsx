import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingPlans from "@/components/PricingPlans";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: `${dict.pricing.title} | SkillHubs` };
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const p = dict.pricing;

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      <Header locale={locale} dict={dict} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold text-text-primary">{p.title}</h1>
          <p className="mt-3 text-lg text-text-secondary">{p.subtitle}</p>
        </div>

        <PricingPlans locale={locale} dict={dict} />

        <div className="mt-16">
          <h2 className="text-center font-serif text-2xl font-bold text-text-primary">{p.faq.title}</h2>
          <div className="mt-8 space-y-4">
            {p.faq.items.map((item: { q: string; a: string }) => (
              <div key={item.q} className="rounded-lg border border-border bg-bg-card p-4">
                <h4 className="font-medium text-text-primary">{item.q}</h4>
                <p className="mt-1 text-sm text-text-secondary">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
