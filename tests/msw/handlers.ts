import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/auth/session", () => HttpResponse.json({ ok: true, authenticated: false, user: null })),
];
