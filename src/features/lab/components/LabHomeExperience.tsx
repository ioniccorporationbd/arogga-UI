"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, FlaskConical, MapPin, Search, ShieldCheck, Star, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { useDiagnosticCenters, useLabCartStore, useLabTests } from "../client";
import type { DiagnosticCenter, LabTest } from "../domain";
import { LabNavigation } from "./LabTestsExperience";

export default function LabHomeExperience({ initialTests = [], initialCenters = [] }: { initialTests?: LabTest[]; initialCenters?: DiagnosticCenter[] }) {
  const [q, setQ] = useState("");
  const [organ, setOrgan] = useState("");
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc" | "rating" | "fastest" | "name">("popular");
  const { data, isLoading } = useLabTests({ q, organ: organ || undefined, sort, limit: 220, page: 1 });
  const centers = useDiagnosticCenters();
  const tests = data?.items ?? initialTests;
  const centerItems = centers.data?.items ?? initialCenters;
  const allFacets = data?.facets;
  const cart = useLabCartStore();

  const popular = tests.slice(0, 8);
  const affordable = tests.filter((test) => test.salePrice <= 500).slice(0, 8);
  const organItems = allFacets?.organs.slice(0, 10) ?? [];
  const centerMap = useMemo(() => new Map(centerItems.map((center) => [center.id, center])), [centerItems]);

  function book(test: LabTest) {
    const center = centerMap.get(test.diagnosticCenterIds[0]) || centerItems[0];
    if (center) cart.add(test, center);
  }

  return <div className="lab-home-v2"><LabNavigation mode="lab" /><section className="lab-top-banner"><div><span>Healthcare diagnostics at home</span><h1>Book lab tests with trusted diagnostic partners</h1><p>Same Lab Test page flow, but cleaner, faster and fully dynamic from <code>public/data/lab-tests.json</code>.</p><div className="lab-hero-actions"><Link href="/lab/tests">See all tests <ArrowRight size={16} /></Link><Link href="/lab/cart">View lab cart</Link></div></div><div className="lab-banner-card"><strong>{data?.meta.total ?? initialTests.length}+</strong><span>Lab tests</span><strong>{centerItems.length}</strong><span>Diagnostic centers</span><strong>24-48h</strong><span>Report delivery</span></div></section><section className="lab-finder-card" aria-label="Find lab tests"><div className="lab-finder-input"><Search size={18} /><input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search test, organ or health concern" /></div><select value={organ} onChange={(event) => setOrgan(event.target.value)} aria-label="Filter by organ"><option value="">All organs</option>{organItems.map((item) => <option value={item.label} key={item.label}>{item.label}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} aria-label="Sort lab tests"><option value="popular">Most booked</option><option value="price-asc">Price low to high</option><option value="price-desc">Price high to low</option><option value="rating">Top rated</option><option value="fastest">Fastest report</option><option value="name">Name A-Z</option></select></section><section className="lab-strip"><Info icon={<Truck />} title="Home sample collection" text="Selected centers provide home collection." /><Info icon={<ShieldCheck />} title="Verified partners" text="12 local diagnostic centers in data." /><Info icon={<Clock3 />} title="Fast reports" text="See report timing before booking." /><Info icon={<FlaskConical />} title="200+ tests" text="All tests come from Lab JSON." /></section><Section title="Most booked lab tests" subtitle="Card and image click redirect to the dynamic test details page."><div className="lab-card-grid">{popular.map((test) => <ClickableTestCard key={test.id} test={test} center={centerMap.get(test.diagnosticCenterIds[0])} onBook={() => book(test)} saved={cart.wishlistIds.includes(test.id)} onSave={() => cart.toggleWishlist(test.id)} />)}</div></Section><Section title="Browse Tests by Trusted Lab Partners" subtitle="Diagnostic centers are independent from Store products."><div className="lab-partner-grid">{centerItems.map((center) => <Link className="lab-partner-card" href={`/lab/diagnostics/${center.slug}`} key={center.id}><Image src={center.logo} alt={center.name} width={64} height={64} /><b>{center.name}</b><span><MapPin size={13} /> {center.city}</span><small><Star size={13} fill="#f97316" color="#f97316" /> {center.rating} · {center.reportDeliveryHours}h report</small></Link>)}</div></Section><Section title="Affordable Health Packages" subtitle="Price-focused cards for fast booking."><div className="lab-package-grid">{affordable.map((test) => <Link className="lab-package-card" href={`/lab/tests/${test.slug}`} key={test.id}><Image src={test.image} alt={test.name} width={74} height={74} /><div><b>{test.name}</b><span>{test.organ} · {test.includedTestCount} test{test.includedTestCount > 1 ? "s" : ""}</span></div><strong>৳{test.salePrice}</strong></Link>)}</div></Section><Section title="All Lab Tests" subtitle="Every test row is dynamic from JSON: image left, test name middle, Visit button right."><div className="lab-all-tests-table">{isLoading && tests.length === 0 ? <p>Loading tests...</p> : tests.map((test) => <LabTestRow key={test.id} test={test} center={centerMap.get(test.diagnosticCenterIds[0])} onBook={() => book(test)} />)}</div></Section></div>;
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) { return <section className="lab-home-section"><header><div><span>Lab Test</span><h2>{title}</h2><p>{subtitle}</p></div><Link href="/lab/tests">View all <ArrowRight size={16} /></Link></header>{children}</section>; }
function Info({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <article>{icon}<b>{title}</b><span>{text}</span></article>; }
function ClickableTestCard({ test, center, saved, onSave, onBook }: { test: LabTest; center?: DiagnosticCenter; saved: boolean; onSave: () => void; onBook: () => void }) { return <article className="lab-click-card"><Link href={`/lab/tests/${test.slug}`} className="lab-click-card-media"><Image src={test.image} alt={test.name} width={170} height={150} /></Link><div><Link href={`/lab/tests/${test.slug}`}><h3>{test.name}</h3></Link><p>{center?.name ?? "Verified Lab"}</p><span><CheckCircle2 size={14} /> {test.reportDeliveryHours}h report</span><strong>৳{test.salePrice} <del>৳{test.regularPrice}</del></strong></div><footer><button type="button" onClick={onSave} className={saved ? "active" : ""}>♡</button><button type="button" onClick={onBook}>Book</button></footer></article>; }
function LabTestRow({ test, center, onBook }: { test: LabTest; center?: DiagnosticCenter; onBook: () => void }) { return <article className="lab-test-row"><Link href={`/lab/tests/${test.slug}`} className="lab-test-row-image"><Image src={test.image} alt={test.name} width={74} height={74} /></Link><Link href={`/lab/tests/${test.slug}`} className="lab-test-row-name"><b>{test.name}</b><span>{test.organ} · {test.healthConcern} · {center?.name ?? "Verified Lab"}</span><small>{test.sampleType} · {test.fastingRequired ? "Fasting required" : "No fasting"} · Report in {test.reportDeliveryHours}h</small></Link><div className="lab-test-row-price"><strong>৳{test.salePrice}</strong><del>৳{test.regularPrice}</del></div><button type="button" onClick={onBook}>Book</button><Link href={`/lab/tests/${test.slug}`} className="lab-row-visit">Visit</Link></article>; }
