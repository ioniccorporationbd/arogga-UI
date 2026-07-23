import type { CartItem, CartSummary } from "@/types";
import { calculateCartDisplayTotals, mergeCartLines } from "@/lib/cart/cart-domain";
import type { CartRepository } from "../interfaces/CartRepository";
function canUseStorage() { return typeof window !== "undefined" && typeof window.localStorage !== "undefined"; }
function readJson<T>(key: string, fallback: T): T { if (!canUseStorage()) return fallback; try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { window.localStorage.removeItem(key); return fallback; } }
function writeJson<T>(key: string, value: T) { if (canUseStorage()) window.localStorage.setItem(key, JSON.stringify(value)); }

const KEY = "arogga-repository-cart";
function summarize(items: CartItem[]): CartSummary { const totals = calculateCartDisplayTotals(items); return { items, count: items.reduce((sum, item) => sum + item.quantity, 0), ...totals }; }
export class LocalCartRepository implements CartRepository {
  async getCart() { return summarize(readJson<CartItem[]>(KEY, [])); }
  async addItem(item: CartItem) { const items = mergeCartLines(readJson<CartItem[]>(KEY, []), item, item.quantity); writeJson(KEY, items); return summarize(items); }
  async updateQuantity(cartKey: string, quantity: number) { const items = readJson<CartItem[]>(KEY, []).map((item) => item.cartKey === cartKey ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxQuantity)) } : item); writeJson(KEY, items); return summarize(items); }
  async removeItem(cartKey: string) { const items = readJson<CartItem[]>(KEY, []).filter((item) => item.cartKey !== cartKey); writeJson(KEY, items); return summarize(items); }
  async clear() { writeJson(KEY, []); return summarize([]); }
  async migrateGuestCart() { return this.getCart(); }
}
