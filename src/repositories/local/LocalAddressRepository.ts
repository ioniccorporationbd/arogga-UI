import type { Address } from "@/types";
import type { AddressRepository } from "../interfaces/AddressRepository";
function canUseStorage() { return typeof window !== "undefined" && typeof window.localStorage !== "undefined"; }
function readJson<T>(key: string, fallback: T): T { if (!canUseStorage()) return fallback; try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { window.localStorage.removeItem(key); return fallback; } }
function writeJson<T>(key: string, value: T) { if (canUseStorage()) window.localStorage.setItem(key, JSON.stringify(value)); }

const KEY = "arogga-repository-addresses";
export class LocalAddressRepository implements AddressRepository {
  async list() { return readJson<Address[]>(KEY, []); }
  async add(address: Address) { const items = [address, ...(await this.list())]; writeJson(KEY, items); return items; }
  async update(id: string, address: Partial<Address>) { const items = (await this.list()).map((item) => item.id === id ? { ...item, ...address } : item); writeJson(KEY, items); return items; }
  async remove(id: string) { const items = (await this.list()).filter((item) => item.id !== id); writeJson(KEY, items); return items; }
  async setDefault(id: string) { const items = (await this.list()).map((item) => { return { ...item, isDefault: item.id === id }; }); writeJson(KEY, items); return items; }
}
