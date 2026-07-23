import type { Order } from "@/types";
import type { OrderRepository } from "../interfaces/OrderRepository";
function canUseStorage() { return typeof window !== "undefined" && typeof window.localStorage !== "undefined"; }
function readJson<T>(key: string, fallback: T): T { if (!canUseStorage()) return fallback; try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { window.localStorage.removeItem(key); return fallback; } }
function writeJson<T>(key: string, value: T) { if (canUseStorage()) window.localStorage.setItem(key, JSON.stringify(value)); }

const KEY = "arogga-repository-orders";
export class LocalOrderRepository implements OrderRepository {
  async list() { return readJson<Order[]>(KEY, []); }
  async getById(orderId: string) { return (await this.list()).find((order) => order.id === orderId || order.number === orderId) || null; }
  async createDraft(order: Omit<Order, "id" | "createdAt">) { const next: Order = { ...order, id: crypto.randomUUID(), createdAt: new Date().toISOString() }; const orders = [next, ...(await this.list())]; writeJson(KEY, orders); return next; }
  async cancel(orderId: string) { const orders = (await this.list()).map((order) => order.id === orderId ? { ...order, status: "cancelled" as const, updatedAt: new Date().toISOString() } : order); writeJson(KEY, orders); const updated = orders.find((order) => order.id === orderId); if (!updated) throw new Error("Order not found"); return updated; }
}
