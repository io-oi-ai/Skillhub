import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllSkills, getSkillById } from "@/lib/skills";
import { ROLE_LABELS, ROLE_COLORS, SCENE_LABELS, SOURCE_LABELS } from "@/lib/types";
import SkillContent from "./SkillContent";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const skills = getAllSkills();
  return skills.map((skill) => ({ id: skill.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const skill = getSkillById(id);
  if (!skill) return { title: "Skill 未找到" };

  return {
    title: skill.name,
    description: skill.description,
    openGraph: {
      title: `${skill.name} | SkillHub`,
      description: skill.description,
    },
  };
}

export default async function SkillPage({ params }: Props) {
  const { id } = await params;
  const skill = getSkillById(id);
  if (!skill) notFound();

  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {skill.featured && (
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
                  推荐
                </span>
              )}
              {skill.roles.map((role) => (
                <span
                  key={role}
                  className={`rounded-md border px-2 py-0.5 text-xs ${ROLE_COLORS[role]}`}
                >
                  {ROLE_LABELS[role]}
                </span>
              ))}
              {skill.scenes.map((scene) => (
                <span
                  key={scene}
                  className="rounded-md border border-border bg-bg-primary/50 px-2 py-0.5 text-xs text-text-muted"
                >
                  {SCENE_LABELS[scene]}
                </span>
              ))}
            </div>

            <h1 className="mb-2 text-3xl font-bold text-text-primary">
              {skill.name}
            </h1>
            <p className="text-lg text-text-secondary">{skill.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-muted">
              <span>作者: {skill.author}</span>
              <span>v{skill.version}</span>
              <span>更新于 {skill.updatedAt}</span>
              {skill.source && (
                <span className="rounded bg-bg-card px-2 py-0.5 font-mono text-xs">
                  来源: {SOURCE_LABELS[skill.source]}
                </span>
              )}
            </div>

            {skill.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-bg-card px-2 py-0.5 text-xs text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          {skill.content ? (
            <div className="rounded-xl border border-border bg-bg-card p-6 sm:p-8">
              <SkillContent content={skill.content} />
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-bg-card p-6 text-center text-text-muted">
              暂无详细说明
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
