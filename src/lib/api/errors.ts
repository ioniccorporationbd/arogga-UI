import { NextResponse } from "next/server";
export function safeErrorResponse(error: unknown, fallback = "Request failed", status = 400) { return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : fallback }, { status }); }
