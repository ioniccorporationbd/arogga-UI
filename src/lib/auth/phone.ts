import { z } from "zod";
export const bdPhoneSchema = z.string().regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Enter a valid Bangladesh mobile number");
export function normalizeBangladeshPhone(phone: string) { const digits = phone.replace(/\D/g, ""); if (digits.startsWith("880")) return `+${digits}`; if (digits.startsWith("01")) return `+88${digits}`; return `+${digits}`; }
export function isValidBangladeshPhone(phone: string) { const digits = phone.replace(/\D/g, ""); return /^(?:88)?01[3-9]\d{8}$/.test(digits); }
export function maskPhone(phone: string) { const normalized = normalizeBangladeshPhone(phone); return normalized.replace(/(\+880)\d{4}(\d{4})$/, "$1****$2"); }
export const otpPhoneRequestSchema = z.object({ countryCode: z.string().default("+880"), phone: bdPhoneSchema });
export const otpVerifyRequestSchema = otpPhoneRequestSchema.extend({ otp: z.string().regex(/^\d{6}$/, "Enter a 6 digit OTP") });
