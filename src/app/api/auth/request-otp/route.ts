import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth/auth-errors";
import { createOtpChallenge, OTP_COOKIE_NAME, assertCanResend } from "@/lib/auth/otp";
import { maskPhone, normalizeBangladeshPhone, otpPhoneRequestSchema } from "@/lib/auth/phone";
import { assertRateLimit } from "@/lib/auth/rate-limit";

function errorResponse(error: unknown) {
  if (error instanceof AuthError) return NextResponse.json({ ok: false, error: error.message, code: error.code }, { status: error.status });
  return NextResponse.json({ ok: false, error: "Unable to request OTP" }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => ({}));
    const parsed = otpPhoneRequestSchema.parse(body);
    const phone = normalizeBangladeshPhone(parsed.phone);
    const currentChallenge = request.headers.get("cookie")?.match(/(?:^|; )arogga_otp_challenge=([^;]+)/)?.[1];

    assertCanResend(currentChallenge ? decodeURIComponent(currentChallenge) : undefined);
    assertRateLimit(`otp:${phone}`, 5, 60_000);

    const challenge = createOtpChallenge(phone);
    const response = NextResponse.json({
      ok: true,
      phone: maskPhone(phone),
      message: "OTP requested successfully",
      demoOtp: challenge.demoOtp,
      expiresInSeconds: challenge.expiresInSeconds,
      resendInSeconds: challenge.resendInSeconds,
      maxAttempts: challenge.maxAttempts,
    });

    response.cookies.set(OTP_COOKIE_NAME, challenge.challengeId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: challenge.expiresInSeconds,
      path: "/",
    });

    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
