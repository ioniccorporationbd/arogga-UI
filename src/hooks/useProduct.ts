"use client";

import { useMemo } from "react";
import { useProducts } from "./useProducts";

export function useProduct(identifier: string) {
  const query = useProducts();
  const product = useMemo(
    () => query.data?.find((item) => String(item.id) === identifier || item.slug === identifier),
    [identifier, query.data],
  );
  return { ...query, product };
}
