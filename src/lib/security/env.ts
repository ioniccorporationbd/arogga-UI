import { z } from "zod";

export const envSchema = z.object({
  DATA_SOURCE: z.enum(["local", "api"]).default("local"),
  API_BASE_URL: z.string().optional().default(""),
  OTP_PROVIDER: z.enum(["demo", "sms"]).default("demo"),
  OTP_DEMO_CODE: z.string().regex(/^\d{6}$/).default("123456"),
  OTP_EXPIRES_SECONDS: z.coerce.number().min(60).default(300),
  OTP_RESEND_SECONDS: z.coerce.number().min(10).default(60),
  OTP_MAX_ATTEMPTS: z.coerce.number().min(1).max(10).default(5),
});
export const env = envSchema.parse(process.env);
