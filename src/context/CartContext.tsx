"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { notify } from "@/lib/toast";

export type CartItem = { id: string; slug: string; name: string; price: number; image: string; quantity: number; sku?: string; maxQuantity?: number; regularPrice?: number; discountPercentage?: number };
type CartTotals = { subtotal: number; discount: number; vat: number; shipping: number; total: number; grandTotal: number };
type CartContextValue = CartTotals & { items: CartItem[]; count: number; addItem: (item: Omit<CartItem,"quantity">, quantity?: number) => void; removeItem: (id:string)=>void; updateQuantity:(id:string,quantity:number)=>void; clearCart:()=>void };
const CartContext = createContext<CartContextValue | null>(null);
const KEY = "arogga-cart";

function safeRead(): CartItem[] {
  try { const raw=localStorage.getItem(KEY); if(!raw) return []; const parsed:unknown=JSON.parse(raw); return Array.isArray(parsed)?parsed.filter((x):x is CartItem=>Boolean(x&&typeof x==="object"&&typeof (x as CartItem).id==="string"&&typeof (x as CartItem).quantity==="number")):[]; }
  catch { localStorage.removeItem(KEY); return []; }
}

function calculateTotals(items: CartItem[]): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + (item.regularPrice || item.price) * item.quantity, 0);
  const saleSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.max(0, subtotal - saleSubtotal);
  const vat = Math.round(saleSubtotal * 0.05);
  const shipping = saleSubtotal > 0 && saleSubtotal < 999 ? 60 : 0;
  const total = saleSubtotal + vat;
  const grandTotal = total + shipping;
  return { subtotal, discount, vat, shipping, total, grandTotal };
}

export function CartProvider({children}:{children:ReactNode}){
  const [items,setItems]=useState<CartItem[]>([]);
  useEffect(()=>{  setItems(safeRead()); const sync=()=>setItems(safeRead()); window.addEventListener("storage",sync); window.addEventListener("arogga-cart-updated",sync); return()=>{window.removeEventListener("storage",sync);window.removeEventListener("arogga-cart-updated",sync)}},[]);
  const persist=useCallback((next:CartItem[])=>{setItems(next);localStorage.setItem(KEY,JSON.stringify(next));window.dispatchEvent(new Event("arogga-cart-updated"));},[]);
  const addItem=useCallback((item:Omit<CartItem,"quantity">,quantity=1)=>{const current=safeRead();const found=current.find(x=>x.id===item.id);const max=Math.max(1,item.maxQuantity??999);const next=found?current.map(x=>x.id===item.id?{...x,...item,quantity:Math.min(max,x.quantity+quantity)}:x):[...current,{...item,quantity:Math.min(max,Math.max(1,quantity))}];persist(next);notify.success(found?`${item.name} quantity updated`:`${item.name} added to cart`)},[persist]);
  const removeItem=useCallback((id:string)=>{const current=safeRead();const removed=current.find(x=>x.id===id);persist(current.filter(x=>x.id!==id));if(removed)notify.info(`${removed.name} removed from cart`)},[persist]);
  const updateQuantity=useCallback((id:string,quantity:number)=>{const current=safeRead();const item=current.find(x=>x.id===id);persist(current.map(x=>x.id===id?{...x,quantity:Math.max(1,Math.min(x.maxQuantity??999,quantity))}:x));if(item)notify.info(`${item.name} quantity updated`)},[persist]);
  const clearCart=useCallback(()=>{persist([]);notify.warning("Cart cleared")},[persist]);
  const totals = useMemo(() => calculateTotals(items), [items]);
  const value=useMemo(()=>({items,count:items.reduce((s,x)=>s+x.quantity,0),...totals,addItem,removeItem,updateQuantity,clearCart}),[items,totals,addItem,removeItem,updateQuantity,clearCart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart(){const value=useContext(CartContext);if(!value)throw new Error("useCart must be used inside CartProvider");return value}
