import { describe, expect, it } from "vitest";

import { envSchema } from "../src/lib/security/env";
import { redactSensitive } from "../src/lib/security/redaction";
import { validateUploadMeta } from "../src/lib/security/uploads";
import { buildCartKey } from "../src/lib/cart/cart-domain";

describe("final hardening foundations", () => {
  it("validates environment defaults and OTP settings", () => {
    const env = envSchema.parse({ DATA_SOURCE: "local", OTP_PROVIDER: "demo", OTP_DEMO_CODE: "123456" });
    expect(env.DATA_SOURCE).toBe("local");
    expect(env.OTP_EXPIRES_SECONDS).toBe(300);
  });

  it("redacts sensitive logs", () => {
    expect(redactSensitive({ token: "abc", nested: { password: "secret", ok: true } })).toEqual({ token: "[REDACTED]", nested: { password: "[REDACTED]", ok: true } });
  });

  it("validates prescription upload MIME and size metadata", () => {
    expect(validateUploadMeta({ mime: "image/png", size: 1024 }).ok).toBe(true);
    expect(validateUploadMeta({ mime: "application/x-msdownload", size: 1024 }).ok).toBe(false);
    expect(validateUploadMeta({ mime: "image/png", size: 9_000_000 }).ok).toBe(false);
  });

  it("keeps canonical cart key stable", () => {
    expect(buildCartKey("p1", "v1")).toBe("p1:v1");
  });
});
