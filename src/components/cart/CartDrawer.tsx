"use client";

import { useEffect, useRef } from "react";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import CartDrawerHeader from "./CartDrawerHeader";
import CartError from "./CartError";
import CartItemList from "./CartItemList";
import CartSkeleton from "./CartSkeleton";
import CartSummary from "./CartSummary";
import CartTabs from "./CartTabs";
import EmptyCart from "./EmptyCart";

type Props = { open: boolean; onClose: () => void };

export default function CartDrawer({ open, onClose }: Props) {
  const drawerRef = useRef<HTMLElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const cart = useCart();
  const wishlist = useWishlist();
  const { requireAuth } = useAuth();

  useEffect(() => {
    if (!open) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => drawerRef.current?.focus(), 60);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      lastFocusedRef.current?.focus?.();
    };
  }, [open, onClose]);

  function moveToWishlist(cartKey: string) {
    const item = cart.moveToWishlist(cartKey);
    if (!item) return;
    wishlist.add({
      id: item.productId,
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      price: item.salePrice ?? item.regularPrice ?? 0,
      image: item.image,
      sku: item.sku,
    });
  }

  function checkout() {
    if (!requireAuth({ reason: "Login to continue checkout.", pendingAction: { type: "CHECKOUT" } })) return;
    onClose();
  }

  return (
    <>
      <button aria-label="Close cart" className={`cart-drawer-backdrop ${open ? "open" : ""}`} onClick={onClose} type="button" />
      <aside ref={drawerRef} tabIndex={-1} className={`cart-drawer-shell ${open ? "open" : ""}`} aria-hidden={!open} aria-label="Shopping cart drawer">
        <CartDrawerHeader count={cart.count} onClose={onClose} />
        <CartTabs />
        {cart.loading ? <CartSkeleton /> : null}
        {cart.error ? <CartError message={cart.error} /> : null}
        {!cart.loading && cart.items.length === 0 ? <EmptyCart onClose={onClose} /> : null}
        {cart.items.length > 0 ? (
          <>
            <CartItemList items={cart.items} onQuantity={cart.updateQuantity} onRemove={cart.removeItem} onMoveToWishlist={moveToWishlist} />
            <CartSummary subtotal={cart.subtotal} discount={cart.discount} vat={cart.vat} shipping={cart.shipping} grandTotal={cart.grandTotal} onCheckout={checkout} />
          </>
        ) : null}
      </aside>
    </>
  );
}
