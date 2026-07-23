import type { Product, ProductListItem } from "@/types";
import type { ProductListResult, ProductQuery, ProductRepository } from "../interfaces/ProductRepository";
import { NotConfiguredError } from "./NotConfiguredError";
const reject = <T>(name: string): Promise<T> => Promise.reject(new NotConfiguredError(name));
export class RemoteProductRepository implements ProductRepository {
  list(_query: ProductQuery = {}): Promise<ProductListResult> { return reject("RemoteProductRepository.list"); }
  searchSuggestions(_q: string, _limit = 10): Promise<ProductListItem[]> { return reject("RemoteProductRepository.searchSuggestions"); }
  getBySlug(_slug: string): Promise<Product | null> { return reject("RemoteProductRepository.getBySlug"); }
  getById(_id: string): Promise<Product | null> { return reject("RemoteProductRepository.getById"); }
}
