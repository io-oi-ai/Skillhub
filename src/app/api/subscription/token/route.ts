import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { issuePancakeSessionToken } from "@/lib/pancake";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { user, error } = await requireAuth();
  if (error || !user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!user.email) {
    return NextResponse.json(
      { error: "User email not found" },
      { status: 400 }
    );
  }

  try {
    const { token } = await issuePancakeSessionToken(user.email);

    return NextResponse.json({
      token,
      expiresIn: 3600, // 1 hour
    });
  } catch (err) {
    console.error("[subscription/token] Failed to issue session token:", err);
    return NextResponse.json(
      { error: "Failed to issue session token" },
      { status: 500 }
    );
  }
}
