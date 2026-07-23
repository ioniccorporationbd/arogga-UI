import type { CartItem, CartSummary } from "@/types";
import type { CartRepository } from "../interfaces/CartRepository";
function canUseStorage() { return typeof window !== "undefined" && typeof window.localStorage !== "undefined"; }
function readJson<T>(key: string, fallback: T): T { if (!canUseStorage()) return fallback; try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { window.localStorage.removeItem(key); return fallback; } }
function writeJson<T>(key: string, value: T) { if (canUseStorage()) window.localStorage.setItem(key, JSON.stringify(value)); }

const KEY = "arogga-repository-cart";
function summarize(items: CartItem[]): CartSummary { const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0); return { items, subtotal, discountTotal: 0, deliveryFee: subtotal > 999 || subtotal === 0 ? 0 : 60, taxTotal: 0, grandTotal: subtotal + (subtotal > 999 || subtotal === 0 ? 0 : 60) }; }
export class LocalCartRepository implements CartRepository {
  async getCart() { return summarize(readJson<CartItem[]>(KEY, [])); }
  async addItem(item: CartItem) { const items = readJson<CartItem[]>(KEY, []); const index = items.findIndex((entry) => entry.cartKey === item.cartKey); if (index >= 0) items[index] = { ...items[index], quantity: items[index].quantity + item.quantity }; else items.push(item); writeJson(KEY, items); return summarize(items); }
  async updateQuantity(cartKey: string, quantity: number) { const items = readJson<CartItem[]>(KEY, []).map((item) => item.cartKey === cartKey ? { ...item, quantity: Math.max(1, quantity) } : item); writeJson(KEY, items); return summarize(items); }
  async removeItem(cartKey: string) { const items = readJson<CartItem[]>(KEY, []).filter((item) => item.cartKey !== cartKey); writeJson(KEY, items); return summarize(items); }
  async clear() { writeJson(KEY, []); return summarize([]); }
  async migrateGuestCart() { return this.getCart(); }
}
