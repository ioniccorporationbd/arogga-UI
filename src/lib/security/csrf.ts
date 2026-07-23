import { NextResponse } from "next/server";

const SAFE = new Set(["GET", "HEAD", "OPTIONS"]);
export function validateCsrf(request: Request) {
  if (SAFE.has(request.method)) return true;
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return true;
  try { return new URL(origin).host === host; } catch { return false; }
}
export function csrfFailureResponse() { return NextResponse.json({ ok: false, error: "CSRF validation failed" }, { status: 403 }); }
