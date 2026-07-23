import "server-only";

import { getProductByIdentifier, getProductsData } from "@/lib/data";
import type { EcommerceProduct } from "@/lib/products";

export async function getServerProducts(): Promise<EcommerceProduct[]> {
  return getProductsData();
}

export async function getServerProductByIdentifier(identifier: string): Promise<EcommerceProduct | undefined> {
  return getProductByIdentifier(identifier);
}
