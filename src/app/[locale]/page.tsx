import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkillGrid from "@/components/SkillGrid";
import RetroComputer from "@/components/RetroComputer";
import { getAllSkills } from "@/lib/skills";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const skills = getAllSkills();

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-32">
          <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            {/* Left: Text */}
            <div className="pt-4">
              <h1 className="font-serif text-[3.5rem] font-normal leading-[1.1] tracking-[-0.02em] text-text-primary sm:text-[4.5rem] lg:text-[5.5rem]">
                {dict.hero.heading1}
                <br />
                <em>{dict.hero.heading2}</em>
              </h1>

              <p className="mt-8 max-w-[460px] text-[1.125rem] leading-[1.7] text-text-secondary">
                {dict.hero.description}
              </p>

              <div className="mt-10 flex items-center gap-6">
                <a
                  href="#skills"
                  className="inline-flex items-center rounded-lg bg-accent px-7 py-4 text-[0.9375rem] font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  {dict.hero.cta}
                </a>
                <span className="font-mono text-[0.9375rem] tracking-wide text-text-muted">
                  {dict.hero.badge}
                </span>
              </div>

              {/* Feature Grid */}
              <div className="mt-16 grid grid-cols-2 gap-x-20 gap-y-8 border-t border-border pt-10">
                <div>
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-muted">
                    {dict.features.platforms}
                  </p>
                  <p className="mt-1.5 font-mono text-[0.875rem] text-text-primary">
                    {dict.features.platformsValue}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-muted">
                    {dict.features.community}
                  </p>
                  <p className="mt-1.5 font-mono text-[0.875rem] text-text-primary">
                    {dict.features.communityValue}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-muted">
                    {dict.features.install}
                  </p>
                  <p className="mt-1.5 font-mono text-[0.875rem] text-text-primary">
                    {dict.features.installValue}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-muted">
                    {dict.features.coverage}
                  </p>
                  <p className="mt-1.5 font-mono text-[0.875rem] text-text-primary">
                    {dict.features.coverageValue}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Retro Computer Illustration */}
            <div className="hidden lg:flex lg:items-center lg:justify-center" style={{ minHeight: 600 }}>
              <RetroComputer snippets={dict.retroComputer.snippets} />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SkillGrid skills={skills} locale={locale} dict={dict} />
          </div>
        </section>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
