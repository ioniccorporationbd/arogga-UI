import type { Notification } from "@/types";
import type { NotificationRepository } from "../interfaces/NotificationRepository";
function canUseStorage() { return typeof window !== "undefined" && typeof window.localStorage !== "undefined"; }
function readJson<T>(key: string, fallback: T): T { if (!canUseStorage()) return fallback; try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { window.localStorage.removeItem(key); return fallback; } }
function writeJson<T>(key: string, value: T) { if (canUseStorage()) window.localStorage.setItem(key, JSON.stringify(value)); }

const KEY = "arogga-repository-notifications";
export class LocalNotificationRepository implements NotificationRepository {
  async list() { return readJson<Notification[]>(KEY, []); }
  async unreadCount() { return (await this.list()).filter((item) => !item.read && !item.archived).length; }
  async markRead(id: string) { const items = (await this.list()).map((item) => item.id === id ? { ...item, read: true } : item); writeJson(KEY, items); return items; }
  async archive(id: string) { const items = (await this.list()).map((item) => item.id === id ? { ...item, archived: true } : item); writeJson(KEY, items); return items; }
  async remove(id: string) { const items = (await this.list()).filter((item) => item.id !== id); writeJson(KEY, items); return items; }
}
