import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import Image from "next/image";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button className={`ui-button ${className}`} {...props} />; }
export function IconButton({ "aria-label": label, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button aria-label={label} className={`ui-icon-button ${className}`} {...props} />; }
export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input className="ui-input" {...props} />; }
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className="ui-input" {...props} />; }
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) { return <select className="ui-input" {...props} />; }
export function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) { return <input type="checkbox" className="ui-checkbox" {...props} />; }
export function Radio(props: InputHTMLAttributes<HTMLInputElement>) { return <input type="radio" className="ui-radio" {...props} />; }
export function Card({ children }: { children: ReactNode }) { return <section className="ui-card">{children}</section>; }
export function Badge({ children }: { children: ReactNode }) { return <span className="ui-badge">{children}</span>; }
export function Skeleton() { return <span className="ui-skeleton" aria-hidden="true" />; }
export function EmptyState({ title, body }: { title: string; body?: string }) { return <section className="ui-empty"><h3>{title}</h3>{body ? <p>{body}</p> : null}</section>; }
export function ErrorState({ message }: { message: string }) { return <section className="ui-error" role="alert">{message}</section>; }
export function Price({ value }: { value: number }) { return <strong className="ui-price">৳{Math.round(value).toLocaleString()}</strong>; }
export function Rating({ value }: { value: number }) { return <span className="ui-rating" aria-label={`${value} out of 5 rating`}>★ {value.toFixed(1)}</span>; }
export function ProductCard({ product }: { product: { slug: string; name: string; image: string; price: number; rating?: number } }) { return <article className="ui-product-card"><Image src={product.image || "/images/product-fallback.png"} alt={product.name} width={220} height={220} sizes="(max-width: 768px) 50vw, 220px" /><h3>{product.name}</h3><Price value={product.price} />{product.rating ? <Rating value={product.rating} /> : null}</article>; }
export function QuantitySelector({ value, max, onChange }: { value: number; max: number; onChange: (value: number) => void }) { return <div className="ui-qty"><button type="button" onClick={() => onChange(Math.max(1, value - 1))}>−</button><span>{value}</span><button type="button" onClick={() => onChange(Math.min(max, value + 1))}>+</button></div>; }
export function FormField({ label, children, error }: { label: string; children: ReactNode; error?: string }) { return <label className="ui-field"><span>{label}</span>{children}{error ? <small role="alert">{error}</small> : null}</label>; }
export function Modal({ children }: { children: ReactNode }) { return <div className="ui-modal" role="dialog" aria-modal="true">{children}</div>; }
export function Drawer({ children }: { children: ReactNode }) { return <aside className="ui-drawer">{children}</aside>; }
export const Sheet = Drawer;
export function Tabs({ children }: { children: ReactNode }) { return <div className="ui-tabs" role="tablist">{children}</div>; }
