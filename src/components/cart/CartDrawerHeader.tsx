"use client";
import { X } from "lucide-react";
export default function CartDrawerHeader({ count, onClose }: { count: number; onClose: () => void }) { return <header className="cart-drawer-header"><div><p>Shopping Cart</p><h2>{count} item{count === 1 ? "" : "s"}</h2></div><button type="button" onClick={onClose} aria-label="Close cart"><X /></button></header>; }
