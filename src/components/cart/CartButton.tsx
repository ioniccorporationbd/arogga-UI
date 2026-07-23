"use client";
import { ShoppingCart } from "lucide-react";
export default function CartButton({ count, onClick }: { count: number; onClick: () => void }) { return <button type="button" className="cart-button" onClick={onClick}><ShoppingCart/><b>{count}</b><span>Cart</span></button>; }
