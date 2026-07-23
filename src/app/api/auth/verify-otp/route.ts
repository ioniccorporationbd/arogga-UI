import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, DEMO_OTP, OTP_COOKIE_NAME, checkRateLimit, createDemoSession, normalizePhone, verifyOtpSchema } from "@/lib/auth-server";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => ({}));
  const parsed = verifyOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message || "Invalid OTP" }, { status: 400 });
  }

  const phone = normalizePhone(parsed.data.phone);
  const requestedPhone = request.headers.get("cookie")?.match(/(?:^|; )arogga_otp_phone=([^;]+)/)?.[1];
  if (requestedPhone && decodeURIComponent(requestedPhone) !== phone) {
    return NextResponse.json({ ok: false, error: "OTP session does not match this mobile number" }, { status: 400 });
  }

  const limit = checkRateLimit(`verify:${phone}`, 8, 5 * 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ ok: false, error: "Too many OTP verification attempts. Please request a new OTP." }, { status: 429 });
  }

  if (parsed.data.otp !== DEMO_OTP) {
    return NextResponse.json({ ok: false, error: "Invalid OTP. Development OTP is 123456." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, user: { phone, name: "Arogga User" } });
  response.cookies.set(AUTH_COOKIE_NAME, createDemoSession(phone), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  response.cookies.delete(OTP_COOKIE_NAME);
  return response;
}
