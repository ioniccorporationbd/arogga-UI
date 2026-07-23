import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, parseSession } from "./session";
export async function getServerSession() { const store = await cookies(); return parseSession(store.get(AUTH_COOKIE_NAME)?.value); }
export async function requireServerSession() { const session = await getServerSession(); if (!session?.phone) throw new Error("Unauthorized"); return session; }
