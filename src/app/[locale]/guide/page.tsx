import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
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
  return { title: `${dict.guide.title} | SkillHubs` };
}

export default async function GuidePage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const g = dict.guide;
  const s = g.sections;

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Hero */}
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {g.title}
          </h1>
          <p className="mt-3 text-lg text-text-secondary">{g.subtitle}</p>

          {/* What is a Skill */}
          <section className="mt-12">
            <h2 className="text-xl font-bold text-text-primary">
              {s.whatIsSkill.title}
            </h2>
            <p className="mt-3 leading-relaxed text-text-secondary">
              {s.whatIsSkill.description}
            </p>
          </section>

          {/* Download & Use */}
          <section className="mt-12">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-text-primary">
                {s.download.title}
              </h2>
              <span className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent">
                {s.download.badge}
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {s.download.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-xl border border-border bg-bg-card p-5"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CLI */}
          <section className="mt-12">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-text-primary">
                {s.cli.title}
              </h2>
              <span className="rounded-full bg-purple-500/10 px-3 py-0.5 text-xs font-semibold text-purple-400">
                {s.cli.badge}
              </span>
            </div>
            <p className="mt-3 text-text-secondary">{s.cli.description}</p>
            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-bg-card">
              <div className="border-b border-border px-4 py-2 text-xs text-text-secondary">
                Terminal
              </div>
              <div className="p-4 font-mono text-sm">
                <p className="text-text-secondary">
                  <span className="text-accent">$</span>{" "}
                  <span className="text-text-primary">
                    {s.cli.installCmd}
                  </span>
                </p>
                <div className="mt-4 space-y-2">
                  {s.cli.commands.map((c, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-text-secondary">
                        <span className="text-accent">$</span>{" "}
                        <span className="text-text-primary">{c.cmd}</span>
                      </span>
                      <span className="text-text-secondary">
                        {"# "}
                        {c.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Create */}
          <section className="mt-12">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-text-primary">
                {s.create.title}
              </h2>
              <span className="rounded-full bg-green-500/10 px-3 py-0.5 text-xs font-semibold text-green-400">
                {s.create.badge}
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {s.create.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-xl border border-border bg-bg-card p-5"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-500/10 text-sm font-bold text-green-400">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="mt-6 rounded-xl border border-border bg-bg-card p-6">
              <h3 className="mb-4 font-semibold text-text-primary">
                {s.create.tips.title}
              </h3>
              <ul className="space-y-2">
                {s.create.tips.items.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-center">
              <Link
                href={`/${locale}/submit`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
              >
                {dict.nav.submit} →
              </Link>
            </div>
          </section>

          {/* Points */}
          <section className="mt-12">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-text-primary">
                {s.points.title}
              </h2>
              <span className="rounded-full bg-yellow-500/10 px-3 py-0.5 text-xs font-semibold text-yellow-400">
                {s.points.badge}
              </span>
            </div>
            <p className="mt-3 text-text-secondary">{s.points.description}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Points rules */}
              <div className="rounded-xl border border-border bg-bg-card p-5">
                <h3 className="mb-4 font-semibold text-text-primary">
                  {dict.points.howToEarn}
                </h3>
                <div className="space-y-3">
                  {s.points.rules.map((rule, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-text-secondary">{rule.action}</span>
                      <span className="font-semibold text-accent">
                        {rule.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Levels */}
              <div className="rounded-xl border border-border bg-bg-card p-5">
                <h3 className="mb-4 font-semibold text-text-primary">
                  {dict.points.level}
                </h3>
                <div className="space-y-3">
                  {s.points.levels.map((level, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            i === 0
                              ? "bg-gray-400"
                              : i === 1
                                ? "bg-blue-400"
                                : i === 2
                                  ? "bg-green-400"
                                  : i === 3
                                    ? "bg-purple-400"
                                    : "bg-yellow-400"
                          }`}
                        />
                        <span className="text-text-primary">{level.name}</span>
                      </div>
                      <span className="text-text-secondary">
                        {level.requirement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link
                href={`/${locale}/leaderboard`}
                className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent/80"
              >
                {dict.points.leaderboard} →
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
