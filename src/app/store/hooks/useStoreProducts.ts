"use client";

import { useEffect, useState } from "react";
import type {
  JsonProduct,
  StoreProduct,
} from "../components/store-product-types";

export function useStoreProducts() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/catalog/products?shape=legacy", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Product data could not be loaded (${response.status}).`,
          );
        }

        const payload: unknown = await response.json();
        const payloadItems = payload && typeof payload === "object" && Array.isArray((payload as { items?: unknown }).items) ? (payload as { items: unknown[] }).items : payload;
        const array = Array.isArray(payloadItems) ? payloadItems : [payloadItems];

        setProducts(
          array
            .filter(isValidProduct)
            .map(normalizeProduct),
        );
      } catch (caughtError) {
        if (
          caughtError instanceof DOMException &&
          caughtError.name === "AbortError"
        ) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Product data could not be loaded.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, []);

  return { products, loading, error };
}

function normalizeProduct(product: JsonProduct): StoreProduct {
  const salePrice = Number(
    product.pricing.salePrice ?? product.pricing.regularPrice,
  );
  const discount = Math.max(
    0,
    Math.round(product.pricing.discount?.percentage ?? 0),
  );
  const originalPrice = Number(product.pricing.regularPrice);

  return {
    id: product.id,
    brand: product.brand.name,
    title: product.name,
    category:
      product.taxonomy.subCategory?.name ??
      product.taxonomy.category.name,
    image: product.media.featuredImage.url,
    rating: product.ratings.average,
    slug: product.slug,
    href: `/products/${product.id}`,
    salePrice,
    originalPrice,
    discount,
    reviewCount: product.ratings.count,
    currencySymbol: getCurrencySymbol(product.pricing.currency),
    deliveryText: `${product.shipping.delivery.estimatedMinimumDays}-${product.shipping.delivery.estimatedMaximumDays} DAYS`,
  };
}

function isValidProduct(value: unknown): value is JsonProduct {
  if (typeof value !== "object" || value === null) return false;

  const product = value as Partial<JsonProduct>;

  return (
    typeof product.id === "string" &&
    typeof product.slug === "string" &&
    typeof product.name === "string" &&
    typeof product.brand?.name === "string" &&
    typeof product.media?.featuredImage?.url === "string" &&
    typeof product.pricing?.regularPrice === "number" &&
    typeof product.pricing?.currency === "string" &&
    (typeof product.ratings?.average === "number" ||
      product.ratings?.average === null)
  );
}

function getCurrencySymbol(currency: string) {
  switch (currency.toUpperCase()) {
    case "BDT":
      return "৳";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "INR":
      return "₹";
    default:
      return `${currency} `;
  }
}
