import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth/auth-errors";
import { OTP_COOKIE_NAME, verifyOtpChallenge } from "@/lib/auth/otp";
import { normalizeBangladeshPhone, otpVerifyRequestSchema } from "@/lib/auth/phone";
import { createSession, AUTH_COOKIE_NAME } from "@/lib/auth/session";

function errorResponse(error: unknown) {
  if (error instanceof AuthError) return NextResponse.json({ ok: false, error: error.message, code: error.code }, { status: error.status });
  return NextResponse.json({ ok: false, error: "Unable to verify OTP" }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => ({}));
    const parsed = otpVerifyRequestSchema.parse(body);
    const phone = normalizeBangladeshPhone(parsed.phone);
    const challengeId = request.headers.get("cookie")?.match(/(?:^|; )arogga_otp_challenge=([^;]+)/)?.[1];

    verifyOtpChallenge(challengeId ? decodeURIComponent(challengeId) : undefined, phone, parsed.otp);

    const response = NextResponse.json({ ok: true, user: { phone, name: "Arogga User" } });
    response.cookies.set(AUTH_COOKIE_NAME, createSession(phone), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    response.cookies.delete(OTP_COOKIE_NAME);
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
