import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, RotateCcw, ShieldCheck, ShoppingCart, Star, Truck } from "lucide-react";
import { getCurrencySymbol, getProductDiscount, getProductPrice } from "@/lib/products";
import { getServerProductBySlug } from "@/lib/server-products";
import ProductDetailActions from "./ProductDetailActions";
import "./product-detail.css";


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getServerProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seo.metaTitle || product.name,
    description: product.seo.metaDescription || product.content.shortDescription,
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getServerProductBySlug(slug);
  if (!product) notFound();

  const price = getProductPrice(product);
  const symbol = getCurrencySymbol(product.pricing.currency);
  const discount = getProductDiscount(product);
  const image = product.media.featuredImage.url;

  return (
    <main className="pd-page">
      <div className="pd-container">
        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span>
          <Link href="/store">Store</Link><span>/</span>
          <Link href={`/${product.taxonomy.department.slug}`}>{product.taxonomy.department.name}</Link><span>/</span>
          <span>{product.shortName}</span>
        </nav>

        <section className="pd-main">
          <div className="pd-media">
            {discount > 0 && <span className="pd-discount">-{discount}%</span>}
            <div className="pd-image-wrap">
              <Image src={image} alt={product.media.featuredImage.alt || product.name} fill sizes="(max-width: 900px) 100vw, 48vw" priority className="pd-image" unoptimized />
            </div>
          </div>

          <div className="pd-info">
            <p className="pd-brand">{product.brand.name}</p>
            <h1>{product.name}</h1>
            <p className="pd-subtitle">{product.subtitle}</p>
            <div className="pd-rating">
              <span>{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={18} fill={i < Math.round(product.ratings.average ?? 0) ? "#ffb400" : "#e5e7eb"} strokeWidth={0} />)}</span>
              <strong>{product.ratings.average ?? 0}</strong>
              <em>({product.ratings.count} reviews)</em>
            </div>
            <div className="pd-price">
              <strong>{symbol}{price.toFixed(2)}</strong>
              {price < product.pricing.regularPrice && <del>{symbol}{product.pricing.regularPrice.toFixed(2)}</del>}
            </div>
            <p className={`pd-stock ${product.inventory.availableQuantity > 0 ? "in" : "out"}`}>
              <Check size={17} /> {product.inventory.availableQuantity > 0 ? `${product.inventory.availableQuantity} items available` : "Out of stock"}
            </p>
            <p className="pd-description">{product.content.shortDescription}</p>
            <ProductDetailActions product={{ id: product.id, slug: product.slug, name: product.name, price, image, sku: product.sku }} maxQuantity={product.purchaseRules.maximumQuantity ?? 10} disabled={product.inventory.availableQuantity <= 0} />
            <div className="pd-services">
              <div><Truck /><span><strong>Fast delivery</strong>{product.shipping.delivery.estimatedMinimumDays}-{product.shipping.delivery.estimatedMaximumDays} working days</span></div>
              <div><RotateCcw /><span><strong>{product.seller.returnPolicy.returnWindowDays}-day returns</strong>Policy conditions apply</span></div>
              <div><ShieldCheck /><span><strong>Secure purchase</strong>Verified product information</span></div>
            </div>
          </div>
        </section>

        <section className="pd-details">
          <div>
            <h2>Product description</h2>
            <p>{product.content.description}</p>
            <h3>Highlights</h3>
            <ul>{product.content.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <aside>
            <h2>Product information</h2>
            <dl>
              <div><dt>SKU</dt><dd>{product.sku}</dd></div>
              <div><dt>Brand</dt><dd>{product.brand.name}</dd></div>
              <div><dt>Category</dt><dd>{product.taxonomy.subCategory?.name ?? product.taxonomy.category.name}</dd></div>
              {product.attributes.filter((a) => a.visible).slice(0, 6).map((a) => <div key={a.id}><dt>{a.name}</dt><dd>{a.value}</dd></div>)}
            </dl>
          </aside>
        </section>
      </div>
    </main>
  );
}
