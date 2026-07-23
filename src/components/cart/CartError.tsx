"use client";
export default function CartError({ message }: { message: string }) { return <div className="cart-error" role="alert">{message}</div>; }
