"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, PackageCheck, ShoppingBag, Star, Trash2, X } from "lucide-react";
import { useState } from "react";

import ProtectedActionPrompt from "@/Components/auth/ProtectedActionPrompt";
import { useAuth } from "@/context/AuthContext";
import { useWishlist, type WishlistItem } from "@/context/WishlistContext";
import "./wishlist.css";

function getProductHref(product: WishlistItem) {
  return `/product/${product.slug || product.id}`;
}

export default function WishlistPage() {
  const { user, ready } = useAuth();
  const { items, remove } = useWishlist();
  const [deleteTarget, setDeleteTarget] = useState<WishlistItem | null>(null);

  if (ready && !user) {
    return (
      <ProtectedActionPrompt
        title="Login to view wishlist"
        message="Your saved products are private. Login first, then you can save, remove, and buy wishlist products from your profile."
        reason="Login to view and manage your wishlist."
      />
    );
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    remove(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <main className="wish-page">
      <header className="wish-hero">
        <div>
          <span><Heart size={16} /> Profile wishlist</span>
          <h1>My Wishlist Products</h1>
          <p>Products saved from details page appear here with price, image, brand, category, delete and buy actions.</p>
        </div>
        <b>{items.length} item{items.length === 1 ? "" : "s"}</b>
      </header>

      {items.length ? (
        <div className="wish-grid">
          {items.map((product) => (
            <article key={product.id} className="wish-card">
              <Link href={getProductHref(product)} className="wish-image" aria-label={`View ${product.name}`}>
                <Image src={product.image} alt={product.name} fill sizes="260px" unoptimized />
              </Link>

              <div className="wish-card-body">
                <div className="wish-meta-row">
                  <span>{product.category || "Saved Product"}</span>
                  {product.rating ? <small><Star size={13} fill="currentColor" /> {product.rating.toFixed(1)}</small> : null}
                </div>
                <Link href={getProductHref(product)} className="wish-title">{product.name}</Link>
                <div className="wish-card-info">
                  <strong>৳{product.price.toFixed(0)}</strong>
                  <small>{product.brand || "Arogga catalog"}</small>
                </div>
                <div className="wish-stock">
                  <PackageCheck size={15} />
                  {typeof product.stock === "number" ? `${product.stock} stock available` : "Ready to buy"}
                </div>
              </div>

              <div className="wish-actions">
                <Link href={getProductHref(product)} className="wish-buy">
                  <ShoppingBag size={16} />
                  Buy Now
                  <ArrowRight size={15} />
                </Link>
                <button type="button" onClick={() => setDeleteTarget(product)} aria-label={`Delete ${product.name}`}>
                  <Trash2 />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="wish-empty">
          <Heart />
          <h2>No saved products yet</h2>
          <p>Open any product details page and tap the heart button. That product will appear on this profile wishlist page.</p>
          <Link href="/store">Browse products</Link>
        </section>
      )}

      {deleteTarget ? (
        <div className="wish-modal-backdrop" role="presentation">
          <section className="wish-delete-modal" role="dialog" aria-modal="true" aria-labelledby="wish-delete-title">
            <button type="button" className="wish-modal-close" onClick={() => setDeleteTarget(null)} aria-label="Close delete confirmation">
              <X />
            </button>
            <div className="wish-delete-icon"><Trash2 /></div>
            <h2 id="wish-delete-title">Delete from wishlist?</h2>
            <p>Are you sure you want to remove <strong>{deleteTarget.name}</strong> from your profile wishlist?</p>
            <div>
              <button type="button" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button type="button" onClick={confirmDelete}>Yes, delete</button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
