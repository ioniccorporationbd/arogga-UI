"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import styles from "./AddToCartButton.module.css";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    sku?: string;
    maxQuantity?: number;
  };
  quantity?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
  addedLabel?: string;
  showIcon?: boolean;
  onAdded?: () => void;
};

export default function AddToCartButton({
  product,
  quantity = 1,
  disabled = false,
  className = "",
  label = "Add to cart",
  addedLabel = "Added",
  showIcon = false,
  onAdded,
}: Props) {
  const { addItem } = useCart();
  const { requireAuth } = useAuth();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    if (disabled) return;
    if (!requireAuth({
      reason: "Login to add products to your cart.",
      pendingAction: { type: "ADD_TO_CART", payload: { productId: product.id, variantId: product.id, quantity } },
    })) return;

    addItem(product, quantity);
    setAdded(true);
    onAdded?.();
    window.setTimeout(() => setAdded(false), 1400);
  }

  const buttonLabel = disabled ? "Out of stock" : added ? addedLabel : label;

  return (
    <button
      type="button"
      className={[
        styles.button,
        added ? styles.added : "",
        added ? styles.pulse : "",
        className,
      ].join(" ")}
      onClick={handleAddToCart}
      disabled={disabled}
      aria-label={`${buttonLabel}: ${product.name}`}
      aria-live="polite"
    >
      {showIcon ? (
        <span className={styles.icon} aria-hidden="true">
          {added ? <Check /> : <ShoppingCart />}
        </span>
      ) : null}
      <span className={styles.label}>{buttonLabel}</span>
    </button>
  );
}
