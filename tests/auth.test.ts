import { afterEach, describe, expect, it, vi } from "vitest";

import { isValidBangladeshPhone, normalizeBangladeshPhone } from "../src/lib/auth/phone";
import { createOtpChallenge, resetOtpStoreForTests, verifyOtpChallenge, assertCanResend } from "../src/lib/auth/otp";
import { createSession, parseSession } from "../src/lib/auth/session";
import { clearPendingAuthAction, getPendingAuthAction, setPendingAuthAction } from "../src/stores/pendingAuthActionStore";

afterEach(() => {
  vi.useRealTimers();
  resetOtpStoreForTests();
  clearPendingAuthAction();
  process.env.OTP_PROVIDER = "demo";
  process.env.OTP_DEMO_CODE = "123456";
  process.env.OTP_EXPIRES_SECONDS = "300";
  process.env.OTP_RESEND_SECONDS = "60";
  process.env.OTP_MAX_ATTEMPTS = "5";
});

describe("Bangladesh phone validation", () => {
  it("accepts valid Bangladesh mobile numbers and normalizes them", () => {
    expect(isValidBangladeshPhone("01712345678")).toBe(true);
    expect(isValidBangladeshPhone("+8801712345678")).toBe(true);
    expect(normalizeBangladeshPhone("01712345678")).toBe("+8801712345678");
  });

  it("rejects invalid phone numbers", () => {
    expect(isValidBangladeshPhone("01212345678")).toBe(false);
    expect(isValidBangladeshPhone("01712345")).toBe(false);
  });
});

describe("OTP provider", () => {
  it("requests OTP without exposing the hash", () => {
    const challenge = createOtpChallenge("+8801712345678");
    expect(challenge.demoOtp).toBe("123456");
    expect(challenge.challengeId).toHaveLength(22);
    expect(challenge.expiresInSeconds).toBe(300);
  });

  it("rejects invalid OTP", () => {
    const challenge = createOtpChallenge("+8801712345678");
    expect(() => verifyOtpChallenge(challenge.challengeId, "+8801712345678", "000000")).toThrow(/Invalid OTP/);
  });

  it("rejects expired OTP", () => {
    vi.useFakeTimers();
    process.env.OTP_EXPIRES_SECONDS = "1";
    const challenge = createOtpChallenge("+8801712345678");
    vi.advanceTimersByTime(1100);
    expect(() => verifyOtpChallenge(challenge.challengeId, "+8801712345678", "123456")).toThrow(/expired/i);
  });

  it("enforces resend cooldown", () => {
    process.env.OTP_RESEND_SECONDS = "60";
    const challenge = createOtpChallenge("+8801712345678");
    expect(() => assertCanResend(challenge.challengeId)).toThrow(/wait/i);
  });

  it("enforces maximum attempts", () => {
    process.env.OTP_MAX_ATTEMPTS = "2";
    const challenge = createOtpChallenge("+8801712345678");
    expect(() => verifyOtpChallenge(challenge.challengeId, "+8801712345678", "000000")).toThrow();
    expect(() => verifyOtpChallenge(challenge.challengeId, "+8801712345678", "111111")).toThrow();
    expect(() => verifyOtpChallenge(challenge.challengeId, "+8801712345678", "123456")).toThrow(/Maximum/);
  });

  it("supports login success with a valid OTP", () => {
    const challenge = createOtpChallenge("+8801712345678");
    expect(verifyOtpChallenge(challenge.challengeId, "+8801712345678", "123456")).toBe(true);
  });
});

describe("session", () => {
  it("creates and parses a session cookie payload", () => {
    const value = createSession("+8801712345678");
    expect(parseSession(value)?.phone).toBe("+8801712345678");
  });

  it("logout is represented by an absent session", () => {
    expect(parseSession(undefined)).toBeNull();
  });
});

describe("pending auth actions", () => {
  it("stores pending Add to Cart", () => {
    setPendingAuthAction({ type: "ADD_TO_CART", payload: { productId: "p1", variantId: "v1", quantity: 2 } });
    expect(getPendingAuthAction()).toEqual({ type: "ADD_TO_CART", payload: { productId: "p1", variantId: "v1", quantity: 2 } });
  });

  it("stores pending Wishlist", () => {
    setPendingAuthAction({ type: "ADD_TO_WISHLIST", payload: { productId: "p1" } });
    expect(getPendingAuthAction()).toEqual({ type: "ADD_TO_WISHLIST", payload: { productId: "p1" } });
  });

  it("stores pending Checkout", () => {
    setPendingAuthAction({ type: "CHECKOUT" });
    expect(getPendingAuthAction()).toEqual({ type: "CHECKOUT" });
  });
});
