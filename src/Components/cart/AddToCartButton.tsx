"use client";
import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Props={product:{id:string;slug:string;name:string;price:number;image:string;sku?:string;maxQuantity?:number};quantity?:number;disabled?:boolean;className?:string;label?:string;addedLabel?:string;showIcon?:boolean;onAdded?:()=>void};
export default function AddToCartButton({product,quantity=1,disabled=false,className="",label="Add to cart",addedLabel="Added",showIcon=true,onAdded}:Props){
 const {addItem}=useCart(); const [added,setAdded]=useState(false);
 function handle(){if(disabled)return;addItem(product,quantity);setAdded(true);onAdded?.();window.setTimeout(()=>setAdded(false),1600)}
 return <button type="button" className={className} onClick={handle} disabled={disabled} aria-label={`${label}: ${product.name}`}>{showIcon&&(added?<Check size={17}/>:<ShoppingCart size={17}/>)}{disabled?"Out of stock":added?addedLabel:label}</button>
}
