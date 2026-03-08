import type { MetadataRoute } from "next";
import { getAllSkills } from "@/lib/skills";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { skills } = await getAllSkills();
  const baseUrl = "https://skillhub.dev";

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
    ...skillPages,
  ];
}
