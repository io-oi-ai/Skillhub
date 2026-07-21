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
        ja: `${baseUrl}/ja/privacy`,
      },
    },
  };
}

interface Section {
  title: string;
  paragraphs?: string[];
  list?: string[];
  afterList?: string[];
}

const SECTIONS: Section[] = [
  {
    title: "1. Introduction",
    paragraphs: [
      'SkillHubs ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and share your personal information when you use SkillHubs (skillhubs.cc) — including the web interface and CLI tool — and the rights available to you.',
      "By using the Service, you agree to this Policy. We may update this Policy periodically and will notify you of material changes via email or in-product notice.",
    ],
  },
  {
    title: "2. Personal Information We Collect",
    paragraphs: ["Information you provide directly:"],
    list: [
      "Account information: email address, username, display name, and optional profile fields (bio, website).",
      "Payment information: transaction amount, payment status, and subscription plan. Full card numbers are never stored by us — card data is processed by our payment processor (see Section 5).",
      "Content: skills you publish and any communications or feedback you send us.",
    ],
    afterList: [
      "Information we collect automatically: IP address, browser type, operating system, and usage data such as skills you create, download, or like, pages visited, points and leaderboard activity, request timestamps, and error logs.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    paragraphs: ["We use your information for the following purposes, each with a corresponding legal basis:"],
    list: [
      "Service delivery and maintenance, including authenticating your account and displaying your public profile — contract performance.",
      "Billing, subscription management, and payment processing — contract performance.",
      "Customer support — contract performance / legitimate interests.",
      "Service notifications (billing, security, policy changes) — legitimate interests.",
      "Tracking points and leaderboard rankings — contract performance.",
      "Security and fraud prevention — legitimate interests.",
      "Product analytics and improvement — legitimate interests.",
      "Legal compliance — legal obligation.",
    ],
    afterList: [
      "We may aggregate or anonymize data for statistical purposes. Such data cannot be linked to any individual.",
    ],
  },
  {
    title: "4. Cookies & Tracking Technologies",
    paragraphs: [
      "We use strictly necessary cookies for authentication session management and functional cookies for locale preferences. Strictly necessary cookies cannot be disabled; you can manage other preferences via your browser settings. We do not use third-party advertising or marketing cookies.",
    ],
  },
  {
    title: "5. Sharing & Disclosure",
    paragraphs: [
      "We do not sell your personal information, including as defined under applicable laws such as the CCPA. We share your information only in the following circumstances:",
    ],
    list: [
      "Service providers: Supabase (authentication and data storage), Vercel (hosting), and our PCI-DSS certified payment processor, Waffo Pancake, which exclusively processes payment card data — card data is never stored on our servers. These providers are bound by their own privacy policies and confidentiality obligations.",
      "Legal requirements: where required by law, court order, or a lawful regulatory request.",
      "Business transactions: in a merger, acquisition, or similar event, with advance notice and continued protections.",
      "With your consent: for any other purpose, with your explicit prior consent.",
    ],
  },
  {
    title: "6. Data Security",
    list: [
      "Encryption in transit (TLS/HTTPS) for all connections.",
      "Encryption at rest for stored data via Supabase infrastructure.",
      "Rate limiting and security headers to protect the platform.",
      "Access controls following the least-privilege principle.",
    ],
    afterList: [
      "In the event of a security incident affecting your rights, we will notify you and the relevant authorities within 72 hours of discovery, as required by law. Please keep your credentials secure and do not share them.",
    ],
  },
  {
    title: "7. Data Retention",
    list: [
      "Account information: retained while your account is active, then deleted or anonymized within 90 days of account deletion.",
      "Transaction records: retained as required by tax and accounting regulations, typically 7 years.",
      "Support records: retained for 2 years, then securely deleted.",
      "Security and error logs: retained for 12 months, then securely deleted.",
    ],
  },
  {
    title: "8. Your Data Rights",
    paragraphs: [
      "You have the following rights over your personal data. To exercise any of them, contact us via the channels in Section 13; we respond within 30 calendar days.",
    ],
    list: [
      "Right to be informed — know what data we collect and how we use it.",
      "Right of access — obtain a copy of your personal information.",
      "Right to rectification — correct inaccurate or incomplete data.",
      "Right to erasure — request deletion of your account and associated data.",
      "Right to restrict processing — temporarily suspend processing in certain cases.",
      "Right to data portability — receive your data in a machine-readable format.",
      "Right to object — object to processing based on legitimate interests.",
      "Right to withdraw consent — for any consent-based processing.",
    ],
    afterList: ["You may also lodge a complaint with your local data protection authority."],
  },
  {
    title: "9. International Data Transfers",
    paragraphs: [
      "Our infrastructure providers (Supabase, Vercel, Waffo Pancake) may store or process data in regions including the United States. For international transfers, we rely on data processing agreements incorporating appropriate safeguards such as EU Standard Contractual Clauses (SCCs).",
    ],
  },
  {
    title: "10. Children's Privacy",
    paragraphs: [
      "The Service is intended for users aged 16 and above. We do not knowingly collect information from children below that age. If you believe your child has provided information, contact us immediately and we will promptly delete it.",
    ],
  },
  {
    title: "11. Open Source Content",
    paragraphs: [
      "Skills submitted to SkillHubs are published under the MIT License (unless otherwise designated for paid skills) and are publicly accessible, along with your public profile (username, display name, points). By submitting a skill, you agree to make its content publicly available. Do not include personal or confidential information in published skills.",
    ],
  },
  {
    title: "12. Policy Changes",
    paragraphs: [
      "For material changes, we will provide at least 15 days' advance notice via platform announcement or your registered email, and update the “Last updated” date at the top of this page. Continued use after the effective date constitutes acceptance.",
    ],
  },
];

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
          <p className="mt-2 text-sm text-text-muted">Last updated: July 14, 2026</p>

          <div className="mt-8 space-y-8 text-text-secondary">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-text-primary">{section.title}</h2>
                {section.paragraphs?.map((p) => (
                  <p key={p} className="mt-3 leading-relaxed">{p}</p>
                ))}
                {section.list && (
                  <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.afterList?.map((p) => (
                  <p key={p} className="mt-3 leading-relaxed">{p}</p>
                ))}
              </section>
            ))}

            <section>
              <h2 className="text-xl font-semibold text-text-primary">13. Contact Us</h2>
              <p className="mt-3 leading-relaxed">For privacy-related inquiries or to exercise your data rights:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                <li>
                  Email:{" "}
                  <a href="mailto:support@skillhubs.cc" className="text-accent hover:underline">
                    support@skillhubs.cc
                  </a>
                </li>
                <li>
                  GitHub:{" "}
                  <a href="https://github.com/io-oi-ai/Skillhub/issues" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                    github.com/io-oi-ai/Skillhub
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
