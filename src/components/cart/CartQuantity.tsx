"use client";
export default function CartQuantity({ value, max, onChange }: { value: number; max: number; onChange: (value: number) => void }) {
  return <div className="cart-qty" aria-label="Cart quantity"><button type="button" onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} aria-label="Decrease quantity">−</button><span>{value}</span><button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase quantity">+</button></div>;
}
