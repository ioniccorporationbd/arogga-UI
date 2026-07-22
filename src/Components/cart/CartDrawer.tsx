"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Bike,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FlaskConical,
  Home,
  Landmark,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
  Tag,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useCart, type CartItem } from "@/context/CartContext";
import styles from "./CartDrawer.module.css";

type AddressType = "Home" | "Office" | "Others";
type PaymentMethod = "bank" | "card" | "online";

type AddressDetails = {
  mobile: string;
  address: string;
  type: AddressType;
};

type PaymentDetails = {
  method: PaymentMethod;
  option: string;
  phone: string;
  cardNumber: string;
};

const initialAddress: AddressDetails = {
  mobile: "",
  address: "",
  type: "Home",
};

const initialPayment: PaymentDetails = {
  method: "online",
  option: "bKash",
  phone: "",
  cardNumber: "",
};

const paymentOptions: Record<PaymentMethod, string[]> = {
  bank: ["DBBL Bank", "BRAC Bank", "City Bank", "Eastern Bank"],
  card: ["Visa Card", "Mastercard", "American Express"],
  online: ["bKash", "Rocket", "Nagad"],
};

function getQuantityOptions(item: CartItem) {
  const max = Math.min(Math.max(item.maxQuantity ?? 4, 1), 6);
  return Array.from({ length: max }, (_, index) => index + 1);
}

function getPackLabel(item: CartItem) {
  if (!item.sku) return "Standard pack";
  return item.sku.split("/").map((part) => part.trim()).filter(Boolean).at(-1) || item.sku;
}

