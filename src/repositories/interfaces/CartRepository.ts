import type { CartItem, CartSummary } from "@/types";

export interface CartRepository {
  getCart(userId?: string): Promise<CartSummary>;
  addItem(item: CartItem): Promise<CartSummary>;
  updateQuantity(cartKey: string, quantity: number): Promise<CartSummary>;
  removeItem(cartKey: string): Promise<CartSummary>;
  clear(userId?: string): Promise<CartSummary>;
  migrateGuestCart(userId: string): Promise<CartSummary>;
}
