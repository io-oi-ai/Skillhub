import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getSkillById } from "@/lib/skills";
import { supabase } from "@/lib/supabase";
import { getLevel } from "@/lib/points";
import { ROLE_COLORS } from "@/lib/types";
import type { Role, Scene } from "@/lib/types";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import Link from "next/link";
import SkillContent from "./SkillContent";
import LikeButton from "@/components/LikeButton";
import DownloadGate from "@/components/DownloadGate";
import SkillActions from "@/components/SkillActions";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

function getChineseSection(content: string): string {
  const lines = content.split("\n");
  const markerIndex = lines.findIndex((line) =>
    /^#{1,2}\s*中文版\s*$/.test(line.trim()),
  );
  if (markerIndex === -1) return "";
  return lines.slice(markerIndex + 1).join("\n").trim();
}

function getFirstMarkdownHeading(content: string): string {
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.trim().match(/^#{1,2}\s+(.+)$/);
    if (match) return match[1].trim();
  }
  return "";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const skill = await getSkillById(id);
  if (!skill) return { title: dict.metadata.skillNotFound };

  const chineseSection = skill.content ? getChineseSection(skill.content) : "";
  const chineseTitle = chineseSection ? getFirstMarkdownHeading(chineseSection) : "";
  const localizedTitle = locale.startsWith("zh") && chineseTitle ? chineseTitle : skill.name;

  const baseUrl = "https://skillhubs.cc";
  const enPath = `/skill/${id}`;
  const zhPath = `/zh/skill/${id}`;

  return {
    title: localizedTitle,
    description: skill.description,
    openGraph: {
      title: `${localizedTitle} | SkillHubs`,
      description: skill.description,
    },
    alternates: {
      canonical: `${baseUrl}${enPath}`,
      languages: {
        en: `${baseUrl}${enPath}`,
        "zh-CN": `${baseUrl}${zhPath}`,
      },
    },
  };
}

export default async function SkillPage({ params }: Props) {
  const { locale, id } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const skill = await getSkillById(id);
  if (!skill) notFound();

  const chineseSection = skill.content ? getChineseSection(skill.content) : "";
  const chineseTitle = chineseSection ? getFirstMarkdownHeading(chineseSection) : "";
  const primaryTitle = locale.startsWith("zh") && chineseTitle ? chineseTitle : skill.name;
  const secondaryTitle = locale.startsWith("zh")
    ? skill.name
    : chineseTitle && chineseTitle !== skill.name
      ? chineseTitle
      : "";

  const roleLabels = dict.roles as Record<string, string>;
  const sceneLabels = dict.scenes as Record<string, string>;
  const sourceLabels = dict.sources as Record<string, string>;

  // Fetch author profile
  let authorLevelLabel = "";
  let authorUsername: string | null = null;
  if (skill.userId) {
    const { data: authorProfile } = await supabase
      .from("profiles")
      .select("points, username")
      .eq("id", skill.userId)
      .single();
    if (authorProfile) {
      authorUsername = authorProfile.username;
      const level = getLevel(authorProfile.points);
      const levelKey = level.name.en.toLowerCase() as keyof typeof dict.points.levels;
      authorLevelLabel = dict.points.levels[levelKey];
    }
  }

  const baseUrl = "https://skillhubs.cc";
  const skillSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: skill.name,
    description: skill.description,
    url: `${baseUrl}/skill/${skill.id}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    softwareVersion: skill.version,
    dateModified: skill.updatedAt,
    offers: {
      "@type": "Offer",
      price: skill.priceType === "paid" ? (skill.price / 100).toFixed(2) : "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    author: {
      "@type": "Person",
      name: skill.author,
      ...(authorUsername ? { url: `${baseUrl}/user/${authorUsername}` } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "SkillHubs",
      url: baseUrl,
    },
    keywords: [...skill.roles, ...skill.scenes, ...skill.tags.filter((t: string) => !t.startsWith("collection:"))],
    isAccessibleForFree: skill.priceType === "free",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Skills", item: `${baseUrl}/#skills` },
      { "@type": "ListItem", position: 3, name: skill.name, item: `${baseUrl}/skill/${skill.id}` },
    ],
  };

  return (
    <>
      <JsonLd data={skillSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Header locale={locale} dict={dict} />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {skill.priceType === "paid" && skill.price > 0 && (
                <span className="rounded-md border border-accent/20 bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                  ${(skill.price / 100).toFixed(2)}
                </span>
              )}
              {skill.featured && (
                <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                  {dict.skillDetail.featured}
                </span>
              )}
              {skill.roles.map((role: Role) => (
                <span
                  key={role}
                  className={`rounded-md border px-2 py-0.5 text-xs ${ROLE_COLORS[role]}`}
                >
                  {roleLabels[role]}
                </span>
              ))}
              {skill.scenes.map((scene: Scene) => (
                <span
                  key={scene}
                  className="rounded-md border border-border bg-bg-primary/50 px-2 py-0.5 text-xs text-text-muted"
                >
                  {sceneLabels[scene]}
                </span>
              ))}
            </div>

            <h1 className="mb-2 text-3xl font-bold text-text-primary">{primaryTitle}</h1>
            {secondaryTitle && (
              <p className="mb-1 text-sm text-text-muted">{secondaryTitle}</p>
            )}
            <p className="text-lg text-text-secondary">{skill.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <span>
                {dict.skillDetail.author}{" "}
                {authorUsername ? (
                  <Link
                    href={`${locale === "en" ? "" : `/${locale}`}/user/${authorUsername}`}
                    className="hover:text-accent hover:underline"
                  >
                    {skill.author}
                  </Link>
                ) : (
                  skill.author
                )}
                {authorLevelLabel && (
                  <span className="ml-1.5 rounded bg-accent/10 px-1.5 py-0.5 text-xs font-medium text-accent">
                    {authorLevelLabel}
                  </span>
                )}
              </span>
              <span>v{skill.version}</span>
              <time dateTime={skill.updatedAt}>{dict.skillDetail.updatedAt} {skill.updatedAt}</time>
              {skill.source && (
                <span className="rounded bg-bg-card px-2 py-0.5 font-mono text-xs">
                  {dict.skillDetail.source} {sourceLabels[skill.source]}
                </span>
              )}
              <LikeButton skillId={skill.id} initialCount={skill.likesCount} size="md" />
              <DownloadGate
                skill={skill}
                downloadLabel={dict.skillCard.download}
                buyLabel={dict.pricing.downloadButton.buy}
                size="md"
              />
            </div>

            {skill.tags.filter((t: string) => !t.startsWith("collection:")).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {skill.tags.filter((t: string) => !t.startsWith("collection:")).map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-md bg-bg-card px-2 py-0.5 text-xs text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions: Edit / Suggest / History / PRs */}
            <div className="mt-4">
              <SkillActions
                skillId={skill.id}
                skillUserId={skill.userId}
                locale={locale}
                dict={dict}
              />
            </div>
          </div>

          {/* Content */}
          {skill.content ? (
            <div className="rounded-xl border border-border bg-bg-card p-6 sm:p-8">
              <SkillContent content={skill.content} locale={locale} />
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-bg-card p-6 text-center text-text-muted">
              {dict.skillDetail.noContent}
            </div>
          )}
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
