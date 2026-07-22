"use client";

import { Check, Heart, Minus, Plus, ShoppingBag, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

type CartProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  sku: string;
};

type ProductOption = {
  name?: string;
  value?: string;
  slug?: string;
};

type Props = {
  product: CartProduct;
  maxQuantity: number;
  disabled: boolean;
  options?: ProductOption[];
  packageLabel?: string;
  prescriptionRequired?: boolean;
};

export default function ProductDetailActions({
  product,
  maxQuantity,
  disabled,
  options = [],
  packageLabel = "Standard Pack",
  prescriptionRequired = false,
}: Props) {
  const { addItem } = useCart();
  const { requireAuth } = useAuth();
  const wishlist = useWishlist();
  const safeMaximum = Math.max(1, maxQuantity);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const packOptions = useMemo(() => {
    const dynamicOptions = options
      .map((option) => option.value || option.name)
      .filter((value): value is string => Boolean(value && value.trim()))
      .map((value) => value.trim());

    return Array.from(new Set([packageLabel, ...dynamicOptions, "Value Pack", "Family Pack"])).slice(0, 5);
  }, [options, packageLabel]);

  const [selectedPack, setSelectedPack] = useState(packOptions[0] || packageLabel);
  const wishlisted = wishlist.has(product.id);

  const cartProduct = {
    ...product,
    id: `${product.id}:${selectedPack}`,
    name: selectedPack === packageLabel ? product.name : `${product.name} - ${selectedPack}`,
    sku: `${product.sku} / ${selectedPack}`,
    maxQuantity: safeMaximum,
  };

  function handleAddToCart() {
    if (disabled) return;
    if (!requireAuth({ reason: "Login to add this product to cart." })) return;
    addItem(cartProduct, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  function handleWishlist() {
    if (!requireAuth({ reason: "Login to save products to wishlist." })) return;
    wishlist.toggle({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  }

  return (
    <div className="pd-action-area">
      <div className="pd-option-picker">
        <div>
          <span>Choose pack</span>
          {prescriptionRequired ? <small>Prescription may be required</small> : <small>Ready for online order</small>}
        </div>

        <div className="pd-pack-options">
          {packOptions.map((item) => (
            <button
              key={item}
              type="button"
              className={selectedPack === item ? "active" : ""}
              onClick={() => setSelectedPack(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="pd-actions">
        <div className="pd-quantity" aria-label="Product quantity">
          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
            <Minus size={15} />
          </button>
          <span>{quantity}</span>
          <button type="button" onClick={() => setQuantity((value) => Math.min(safeMaximum, value + 1))} aria-label="Increase quantity">
            <Plus size={15} />
          </button>
        </div>

        <button
          type="button"
          className={`pd-cart-button ${added ? "is-added" : ""}`}
          onClick={handleAddToCart}
          disabled={disabled}
          aria-label={`${disabled ? "Out of stock" : added ? "Added to cart" : "Add to cart"}: ${product.name}`}
        >
          {added ? <Check size={16} /> : <ShoppingCart size={16} />}
          <span>{disabled ? "Out of stock" : added ? "Added" : "Add to Cart"}</span>
        </button>

        <button
          type="button"
          className={`pd-wishlist-button ${wishlisted ? "is-active" : ""}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="pd-action-note">
        <span><ShoppingBag size={14} /> Cart updates instantly</span>
        <span><Heart size={14} /> Save to wishlist anytime</span>
      </div>
    </div>
  );
}
