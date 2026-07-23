export const MAX_PRESCRIPTION_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_PRESCRIPTION_MIME = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
export function validateUploadMeta(input: { mime: string; size: number }) {
  if (!ALLOWED_PRESCRIPTION_MIME.has(input.mime)) return { ok: false as const, error: "Unsupported prescription file type" };
  if (input.size > MAX_PRESCRIPTION_UPLOAD_BYTES) return { ok: false as const, error: "Prescription file is too large" };
  return { ok: true as const };
}
