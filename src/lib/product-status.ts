export type ProductStatus =
  | "available"
  | "out_of_stock"
  | "inactive"
  | "hidden"
  | "unavailable"
  | "invalid";

export interface ProductStatusInput {
  status?: string;
  visibility?: string;

  inventory?: {
    trackQuantity?: boolean;
    stockStatus?: string;
    totalQuantity?: number;
    reservedQuantity?: number;
    availableQuantity?: number;
    allowBackorder?: boolean;
  };

  availability?: {
    isAvailable?: boolean;
    availableFrom?: string | null;
    availableUntil?: string | null;
  };
}

export interface ProductStatusResult {
  status: ProductStatus;
  label: string;
  canAddToCart: boolean;
  isAvailable: boolean;
  isInStock: boolean;
  availableQuantity: number;
}

function createUnavailableStatus(
  status: ProductStatus,
  label: string,
  availableQuantity = 0,
): ProductStatusResult {
  return {
    status,
    label,
    canAddToCart: false,
    isAvailable: false,
    isInStock: false,
    availableQuantity,
  };
}

function isBeforeAvailableDate(
  availableFrom?: string | null,
): boolean {
  if (!availableFrom) {
    return false;
  }

  const date = new Date(availableFrom);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return Date.now() < date.getTime();
}

function isAfterAvailableDate(
  availableUntil?: string | null,
): boolean {
  if (!availableUntil) {
    return false;
  }

  const date = new Date(availableUntil);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return Date.now() > date.getTime();
}

export function getProductStatus(
  product?: ProductStatusInput | null,
): ProductStatusResult {
  if (!product) {
    return createUnavailableStatus(
      "invalid",
      "Product information unavailable",
    );
  }

  if (!product.inventory) {
    return createUnavailableStatus(
      "invalid",
      "Inventory information unavailable",
    );
  }

  const availableQuantity = Math.max(
    0,
    Number(product.inventory.availableQuantity ?? 0),
  );

  if (product.status !== "active") {
    return createUnavailableStatus(
      "inactive",
      "Inactive",
      availableQuantity,
    );
  }

  if (product.visibility !== "public") {
    return createUnavailableStatus(
      "hidden",
      "Not publicly available",
      availableQuantity,
    );
  }

  if (
    product.availability?.isAvailable === false ||
    isBeforeAvailableDate(
      product.availability?.availableFrom,
    ) ||
    isAfterAvailableDate(
      product.availability?.availableUntil,
    )
  ) {
    return createUnavailableStatus(
      "unavailable",
      "Currently unavailable",
      availableQuantity,
    );
  }

  const stockStatus =
    product.inventory.stockStatus ??
    (availableQuantity > 0
      ? "in_stock"
      : "out_of_stock");

  const hasAvailableStock =
    stockStatus === "in_stock" &&
    availableQuantity > 0;

  const canBackorder =
    product.inventory.allowBackorder === true;

  if (!hasAvailableStock && !canBackorder) {
    return createUnavailableStatus(
      "out_of_stock",
      "Out of stock",
      availableQuantity,
    );
  }

  return {
    status: "available",
    label: canBackorder && !hasAvailableStock
      ? "Available for backorder"
      : "In stock",
    canAddToCart: true,
    isAvailable: true,
    isInStock: hasAvailableStock,
    availableQuantity,
  };
}

export function calculateAvailableQuantity(
  totalQuantity?: number,
  reservedQuantity?: number,
): number {
  return Math.max(
    0,
    Number(totalQuantity ?? 0) -
      Number(reservedQuantity ?? 0),
  );
}

export function getStockStatus(
  availableQuantity?: number,
): "in_stock" | "out_of_stock" {
  return Number(availableQuantity ?? 0) > 0
    ? "in_stock"
    : "out_of_stock";
}