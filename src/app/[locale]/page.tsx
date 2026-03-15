import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkillGrid from "@/components/SkillGrid";
import RetroComputer from "@/components/RetroComputer";
import CrtTerminal from "@/components/CrtTerminal";
import { JsonLd } from "@/components/JsonLd";
import { getAllSkills } from "@/lib/skills";
import { supabase } from "@/lib/supabase";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const { skills } = await getAllSkills();

  // Batch-fetch author usernames for skills with user_id
  const userIds = [...new Set(skills.map((s) => s.userId).filter(Boolean))] as string[];
  let authorMap: Record<string, string> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", userIds);
    if (profiles) {
      authorMap = Object.fromEntries(profiles.map((p) => [p.id, p.username]));
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SkillHubs",
    url: "https://skillhubs.cc",
    description: dict.metadata.home.description,
    inLanguage: ["en", "zh-CN"],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://skillhubs.cc/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AI Agent Skills",
    description: "Curated collection of AI skills for every industry and role",
    numberOfItems: skills.length,
    itemListElement: skills.slice(0, 50).map((skill, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://skillhubs.cc/skill/${skill.id}`,
      name: skill.name,
    })),
  };

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={itemListSchema} />
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
                <a
                  href="https://github.com/io-oi-ai/Skillhub"
                  className="inline-flex items-center rounded-lg border border-border px-6 py-3.5 text-[0.9375rem] font-medium text-text-primary transition-colors hover:border-text-muted"
                >
                  {dict.hero.ctaCli}
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

        {/* CLI */}
        <section id="cli" className="border-t border-border px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-32">
          <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            {/* Left: text + CTA */}
            <div className="pt-4">
              <h2 className="font-serif text-[2.5rem] font-normal leading-[1.1] tracking-[-0.02em] text-text-primary sm:text-[3.5rem]">
                {dict.cli.title}
              </h2>

              <p className="mt-8 max-w-[460px] text-[1.125rem] leading-[1.7] text-text-secondary">
                {dict.cli.description}
              </p>

              <div className="mt-10 flex items-center gap-6">
                <a
                  href="https://github.com/io-oi-ai/Skillhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-lg bg-accent px-7 py-4 text-[0.9375rem] font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  {dict.cli.viewOnGithub}
                </a>
                <span className="font-mono text-[0.9375rem] tracking-wide text-text-muted">
                  npm · CLI
                </span>
              </div>

              {/* CLI feature grid — mirrors Hero's feature grid */}
              <div className="mt-16 grid grid-cols-2 gap-x-20 gap-y-8 border-t border-border pt-10">
                <div>
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-muted">
                    Commands
                  </p>
                  <p className="mt-1.5 font-mono text-[0.875rem] text-text-primary">
                    list · search · create · update
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-muted">
                    Output
                  </p>
                  <p className="mt-1.5 font-mono text-[0.875rem] text-text-primary">
                    Table · JSON · Markdown
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-muted">
                    Runtime
                  </p>
                  <p className="mt-1.5 font-mono text-[0.875rem] text-text-primary">
                    Node.js 18+
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-text-muted">
                    License
                  </p>
                  <p className="mt-1.5 font-mono text-[0.875rem] text-text-primary">
                    MIT
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Terminal window */}
            <div className="hidden lg:flex lg:items-center lg:justify-center">
              <CrtTerminal />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SkillGrid skills={skills} locale={locale} dict={dict} authorMap={authorMap} />
          </div>
        </section>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
