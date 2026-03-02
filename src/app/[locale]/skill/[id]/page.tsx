import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSkillById } from "@/lib/skills";
import { ROLE_COLORS } from "@/lib/types";
import type { Role, Scene } from "@/lib/types";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import SkillContent from "./SkillContent";
import LikeButton from "@/components/LikeButton";
import DownloadButton from "@/components/DownloadButton";
import SkillActions from "@/components/SkillActions";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const skill = await getSkillById(id);
  if (!skill) return { title: dict.metadata.skillNotFound };

  const baseUrl = "https://skillhub.dev";
  const enPath = `/skill/${id}`;
  const zhPath = `/zh/skill/${id}`;

  return {
    title: skill.name,
    description: skill.description,
    openGraph: {
      title: `${skill.name} | SkillHub`,
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

  const roleLabels = dict.roles as Record<string, string>;
  const sceneLabels = dict.scenes as Record<string, string>;
  const sourceLabels = dict.sources as Record<string, string>;

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
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

            <h1 className="mb-2 text-3xl font-bold text-text-primary">
              {skill.name}
            </h1>
            <p className="text-lg text-text-secondary">{skill.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <span>{dict.skillDetail.author} {skill.author}</span>
              <span>v{skill.version}</span>
              <span>{dict.skillDetail.updatedAt} {skill.updatedAt}</span>
              {skill.source && (
                <span className="rounded bg-bg-card px-2 py-0.5 font-mono text-xs">
                  {dict.skillDetail.source} {sourceLabels[skill.source]}
                </span>
              )}
              <LikeButton skillId={skill.id} initialCount={skill.likesCount} size="md" />
              <DownloadButton skill={skill} label={dict.skillCard.download} size="md" />
            </div>

            {skill.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {skill.tags.map((tag: string) => (
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
              <SkillContent content={skill.content} />
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
