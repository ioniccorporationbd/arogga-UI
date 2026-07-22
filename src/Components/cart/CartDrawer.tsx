"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bike,
  CheckCircle2,
  ChevronDown,
  FlaskConical,
  ShoppingBag,
  Store,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

import { useCart, type CartItem } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import styles from "./CartDrawer.module.css";

function getQuantityOptions(item: CartItem) {
  const max = Math.min(Math.max(item.maxQuantity ?? 4, 1), 6);
  return Array.from({ length: max }, (_, index) => index + 1);
}

function getPackLabel(item: CartItem) {
  if (!item.sku) return "Standard pack";
  return item.sku.split("/").map((part) => part.trim()).filter(Boolean).at(-1) || item.sku;
}

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, count, subtotal, removeItem, updateQuantity } = useCart();
  const { requireAuth } = useAuth();
  const [quantityPicker, setQuantityPicker] = useState<string | null>(null);

  const activeItem = items.find((item) => item.id === quantityPicker) ?? null;

  function closeDrawer() {
    setQuantityPicker(null);
    onClose();
  }

  return (
    <>
      <button
        aria-label="Close cart"
        className={`${styles.backdrop} ${open ? styles.open : ""}`}
        onClick={closeDrawer}
        type="button"
      />

      <aside className={`${styles.drawer} ${open ? styles.open : ""}`} aria-hidden={!open}>
        <header className={styles.header}>
          <div>
            <h2>Shopping Cart</h2>
            <span>{count} item{count === 1 ? "" : "s"} ready</span>
          </div>
          <button type="button" onClick={closeDrawer} aria-label="Close cart">
            <X />
          </button>
        </header>

        <div className={styles.tabs}>
          <button type="button" className={styles.active}>
            <Store />
            <span>Store</span>
            <b>{count}</b>
          </button>
          <button type="button">
            <FlaskConical />
            <span>Lab</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <div><ShoppingBag /></div>
            <p>Your cart is empty</p>
            <Link href="/store" onClick={closeDrawer}>Start Shopping</Link>
          </div>
        ) : (
          <>
            <div className={styles.content}>
              <section className={styles.list} aria-label="Cart products">
                {items.map((item) => {
                  const packLabel = getPackLabel(item);
                  return (
                    <article key={item.id} className={styles.itemCard}>
                      <Link href={`/products/${item.slug}`} onClick={closeDrawer} className={styles.image} aria-label={`View ${item.name}`}>
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill sizes="78px" unoptimized />
                        ) : (
                          <ShoppingBag />
                        )}
                      </Link>

                      <div className={styles.info}>
                        <Link href={`/products/${item.slug}`} onClick={closeDrawer} className={styles.title}>
                          {item.name}
                        </Link>
                        <span>Pack Size: {packLabel}</span>
                        {item.sku ? <small>{item.sku}</small> : null}
                        <button
                          type="button"
                          className={styles.qtySelect}
                          onClick={() => setQuantityPicker((current) => current === item.id ? null : item.id)}
                          aria-expanded={quantityPicker === item.id}
                        >
                          Qty: {item.quantity}
                          <ChevronDown />
                        </button>
                      </div>

                      <div className={styles.priceColumn}>
                        <button type="button" className={styles.remove} onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
                          <Trash2 />
                        </button>
                        <strong>৳{(item.price * item.quantity).toFixed(0)}</strong>
                      </div>
                    </article>
                  );
                })}
              </section>

              <section className={styles.address}>
                <h3>Shipping Address</h3>
                <p>You haven&apos;t added any address yet.</p>
                <Link href="/account/addresses" onClick={(event) => {
                  if (requireAuth({ reason: "Login to add a delivery address." })) {
                    closeDrawer();
                    return;
                  }
                  event.preventDefault();
                }}>Add New Address</Link>
              </section>

              <section className={styles.coupon}>
                <a href="#coupon"><Tag /> Have coupon code?</a>
                <div><CheckCircle2 /> You are saving with store offers</div>
              </section>

              <section className={styles.summary}>
                <div><span>Subtotal (MRP)</span><strong>৳{subtotal.toFixed(0)}</strong></div>
                <div><span>Discount applied</span><strong>-৳0</strong></div>
                <div className={styles.delivery}><span><Bike /> Regular Delivery</span><strong>Free</strong></div>
              </section>
            </div>

            <footer className={styles.footer}>
              <div>
                <span><ShoppingBag /></span>
                <p><small>{count} Item{count === 1 ? "" : "s"}</small><strong>৳{subtotal.toFixed(0)}</strong></p>
              </div>
              <Link href="/checkout" onClick={(event) => {
                if (requireAuth({ reason: "Login to continue checkout." })) {
                  closeDrawer();
                  return;
                }
                event.preventDefault();
              }}>Select Address</Link>
            </footer>
          </>
        )}

        {activeItem ? (
          <div className={styles.quantityPopover} role="dialog" aria-label="Select quantity">
            <header>
              <strong>Select quantity</strong>
              <button type="button" onClick={() => setQuantityPicker(null)} aria-label="Close quantity selector"><X /></button>
            </header>
            <div>
              {getQuantityOptions(activeItem).map((quantity) => (
                <button
                  type="button"
                  key={quantity}
                  className={quantity === activeItem.quantity ? styles.selectedQuantity : ""}
                  onClick={() => {
                    updateQuantity(activeItem.id, quantity);
                    setQuantityPicker(null);
                  }}
                >
                  {quantity} × {getPackLabel(activeItem)}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
}
