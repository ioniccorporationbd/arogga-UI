"use client";
import type { CartItem } from "@/lib/cart/cart-domain";
import CartItemRow from "./CartItemRow";
export default function CartItemList({ items, onQuantity, onRemove, onMoveToWishlist }: { items: CartItem[]; onQuantity: (cartKey: string, quantity: number) => void; onRemove: (cartKey: string) => void; onMoveToWishlist: (cartKey: string) => void }) { return <section className="cart-list" aria-label="Cart items">{items.map((item) => <CartItemRow key={item.cartKey} item={item} onQuantity={onQuantity} onRemove={onRemove} onMoveToWishlist={onMoveToWishlist}/>)}</section>; }
