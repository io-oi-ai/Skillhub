import type { MetadataRoute } from "next";
import { getAllSkills } from "@/lib/skills";

export default function sitemap(): MetadataRoute.Sitemap {
  const skills = getAllSkills();
  const baseUrl = "https://skillhub.dev";

  const skillPages = skills.map((skill) => ({
    url: `${baseUrl}/skill/${skill.id}`,
    lastModified: new Date(skill.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...skillPages,
  ];
}
