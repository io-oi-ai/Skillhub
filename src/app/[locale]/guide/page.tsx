import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: `${dict.guide.title} | SkillHub` };
}

export default async function GuidePage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const findings = dict.guide.findings;
  const findingCards = [
    { key: "structure", ...findings.structure },
    { key: "style", ...findings.style },
    { key: "curation", ...findings.curation },
    { key: "domain", ...findings.domain },
    { key: "balance", ...findings.balance },
  ];

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Title */}
          <h1 className="mb-2 text-2xl font-bold text-text-primary">
            {dict.guide.title}
          </h1>
          <p className="mb-4 text-text-secondary">
            {dict.guide.subtitle}
          </p>
          <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            {dict.guide.researchBadge}
          </span>

          {/* Research Findings */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {findingCards.map((card) => (
              <div
                key={card.key}
                className="rounded-xl border border-border bg-bg-card p-5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text-primary">
                    {card.title}
                  </h3>
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
                    {card.stat}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {card.body}
                </p>
              </div>
            ))}
          </div>

          {/* Practical Tips */}
          <div className="mt-8 rounded-xl border border-border bg-bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-text-primary">
              {dict.guide.tips.title}
            </h2>
            <ol className="space-y-3">
              {dict.guide.tips.items.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-text-secondary">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
