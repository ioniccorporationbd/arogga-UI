import type { WishlistItem } from "@/types";

export interface WishlistRepository {
  list(userId?: string): Promise<WishlistItem[]>;
  add(item: WishlistItem): Promise<WishlistItem[]>;
  remove(productId: string): Promise<WishlistItem[]>;
  clear(userId?: string): Promise<WishlistItem[]>;
}
