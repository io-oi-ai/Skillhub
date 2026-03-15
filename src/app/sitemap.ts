import type { MetadataRoute } from "next";
import { getAllSkills } from "@/lib/skills";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { skills } = await getAllSkills();
  const baseUrl = "https://skillhubs.cc";

  const skillPages = skills.flatMap((skill) => [
    {
      url: `${baseUrl}/skill/${skill.id}`,
      lastModified: new Date(skill.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/skill/${skill.id}`,
          "zh-CN": `${baseUrl}/zh/skill/${skill.id}`,
        },
      },
    },
  ]);

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          en: baseUrl,
          "zh-CN": `${baseUrl}/zh`,
        },
      },
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/guide`,
          "zh-CN": `${baseUrl}/zh/guide`,
        },
      },
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: {
        languages: {
          en: `${baseUrl}/submit`,
          "zh-CN": `${baseUrl}/zh/submit`,
        },
      },
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
      alternates: {
        languages: {
          en: `${baseUrl}/leaderboard`,
          "zh-CN": `${baseUrl}/zh/leaderboard`,
        },
      },
    },
    ...skillPages,
  ];
}
