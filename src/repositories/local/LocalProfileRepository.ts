import type { AccountSummary, User } from "@/types";
import type { ProfileRepository } from "../interfaces/ProfileRepository";
function canUseStorage() { return typeof window !== "undefined" && typeof window.localStorage !== "undefined"; }
function readJson<T>(key: string, fallback: T): T { if (!canUseStorage()) return fallback; try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { window.localStorage.removeItem(key); return fallback; } }
function writeJson<T>(key: string, value: T) { if (canUseStorage()) window.localStorage.setItem(key, JSON.stringify(value)); }

const KEY = "arogga-profile-user";
export class LocalProfileRepository implements ProfileRepository {
  async getProfile() { return readJson<User | null>(KEY, null); }
  async updateProfile(profile: Partial<User>) { const current = readJson<User | null>(KEY, null) || { phone: "", name: "Arogga User" }; const next = { ...current, ...profile }; writeJson(KEY, next); return next; }
  async getAccountSummary() { const user = await this.getProfile(); return { user, orderCount: 0, wishlistCount: 0, unreadNotifications: 0, savedAddressCount: 0, walletBalance: 0, rewardPoints: 0 } satisfies AccountSummary; }
}
