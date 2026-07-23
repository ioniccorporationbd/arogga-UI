import type { WishlistItem } from "@/types";
import type { WishlistRepository } from "../interfaces/WishlistRepository";
function canUseStorage() { return typeof window !== "undefined" && typeof window.localStorage !== "undefined"; }
function readJson<T>(key: string, fallback: T): T { if (!canUseStorage()) return fallback; try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { window.localStorage.removeItem(key); return fallback; } }
function writeJson<T>(key: string, value: T) { if (canUseStorage()) window.localStorage.setItem(key, JSON.stringify(value)); }

const KEY = "arogga-repository-wishlist";
export class LocalWishlistRepository implements WishlistRepository {
  async list() { return readJson<WishlistItem[]>(KEY, []); }
  async add(item: WishlistItem) { const items = readJson<WishlistItem[]>(KEY, []); const next = items.some((entry) => entry.productId === item.productId) ? items : [item, ...items]; writeJson(KEY, next); return next; }
  async remove(productId: string) { const next = readJson<WishlistItem[]>(KEY, []).filter((item) => item.productId !== productId); writeJson(KEY, next); return next; }
  async clear() { writeJson(KEY, []); return []; }
}
