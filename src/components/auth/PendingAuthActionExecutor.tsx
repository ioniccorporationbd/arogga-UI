"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { notify } from "@/lib/notify";
import { usePendingAuthActionStore } from "@/stores/pendingAuthActionStore";

type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  image?: string;
  price?: number;
  salePrice?: number;
  regularPrice?: number;
  sku?: string;
  brand?: string;
  category?: string;
  rating?: number;
  stock?: number;
  stockStatus?: string;
};

async function getProduct(productId: string): Promise<CatalogProduct | null> {
  const response = await fetch(`/api/catalog/products?limit=250`, { cache: "no-store" });
  if (!response.ok) return null;
  const data = await response.json();
  const products = Array.isArray(data?.products) ? data.products : Array.isArray(data?.items) ? data.items : [];
  return products.find((item: CatalogProduct) => item.id === productId || item.slug === productId) || null;
}

export default function PendingAuthActionExecutor() {
  const { user } = useAuth();
  const router = useRouter();
  const cart = useCart();
  const wishlist = useWishlist();
  const pendingAction = usePendingAuthActionStore((state) => state.pendingAction);
  const clearPendingAction = usePendingAuthActionStore((state) => state.clearPendingAction);

  useEffect(() => {
    if (!user || !pendingAction) return;
    const action = pendingAction;
    let cancelled = false;

    async function run() {
      try {
        switch (action.type) {
          case "ADD_TO_CART":
          case "BUY_NOW": {
            const product = await getProduct(action.payload.productId);
            if (!product || cancelled) return;
            const price = product.salePrice ?? product.price ?? product.regularPrice ?? 0;
            if ((product.stockStatus && product.stockStatus !== "in_stock") || product.stock === 0) {
              notify.cart.outOfStock();
              return;
            }
            cart.addItem({
              cartKey: `${product.id}:${action.payload.variantId || product.id}`,
              productId: product.id,
              variantId: action.payload.variantId || product.id,
              slug: product.slug,
              name: product.name,
              price,
              image: product.image || "/placeholder-product.png",
              sku: product.sku || action.payload.variantId,
              selectedOptions: {},
              maxQuantity: product.stock || 99,
              regularPrice: product.regularPrice,
            }, action.payload.quantity);
            window.dispatchEvent(new Event("arogga-open-cart"));
            if (action.type === "BUY_NOW") router.push("/checkout");
            break;
          }
          case "ADD_TO_WISHLIST": {
            const product = await getProduct(action.payload.productId);
            if (!product || cancelled) return;
            wishlist.add({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.salePrice ?? product.price ?? product.regularPrice ?? 0,
              image: product.image || "/placeholder-product.png",
              sku: product.sku,
              brand: product.brand,
              category: product.category,
              rating: product.rating,
              stock: product.stock,
            });
            break;
          }
          case "CHECKOUT":
            router.push("/checkout");
            break;
          case "OPEN_ORDERS":
            router.push("/orders");
            break;
          case "OPEN_INBOX":
            router.push("/inbox");
            break;
          case "OPEN_ACCOUNT_SECTION":
            router.push(`/account/${action.payload.section}`);
            break;
        }
      } catch (error) {
        notify.error(error instanceof Error ? error.message : "Could not complete the requested action");
      } finally {
        clearPendingAction();
      }
    }

    void run();
    return () => { cancelled = true; };
  }, [cart, clearPendingAction, pendingAction, router, user, wishlist]);

  return null;
}
