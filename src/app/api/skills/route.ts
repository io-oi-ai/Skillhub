import { NextRequest, NextResponse } from "next/server";
import { getAllSkills } from "@/lib/skills";
import { supabase } from "@/lib/supabase";
import type { Role, Scene } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const role = searchParams.get("role") as Role | null;
  const scene = searchParams.get("scene") as Scene | null;
  const q = searchParams.get("q");

  let skills = await getAllSkills();

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, description, author, roles, scenes, tags, content } = body;

    if (!name || !description || !author || !roles?.length || !scenes?.length) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, author, roles, scenes" },
        { status: 400 }
      );
    }

    // Generate id from name: lowercase, replace non-alphanumeric/chinese with hyphens
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!id) {
      return NextResponse.json(
        { error: "Could not generate a valid id from the name" },
        { status: 400 }
      );
    }

    const row = {
      id,
      name,
      description,
      author,
      roles,
      scenes,
      version: "1.0.0",
      updated_at: new Date().toISOString().split("T")[0],
      tags: tags || [],
      featured: false,
      source: null,
      content: content || `# ${name}\n\n${description}`,
      likes_count: 0,
    };

    const { data, error } = await supabase
      .from("skills")
      .upsert(row, { onConflict: "id" })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to create skill:", error);
      return NextResponse.json(
        { error: "Failed to create skill" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
