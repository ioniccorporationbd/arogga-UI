import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Clock3, Star } from "lucide-react";
import type { EcommerceProduct } from "@/lib/products";
import { getCurrencySymbol, getProductDiscount, getProductPrice } from "@/lib/products";
import AddToCartControl from "./AddToCartControl";

export default function CategoryProductCard({ product }: { product: EcommerceProduct }) {
  const price = getProductPrice(product);
  const discount = getProductDiscount(product);
  const oldPrice = product.pricing.compareAtPrice ?? product.pricing.regularPrice;
  const image = product.media.featuredImage.thumbnailUrl || product.media.featuredImage.url;
  const symbol = getCurrencySymbol(product.pricing.currency);
  const available = product.inventory.availableQuantity ?? 0;
  const href = `/products/${product.slug}`;

  return (
    <article className="category-product-card">
      <Link href={href} className="category-product-image-wrap" aria-label={`View ${product.name}`}>
        {discount > 0 && <span className="category-discount-badge">Save {discount}%</span>}
        {available > 0 && available <= product.inventory.lowStockThreshold && <span className="category-low-stock">Only {available} left</span>}
        <Image
          src={image}
          alt={product.media.featuredImage.alt || product.name}
          fill
          sizes="(max-width: 480px) 46vw, (max-width: 768px) 31vw, (max-width: 1100px) 23vw, 210px"
          className="category-product-image"
        />
      </Link>

      <div className="category-product-body">
        <div className="category-product-meta">
          <p className="category-product-brand"><BadgeCheck size={12} />{product.brand?.name || "Arogga"}</p>
          {product.shipping?.delivery?.sameDayEligible && <span className="category-fast-delivery"><Clock3 size={11} />Same day</span>}
        </div>

        <Link href={href} className="category-product-name">{product.name}</Link>

        <div className="category-rating" aria-label={`${product.ratings.average ?? 0} out of 5 stars`}>
          <Star size={13} fill="currentColor" strokeWidth={0} />
          <strong>{product.ratings.average?.toFixed(1) ?? "0.0"}</strong>
          <span>({product.ratings.count ?? 0})</span>
        </div>

        <div className="category-price-line">
          <div className="category-product-prices">
            {oldPrice > price && <span className="category-old-price">{symbol}{oldPrice.toFixed(2)}</span>}
            <strong>{symbol}{price.toFixed(2)}</strong>
          </div>
          <AddToCartControl
            item={{ id: product.id, slug: product.slug, name: product.name, image, price }}
            availableQuantity={available}
            maximumQuantity={product.purchaseRules.maximumQuantity}
          />
        </div>
      </div>
    </article>
  );
}
