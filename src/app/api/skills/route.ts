import { NextRequest, NextResponse } from "next/server";
import { getAllSkills } from "@/lib/skills";
import type { Role, Scene } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const role = searchParams.get("role") as Role | null;
  const scene = searchParams.get("scene") as Scene | null;
  const q = searchParams.get("q");

  let skills = getAllSkills();

  if (role) {
    skills = skills.filter((s) => s.roles.includes(role));
  }
  if (scene) {
    skills = skills.filter((s) => s.scenes.includes(scene));
  }
  if (q) {
    const query = q.toLowerCase();
    skills = skills.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  // Return concise list without full content
  const result = skills.map(({ content, ...rest }) => rest);

  return NextResponse.json({
    count: result.length,
    skills: result,
  });
}
