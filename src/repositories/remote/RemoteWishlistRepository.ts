import type { WishlistItem } from "@/types";
import type { WishlistRepository } from "../interfaces/WishlistRepository";
import { NotConfiguredError } from "./NotConfiguredError";
const reject = <T>(name: string): Promise<T> => Promise.reject(new NotConfiguredError(name));
export class RemoteWishlistRepository implements WishlistRepository {
  list(_userId?: string): Promise<WishlistItem[]> { return reject("RemoteWishlistRepository.list"); }
  add(_item: WishlistItem): Promise<WishlistItem[]> { return reject("RemoteWishlistRepository.add"); }
  remove(_productId: string): Promise<WishlistItem[]> { return reject("RemoteWishlistRepository.remove"); }
  clear(_userId?: string): Promise<WishlistItem[]> { return reject("RemoteWishlistRepository.clear"); }
}
