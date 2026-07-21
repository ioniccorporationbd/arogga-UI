/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import {createContext,useCallback,useContext,useEffect,useMemo,useState,type ReactNode} from "react";
export type WishlistItem={id:string;slug:string;name:string;price:number;image:string};
type Value={items:WishlistItem[];has:(id:string)=>boolean;toggle:(item:WishlistItem)=>void;remove:(id:string)=>void};
const C=createContext<Value|null>(null);const KEY="arogga-wishlist";
function read():WishlistItem[]{try{const v=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(v)?v:[]}catch{return[]}}
export function WishlistProvider({children}:{children:ReactNode}){const[items,setItems]=useState<WishlistItem[]>([]);useEffect(()=>setItems(read()),[]);const save=useCallback((n:WishlistItem[])=>{setItems(n);localStorage.setItem(KEY,JSON.stringify(n))},[]);const toggle=useCallback((item:WishlistItem)=>{const c=read();save(c.some(x=>x.id===item.id)?c.filter(x=>x.id!==item.id):[...c,item])},[save]);const remove=useCallback((id:string)=>save(read().filter(x=>x.id!==id)),[save]);const value=useMemo(()=>({items,has:(id:string)=>items.some(x=>x.id===id),toggle,remove}),[items,toggle,remove]);return <C.Provider value={value}>{children}</C.Provider>};
export function useWishlist(){const v=useContext(C);if(!v)throw new Error("useWishlist must be used inside WishlistProvider");return v}
