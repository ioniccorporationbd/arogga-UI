import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, parseSession } from "@/lib/auth/session";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|; )arogga_session=([^;]+)/);
  const session = parseSession(match ? decodeURIComponent(match[1]) : undefined);

  if (!session) {
    return NextResponse.json({ ok: true, authenticated: false, user: null }, { headers: { "Cache-Control": "no-store" } });
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    user: { phone: session.phone, name: session.name || "Arogga User" },
    demo: Boolean(session.demo),
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true, authenticated: false });
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}
