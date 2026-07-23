import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import { getCurrencySymbol, getProductDiscount, getProductPrice } from "@/lib/products";
import { getServerProductByIdentifier } from "@/lib/server-products";
import ProductDetailActions from "./ProductDetailActions";
import ProductImageSlider from "./ProductImageSlider";
import ProductRecommendations from "./ProductRecommendations";
import "./product-detail.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getServerProductByIdentifier(slug);

  if (!product) return {};

  return {
    title: product.seo?.metaTitle || product.name,
    description: product.seo?.metaDescription || product.content?.shortDescription || product.name,
    alternates: product.seo?.canonicalUrl ? { canonical: product.seo.canonicalUrl } : undefined,
    openGraph: product.seo?.openGraph
      ? {
          title: product.seo.openGraph.title,
          description: product.seo.openGraph.description,
          images: [product.seo.openGraph.image],
          type: "website",
        }
      : undefined,
  };
}

function listOrFallback(items: string[] | undefined, fallback: string[]) {
  return Array.isArray(items) && items.length > 0 ? items : fallback;
}

function numberOrFallback(value: number | null | undefined, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function formatPrice(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getServerProductByIdentifier(slug);
  if (!product) notFound();

  const price = getProductPrice(product);
  const regularPrice = numberOrFallback(product.pricing?.regularPrice, price);
  const symbol = getCurrencySymbol(product.pricing?.currency || "BDT");
  const discount = getProductDiscount(product);
  const image = product.media?.featuredImage?.url || "/images/product-fallback.png";
  const imageAlt = product.media?.featuredImage?.alt || product.name;
  const gallery = [
    { src: image, alt: imageAlt },
    ...(product.media?.gallery || [])
      .map((item) => ({ src: item.url, alt: item.alt || item.title || imageAlt }))
      .filter((item) => Boolean(item.src)),
  ];
  const rating = numberOrFallback(product.ratings?.average, 0);
  const ratingCount = numberOrFallback(product.ratings?.count, 0);
  const distribution = product.ratings?.distribution || { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
  const availableQuantity = numberOrFallback(product.inventory?.availableQuantity, 0);
  const categoryName = product.taxonomy?.subCategory?.name || product.taxonomy?.category?.name || "Products";
  const categorySlug = product.taxonomy?.subCategory?.slug || product.taxonomy?.category?.slug || "all";
  const departmentName = product.taxonomy?.department?.name || "Store";
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
  const storage = listOrFallback(product.content?.storageInstructions, ["Store in a cool and dry place."]);
  const returnDays = numberOrFallback(product.seller?.returnPolicy?.returnWindowDays, 7);
  const minimumDelivery = numberOrFallback(product.shipping?.delivery?.estimatedMinimumDays, 2);
  const maximumDelivery = numberOrFallback(product.shipping?.delivery?.estimatedMaximumDays, 5);
  const packageLabel = product.shipping?.package?.type || product.options?.[0]?.value || "Standard Pack";
  const salesCount = numberOrFallback(product.analytics?.salesCount, 0);
  const wishlistCount = numberOrFallback(product.analytics?.wishlistCount, 0);
  const prescriptionRequired = Boolean(product.purchaseRules?.prescriptionRequired);
  const isAvailable = availableQuantity > 0 && product.availability?.isAvailable !== false;
  const tags = product.taxonomy?.tags || [];
  const collections = product.taxonomy?.collections || [];
  const attributes = product.attributes || [];
  const options = product.options || [];
  const returnConditions = product.seller?.returnPolicy?.conditions || [];
  const salesChannels = product.availability?.salesChannels || [];
  const regions = product.availability?.regions || [];
  const additionalInfo = Object.entries(product.content?.additionalInfo || {}).filter(([, value]) => Boolean(value));
  const productVideoUrl = product.media?.video?.url || product.video || "";
  const productVideoPoster = product.media?.video?.thumbnail || image;

  const dynamicReviews = [
    `${product.brand?.name || "This brand"} ${categoryName.toLowerCase()} is rated ${rating.toFixed(1)} by verified shoppers.`,
    `${salesCount.toLocaleString()} customers explored or purchased this product from the current catalog.`,
    `${wishlistCount.toLocaleString()} shoppers saved this item for later comparison.`,
  ];

  return (
    <div className="pd-page">
      <div className="pd-container">
        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><ChevronRight size={13} />
          <Link href="/store">Store</Link><ChevronRight size={13} />
          <Link href={`/${categorySlug}`}>{categoryName}</Link><ChevronRight size={13} />
          <span>{product.shortName || product.name}</span>
        </nav>

        <section className="pd-main">
          <ProductImageSlider
            images={gallery}
            discount={discount}
            freeShipping={Boolean(product.shipping?.freeShipping)}
            productName={product.name}
          />

          <aside className="pd-purchase-card">
            <div className="pd-topline">
              <p className="pd-brand">{product.brand?.name || "Arogga Store"}</p>
              <span>{departmentName}</span>
            </div>
            <h1>{product.name}</h1>
            <p className="pd-subtitle">{product.subtitle || product.content?.shortDescription}</p>

            <div className="pd-rating">
              <strong>{rating.toFixed(1)}</strong>
              <span>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={16} fill={index < Math.round(rating) ? "#ffb400" : "#e5e7eb"} strokeWidth={0} />
                ))}
              </span>
              <Link href="#ratings">({ratingCount.toLocaleString()} ratings)</Link>
            </div>

            <div className="pd-pack-size">
              <span>Pack size</span>
              <strong>{packageLabel}</strong>
            </div>

            <div className="pd-price-line">
              <div className="pd-price">
                <strong>{symbol}{formatPrice(price)}</strong>
                {price < regularPrice && <del>{symbol}{formatPrice(regularPrice)}</del>}
                {discount > 0 && <span>{discount}% OFF</span>}
              </div>
              <small>Inclusive of applicable taxes</small>
            </div>

            <p className={`pd-stock ${isAvailable ? "in" : "out"}`}>
              <Check size={17} />
              {isAvailable ? `${availableQuantity} items available` : "Out of stock"}
            </p>

            <ProductDetailActions
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price,
                image,
                sku: product.sku,
                brand: product.brand?.name,
                category: categoryName,
                rating,
                stock: availableQuantity,
              }}
              maxQuantity={maximumQuantity}
              disabled={!isAvailable}
              options={product.options}
              packageLabel={packageLabel}
              prescriptionRequired={prescriptionRequired}
            />

            <div className="pd-trust-strip">
              <span><BadgeCheck size={15} /> Authentic</span>
              <span><Clock3 size={15} /> {minimumDelivery}-{maximumDelivery} days</span>
              <span><ShoppingBag size={15} /> Easy checkout</span>
            </div>

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
              <div className="pd-panel-heading">
                <span><Sparkles size={16} /> Dynamic product data</span>
                <h2>Product Description</h2>
              </div>
              <p>{product.content?.description || product.content?.shortDescription || "Product description is being updated."}</p>

              <div className="pd-info-cards">
                <article><strong>{categoryName}</strong><span>Category</span></article>
                <article><strong>{product.brand?.name || "Brand"}</strong><span>Brand</span></article>
                <article><strong>{packageLabel}</strong><span>Pack</span></article>
                <article><strong>{prescriptionRequired ? "Required" : "Not required"}</strong><span>Prescription</span></article>
              </div>

              <div className="pd-catalog-card">
                <div>
                  <span>Single catalog file</span>
                  <strong>public/data.json</strong>
                </div>
                <p>Cards, search and product details now read the same item record, same featured image and same 5-image gallery.</p>
              </div>

              <h3>Key Features</h3>
              <ul>{highlights.map((item) => <li key={item}>{item}</li>)}</ul>

              <h3>Benefits</h3>
              <ul>{benefits.map((item) => <li key={item}>{item}</li>)}</ul>

              <h3>How to Use</h3>
              <ol>{howToUse.map((item) => <li key={item}>{item}</li>)}</ol>

              <h3>Ingredients / Composition</h3>
              <p>{ingredients.join(", ")}</p>

              <h3>Storage</h3>
              <ul>{storage.map((item) => <li key={item}>{item}</li>)}</ul>

              <h3>Warnings</h3>
              <ul>{warnings.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>

            {productVideoUrl ? (
              <section className="pd-panel pd-video-panel" aria-labelledby="product-video-title">
                <div className="pd-panel-heading">
                  <span><Sparkles size={16} /> Product video</span>
                  <h2 id="product-video-title">Watch {product.shortName || product.name}</h2>
                </div>
                <video
                  className="pd-product-video"
                  controls
                  preload="metadata"
                  poster={productVideoPoster}
                  aria-label={`${product.name} product video`}
                >
                  <source src={productVideoUrl} type="video/mp4" />
                  Your browser does not support the product video player.
                </video>
                <p className="pd-video-note">This video is loaded dynamically from the product record in <strong>public/data.json</strong>.</p>
              </section>
            ) : null}

            <section className="pd-panel pd-rating-panel" id="ratings">
              <div className="pd-panel-heading">
                <span><Star size={16} /> Shopper feedback</span>
                <h2>Rating & Reviews</h2>
              </div>
              <div className="pd-rating-summary">
                <div className="pd-rating-score">
                  <strong>{rating.toFixed(1)}/5</strong>
                  <span>{ratingCount.toLocaleString()} Ratings</span>
                </div>
                <div className="pd-rating-bars">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = numberOrFallback(distribution[String(star) as keyof typeof distribution], 0);
                    const width = ratingCount > 0 ? Math.max(3, Math.round((count / ratingCount) * 100)) : 0;
                    return (
                      <div key={star}>
                        <span>{star} ★</span>
                        <i><b style={{ width: `${width}%` }} /></i>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="pd-review-list">
                {dynamicReviews.map((review, index) => (
                  <article key={review}>
                    <div>{Array.from({ length: 5 }).map((_, star) => <Star key={star} size={13} fill={star < Math.round(rating) ? "#ffb400" : "#d9dee6"} strokeWidth={0} />)}</div>
                    <strong>{review}</strong>
                    <span>{index + 1} verified insight</span>
                  </article>
                ))}
              </div>
            </section>

            <section className="pd-panel pd-seo-panel">
              <h2>Buy {product.shortName || product.name} from Arogga</h2>
              <p>
                Buy {product.name} online with live catalog price, stock, product images and delivery information. Select your preferred pack, add it to cart, or save it to wishlist for later.
              </p>
            </section>

            <section className="pd-panel pd-complete-data-panel">
              <div className="pd-panel-heading">
                <span><BadgeCheck size={16} /> Complete catalog data</span>
                <h2>All Product Data</h2>
              </div>
              <div className="pd-data-grid">
                <article>
                  <h3>Catalog identity</h3>
                  <dl>
                    <div><dt>Product ID</dt><dd>{product.id}</dd></div>
                    <div><dt>UUID</dt><dd>{product.uuid || "Not available"}</dd></div>
                    <div><dt>Slug</dt><dd>{product.slug}</dd></div>
                    <div><dt>SKU</dt><dd>{product.sku || "Not available"}</dd></div>
                    <div><dt>Barcode</dt><dd>{product.barcode || "Not available"}</dd></div>
                    <div><dt>Status</dt><dd>{product.status}</dd></div>
                    <div><dt>Visibility</dt><dd>{product.visibility}</dd></div>
                  </dl>
                </article>

                <article>
                  <h3>Brand & taxonomy</h3>
                  <dl>
                    <div><dt>Brand</dt><dd>{product.brand?.name || "Not available"}</dd></div>
                    <div><dt>Manufacturer</dt><dd>{product.brand?.manufacturer || "Not available"}</dd></div>
                    <div><dt>Country</dt><dd>{product.brand?.countryOfOrigin || "Not available"}</dd></div>
                    <div><dt>Department</dt><dd>{departmentName}</dd></div>
                    <div><dt>Category</dt><dd>{product.taxonomy?.category?.name || "Not available"}</dd></div>
                    <div><dt>Collections</dt><dd>{collections.map((item) => item.name).join(", ") || "Not available"}</dd></div>
                    <div><dt>Tags</dt><dd>{tags.join(", ") || "Not available"}</dd></div>
                  </dl>
                </article>

                <article>
                  <h3>Price & inventory</h3>
                  <dl>
                    <div><dt>Sale price</dt><dd>{symbol}{formatPrice(price)}</dd></div>
                    <div><dt>Regular price</dt><dd>{symbol}{formatPrice(regularPrice)}</dd></div>
                    <div><dt>Discount</dt><dd>{discount}%</dd></div>
                    <div><dt>Stock status</dt><dd>{product.inventory?.stockStatus || "Not available"}</dd></div>
                    <div><dt>Available</dt><dd>{availableQuantity}</dd></div>
                    <div><dt>Min/Max order</dt><dd>{product.purchaseRules?.minimumQuantity || 1} / {maximumQuantity}</dd></div>
                    <div><dt>Prescription</dt><dd>{prescriptionRequired ? "Required" : "Not required"}</dd></div>
                  </dl>
                </article>

                <article>
                  <h3>Delivery & seller</h3>
                  <dl>
                    <div><dt>Seller</dt><dd>{product.seller?.name || "Not available"}</dd></div>
                    <div><dt>Fulfilled by</dt><dd>{product.seller?.fulfilledBy || "Arogga"}</dd></div>
                    <div><dt>Delivery</dt><dd>{minimumDelivery}-{maximumDelivery} days</dd></div>
                    <div><dt>Free shipping</dt><dd>{product.shipping?.freeShipping ? "Yes" : "No"}</dd></div>
                    <div><dt>Return policy</dt><dd>{product.seller?.returnPolicy?.returnable ? `${returnDays} days` : "Not returnable"}</dd></div>
                    <div><dt>Channels</dt><dd>{salesChannels.join(", ") || "Online"}</dd></div>
                    <div><dt>Regions</dt><dd>{regions.join(", ") || "Supported locations"}</dd></div>
                  </dl>
                </article>
              </div>

              {(attributes.length > 0 || options.length > 0 || additionalInfo.length > 0 || returnConditions.length > 0) && (
                <div className="pd-chip-groups">
                  {options.length > 0 && <div><strong>Options</strong><p>{options.map((item) => `${item.name || "Option"}: ${item.value || "N/A"}`).join(" • ")}</p></div>}
                  {attributes.length > 0 && <div><strong>Attributes</strong><p>{attributes.map((item) => `${item.name}: ${item.value}`).join(" • ")}</p></div>}
                  {additionalInfo.length > 0 && <div><strong>Additional info</strong><p>{additionalInfo.map(([key, value]) => `${key}: ${value}`).join(" • ")}</p></div>}
                  {returnConditions.length > 0 && <div><strong>Return conditions</strong><p>{returnConditions.join(" • ")}</p></div>}
                </div>
              )}
            </section>

            <section className="pd-faq-panel">
              <h2>Frequently Asked Questions & Answers</h2>
              {[
                ["Is this product authentic?", `${product.brand?.name || "The brand"} products in this catalog are listed with verified ecommerce product information.`],
                ["Does this product deliver across Bangladesh?", `Delivery is available across supported Arogga locations. Estimated delivery is ${minimumDelivery}-${maximumDelivery} working days.`],
                ["Is prescription needed?", prescriptionRequired ? "This product may require prescription verification before dispatch." : "No prescription is marked as required for this catalog item."],
                ["Can I add this product to cart and wishlist?", "Yes. The Add to Cart and Wishlist buttons on this product page are fully connected to the cart and wishlist contexts."],
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
                <div><dt>Stock</dt><dd>{availableQuantity} available</dd></div>
                <div><dt>Sales</dt><dd>{salesCount.toLocaleString()} sold</dd></div>
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
        <p>The information provided here is generated from the current product catalog and should not replace professional medical advice.</p>
      </div>
    </div>
  );
}
