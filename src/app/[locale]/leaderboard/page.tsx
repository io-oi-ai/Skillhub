import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { getLevel, LEVELS } from "@/lib/points";
import { isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: `${dict.points.leaderboard} | SkillHub` };
}

export default async function LeaderboardPage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const { data: users } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, points")
    .order("points", { ascending: false })
    .limit(20);

  const levelNames = dict.points.levels as Record<string, string>;
  const lang = locale === "zh" ? "zh" : "en";

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-2xl font-bold text-text-primary">
            {dict.points.leaderboard}
          </h1>

          {/* Level requirements */}
          <div className="mb-8 overflow-hidden rounded-xl border border-border bg-bg-card">
            <div className="grid grid-cols-5 divide-x divide-border">
              {LEVELS.map((lvl) => {
                const key = lvl.name.en.toLowerCase() as keyof typeof levelNames;
                return (
                  <div key={lvl.level} className="px-4 py-4 text-center">
                    <p className="text-sm font-semibold text-text-primary">
                      {levelNames[key]}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      {lvl.minPoints === 0
                        ? "0"
                        : `${lvl.minPoints}+`}{" "}
                      {dict.points.toast.pts}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="overflow-hidden rounded-xl border border-border bg-bg-card">
            {users && users.length > 0 ? (
              <ul className="divide-y divide-border">
                {users.map((u, i) => {
                  const level = getLevel(u.points);
                  const levelKey = level.name.en.toLowerCase() as keyof typeof levelNames;
                  const name = u.display_name || u.username || "Anonymous";
                  const initial = name.charAt(0).toUpperCase();

                  return (
                    <li
                      key={u.id}
                      className="flex items-center gap-4 px-4 py-3"
                    >
                      <span className="w-8 text-center text-sm font-bold text-text-muted">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                      </span>

                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-bg-primary">
                        {u.avatar_url ? (
                          <img
                            src={u.avatar_url}
                            alt={name}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-xs font-medium text-text-primary">
                            {initial}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {levelNames[levelKey]}
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-accent">
                        {u.points} {dict.points.toast.pts}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-4 py-8 text-center text-sm text-text-muted">
                No data yet
              </p>
            )}
          </div>

          {/* How to earn points */}
          <h2 className="mb-4 mt-10 text-xl font-bold text-text-primary">
            {dict.points.howToEarn}
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-bg-card">
            <ul className="divide-y divide-border">
              {([
                [dict.points.earnRules.signup, "+10"],
                [dict.points.earnRules.create, "+10"],
                [dict.points.earnRules.firstCreate, "+20"],
                [dict.points.earnRules.update, "+5"],
                [`${dict.points.earnRules.download}`, "5 + likes"],
                [dict.points.earnRules.like, "+2"],
                [dict.points.earnRules.prSubmit, "+3"],
                [dict.points.earnRules.prMerged, "+3"],
              ] as const).map(([label, pts]) => (
                <li key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-text-secondary">{label}</span>
                  <span className="text-sm font-semibold text-accent">{pts}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
