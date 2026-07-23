import { z } from "zod";

export const DEMO_OTP = "123456";
export const AUTH_COOKIE_NAME = "arogga_session";
export const OTP_COOKIE_NAME = "arogga_otp_phone";

export const phoneSchema = z.object({
  countryCode: z.string().default("+880"),
  phone: z.string().regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Enter a valid Bangladesh mobile number"),
});

export const verifyOtpSchema = phoneSchema.extend({
  otp: z.string().regex(/^\d{6}$/, "Enter a 6 digit OTP"),
});

const attempts = new Map<string, { count: number; resetAt: number }>();

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("880")) return `+${digits}`;
  if (digits.startsWith("01")) return `+88${digits}`;
  return `+${digits}`;
}

export function checkRateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  return { allowed: true, remaining: Math.max(0, limit - current.count), resetAt: current.resetAt };
}

export function createDemoSession(phone: string) {
  return Buffer.from(JSON.stringify({ phone, name: "Arogga User", issuedAt: Date.now(), demo: true })).toString("base64url");
}

export function parseDemoSession(value?: string) {
  if (!value) return null;
  try {
    const decoded = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as { phone?: string; name?: string; issuedAt?: number; demo?: boolean };
    if (!decoded.phone || !decoded.issuedAt) return null;
    return decoded;
  } catch {
    return null;
  }
}
