import type { User } from "@/types";

export type OtpRequest = { countryCode?: string; phone: string };
export type OtpVerifyRequest = OtpRequest & { otp: string };

export interface AuthRepository {
  getSession(): Promise<User | null>;
  requestOtp(input: OtpRequest): Promise<{ ok: true; phone: string; expiresInSeconds: number; demoOtp?: string }>;
  verifyOtp(input: OtpVerifyRequest): Promise<User>;
  logout(): Promise<void>;
}
