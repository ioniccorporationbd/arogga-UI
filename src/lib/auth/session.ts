import { Buffer } from "node:buffer";
export const AUTH_COOKIE_NAME = "arogga_session";
export type AuthSession = { phone: string; name: string; issuedAt: number; demo?: boolean };
export function createSession(phone: string): string { return Buffer.from(JSON.stringify({ phone, name: "Arogga User", issuedAt: Date.now(), demo: process.env.OTP_PROVIDER !== "sms" } satisfies AuthSession)).toString("base64url"); }
export function parseSession(value?: string): AuthSession | null { if (!value) return null; try { const decoded = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as AuthSession; if (!decoded.phone || !decoded.issuedAt) return null; return decoded; } catch { return null; } }
