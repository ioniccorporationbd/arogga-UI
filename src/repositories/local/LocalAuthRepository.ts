import type { User } from "@/types";
import type { AuthRepository, OtpRequest, OtpVerifyRequest } from "../interfaces/AuthRepository";

export class LocalAuthRepository implements AuthRepository {
  async getSession() { const res = await fetch("/api/auth/session", { credentials: "include", cache: "no-store" }); const data = await res.json(); return data?.authenticated ? data.user as User : null; }
  async requestOtp(input: OtpRequest) { const res = await fetch("/api/auth/request-otp", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) }); const data = await res.json(); if (!res.ok || !data?.ok) throw new Error(data?.error || "OTP request failed"); return data; }
  async verifyOtp(input: OtpVerifyRequest) { const res = await fetch("/api/auth/verify-otp", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) }); const data = await res.json(); if (!res.ok || !data?.ok) throw new Error(data?.error || "OTP verification failed"); return data.user as User; }
  async logout() { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); }
}
