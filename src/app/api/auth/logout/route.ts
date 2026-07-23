import { NextResponse } from "next/server";
import { OTP_COOKIE_NAME } from "@/lib/auth/otp";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({ ok: true, authenticated: false });
  response.cookies.delete(AUTH_COOKIE_NAME);
  response.cookies.delete(OTP_COOKIE_NAME);
  return response;
}
