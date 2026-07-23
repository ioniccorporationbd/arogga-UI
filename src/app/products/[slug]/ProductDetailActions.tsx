"use client";

import { Check, Heart, Minus, Plus, ShoppingBag, ShoppingCart, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { buildCartKey } from "@/lib/cart/cart-domain";
import { notify } from "@/lib/notify";
import type { ProductVariant } from "@/types";

type CartProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  sku: string;
  brand?: string;
  category?: string;
  rating?: number;
  stock?: number;
};

type ProductOption = { name?: string; value?: string; slug?: string };

type Props = {
  product: CartProduct;
  maxQuantity: number;
  disabled: boolean;
  options?: ProductOption[];
  variants?: ProductVariant[];
  packageLabel?: string;
  prescriptionRequired?: boolean;
};

function formatOptionLabel(options: Record<string, string>) {
  return Object.entries(options).map(([key, value]) => `${key}: ${value}`).join(" • ");
}

export default function ProductDetailActions({ product, maxQuantity, disabled, options = [], variants = [], packageLabel = "Standard Pack", prescriptionRequired = false }: Props) {
  const { addItem } = useCart();
  const { requireAuth } = useAuth();
  const wishlist = useWishlist();
  const router = useRouter();
  const availableVariants = variants.length > 0 ? variants : [{ id: `${product.id}:standard-pack`, productId: product.id, sku: product.sku, name: packageLabel, options: { pack: packageLabel }, regularPrice: product.price, salePrice: product.price, stock: product.stock || maxQuantity, image: product.image, maxQuantity, available: !disabled }];
  const [selectedVariantId, setSelectedVariantId] = useState(availableVariants[0]?.available ? availableVariants[0].id : "");
  const selectedVariant = availableVariants.find((variant) => variant.id === selectedVariantId) || null;
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const wishlisted = wishlist.has(product.id);

  const visibleOptions = useMemo(() => availableVariants.map((variant) => ({ id: variant.id, label: formatOptionLabel(variant.options) || variant.name, available: variant.available })), [availableVariants]);
  const effectivePrice = selectedVariant ? selectedVariant.salePrice ?? selectedVariant.regularPrice : product.price;
  const effectiveRegular = selectedVariant?.regularPrice ?? product.price;
  const effectiveImage = selectedVariant?.image || product.image;
  const effectiveMax = Math.max(1, Math.min(selectedVariant?.maxQuantity || maxQuantity, selectedVariant?.stock || maxQuantity));
  const stockMessage = selectedVariant ? selectedVariant.available ? `${selectedVariant.stock} items available` : "Selected variant is out of stock" : "Please select a variant";

  function validateVariant() {
    if (!selectedVariant) { notify.cart.selectVariant(); return false; }
    if (!selectedVariant.available || selectedVariant.stock <= 0 || disabled) { notify.cart.outOfStock(); return false; }
    if (quantity > effectiveMax) { notify.warning("Quantity adjusted to available stock"); setQuantity(effectiveMax); return false; }
    return true;
  }

  function cartPayload() {
    if (!selectedVariant) return null;
    return {
      cartKey: buildCartKey(product.id, selectedVariant.id),
      productId: product.id,
      variantId: selectedVariant.id,
      slug: product.slug,
      name: product.name,
      image: effectiveImage,
      sku: selectedVariant.sku,
      selectedOptions: selectedVariant.options,
      quantity,
      maxQuantity: effectiveMax,
      regularPrice: selectedVariant.regularPrice,
      salePrice: selectedVariant.salePrice ?? selectedVariant.regularPrice,
    };
  }

  function handleAddToCart() {
    if (!validateVariant()) return;
    const payload = cartPayload();
    if (!payload || !selectedVariant) return;
    if (!requireAuth({ reason: "Login to add this product to cart.", pendingAction: { type: "ADD_TO_CART", payload: { productId: product.id, variantId: selectedVariant.id, quantity } } })) return;
    addItem(payload, quantity);
    window.dispatchEvent(new Event("arogga-open-cart"));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  function handleBuyNow() {
    if (!validateVariant()) return;
    const payload = cartPayload();
    if (!payload || !selectedVariant) return;
    if (!requireAuth({ reason: "Login to buy this product now.", pendingAction: { type: "BUY_NOW", payload: { productId: product.id, variantId: selectedVariant.id, quantity } } })) return;
    sessionStorage.setItem("arogga-buy-now", JSON.stringify(payload));
    router.push("/checkout");
  }

  function handleWishlist() {
    wishlist.toggleWithAuth({ id: product.id, productId: product.id, slug: product.slug, name: product.name, price: effectivePrice, image: effectiveImage, sku: selectedVariant?.sku || product.sku, brand: product.brand, category: product.category, rating: product.rating, stock: selectedVariant?.stock || product.stock });
  }

  return (
    <div className="pd-action-area">
      <div className="pd-option-picker">
        <div><span>Choose variant</span>{prescriptionRequired ? <small>Prescription may be required</small> : <small>{stockMessage}</small>}</div>
        <div className="pd-pack-options">
          {visibleOptions.map((item) => <button key={item.id} type="button" className={selectedVariantId === item.id ? "active" : ""} onClick={() => { setSelectedVariantId(item.id); setQuantity(1); }} disabled={!item.available} aria-pressed={selectedVariantId === item.id}>{item.label}</button>)}
          {visibleOptions.length === 0 ? options.map((item) => <button key={item.value || item.name} type="button" disabled>{item.value || item.name}</button>) : null}
        </div>
      </div>

      <div className="pd-price-line pd-variant-price"><div className="pd-price"><strong>৳{Math.round(effectivePrice).toLocaleString()}</strong>{effectivePrice < effectiveRegular ? <del>৳{Math.round(effectiveRegular).toLocaleString()}</del> : null}</div><small>{selectedVariant ? selectedVariant.sku : "Select a variant"}</small></div>
      {selectedVariant?.image && selectedVariant.image !== product.image ? <p className="pd-action-note"><span>Variant image selected for cart: {selectedVariant.name}</span></p> : null}

      <div className="pd-actions pd-sticky-purchase-bar">
        <div className="pd-quantity" aria-label="Product quantity"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={15} /></button><span>{quantity}</span><button type="button" onClick={() => setQuantity((value) => Math.min(effectiveMax, value + 1))} aria-label="Increase quantity"><Plus size={15} /></button></div>
        <button type="button" className={`pd-cart-button ${added ? "is-added" : ""}`} onClick={handleAddToCart} disabled={disabled || !selectedVariant?.available} aria-label={`${disabled ? "Out of stock" : added ? "Added to cart" : "Add to cart"}: ${product.name}`}>{added ? <Check size={16} /> : <ShoppingCart size={16} />}<span>{disabled ? "Out of stock" : added ? "Added" : "Add to Cart"}</span></button>
        <button type="button" className="pd-cart-button pd-buy-now" onClick={handleBuyNow} disabled={disabled || !selectedVariant?.available}><Zap size={16} /><span>Buy Now</span></button>
        <button type="button" className={`pd-wishlist-button ${wishlisted ? "is-active" : ""}`} onClick={handleWishlist} aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}><Heart fill={wishlisted ? "currentColor" : "none"} /></button>
      </div>
      <div className="pd-action-note"><span><ShoppingBag size={14} /> Selected options appear in cart</span><span><Heart size={14} /> Save to wishlist anytime</span></div>
    </div>
  );
}
