"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Clock3,
  FlaskConical,
  Heart,
  Home,
  Inbox,
  LogOut,
  MapPin,
  Menu,
  Package,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./cart/CartDrawer";
import styles from "./TopNavber.module.css";

const nav = [
  { label: "All", href: "/", icon: <Home /> },
  { label: "Store", href: "/store", icon: <Store /> },
  { label: "Lab", href: "/lab", icon: <FlaskConical /> },
  { label: "Doctor", href: "/doctor", icon: <Stethoscope /> },
];

const deliveryOptions = ["Dhaka", "Chattogram", "Sylhet", "Bangladesh"];
const orderOptions = ["Medicines", "Lab test", "Doctor consult", "Health package"];

type DropdownName = "location" | "account" | "order" | null;

export default function TopNavber() {
  const path = usePathname();
  const router = useRouter();
  const { user, logout, requireAuth, openLoginModal } = useAuth();
  const { count } = useCart();

  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdown, setDropdown] = useState<DropdownName>(null);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdown(null);
        setDrawerOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  }

  function toggleDropdown(name: Exclude<DropdownName, null>) {
    setDropdown((current) => (current === name ? null : name));
  }

  function handleAccountClick() {
    if (user) {
      toggleDropdown("account");
      return;
    }

    setDropdown(null);
    openLoginModal("Login to manage your Arogga account.");
  }

  function closeDrawerAndGo(href: string) {
    setDrawerOpen(false);
    router.push(href);
  }

  function openProtectedRoute(href: string, reason: string) {
    setDropdown(null);
    if (!requireAuth({ reason })) return;
    router.push(href);
  }

  function openProtectedCart() {
    if (!requireAuth({ reason: "Login to view cart and add products." })) return;
    setCartOpen(true);
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.top}>
          <button
            type="button"
            className={styles.menu}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu />
          </button>

          <Link className={styles.logo} href="/" aria-label="Arogga home">
            <Image
              src="/arogga-logo.svg"
              alt="Arogga"
              width={220}
              height={70}
              priority
              className={styles.logoImage}
            />
          </Link>

          <div className={styles.dropdownWrap}>
            <button
              type="button"
              className={`${styles.location} ${dropdown === "location" ? styles.dropdownActive : ""}`}
              onClick={() => toggleDropdown("location")}
              aria-expanded={dropdown === "location"}
            >
              <MapPin />
              <span>
                Delivery To<strong>Bangladesh</strong>
              </span>
              <ChevronDown />
            </button>

            <div className={`${styles.dropdownPanel} ${dropdown === "location" ? styles.showDropdown : ""}`}>
              <div className={styles.dropdownHeader}>
                <strong>Choose delivery area</strong>
                <small>Faster delivery with accurate location</small>
              </div>
              {deliveryOptions.map((option) => (
                <button type="button" key={option} onClick={() => setDropdown(null)}>
                  <MapPin />
                  <span>{option}</span>
                  <small>Available</small>
                </button>
              ))}
            </div>
          </div>

          <form className={styles.search} onSubmit={submitSearch}>
            <Search />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search "Products"'
              aria-label="Search products"
            />
            <button type="submit">Search</button>
          </form>

          <div className={styles.actions}>
            <div className={styles.dropdownWrap}>
              <button
                type="button"
                onClick={handleAccountClick}
                className={dropdown === "account" ? styles.dropdownActive : ""}
                aria-expanded={dropdown === "account"}
              >
                <UserRound />
                <span>
                  Account<strong>{user ? user.phone : "Login"}</strong>
                </span>
              </button>

              <div className={`${styles.dropdownPanel} ${styles.accountPanel} ${dropdown === "account" ? styles.showDropdown : ""}`}>
                <div className={styles.profileCard}>
                  <span>
                    <UserRound />
                  </span>
                  <div>
                    <strong>{user?.phone ?? "Welcome"}</strong>
                    <small>Manage your Arogga account</small>
                  </div>
                </div>
                <Link href="/profile" onClick={() => setDropdown(null)}>
                  <UserRound /> Profile
                </Link>
                <Link href="/wishlist" onClick={() => setDropdown(null)}>
                  <Heart /> Wishlist
                </Link>
                <Link href="/profile/orders" onClick={() => setDropdown(null)}>
                  <Package /> Orders
                </Link>
                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setDropdown(null);
                    }}
                  >
                    <LogOut /> Logout
                  </button>
                ) : null}
              </div>
            </div>

            <Link href="/profile/orders" onClick={(event) => {
              if (user) return;
              event.preventDefault();
              openProtectedRoute("/profile/orders", "Login to see your orders.");
            }}>
              <Package />
              <span>
                Orders<strong>0</strong>
              </span>
            </Link>
            <Link href="/profile/inbox" onClick={(event) => {
              if (user) return;
              event.preventDefault();
              openProtectedRoute("/profile/inbox", "Login to read your inbox messages.");
            }}>
              <Inbox />
              <span>
                Inbox<strong>0</strong>
              </span>
            </Link>
            <button type="button" onClick={openProtectedCart} className={styles.cart}>
              <ShoppingCart />
              <b>{count}</b>
              <span>Cart</span>
            </button>
          </div>
        </div>

        <div className={styles.bottom}>
          <Link href="/offers">
            <Sparkles /> Flash Sale <span>Save upto 74%</span>
          </Link>
          <nav aria-label="Primary navigation">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={path === item.href || path.startsWith(`${item.href}/`) ? styles.active : ""}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className={styles.dropdownWrap}>
            <button
              type="button"
              className={`${styles.orderButton} ${dropdown === "order" ? styles.dropdownActive : ""}`}
              onClick={() => toggleDropdown("order")}
              aria-expanded={dropdown === "order"}
            >
              Order By <ChevronDown />
            </button>
            <div className={`${styles.dropdownPanel} ${styles.orderPanel} ${dropdown === "order" ? styles.showDropdown : ""}`}>
              {orderOptions.map((option) => (
                <button type="button" key={option} onClick={() => {
                  setDropdown(null);
                  if (!requireAuth({ reason: `Login to continue with ${option}.` })) return;
                }}>
                  <Clock3 /> {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <button
        type="button"
        aria-label="Close navigation menu"
        className={`${styles.mobileShade} ${drawerOpen ? styles.open : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      <aside className={`${styles.mobileDrawer} ${drawerOpen ? styles.open : ""}`} aria-hidden={!drawerOpen}>
        <header>
          <div>
            <span>Menu</span>
            <small>Browse Arogga smoothly</small>
          </div>
          <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close navigation menu">
            <X />
          </button>
        </header>

        <button
          type="button"
          className={styles.drawerAccount}
          onClick={() => {
            if (user) closeDrawerAndGo("/profile");
            else {
              setDrawerOpen(false);
              openLoginModal("Login to manage your Arogga account.");
            }
          }}
        >
          <UserRound />
          <span>{user ? user.phone : "Login / Register"}</span>
          <ShieldCheck />
        </button>

        {nav.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setDrawerOpen(false)}>
            {item.icon}
            {item.label}
          </Link>
        ))}
        <button type="button" onClick={() => {
          setDrawerOpen(false);
          openProtectedRoute("/profile/orders", "Login to see your orders.");
        }}>
          <Package /> Orders
        </button>
        <button type="button" onClick={() => {
          setDrawerOpen(false);
          openProtectedRoute("/profile/inbox", "Login to read your inbox messages.");
        }}>
          <Inbox /> Inbox
        </button>
        {user ? (
          <button type="button" onClick={logout}>
            <LogOut /> Logout
          </button>
        ) : null}
      </aside>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
