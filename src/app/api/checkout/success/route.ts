import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get("redirect_to");
  const origin = new URL(request.url).origin;

  const safePath =
    redirectTo && redirectTo.startsWith("/") ? redirectTo : "/pricing?checkout=success";
  const redirectUrl = `${origin}${safePath}`;
  return NextResponse.redirect(redirectUrl);
}
