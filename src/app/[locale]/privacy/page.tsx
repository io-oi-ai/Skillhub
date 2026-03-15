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
    title: "Privacy Policy",
    description: "SkillHubs privacy policy — how we collect, use, and protect your data.",
    alternates: {
      canonical: `${baseUrl}/privacy`,
      languages: {
        en: `${baseUrl}/privacy`,
        "zh-CN": `${baseUrl}/zh/privacy`,
      },
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-invert mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Privacy Policy</h1>
          <p className="mt-2 text-sm text-text-muted">Last updated: March 15, 2026</p>

          <div className="mt-8 space-y-8 text-text-secondary">
            <section>
              <h2 className="text-xl font-semibold text-text-primary">1. Information We Collect</h2>
              <p className="mt-3 leading-relaxed">When you create an account on SkillHubs, we collect your email address and profile information (username, display name, optional bio and website). When you use the platform, we collect usage data such as skills you create, download, or like.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">2. How We Use Your Information</h2>
              <p className="mt-3 leading-relaxed">We use your information to provide and improve the SkillHubs platform, including authenticating your account, displaying your public profile, tracking points and leaderboard rankings, and communicating service updates.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">3. Data Storage & Security</h2>
              <p className="mt-3 leading-relaxed">Your data is stored securely using Supabase infrastructure with encryption at rest and in transit. We use HTTPS for all connections and implement rate limiting and security headers to protect the platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">4. Third-Party Services</h2>
              <p className="mt-3 leading-relaxed">We use Supabase for authentication and data storage, and Vercel for hosting. These services have their own privacy policies governing data they process on our behalf.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">5. Your Rights</h2>
              <p className="mt-3 leading-relaxed">You may request access to, correction of, or deletion of your personal data at any time by contacting us through our GitHub repository. You can delete your account and associated data upon request.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">6. Cookies</h2>
              <p className="mt-3 leading-relaxed">We use essential cookies for authentication session management and locale preferences. We do not use tracking cookies or third-party advertising cookies.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">7. Open Source Content</h2>
              <p className="mt-3 leading-relaxed">Skills submitted to SkillHubs are published under the MIT License and are publicly accessible. By submitting a skill, you agree to make its content publicly available.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary">8. Contact</h2>
              <p className="mt-3 leading-relaxed">For privacy-related inquiries, please open an issue at{" "}
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
