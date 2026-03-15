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
  const baseUrl = "https://skillhubs.cc";
  return {
    title: "Terms of Service",
    description: "SkillHubs terms of service — rules and guidelines for using the platform.",
    alternates: {
      canonical: `${baseUrl}/terms`,
      languages: {
        en: `${baseUrl}/terms`,
        "zh-CN": `${baseUrl}/zh/terms`,
      },
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-invert mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Terms of Service</h1>
          <p className="mt-2 text-sm text-text-muted">Last updated: March 15, 2026</p>

          <div className="mt-8 space-y-8 text-text-secondary">
            <section>
              <h2 className="text-xl font-semibold text-text-primary">1. Acceptance of Terms</h2>
              <p className="mt-3 leading-relaxed">By accessing or using SkillHubs (skillhubs.cc), you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">2. Description of Service</h2>
              <p className="mt-3 leading-relaxed">SkillHubs is a free, open-source platform for discovering, sharing, and managing AI agent skills. The platform includes a web interface, CLI tool, and community features including points and leaderboards.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">3. User Accounts</h2>
              <p className="mt-3 leading-relaxed">You are responsible for maintaining the security of your account. You must provide accurate information when creating an account. We reserve the right to suspend accounts that violate these terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">4. Content & Licensing</h2>
              <p className="mt-3 leading-relaxed">Skills submitted to SkillHubs are published under the MIT License. By submitting content, you represent that you have the right to license it under MIT and grant SkillHubs permission to host and distribute it. You retain ownership of your original content.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">5. Acceptable Use</h2>
              <p className="mt-3 leading-relaxed">You agree not to submit content that is illegal, harmful, or infringes on the rights of others. You agree not to abuse the platform through automated mass actions, spam, or attempts to manipulate the points system.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">6. Disclaimer of Warranties</h2>
              <p className="mt-3 leading-relaxed">SkillHubs is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of any skills or content on the platform. Use of AI skills is at your own risk.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">7. Limitation of Liability</h2>
              <p className="mt-3 leading-relaxed">SkillHubs shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or any skills obtained through it.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">8. Changes to Terms</h2>
              <p className="mt-3 leading-relaxed">We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">9. Contact</h2>
              <p className="mt-3 leading-relaxed">For questions about these terms, please open an issue at{" "}
                <a href="https://github.com/io-oi-ai/Skillhub/issues" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                  github.com/io-oi-ai/Skillhub
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
