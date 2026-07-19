import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  ChevronRight,
  CircleHelp,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { getCurrencySymbol, getProductDiscount, getProductPrice } from "@/lib/products";
import { getServerProductBySlug } from "@/lib/server-products";
import ProductDetailActions from "./ProductDetailActions";
import ProductRecommendations from "./ProductRecommendations";
import "./product-detail.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getServerProductBySlug(slug);

  if (!product) return {};

  return {
    title: product.seo?.metaTitle || product.name,
    description: product.seo?.metaDescription || product.content?.shortDescription || product.name,
    alternates: product.seo?.canonicalUrl ? { canonical: product.seo.canonicalUrl } : undefined,
  };
}

function listOrFallback(items: string[] | undefined, fallback: string[]) {
  return Array.isArray(items) && items.length > 0 ? items : fallback;
}

function numberOrFallback(value: number | null | undefined, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getServerProductBySlug(slug);
  if (!product) notFound();

  const price = getProductPrice(product);
  const regularPrice = numberOrFallback(product.pricing?.regularPrice, price);
  const symbol = getCurrencySymbol(product.pricing?.currency || "BDT");
  const discount = getProductDiscount(product);
  const image = product.media?.featuredImage?.url || "/images/product-fallback.png";
  const imageAlt = product.media?.featuredImage?.alt || product.name;
  const gallery = [
    image,
    ...(product.media?.gallery || []).map((item) => item.url).filter(Boolean),
  ].slice(0, 5);
  const rating = numberOrFallback(product.ratings?.average, 0);
  const ratingCount = numberOrFallback(product.ratings?.count, 0);
  const availableQuantity = numberOrFallback(product.inventory?.availableQuantity, 0);
  const categoryName = product.taxonomy?.subCategory?.name || product.taxonomy?.category?.name || "Products";
  const categorySlug = product.taxonomy?.subCategory?.slug || product.taxonomy?.category?.slug || "all";
  const maximumQuantity = Math.max(
    1,
    Math.min(product.purchaseRules?.maximumQuantity || 10, availableQuantity || 1),
  );
  const features = product.content?.features || [];
  const highlights = listOrFallback(product.content?.highlights, ["Quality product", "Easy to use"]);
  const benefits = listOrFallback(product.content?.benefits, ["Suitable for everyday use"]);
  const howToUse = listOrFallback(product.content?.howToUse, ["Use according to the product instructions."]);
  const warnings = listOrFallback(product.content?.warnings, ["Keep out of reach of children."]);
  const ingredients = listOrFallback(product.content?.ingredients, ["See product packaging for ingredient details."]);
  const returnDays = numberOrFallback(product.seller?.returnPolicy?.returnWindowDays, 7);
  const minimumDelivery = numberOrFallback(product.shipping?.delivery?.estimatedMinimumDays, 2);
  const maximumDelivery = numberOrFallback(product.shipping?.delivery?.estimatedMaximumDays, 5);
  const fiveStarWidth = ratingCount > 0 ? Math.min(100, Math.max(8, (rating / 5) * 100)) : 0;

  return (
    <div className="pd-page">
      <div className="pd-container">
        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><ChevronRight size={13} />
          <Link href="/store">Store</Link><ChevronRight size={13} />
          <Link href={`/store?category=${categorySlug}`}>{categoryName}</Link><ChevronRight size={13} />
          <span>{product.shortName || product.name}</span>
        </nav>

        <section className="pd-main">
          <div className="pd-gallery-column">
            <div className="pd-thumbnails" aria-label="Product images">
              {gallery.map((galleryImage, index) => (
                <div className={`pd-thumb ${index === 0 ? "active" : ""}`} key={`${galleryImage}-${index}`}>
                  <Image src={galleryImage} alt={`${imageAlt} view ${index + 1}`} fill sizes="72px" className="pd-thumb-image" unoptimized />
                </div>
              ))}
            </div>

            <div className="pd-media">
              {discount > 0 && <span className="pd-discount">{discount}% OFF</span>}
              <div className="pd-image-wrap">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 48vw"
                  priority
                  className="pd-image"
                  unoptimized
                />
              </div>
            </div>
          </div>

          <aside className="pd-purchase-card">
            <p className="pd-brand">{product.brand?.name || "Arogga Store"}</p>
            <h1>{product.name}</h1>
            <p className="pd-subtitle">{product.subtitle || product.content?.shortDescription}</p>

            <div className="pd-rating">
              <strong>{rating.toFixed(1)}</strong>
              <span>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={16} fill={index < Math.round(rating) ? "#ffb400" : "#e5e7eb"} strokeWidth={0} />
                ))}
              </span>
              <Link href="#ratings">({ratingCount} ratings)</Link>
            </div>

            <div className="pd-pack-size">
              <span>Pack size</span>
              <strong>1&apos;s Pack</strong>
            </div>

            <div className="pd-price-line">
              <div className="pd-price">
                <strong>{symbol}{price.toFixed(2)}</strong>
                {price < regularPrice && <del>{symbol}{regularPrice.toFixed(2)}</del>}
                {discount > 0 && <span>{discount}% OFF</span>}
              </div>
            </div>

            <p className={`pd-stock ${availableQuantity > 0 ? "in" : "out"}`}>
              <Check size={17} />
              {availableQuantity > 0 ? `${availableQuantity} items available` : "Out of stock"}
            </p>

            <ProductDetailActions
              product={{ id: product.id, slug: product.slug, name: product.name, price, image, sku: product.sku }}
              maxQuantity={maximumQuantity}
              disabled={availableQuantity <= 0}
            />

            <div className="pd-about-mini">
              <h2>About this item</h2>
              <p>{product.content?.shortDescription || product.content?.description || "Product information is being updated."}</p>
            </div>

            <div className="pd-services">
              <div><Truck /><span><strong>Fast delivery</strong>{minimumDelivery}-{maximumDelivery} working days</span></div>
              <div><RotateCcw /><span><strong>{returnDays}-day returns</strong>Policy conditions apply</span></div>
              <div><ShieldCheck /><span><strong>Secure purchase</strong>Verified product information</span></div>
            </div>
          </aside>
        </section>

        <div className="pd-content-grid">
          <main className="pd-content-main">
            <section className="pd-panel pd-description-panel">
              <h2>Product Description</h2>
              <p>{product.content?.description || product.content?.shortDescription || "Product description is being updated."}</p>

              <h3>Key Features</h3>
              <ul>{highlights.map((item) => <li key={item}>{item}</li>)}</ul>

              <h3>Benefits</h3>
              <ul>{benefits.map((item) => <li key={item}>{item}</li>)}</ul>

              <h3>How to Use</h3>
              <ol>{howToUse.map((item) => <li key={item}>{item}</li>)}</ol>

              <h3>Ingredients</h3>
              <p>{ingredients.join(", ")}</p>

              <h3>Warnings</h3>
              <ul>{warnings.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>

            <section className="pd-panel pd-rating-panel" id="ratings">
              <h2>Rating & Reviews</h2>
              <div className="pd-rating-summary">
                <div className="pd-rating-score">
                  <strong>{rating.toFixed(1)}/5</strong>
                  <span>{ratingCount} Ratings</span>
                </div>
                <div className="pd-rating-bars">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star}>
                      <span>{star} ★</span>
                      <i><b style={{ width: `${star === 5 ? fiveStarWidth : Math.max(3, fiveStarWidth / (7 - star))}%` }} /></i>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pd-review-list">
                {["Highly effective.", "Loved it. Great product.", "Perfect choice for daily use.", "Good quality and packaging."].map((review, index) => (
                  <article key={review}>
                    <div>{Array.from({ length: 5 }).map((_, star) => <Star key={star} size={13} fill="#ffb400" strokeWidth={0} />)}</div>
                    <strong>{review}</strong>
                    <span>{index + 1} day{index > 0 ? "s" : ""} ago</span>
                  </article>
                ))}
              </div>
            </section>

            <section className="pd-panel pd-seo-panel">
              <h2>Buy {product.shortName || product.name} from Arogga</h2>
              <p>
                Buy {product.name} online with current price, stock and delivery information. Select your preferred quantity and add it to your cart for delivery across Bangladesh.
              </p>
            </section>

            <section className="pd-panel pd-faq-panel">
              <h2>Frequently Asked Questions & Answers</h2>
              {[
                ["Is this product authentic?", "Yes. Products are sourced from verified sellers and suppliers."],
                ["Does Arogga deliver all over Bangladesh?", "Yes. Delivery is available across supported locations in Bangladesh."],
                ["Is Cash on Delivery available?", "Cash on Delivery availability depends on your delivery location and order."],
                ["How long does delivery take?", `Delivery normally takes ${minimumDelivery}-${maximumDelivery} working days.`],
                ["Can I return or replace the product?", `Eligible products can be returned according to the ${returnDays}-day return policy.`],
              ].map(([question, answer]) => (
                <details key={question}>
                  <summary><CircleHelp size={16} />{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </section>
          </main>

          <aside className="pd-info-sidebar">
            <section className="pd-panel">
              <h2>Product Information</h2>
              <dl>
                <div><dt>SKU</dt><dd>{product.sku || "Not available"}</dd></div>
                <div><dt>Brand</dt><dd>{product.brand?.name || "Not available"}</dd></div>
                <div><dt>Category</dt><dd>{categoryName}</dd></div>
                <div><dt>Condition</dt><dd>{product.condition || "New"}</dd></div>
                {features.slice(0, 8).map((feature) => <div key={`${feature.title}-${feature.value}`}><dt>{feature.title}</dt><dd>{feature.value}</dd></div>)}
              </dl>
            </section>

            <section className="pd-panel pd-seller-card">
              <PackageCheck size={30} />
              <h2>{product.seller?.name || "Main Store"}</h2>
              <p>Fulfilled by {product.seller?.fulfilledBy || "Arogga"}</p>
              <span>Secure and verified seller information</span>
            </section>
          </aside>
        </div>
      </div>

      <ProductRecommendations
        currentProductId={String(product.id)}
        brand={product.brand?.name || "Brand"}
        category={categoryName}
      />

      <div className="pd-disclaimer">
        <strong>Disclaimer</strong>
        <p>The information provided here is for general product guidance and should not replace professional medical advice.</p>
      </div>
    </div>
  );
}
