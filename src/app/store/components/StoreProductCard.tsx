"use client";

import { ImageOff, Rocket, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import AddToCartButton from "@/Components/cart/AddToCartButton";
import type { StoreProduct } from "./store-product-types";

type StoreProductCardProps = {
  product: StoreProduct;
  added: boolean;
  onToggleCart: () => void;
};

export default function StoreProductCard({
  product,
  onToggleCart,
}: StoreProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const roundedRating = Math.round(product.rating ?? 0);

  return (
    <article
      data-store-product-card
      className="store-product-card-wrapper store-product-card"
    >
      <Link
        href={product.href}
        aria-label={`View details for ${product.title}`}
        className="store-product-image-link"
      >
        {!imageError ? (
          <img
            src={product.image}
            alt={product.title}
            width={500}
            height={500}
            loading="lazy"
            draggable={false}
            onError={() => setImageError(true)}
            className="store-product-image"
          />
        ) : (
          <div className="store-product-fallback">
            <ImageOff size={20} strokeWidth={1.7} />
            <span>Image unavailable</span>
          </div>
        )}

        <span aria-hidden="true" className="store-product-image-overlay" />
        <span aria-hidden="true" className="store-product-shine" />

        {product.discount > 0 && (
          <DiscountBadge discount={product.discount} />
        )}

        <span className="store-product-brand">
          {product.brand || "Product"}
        </span>
      </Link>

      <div className="store-product-content">
        <DeliveryBadge text={product.deliveryText} />

        <Link href={product.href} className="store-product-name" aria-label={`View details for ${product.title}`}>
          {product.title}
        </Link>

        <div className="store-product-rating">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={14}
              fill={index < roundedRating ? "#ffb400" : "#dce3ea"}
              strokeWidth={0}
            />
          ))}

          <span className="store-product-review-count">
            ({product.reviewCount})
          </span>
        </div>

        <div className="store-product-price-row">
          <div>
            <p className="store-product-old-price">
              {product.currencySymbol}
              {formatPrice(product.originalPrice)}
            </p>

            <p className="store-product-sale-price">
              {product.currencySymbol}
              {formatPrice(product.salePrice)}
            </p>
          </div>

          <AddToCartButton
            product={{
              id: product.id,
              slug: product.slug,
              name: product.title,
              price: product.salePrice,
              image: product.image,
              sku: product.brand,
            }}
            className="store-product-add-button"
            label="Add"
            addedLabel="Done"
            showIcon={false}
            onAdded={onToggleCart}
          />
        </div>
      </div>
    </article>
  );
}

function DeliveryBadge({ text }: { text: string }) {
  return (
    <div className="store-product-delivery">
      <span className="store-product-delivery-icon">
        <Rocket size={13} fill="currentColor" strokeWidth={0} />
      </span>
      {text}
    </div>
  );
}

function DiscountBadge({ discount }: { discount: number }) {
  return (
    <span
      className={[
        "store-product-discount",
        discount >= 30 ? "is-highlighted" : "",
      ].join(" ")}
    >
      {discount}%
      <br />
      OFF
    </span>
  );
}

function formatPrice(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}