function getDeliveryDate() {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  return deliveryDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getOrderId() {
  return `ARG-${Date.now().toString().slice(-7)}`;
}

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, count, subtotal, removeItem, updateQuantity, clearCart } = useCart();
  const { requireAuth } = useAuth();
  const [quantityPicker, setQuantityPicker] = useState<string | null>(null);
  const [addressOpen, setAddressOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [address, setAddress] = useState<AddressDetails>(initialAddress);
  const [savedAddress, setSavedAddress] = useState<AddressDetails | null>(null);
  const [payment, setPayment] = useState<PaymentDetails>(initialPayment);
  const [orderId, setOrderId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const activeItem = items.find((item) => item.id === quantityPicker) ?? null;
  const total = useMemo(() => subtotal, [subtotal]);

  function closeDrawer() {
    setQuantityPicker(null);
    onClose();
  }

  function startAddressFlow() {
    if (!requireAuth({ reason: "Login to add a delivery address and checkout." })) return;
    setAddressOpen(true);
  }

  function submitAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextAddress = {
      ...address,
      mobile: address.mobile.replace(/\D/g, "").slice(0, 11),
      address: address.address.trim(),
    };
    setSavedAddress(nextAddress);
    setAddress(nextAddress);
    setAddressOpen(false);
    setPaymentOpen(true);
  }

  function selectPaymentMethod(method: PaymentMethod) {
    setPayment((current) => ({
      ...current,
      method,
      option: paymentOptions[method][0],
    }));
  }

  function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPaymentOpen(false);
    setOrderId(getOrderId());
    setDeliveryDate(getDeliveryDate());
    clearCart();
    setSuccessOpen(true);
  }

  function resetFlowAndCloseSuccess() {
    setSuccessOpen(false);
    setAddressOpen(false);
    setPaymentOpen(false);
    setQuantityPicker(null);
    closeDrawer();
  }

  return (
    <>
      <button
        aria-label="Close cart"
        className={`${styles.backdrop} ${open ? styles.open : ""}`}
        onClick={closeDrawer}
        type="button"
      />

      <aside className={`${styles.drawer} ${open ? styles.open : ""}`} aria-hidden={!open}>
        <header className={styles.header}>
          <div>
            <h2>Shopping Cart</h2>
            <span>{count} item{count === 1 ? "" : "s"} ready</span>
          </div>
          <button type="button" onClick={closeDrawer} aria-label="Close cart">
            <X />
          </button>
        </header>

        <div className={styles.tabs}>
          <button type="button" className={styles.active}>
            <Store />
            <span>Store</span>
            <b>{count}</b>
          </button>
          <button type="button">
            <FlaskConical />
            <span>Lab</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <div><ShoppingBag /></div>
            <p>Your cart is empty</p>
            <Link href="/store" onClick={closeDrawer}>Start Shopping</Link>
          </div>
        ) : (
          <>
            <div className={styles.content}>
              <section className={styles.list} aria-label="Cart products">
                {items.map((item) => {
                  const packLabel = getPackLabel(item);
                  return (
                    <article key={item.id} className={styles.itemCard}>
                      <Link href={`/products/${item.slug}`} onClick={closeDrawer} className={styles.image} aria-label={`View ${item.name}`}>
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill sizes="78px" unoptimized />
                        ) : (
                          <ShoppingBag />
                        )}
                      </Link>

                      <div className={styles.info}>
                        <Link href={`/products/${item.slug}`} onClick={closeDrawer} className={styles.title}>
                          {item.name}
                        </Link>
                        <span>Pack Size: {packLabel}</span>
                        {item.sku ? <small>{item.sku}</small> : null}
                        <button
                          type="button"
                          className={styles.qtySelect}
                          onClick={() => setQuantityPicker((current) => current === item.id ? null : item.id)}
                          aria-expanded={quantityPicker === item.id}
                        >
                          Qty: {item.quantity}
                          <ChevronDown />
                        </button>
                      </div>

                      <div className={styles.priceColumn}>
                        <button type="button" className={styles.remove} onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
                          <Trash2 />
                        </button>
                        <strong>৳{(item.price * item.quantity).toFixed(0)}</strong>
                      </div>
                    </article>
                  );
                })}
              </section>

              <section className={styles.address}>
                <h3>Shipping Address</h3>
                {savedAddress ? (
                  <div className={styles.savedAddress}>
                    <strong><MapPin /> {savedAddress.type}</strong>
                    <span>{savedAddress.mobile}</span>
                    <p>{savedAddress.address}</p>
                  </div>
                ) : (
                  <p>You haven&apos;t added any address yet.</p>
                )}
                <button type="button" onClick={startAddressFlow} className={styles.addressButton}>
                  <MapPin /> {savedAddress ? "Edit Address" : "Add Address"}
                </button>
              </section>

              <section className={styles.coupon}>
                <a href="#coupon"><Tag /> Have coupon code?</a>
                <div><CheckCircle2 /> You are saving with store offers</div>
              </section>

              <section className={styles.summary}>
                <div><span>Subtotal (MRP)</span><strong>৳{subtotal.toFixed(0)}</strong></div>
                <div><span>Discount applied</span><strong>-৳0</strong></div>
                <div className={styles.delivery}><span><Bike /> Delivery after 3 days</span><strong>Free</strong></div>
              </section>
            </div>

            <footer className={styles.footer}>
              <div>
                <span><ShoppingBag /></span>
                <p><small>{count} Item{count === 1 ? "" : "s"}</small><strong>৳{subtotal.toFixed(0)}</strong></p>
              </div>
              <button type="button" onClick={startAddressFlow}>Select Address</button>
            </footer>
          </>
        )}

        {activeItem ? (
          <div className={styles.quantityPopover} role="dialog" aria-label="Select quantity">
            <header>
              <strong>Select quantity</strong>
              <button type="button" onClick={() => setQuantityPicker(null)} aria-label="Close quantity selector"><X /></button>
            </header>
            <div>
              {getQuantityOptions(activeItem).map((quantity) => (
                <button
                  type="button"
                  key={quantity}
                  className={quantity === activeItem.quantity ? styles.selectedQuantity : ""}
                  onClick={() => {
                    updateQuantity(activeItem.id, quantity);
                    setQuantityPicker(null);
                  }}
                >
                  {quantity} × {getPackLabel(activeItem)}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </aside>

      {addressOpen ? (
        <div className={styles.modalBackdrop} role="presentation">
          <section className={styles.flowModal} role="dialog" aria-modal="true" aria-labelledby="address-modal-title">
            <header>
              <div>
                <span>STEP 1</span>
                <h2 id="address-modal-title">Add delivery address</h2>
                <p>Fill mobile number and full delivery address before payment.</p>
              </div>
              <button type="button" onClick={() => setAddressOpen(false)} aria-label="Close address modal"><X /></button>
            </header>

            <form onSubmit={submitAddress} className={styles.modalForm}>
              <label>
                <span><Phone /> Mobile number</span>
                <input
                  required
                  inputMode="numeric"
                  pattern="01[3-9][0-9]{8}"
                  placeholder="01XXXXXXXXX"
                  value={address.mobile}
                  onChange={(event) => setAddress((current) => ({ ...current, mobile: event.target.value.replace(/\D/g, "").slice(0, 11) }))}
                />
              </label>
              <label>
                <span><MapPin /> Full address</span>
                <textarea
                  required
                  rows={4}
                  minLength={12}
                  placeholder="House, road, area, city"
                  value={address.address}
                  onChange={(event) => setAddress((current) => ({ ...current, address: event.target.value }))}
                />
              </label>

              <div className={styles.addressTypes}>
                {(["Home", "Office", "Others"] as AddressType[]).map((type) => (
                  <button
                    type="button"
                    key={type}
                    className={address.type === type ? styles.selectedOption : ""}
                    onClick={() => setAddress((current) => ({ ...current, type }))}
                  >
                    {type === "Home" ? <Home /> : type === "Office" ? <Building2 /> : <MapPin />}
                    {type}
                  </button>
                ))}
              </div>

              <button type="submit" className={styles.primaryAction}>Submit address & continue payment</button>
            </form>
          </section>
        </div>
      ) : null}

      {paymentOpen ? (
        <div className={styles.modalBackdrop} role="presentation">
          <section className={styles.flowModal} role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
            <header>
              <div>
                <span>STEP 2</span>
                <h2 id="payment-modal-title">Select payment option</h2>
                <p>Choose bank, card, or online payment. You can reselect anytime.</p>
              </div>
              <button type="button" onClick={() => setPaymentOpen(false)} aria-label="Close payment modal"><X /></button>
            </header>

            <form onSubmit={submitPayment} className={styles.modalForm}>
              <div className={styles.paymentMethods}>
                <button type="button" className={payment.method === "bank" ? styles.selectedOption : ""} onClick={() => selectPaymentMethod("bank")}>
                  <Landmark /> Bank
                </button>
                <button type="button" className={payment.method === "card" ? styles.selectedOption : ""} onClick={() => selectPaymentMethod("card")}>
                  <CreditCard /> Card
                </button>
                <button type="button" className={payment.method === "online" ? styles.selectedOption : ""} onClick={() => selectPaymentMethod("online")}>
                  <Smartphone /> Online
                </button>
              </div>

              <div className={styles.paymentOptionGrid}>
                {paymentOptions[payment.method].map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={payment.option === option ? styles.selectedOption : ""}
                    onClick={() => setPayment((current) => ({ ...current, option }))}
                  >
                    <WalletCards />
                    {option}
                  </button>
                ))}
              </div>

              {payment.method === "card" ? (
                <label>
                  <span><CreditCard /> Card number</span>
                  <input
                    required
                    inputMode="numeric"
                    minLength={12}
                    placeholder="Card number"
                    value={payment.cardNumber}
                    onChange={(event) => setPayment((current) => ({ ...current, cardNumber: event.target.value.replace(/\D/g, "").slice(0, 16) }))}
                  />
                </label>
              ) : (
                <label>
                  <span><Phone /> Payment phone number</span>
                  <input
                    required
                    inputMode="numeric"
                    pattern="01[3-9][0-9]{8}"
                    placeholder="01XXXXXXXXX"
                    value={payment.phone}
                    onChange={(event) => setPayment((current) => ({ ...current, phone: event.target.value.replace(/\D/g, "").slice(0, 11) }))}
                  />
                </label>
              )}

              <section className={styles.paymentSummary}>
                <span>Total payable</span>
                <strong>৳{total.toFixed(0)}</strong>
                <small>{savedAddress?.type ?? address.type} delivery • expected after 3 days</small>
              </section>

              <button type="submit" className={styles.primaryAction}>Pay successfully</button>
            </form>
          </section>
        </div>
      ) : null}

      {successOpen ? (
        <div className={styles.modalBackdrop} role="presentation">
          <section className={`${styles.flowModal} ${styles.successModal}`} role="dialog" aria-modal="true" aria-labelledby="success-modal-title">
            <div className={styles.successIcon}><BadgeCheck /></div>
            <h2 id="success-modal-title">Order placed successfully</h2>
            <p>Your payment was successful and your order is now confirmed.</p>
            <div className={styles.successCards}>
              <article><span>Order ID</span><strong>{orderId}</strong></article>
              <article><span>Payment</span><strong>{payment.option}</strong></article>
              <article><span>Delivery date</span><strong>{deliveryDate}</strong></article>
            </div>
            <p className={styles.successNote}>Your order will be delivered after 3 days to your selected {savedAddress?.type ?? address.type} address.</p>
            <button type="button" className={styles.primaryAction} onClick={resetFlowAndCloseSuccess}>Done</button>
          </section>
        </div>
      ) : null}
    </>
  );
}
