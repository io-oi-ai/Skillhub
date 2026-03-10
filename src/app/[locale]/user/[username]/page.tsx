import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { getLevel } from "@/lib/points";
import { ROLE_COLORS } from "@/lib/types";
import type { Role } from "@/lib/types";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string; username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, username } = await params;
  if (!isValidLocale(locale)) return {};
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, username")
    .eq("username", username)
    .single();

  const name = profile?.display_name || profile?.username || username;
  return {
    title: `${name} | SkillHubs`,
    description: `View ${name}'s profile on SkillHubs`,
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { locale, username } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const prefix = locale === "en" ? "" : `/${locale}`;

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, points, bio, website, created_at")
    .eq("username", username)
    .single();

  if (profileError || !profile) notFound();

  // Fetch user's skills
  const { data: skills } = await supabase
    .from("skills")
    .select("id, name, description, author, roles, scenes, version, updated_at, tags, featured, source, likes_count, download_count, user_id")
    .eq("user_id", profile.id)
    .order("updated_at", { ascending: false });

  // Count PRs
  const { count: prCount } = await supabase
    .from("skill_pull_requests")
    .select("id", { count: "exact", head: true })
    .eq("author_id", profile.id);

  const level = getLevel(profile.points);
  const lang = locale === "zh" ? "zh" : "en";
  const levelNames = dict.points.levels as Record<string, string>;
  const levelKey = level.name.en.toLowerCase() as keyof typeof levelNames;
  const levelLabel = levelNames[levelKey];
  const roleLabels = dict.roles as Record<string, string>;
  const displayName = profile.display_name || profile.username;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Profile Header */}
          <div className="mb-8 rounded-xl border border-border bg-bg-card p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* Avatar */}
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-bg-primary">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-2xl font-bold text-text-primary">
                    {initial}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-text-primary">
                  {displayName}
                </h1>
                <p className="text-sm text-text-muted">@{profile.username}</p>

                {profile.bio && (
                  <p className="mt-2 text-sm text-text-secondary">
                    {profile.bio}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-text-muted sm:justify-start">
                  <span className="rounded bg-accent/10 px-2 py-0.5 font-medium text-accent">
                    {levelLabel}
                  </span>
                  <span>
                    {profile.points} {dict.points.toast.pts}
                  </span>
                  <span>
                    {dict.userProfile.joinedOn}{" "}
                    {new Date(profile.created_at).toLocaleDateString(
                      locale === "zh" ? "zh-CN" : "en-US",
                      { year: "numeric", month: "short" }
                    )}
                  </span>
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {dict.userProfile.website}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 divide-x divide-border rounded-lg border border-border">
              <div className="px-4 py-3 text-center">
                <p className="text-lg font-bold text-text-primary">
                  {skills?.length ?? 0}
                </p>
                <p className="text-xs text-text-muted">
                  {dict.userProfile.skills}
                </p>
              </div>
              <div className="px-4 py-3 text-center">
                <p className="text-lg font-bold text-text-primary">
                  {prCount ?? 0}
                </p>
                <p className="text-xs text-text-muted">
                  {dict.userProfile.pullRequests}
                </p>
              </div>
              <div className="px-4 py-3 text-center">
                <p className="text-lg font-bold text-text-primary">
                  {profile.points}
                </p>
                <p className="text-xs text-text-muted">
                  {dict.points.label}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <h2 className="mb-4 text-xl font-bold text-text-primary">
            {dict.userProfile.skills}
          </h2>
          {skills && skills.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill) => (
                <Link key={skill.id} href={`${prefix}/skill/${skill.id}`}>
                  <div className="group h-full rounded-xl border border-border bg-bg-card p-5 transition-all hover:border-text-muted hover:shadow-sm">
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="font-serif text-lg font-semibold text-text-primary group-hover:text-accent">
                        {skill.name}
                      </h3>
                      {skill.featured && (
                        <span className="shrink-0 rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-700 border border-amber-200">
                          {dict.skillCard.featured}
                        </span>
                      )}
                    </div>
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                      {skill.description}
                    </p>
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {(skill.roles as string[]).map((role: string) => (
                        <span
                          key={role}
                          className={`rounded-md border px-2 py-0.5 text-xs ${ROLE_COLORS[role as Role] ?? ""}`}
                        >
                          {roleLabels[role] ?? role}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>v{skill.version}</span>
                      <span>{skill.likes_count} {dict.like.button}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-bg-card p-8 text-center text-text-muted">
              {dict.userProfile.noSkills}
            </div>
          )}
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
