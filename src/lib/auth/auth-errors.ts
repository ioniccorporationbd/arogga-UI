export class AuthError extends Error {
  constructor(message: string, public status = 400, public code = "AUTH_ERROR") { super(message); this.name = "AuthError"; }
}
export class RateLimitError extends AuthError { constructor(message = "Too many requests. Please wait before trying again.") { super(message, 429, "RATE_LIMITED"); } }
export class OtpExpiredError extends AuthError { constructor() { super("OTP expired. Please request a new code.", 410, "OTP_EXPIRED"); } }
export class OtpInvalidError extends AuthError { constructor(message = "Invalid OTP.") { super(message, 401, "OTP_INVALID"); } }
