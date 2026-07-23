"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
export default function EmptyCart({ onClose }: { onClose: () => void }) { return <section className="cart-empty"><ShoppingBag /><h3>Your cart is empty</h3><p>Add medicines, healthcare products, or lab items to continue.</p><Link href="/store" onClick={onClose}>Continue shopping</Link></section>; }
