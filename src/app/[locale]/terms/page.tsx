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
        ja: `${baseUrl}/ja/terms`,
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
    title: "1. Introduction & Acceptance of Terms",
    paragraphs: [
      'Welcome to SkillHubs ("SkillHubs" / "we" / "us" / "our"). These Terms of Service ("Terms") govern your access to and use of SkillHubs — a platform for discovering, sharing, and managing AI agent skills — available at https://skillhubs.cc (the "Service"), including the web interface, CLI tool, and community features.',
      "By creating an account, subscribing to any plan, purchasing a paid skill, or otherwise using the Service, you confirm that you: (a) are at least 18 years of age; (b) have read, understood, and agree to be bound by these Terms; (c) agree to our Privacy Policy; and (d) are authorized to enter into this agreement on behalf of yourself or any organization you represent.",
      "If you do not agree to these Terms, you may not use the Service. Continued use after any update constitutes acceptance of the revised Terms.",
    ],
  },
  {
    title: "2. Service Description",
    paragraphs: [
      "SkillHubs provides a platform that enables users to discover, publish, download, and manage AI agent skills, including community features such as points and leaderboards. The Service is a digital software-as-a-service (SaaS) product delivered via the internet.",
      "The Service is a digital, intangible product. Upon confirmed payment, access to paid features is granted immediately. Due to the immediate digital delivery, specific limitations apply to refunds as described in Section 7.",
      "Skills hosted on SkillHubs are designed to be used with third-party AI agents and AI model providers. The behavior and output of those AI systems are outside our control, and Service usefulness may be affected by the operational status of such providers.",
    ],
  },
  {
    title: "3. Account Registration & Eligibility",
    paragraphs: [
      "To use certain features of the Service, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.",
    ],
    list: [
      "Notify us immediately of any unauthorized use of your account (see Section 16 for contact channels).",
      "Do not share your credentials with any third party.",
      "Keep your billing email address up to date.",
    ],
    afterList: [
      "If you register on behalf of a company or organization, you represent that you have authority to bind that entity to these Terms.",
    ],
  },
  {
    title: "4. Plans & Paid Skills",
    paragraphs: [
      "We offer a free tier, Pro subscription plans (monthly and yearly), and individually priced paid skills sold as one-time purchases. For current plan details and pricing, please visit https://skillhubs.cc/pricing.",
      "We reserve the right to modify plan features or introduce new plans at any time. Price changes for active subscriptions are governed by Section 5.1 and Section 15.",
    ],
  },
  {
    title: "5. Billing & Payment",
    paragraphs: [
      "5.1 Recurring Billing Authorization. By providing your payment method and subscribing to a paid plan, you expressly authorize SkillHubs to charge your payment method on a recurring basis for the applicable subscription fee. This recurring authorization remains in effect until you cancel in accordance with Section 6. Your subscription renews automatically at the end of each billing period unless cancelled. We will send you advance notice before the renewal of any annual subscription.",
      "5.2 Free Trial. Where a free trial is offered, you will not be charged until the trial ends. We will remind you before your trial converts to a paid subscription. You can cancel at any time during the trial to avoid being charged.",
      "5.3 One-Time Purchases. Each paid skill purchase is a one-time transaction. By completing a purchase, you authorize SkillHubs to charge your payment method for the amount displayed at checkout.",
      "5.4 Payment Processing. All payments are processed by our PCI-DSS certified payment processor, Waffo Pancake. We do not store your card details on our servers.",
      "5.5 Taxes. Prices are exclusive of applicable taxes (including VAT, GST, sales tax, or similar) unless otherwise stated. Where required by applicable law, such taxes will be collected at checkout.",
    ],
  },
  {
    title: "6. Cancellation Policy",
    paragraphs: [
      "6.1 How to Cancel. You may cancel your subscription at any time through Account Settings → Subscription → Cancel Subscription, or by contacting us through the channels listed in Section 16. A confirmation will be sent to your registered email.",
      "6.2 Effect of Cancellation. Your subscription remains active until the end of the current billing period, and you will not be charged for subsequent billing periods. Paid skills purchased separately are not affected by subscription cancellation. Account data is retained for 90 days after account deletion, then deleted per our Privacy Policy.",
    ],
  },
  {
    title: "7. Refund Policy",
    paragraphs: [
      "7.1 General Policy. Due to the immediate and intangible nature of our digital services, fees are generally non-refundable, except as expressly stated below.",
      "7.2 Eligible Refunds:",
    ],
    list: [
      "New subscriber 7-day guarantee: a full refund is available to first-time subscribers within 7 days of the initial charge, provided usage has not been substantial.",
      "Paid skills: a full refund may be requested within 7 days of purchase if the skill has not been downloaded.",
      "Duplicate charge: a full refund for any billing error resulting in a duplicate charge.",
      "Verified service outage (≥72 hours): a pro-rated credit or refund for extended outages within our control.",
      "Statutory rights: if applicable law grants withdrawal or refund rights (e.g., the 14-day withdrawal right in the EU/UK), those rights are preserved.",
    ],
    afterList: [
      "7.3 How to Request a Refund. Contact us via the channels in Section 16 with your account email, transaction ID, and reason. We will acknowledge within 2 business days and process eligible refunds within 5–10 business days.",
      "7.4 Non-Refundable Items. Fees for subscription periods already used (except as noted in 7.2); annual subscription fees requested after 30 days from initial purchase; downloaded paid skills (except as required by law); and accounts terminated for violation of these Terms.",
    ],
  },
  {
    title: "8. Billing Disputes",
    paragraphs: [
      "If you believe there is an error in a charge, please contact us through the channels in Section 16 before disputing with your bank. We commit to responding within 2 business days and resolving confirmed billing errors within 5 business days.",
    ],
  },
  {
    title: "9. Content, Licensing & Intellectual Property",
    paragraphs: [
      "9.1 Skill Licensing. Skills submitted to SkillHubs are published under the MIT License unless a different license is explicitly designated for a paid skill. By submitting content, you represent that you have the right to license it accordingly and grant SkillHubs permission to host and distribute it. You retain ownership of your original content.",
      "9.2 Input License. By submitting content to the Service, you grant SkillHubs a limited, non-exclusive license to process it solely to deliver the Service. We do not use your content to train AI models without your explicit consent.",
      "9.3 AI Output Accuracy. Skills on SkillHubs are instructions and prompts intended for use with AI systems. AI-generated results produced using any skill may contain errors or inaccuracies. You are solely responsible for reviewing and verifying any AI output before relying on it.",
    ],
  },
  {
    title: "10. Acceptable Use Policy",
    paragraphs: ["You may use the Service only for lawful purposes. You agree NOT to:"],
    list: [
      "Submit or distribute skills or content that is illegal, defamatory, harassing, or fraudulent.",
      "Submit skills designed to generate deepfake content that impersonates real individuals or deceives viewers about its origin or authenticity.",
      "Submit skills or content that sexualizes minors or violates child protection laws.",
      "Submit skills designed to produce malware, phishing content, or cyberattack tools.",
      "Infringe the intellectual property or privacy rights of any third party.",
      "Circumvent or interfere with security features of the Service.",
      "Abuse the platform through automated mass actions, spam, or attempts to manipulate the points and leaderboard system.",
      "Resell or sub-license paid features of the Service without prior written approval.",
      "Systematically scrape or harvest platform content at scale for purposes other than your own authorized use.",
      "Violate any applicable law, regulation, or card network rule.",
    ],
  },
  {
    title: "11. Data, Privacy & Security",
    paragraphs: [
      "Your use of the Service is governed by our Privacy Policy at https://skillhubs.cc/privacy. Payment card data is processed exclusively by our PCI-DSS certified payment processor (Waffo Pancake) and is not stored on our servers. Account data is retained for 90 days following account deletion, then deleted.",
    ],
  },
  {
    title: "12. Disclaimers & Limitation of Liability",
    paragraphs: [
      '12.1 Disclaimer of Warranties. THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR ACCURACY OF ANY SKILL OR AI OUTPUT.',
      "12.2 AI-Generated Content Disclaimer. Results produced by AI systems using skills from SkillHubs may be inaccurate, incomplete, or outdated. Do not rely on them for legal, medical, financial, or other professional advice. Always verify AI-generated content with a qualified professional before acting on it. Use of any skill is at your own risk.",
      "12.3 Limitation of Liability. TO THE MAXIMUM EXTENT PERMITTED BY LAW, SKILLHUBS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID IN THE 12 MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.",
    ],
  },
  {
    title: "13. Term & Termination",
    paragraphs: [
      "These Terms remain effective while you use the Service. We may suspend or terminate your account if you materially breach these Terms, we suspect fraudulent activity, or as required by law. If we terminate for reasons other than your breach, we will provide a pro-rated refund for any unused prepaid period. You may delete your account at any time via Account Settings or by contacting us through the channels in Section 16.",
    ],
  },
  {
    title: "14. Governing Law & Dispute Resolution",
    paragraphs: [
      "Before initiating any formal proceedings, please contact us through the channels in Section 16 to attempt informal resolution. These Terms are governed by the laws of the jurisdiction in which the operator of SkillHubs is established, without regard to conflict-of-law principles.",
    ],
  },
  {
    title: "15. General Provisions",
    paragraphs: [
      "We may update these Terms at any time. Material changes will be notified by email or in-product notice at least 14 days before the effective date. Continued use constitutes acceptance. If any provision is found unenforceable, the remainder continues in full effect.",
    ],
  },
];

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
              <h2 className="text-xl font-semibold text-text-primary">16. Contact Information</h2>
              <p className="mt-3 leading-relaxed">
                For any questions about these Terms, billing, refunds, or cancellation, please contact us:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                <li>
                  Support, billing &amp; refunds:{" "}
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
                <li>Cancel subscription: Account Settings → Subscription, or email us.</li>
              </ul>
              <p className="mt-3 leading-relaxed">
                By using the Service or checking &ldquo;I agree&rdquo; at checkout, you acknowledge and agree to these Terms.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
