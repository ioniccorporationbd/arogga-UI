import { NextResponse } from "next/server";
import { DEMO_OTP, OTP_COOKIE_NAME, checkRateLimit, normalizePhone, phoneSchema } from "@/lib/auth-server";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => ({}));
  const parsed = phoneSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Invalid mobile number" }, { status: 400 });
  }

  const phone = normalizePhone(parsed.data.phone);
  const limit = checkRateLimit(`otp:${phone}`, 5, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, error: "Too many OTP requests. Please wait before trying again.", resetAt: limit.resetAt }, { status: 429 });
  }

  const response = NextResponse.json({
    ok: true,
    phone,
    message: "OTP requested successfully",
    demoOtp: process.env.NODE_ENV === "production" ? undefined : DEMO_OTP,
    expiresInSeconds: 120,
  });

  response.cookies.set(OTP_COOKIE_NAME, phone, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 120,
    path: "/",
  });

  return response;
}
