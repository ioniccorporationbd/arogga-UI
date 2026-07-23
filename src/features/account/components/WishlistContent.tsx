"use client";
import { useWishlist } from "@/context/WishlistContext";
export default function WishlistContent(){const wishlist=useWishlist();return <section className="account-content"><h2>Wishlist</h2>{wishlist.items.length===0?<p className="muted">No wishlist items.</p>:wishlist.items.map(i=><article className="account-card" key={i.id}><strong>{i.name}</strong><span>{i.slug}</span><button onClick={()=>wishlist.remove(i.id)}>Remove</button></article>)}</section>}
