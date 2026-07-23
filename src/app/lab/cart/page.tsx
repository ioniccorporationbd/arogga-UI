"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useLabCartStore, useLabCartSummary } from "@/features/lab/client";
import { LabNavigation } from "@/features/lab/components/LabTestsExperience";

export default function LabCartPage() {
  const items = useLabCartStore((state) => state.items);
  const remove = useLabCartStore((state) => state.remove);
  const clear = useLabCartStore((state) => state.clear);
  const summary = useLabCartSummary();
  return <div className="lab-shell"><LabNavigation mode="lab" /><header className="lab-list-header"><div><span>Lab Cart</span><h1>Your lab booking cart</h1><p>Local-first booking cart. Final booking will be API-ready when lab backend credentials are connected.</p></div></header>{items.length === 0 ? <section className="lab-empty"><h2>No lab tests selected</h2><Link href="/lab/tests">Browse lab tests</Link></section> : <section className="lab-cart-layout"><div className="lab-results">{items.map((item) => <article className="lab-test-card" key={item.cartKey}><div className="lab-test-image"><Image src={item.image || "/images/product-fallback.png"} alt={item.name} width={92} height={92} /></div><div className="lab-test-main"><h2>{item.name}</h2><p>{item.centerName} · {item.sampleType} · Report in {item.reportDeliveryHours} hours</p><div className="lab-price"><b>৳{item.salePrice}</b><del>৳{item.regularPrice}</del><span>Qty {item.quantity}</span></div></div><div className="lab-test-actions"><button type="button" onClick={() => remove(item.cartKey)}><Trash2 size={15} /> Remove</button></div></article>)}</div><aside className="lab-cart-summary"><h2>Summary</h2><p><span>Items</span><b>{summary.itemCount}</b></p><p><span>Subtotal</span><b>৳{summary.subtotal}</b></p><p><span>Discount</span><b>৳{summary.discount}</b></p><p><span>Home collection</span><b>৳{summary.homeCollectionFee}</b></p><p><span>VAT</span><b>৳{summary.vat}</b></p><strong><span>Total</span><b>৳{summary.grandTotal}</b></strong><button type="button">Continue Booking</button><button type="button" onClick={clear}>Clear cart</button></aside></section>}</div>;
}
