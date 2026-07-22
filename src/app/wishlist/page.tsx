"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";

import AddToCartButton from "@/Components/cart/AddToCartButton";
import ProtectedActionPrompt from "@/Components/auth/ProtectedActionPrompt";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import "./wishlist.css";

export default function WishlistPage() {
  const { user, ready } = useAuth();
  const { items, remove } = useWishlist();

  if (ready && !user) {
    return (
      <ProtectedActionPrompt
        title="Login to view wishlist"
        message="Your saved products are private. Login first, then you can save, remove, and add wishlist products to cart."
        reason="Login to view and manage your wishlist."
      />
    );
  }

  return (
    <main className="wish-page">
      <header>
        <div><span>Saved products</span><h1>My Wishlist</h1></div>
        <b>{items.length} items</b>
      </header>
      {items.length ? (
        <div className="wish-grid">
          {items.map((product) => (
            <article key={product.id}>
              <div className="wish-image">
                <Image src={product.image} alt={product.name} fill sizes="240px" unoptimized />
              </div>
              <Link href={`/products/${product.id}`}>{product.name}</Link>
              <strong>৳{product.price.toFixed(0)}</strong>
              <div>
                <AddToCartButton
                  product={{ ...product, maxQuantity: 5 }}
                  label="Add"
                  addedLabel="Added"
                />
                <button type="button" onClick={() => remove(product.id)} aria-label={`Remove ${product.name}`}>
                  <Trash2 />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="wish-empty">
          <Heart />
          <h2>No saved products yet</h2>
          <p>Tap the heart icon on product pages to save products here.</p>
          <Link href="/store">Browse products</Link>
        </section>
      )}
    </main>
  );
}
