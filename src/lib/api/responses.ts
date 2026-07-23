import { NextResponse } from "next/server";
export function unauthorizedResponse(message = "Unauthorized") { return NextResponse.json({ ok: false, error: message }, { status: 401 }); }
export function forbiddenResponse(message = "Forbidden") { return NextResponse.json({ ok: false, error: message }, { status: 403 }); }
