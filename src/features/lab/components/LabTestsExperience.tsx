"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, Star, Clock3, Heart, ShoppingCart, RotateCcw } from "lucide-react";
import { useLabCartStore, useLabFilters, useLabTests, useDiagnosticCenters } from "../client";
import type { LabQuery, LabTest } from "../domain";

export function LabNavigation({ mode = "lab" }: { mode?: "all" | "store" | "lab" }) {
  const labLinks = [
    ["Home", "/lab"], ["Browse by Health Concern", "/lab/tests?group=concern"], ["Vital Organs", "/lab/tests?group=organ"], ["Life Style Package", "/lab/tests?packageGroup=Life%20Style"], ["Checkups for Women", "/lab/tests?healthConcern=Women"], ["Checkups for Men", "/lab/tests?packageGroup=20%20to%2040%20Years"], ["Diagnostic Centers", "/lab/diagnostics/the-ibn-sina-trust"], ["Lab Cart", "/lab/cart"],
  ];
  const storeLinks = [["Store Home", "/store"], ["Medicines", "/store"], ["Beauty", "/category/beauty"], ["Baby Care", "/category/baby-care"], ["Groceries", "/category/groceries"]];
  const links = mode === "all" ? [...storeLinks, ...labLinks] : mode === "store" ? storeLinks : labLinks;
  return <nav className="lab-nav" aria-label={`${mode} menu`}>{links.map(([label, href]) => <Link key={`${label}-${href}`} href={href}>{label}</Link>)}</nav>;
}

export default function LabTestsExperience({ initialQuery = {} }: { initialQuery?: LabQuery }) {
  const [filters, setFilters] = useLabFilters();
  const query = { ...filters, ...initialQuery };
  const { data, isLoading, isError, refetch } = useLabTests(query);
  const centers = useDiagnosticCenters();
  const primaryCenter = centers.data?.items[0];
  const cart = useLabCartStore();
  const facets = data?.facets;

  function update(next: Partial<LabQuery>) { setFilters((current) => ({ ...current, ...next, page: next.page ?? 1 })); }

  return <section className="lab-shell"><LabNavigation mode="lab" /><header className="lab-list-header"><div><span>Showing all results</span><h1>Book Lab Tests from Home</h1><p>Compare verified diagnostic partners, report time, home collection, and transparent local pricing.</p></div><div className="lab-search"><Search size={18} /><input value={query.q || ""} onChange={(event) => update({ q: event.target.value })} placeholder="Search CBC, HbA1c, Thyroid..." aria-label="Search lab tests" /></div><label>Sort By<select value={query.sort || "popular"} onChange={(event) => update({ sort: event.target.value as LabQuery["sort"] })}><option value="popular">Most booked</option><option value="price-asc">Price low to high</option><option value="price-desc">Price high to low</option><option value="rating">Rating</option><option value="fastest">Fastest report</option><option value="name">Name</option></select></label></header><div className="lab-layout"><aside className="lab-filters"><div className="lab-filter-title"><b><SlidersHorizontal size={16} /> Filters</b><button onClick={() => setFilters({ page: 1, limit: 20, sort: "popular" })}>Clear All</button></div><FilterBlock title="Price"><button onClick={() => update({ priceMax: 400 })}>৳0 - 400</button><button onClick={() => update({ priceMin: 400, priceMax: 800 })}>৳400 - 800</button><button onClick={() => update({ priceMin: 800, priceMax: 1200 })}>৳800 - 1200</button><button onClick={() => update({ priceMin: 1200 })}>৳1200+</button></FilterBlock><FilterBlock title="Lab Partners">{facets?.centers.slice(0, 8).map((item) => <button key={item.value} onClick={() => update({ centerId: item.value })}>{item.label}</button>)}</FilterBlock><FacetBlock title="Vital Organs" items={facets?.organs} onClick={(label) => update({ organ: label })} /><FacetBlock title="Health Concern" items={facets?.healthConcerns} onClick={(label) => update({ healthConcern: label })} /><FacetBlock title="Packages" items={facets?.packageGroups} onClick={(label) => update({ packageGroup: label })} /></aside><section className="lab-results" aria-live="polite">{isLoading ? Array.from({ length: 8 }).map((_, i) => <div className="lab-test-skeleton" key={i} />) : isError ? <div className="lab-error"><p>Lab tests could not be loaded.</p><button onClick={() => refetch()}><RotateCcw size={16} /> Retry</button></div> : data?.items.length ? data.items.map((test) => <LabTestCard key={test.id} test={test} center={centers.data?.items.find((center) => test.diagnosticCenterIds.includes(center.id)) || primaryCenter} wishlist={cart.wishlistIds.includes(test.id)} onWishlist={() => cart.toggleWishlist(test.id)} onBook={() => primaryCenter && cart.add(test, centers.data?.items.find((center) => test.diagnosticCenterIds.includes(center.id)) || primaryCenter)} />) : <div className="lab-empty">No lab tests matched your filters.</div>}<Pagination page={data?.meta.page || 1} total={data?.meta.pageCount || 1} onPage={(page) => update({ page })} /></section></div></section>;
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) { return <section className="lab-filter-block"><h3>{title}</h3>{children}</section>; }
function FacetBlock({ title, items, onClick }: { title: string; items?: { label: string; total: number }[]; onClick: (label: string) => void }) { return <FilterBlock title={title}>{items?.slice(0, 8).map((item) => <button key={item.label} onClick={() => onClick(item.label)}><span>{item.label}</span><small>{item.total}</small></button>)}</FilterBlock>; }

export function LabTestCard({ test, center, wishlist, onWishlist, onBook }: { test: LabTest; center?: { logo: string; name: string }; wishlist?: boolean; onWishlist?: () => void; onBook?: () => void }) {
  return <article className="lab-test-card"><Link href={`/lab/tests/${test.slug}`} className="lab-test-image"><Image src={test.image || "/images/product-fallback.png"} alt={test.name} width={92} height={92} sizes="92px" /></Link><div className="lab-test-main"><Link href={`/lab/tests/${test.slug}`}><h2>{test.name}</h2></Link><p>Includes {test.includedTestCount} test{test.includedTestCount > 1 ? "s" : ""}</p><div className="lab-center-strip" title={center?.name || "Diagnostic partners"}>{test.diagnosticCenterIds.slice(0, 4).map((id) => <span key={id}>{id.includes("ibn") ? "IBN" : id.split("-").at(-1)?.slice(0, 3).toUpperCase()}</span>)}<em>+{Math.max(0, test.diagnosticCenterIds.length - 4)}</em></div><div className="lab-price"><b>৳{test.salePrice}</b>{test.regularPrice > test.salePrice ? <del>৳{test.regularPrice}</del> : null}<strong>{test.discountPercentage}% OFF</strong></div></div><div className="lab-test-actions"><button type="button" className={wishlist ? "saved" : ""} onClick={onWishlist} aria-label={`${wishlist ? "Remove" : "Save"} ${test.name}`}><Heart size={16} /></button><button type="button" onClick={onBook}><ShoppingCart size={15} /> Book Test</button></div><footer><span><Clock3 size={14} /> Report in {test.reportDeliveryHours} hours</span><span><Star size={15} fill="#f97316" color="#f97316" /> Booked {test.bookedCount} times</span></footer></article>;
}

function Pagination({ page, total, onPage }: { page: number; total: number; onPage: (page: number) => void }) { return <div className="lab-pagination"><button disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button><span>Page {page} of {total}</span><button disabled={page >= total} onClick={() => onPage(page + 1)}>Next</button></div>; }
