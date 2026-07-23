import type { CartItem, CartSummary } from "@/types";
import type { CartRepository } from "../interfaces/CartRepository";
import { NotConfiguredError } from "./NotConfiguredError";
const reject = <T>(name: string): Promise<T> => Promise.reject(new NotConfiguredError(name));
export class RemoteCartRepository implements CartRepository {
  getCart(_userId?: string): Promise<CartSummary> { return reject("RemoteCartRepository.getCart"); }
  addItem(_item: CartItem): Promise<CartSummary> { return reject("RemoteCartRepository.addItem"); }
  updateQuantity(_cartKey: string, _quantity: number): Promise<CartSummary> { return reject("RemoteCartRepository.updateQuantity"); }
  removeItem(_cartKey: string): Promise<CartSummary> { return reject("RemoteCartRepository.removeItem"); }
  clear(_userId?: string): Promise<CartSummary> { return reject("RemoteCartRepository.clear"); }
  migrateGuestCart(_userId: string): Promise<CartSummary> { return reject("RemoteCartRepository.migrateGuestCart"); }
}
