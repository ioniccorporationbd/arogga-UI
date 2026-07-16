"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FlaskConical,
  Heart,
  Home,
  MapPin,
  Menu,
  PackageCheck,
  Search,
  ShoppingCart,
  Stethoscope,
  Store,
  UserRound,
  X,
} from "lucide-react";
import {
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type DropdownName =
  | "delivery"
  | "account"
  | "notifications"
  | "cart"
  | null;

type NavigationItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

type LocationItem = {
  name: string;
  description: string;
};

type SearchSuggestion = {
  id: number;
  title: string;
  type: string;
  price?: string;
  href: string;
};

type NotificationItem = {
  id: number;
  title: string;
  description: string;
  unread: boolean;
};

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

const navigationItems: NavigationItem[] = [
  {
    label: "All",
    href: "/",
    icon: <Home size={18} />,
  },
  {
    label: "Store",
    href: "/store",
    icon: <Store size={18} />,
  },
  {
    label: "Lab",
    href: "/lab",
    icon: <FlaskConical size={18} />,
  },
  {
    label: "Doctor",
    href: "/doctor",
    icon: <Stethoscope size={18} />,
  },
];

const locations: LocationItem[] = [
  {
    name: "Bangladesh",
    description: "Nationwide delivery",
  },
  {
    name: "Dhaka",
    description: "Express delivery available",
  },
  {
    name: "Chattogram",
    description: "Standard delivery",
  },
  {
    name: "Sylhet",
    description: "Standard delivery",
  },
];

const searchSuggestions: SearchSuggestion[] = [
  {
    id: 1,
    title: "Napa 500mg Tablet",
    type: "Medicine",
    price: "৳20",
    href: "/product/napa-500mg",
  },
  {
    id: 2,
    title: "Vitamin D3 Capsule",
    type: "Supplement",
    price: "৳320",
    href: "/product/vitamin-d3",
  },
  {
    id: 3,
    title: "CBC Blood Test",
    type: "Lab Test",
    price: "৳450",
    href: "/lab/cbc",
  },
  {
    id: 4,
    title: "Online Doctor Consultation",
    type: "Doctor",
    href: "/doctor",
  },
];

const notifications: NotificationItem[] = [
  {
    id: 1,
    title: "Order confirmed",
    description: "Your latest order has been confirmed.",
    unread: true,
  },
  {
    id: 2,
    title: "Lab report ready",
    description: "Your lab report is available now.",
    unread: true,
  },
  {
    id: 3,
    title: "Healthcare offer",
    description: "New discounts are available in the store.",
    unread: false,
  },
];

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Napa 500mg Tablet",
    quantity: 2,
    price: 20,
  },
  {
    id: 2,
    name: "Vitamin D3 Capsule",
    quantity: 1,
    price: 320,
  },
];

export default function TopNavber() {
  const pathname = usePathname();
  const router = useRouter();

  const headerRef = useRef<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState("Bangladesh");

  const [openDropdown, setOpenDropdown] =
    useState<DropdownName>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  const [cartItems, setCartItems] =
    useState<CartItem[]>(initialCartItems);

  const filteredSuggestions = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return searchSuggestions;
    }

    return searchSuggestions.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
      );
    });
  }, [searchText]);

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0,
    );
  }, [cartItems]);

  const unreadNotifications = useMemo(() => {
    return notifications.filter(
      (item) => item.unread,
    ).length;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      const target = event.target as Node;

      if (
        headerRef.current &&
        !headerRef.current.contains(target)
      ) {
        setOpenDropdown(null);
        setSearchOpen(false);
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const toggleDropdown = (
    dropdown: DropdownName,
  ) => {
    setSearchOpen(false);

    setOpenDropdown((current) =>
      current === dropdown ? null : dropdown,
    );
  };

  const handleSearch = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const query = searchText.trim();

    if (!query) {
      searchInputRef.current?.focus();
      setSearchOpen(true);
      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(query)}`,
    );

    setSearchOpen(false);
    setOpenDropdown(null);
  };

  const removeCartItem = (itemId: number) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== itemId,
      ),
    );
  };

  return (
    <>
      <header
        ref={headerRef}
        className={[
          "site-navbar",
          isScrolled ? "is-scrolled" : "",
        ].join(" ")}
      >
        <div className="site-navbar-main">
          <div className="site-navbar-container">
            <div className="site-navbar-row">
              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(true)
                }
                aria-label="Open menu"
                className="site-navbar-menu-button"
              >
                <Menu size={22} />
              </button>

              <Link
                href="/"
                aria-label="Arogga home"
                className="site-navbar-logo-link"
              >
                <Logo />
              </Link>

              <div className="site-navbar-location">
                <button
                  type="button"
                  onClick={() =>
                    toggleDropdown("delivery")
                  }
                  aria-expanded={
                    openDropdown === "delivery"
                  }
                  className="site-navbar-location-button"
                >
                  <span className="site-navbar-location-icon">
                    <MapPin size={20} />
                  </span>

                  <span className="site-navbar-location-text">
                    <span>Deliver to</span>
                    <strong>
                      {selectedLocation}
                    </strong>
                  </span>

                  <ChevronDown
                    size={16}
                    className={
                      openDropdown === "delivery"
                        ? "is-rotated"
                        : ""
                    }
                  />
                </button>

                {openDropdown === "delivery" && (
                  <Dropdown className="site-navbar-location-dropdown">
                    <DropdownHeader
                      eyebrow="Delivery location"
                      title="Select your area"
                      onClose={() =>
                        setOpenDropdown(null)
                      }
                    />

                    <div className="site-navbar-location-list">
                      {locations.map((location) => {
                        const selected =
                          location.name ===
                          selectedLocation;

                        return (
                          <button
                            key={location.name}
                            type="button"
                            onClick={() => {
                              setSelectedLocation(
                                location.name,
                              );

                              setOpenDropdown(null);
                            }}
                            className={
                              selected
                                ? "is-selected"
                                : ""
                            }
                          >
                            <span>
                              <MapPin size={17} />
                            </span>

                            <span>
                              <strong>
                                {location.name}
                              </strong>

                              <small>
                                {
                                  location.description
                                }
                              </small>
                            </span>

                            {selected && (
                              <Check size={17} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </Dropdown>
                )}
              </div>

              <form
                onSubmit={handleSearch}
                className="site-navbar-search"
              >
                <div
                  className={[
                    "site-navbar-search-box",
                    searchOpen
                      ? "is-focused"
                      : "",
                  ].join(" ")}
                >
                  <Search size={20} />

                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchText}
                    onChange={(event) =>
                      setSearchText(
                        event.target.value,
                      )
                    }
                    onFocus={() => {
                      setSearchOpen(true);
                      setOpenDropdown(null);
                    }}
                    placeholder="Search medicines, products, lab tests or doctors"
                    aria-label="Search"
                    autoComplete="off"
                  />

                  {searchText && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchText("");
                        searchInputRef.current?.focus();
                      }}
                      aria-label="Clear search"
                      className="site-navbar-search-clear"
                    >
                      <X size={17} />
                    </button>
                  )}

                  <button
                    type="submit"
                    className="site-navbar-search-submit"
                  >
                    Search
                  </button>

                  {searchOpen && (
                    <div className="site-navbar-search-panel">
                      <div className="site-navbar-search-panel-header">
                        <span>
                          Suggested results
                        </span>

                        <small>
                          {
                            filteredSuggestions.length
                          }{" "}
                          items
                        </small>
                      </div>

                      <div className="site-navbar-search-results">
                        {filteredSuggestions.length >
                        0 ? (
                          filteredSuggestions.map(
                            (item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setSearchText(
                                    item.title,
                                  );

                                  setSearchOpen(false);
                                  router.push(item.href);
                                }}
                              >
                                <span className="site-navbar-result-icon">
                                  {item.type ===
                                  "Lab Test" ? (
                                    <FlaskConical
                                      size={18}
                                    />
                                  ) : item.type ===
                                    "Doctor" ? (
                                    <Stethoscope
                                      size={18}
                                    />
                                  ) : (
                                    <Store
                                      size={18}
                                    />
                                  )}
                                </span>

                                <span className="site-navbar-result-content">
                                  <strong>
                                    {item.title}
                                  </strong>

                                  <small>
                                    {item.type}
                                  </small>
                                </span>

                                {item.price && (
                                  <span className="site-navbar-result-price">
                                    {item.price}
                                  </span>
                                )}

                                <ChevronRight
                                  size={17}
                                />
                              </button>
                            ),
                          )
                        ) : (
                          <div className="site-navbar-empty-search">
                            <Search size={26} />

                            <strong>
                              No result found
                            </strong>

                            <span>
                              Try another keyword.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </form>

              <div className="site-navbar-actions">
                <div className="site-navbar-action-wrapper">
                  <button
                    type="button"
                    onClick={() =>
                      toggleDropdown("account")
                    }
                    className="site-navbar-account-button"
                    aria-expanded={
                      openDropdown === "account"
                    }
                  >
                    <span>
                      <UserRound size={20} />
                    </span>

                    <span>
                      <small>Account</small>
                      <strong>Login</strong>
                    </span>
                  </button>

                  {openDropdown === "account" && (
                    <Dropdown className="site-navbar-account-dropdown">
                      <div className="site-navbar-account-heading">
                        <span>
                          <UserRound size={22} />
                        </span>

                        <div>
                          <strong>
                            Welcome to Arogga
                          </strong>

                          <small>
                            Manage your account
                          </small>
                        </div>
                      </div>

                      <div className="site-navbar-account-buttons">
                        <Link
                          href="/login"
                          onClick={() =>
                            setOpenDropdown(null)
                          }
                          className="primary"
                        >
                          Login
                        </Link>

                        <Link
                          href="/register"
                          onClick={() =>
                            setOpenDropdown(null)
                          }
                        >
                          Register
                        </Link>
                      </div>

                      <div className="site-navbar-account-links">
                        <Link href="/orders">
                          <ClipboardList size={17} />
                          My Orders
                        </Link>

                        <Link href="/wishlist">
                          <Heart size={17} />
                          Wishlist
                        </Link>
                      </div>
                    </Dropdown>
                  )}
                </div>

                <div className="site-navbar-action-wrapper">
                  <button
                    type="button"
                    onClick={() =>
                      toggleDropdown(
                        "notifications",
                      )
                    }
                    className="site-navbar-icon-button"
                    aria-label="Notifications"
                  >
                    <Bell size={21} />

                    {unreadNotifications > 0 && (
                      <span>
                        {unreadNotifications}
                      </span>
                    )}
                  </button>

                  {openDropdown ===
                    "notifications" && (
                    <Dropdown className="site-navbar-notification-dropdown">
                      <DropdownHeader
                        eyebrow="Notifications"
                        title="Recent updates"
                        onClose={() =>
                          setOpenDropdown(null)
                        }
                      />

                      <div className="site-navbar-notifications">
                        {notifications.map(
                          (notification) => (
                            <Link
                              key={notification.id}
                              href="/notifications"
                              className={
                                notification.unread
                                  ? "is-unread"
                                  : ""
                              }
                              onClick={() =>
                                setOpenDropdown(null)
                              }
                            >
                              <span>
                                <Bell size={17} />
                              </span>

                              <span>
                                <strong>
                                  {
                                    notification.title
                                  }
                                </strong>

                                <small>
                                  {
                                    notification.description
                                  }
                                </small>
                              </span>

                              {notification.unread && (
                                <i />
                              )}
                            </Link>
                          ),
                        )}
                      </div>
                    </Dropdown>
                  )}
                </div>

                <div className="site-navbar-action-wrapper">
                  <button
                    type="button"
                    onClick={() =>
                      toggleDropdown("cart")
                    }
                    className="site-navbar-cart-button"
                    aria-expanded={
                      openDropdown === "cart"
                    }
                  >
                    <span className="site-navbar-cart-icon">
                      <ShoppingCart size={21} />

                      <b>{cartCount}</b>
                    </span>

                    <span>
                      <small>Cart</small>
                      <strong>
                        ৳{cartSubtotal}
                      </strong>
                    </span>
                  </button>

                  {openDropdown === "cart" && (
                    <Dropdown className="site-navbar-cart-dropdown">
                      <DropdownHeader
                        eyebrow="Shopping cart"
                        title={`${cartCount} items`}
                        onClose={() =>
                          setOpenDropdown(null)
                        }
                      />

                      <div className="site-navbar-cart-items">
                        {cartItems.length > 0 ? (
                          cartItems.map((item) => (
                            <div key={item.id}>
                              <span>
                                <ShoppingCart
                                  size={18}
                                />
                              </span>

                              <span>
                                <strong>
                                  {item.name}
                                </strong>

                                <small>
                                  Quantity:{" "}
                                  {item.quantity}
                                </small>

                                <b>
                                  ৳
                                  {item.price *
                                    item.quantity}
                                </b>
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  removeCartItem(
                                    item.id,
                                  )
                                }
                                aria-label={`Remove ${item.name}`}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="site-navbar-empty-cart">
                            <ShoppingCart
                              size={26}
                            />

                            <strong>
                              Your cart is empty
                            </strong>
                          </div>
                        )}
                      </div>

                      {cartItems.length > 0 && (
                        <div className="site-navbar-cart-footer">
                          <span>
                            <small>Subtotal</small>

                            <strong>
                              ৳{cartSubtotal}
                            </strong>
                          </span>

                          <div>
                            <Link
                              href="/cart"
                              onClick={() =>
                                setOpenDropdown(null)
                              }
                            >
                              View Cart
                            </Link>

                            <Link
                              href="/checkout"
                              className="primary"
                              onClick={() =>
                                setOpenDropdown(null)
                              }
                            >
                              Checkout
                            </Link>
                          </div>
                        </div>
                      )}
                    </Dropdown>
                  )}
                </div>
              </div>

              <Link
                href="/cart"
                aria-label="Shopping cart"
                className="site-navbar-mobile-cart"
              >
                <ShoppingCart size={21} />
                <span>{cartCount}</span>
              </Link>
            </div>

            <div className="site-navbar-mobile-search-row">
              <form
                onSubmit={handleSearch}
                className="site-navbar-mobile-search"
              >
                <Search size={18} />

                <input
                  type="search"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(
                      event.target.value,
                    )
                  }
                  placeholder="Search products, lab or doctors"
                  aria-label="Search"
                />

                <button type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="site-navbar-navigation">
          <div className="site-navbar-container">
            <nav
              aria-label="Primary navigation"
              className="site-navbar-navigation-list"
            >
              {navigationItems.map((item) => {
                const active = isActiveRoute(
                  item.href,
                );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active ? "is-active" : ""
                    }
                  >
                    <span>{item.icon}</span>
                    <strong>{item.label}</strong>
                    <i />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <div
        aria-hidden={!mobileMenuOpen}
        onClick={() =>
          setMobileMenuOpen(false)
        }
        className={[
          "site-navbar-mobile-overlay",
          mobileMenuOpen ? "is-open" : "",
        ].join(" ")}
      />

      <aside
        aria-hidden={!mobileMenuOpen}
        className={[
          "site-navbar-mobile-drawer",
          mobileMenuOpen ? "is-open" : "",
        ].join(" ")}
      >
        <div className="site-navbar-mobile-drawer-header">
          <Logo />

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <div className="site-navbar-mobile-account">
          <span>
            <UserRound size={21} />
          </span>

          <div>
            <strong>
              Welcome to Arogga
            </strong>

            <small>
              Login to manage your account
            </small>
          </div>

          <Link
            href="/login"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          >
            Login
          </Link>
        </div>

        <div className="site-navbar-mobile-location">
          <MapPin size={19} />

          <div>
            <small>Deliver to</small>
            <strong>
              {selectedLocation}
            </strong>
          </div>
        </div>

        <nav className="site-navbar-mobile-links">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className={
                isActiveRoute(item.href)
                  ? "is-active"
                  : ""
              }
            >
              <span>{item.icon}</span>
              <strong>{item.label}</strong>
              <ChevronRight size={17} />
            </Link>
          ))}
        </nav>

        <Link
          href="/track-order"
          onClick={() =>
            setMobileMenuOpen(false)
          }
          className="site-navbar-mobile-track"
        >
          <PackageCheck size={18} />
          Track Order
        </Link>
      </aside>

      <nav
        aria-label="Mobile navigation"
        className="site-navbar-bottom-nav"
      >
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActiveRoute(item.href)
                ? "is-active"
                : ""
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <style jsx global>{`
        .site-navbar {
          --nav-text-20: 20px;
          --nav-text-18: 18px;
          --nav-text-16: 16px;
          --nav-text-13: 13px;

          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          color: #101828;
        }

        .site-navbar-main,
        .site-navbar-navigation {
          border-bottom: 1px solid
            rgba(15, 23, 42, 0.08);
          background: rgba(
            255,
            255,
            255,
            0.96
          );
          backdrop-filter: blur(18px);
          transition:
            background-color 250ms ease,
            box-shadow 250ms ease;
        }

        .site-navbar.is-scrolled
          .site-navbar-main {
          background: rgba(
            255,
            255,
            255,
            0.92
          );
          box-shadow: 0 18px 40px -30px
            rgba(15, 23, 42, 0.5);
        }

        .site-navbar-container {
          width: min(
            1440px,
            calc(100% - 48px)
          );
          margin-inline: auto;
        }

        .site-navbar-row {
          display: flex;
          min-height: 74px;
          align-items: center;
          gap: 16px;
        }

        .site-navbar-logo-link {
          display: inline-flex;
          flex-shrink: 0;
          border-radius: 10px;
          text-decoration: none;
        }

        .site-navbar-logo {
          display: flex;
          align-items: center;
          color: #087b75;
          font-size: var(--nav-text-20);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -1.4px;
        }

        .site-navbar-logo-symbol {
          position: relative;
          display: inline-flex;
          width: 31px;
          height: 31px;
          align-items: center;
          justify-content: center;
          margin-inline: 1px;
          border: 4px solid #087b75;
          border-radius: 50%;
        }

        .site-navbar-logo-heart {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ef4545;
        }

        .site-navbar-logo-cross-vertical,
        .site-navbar-logo-cross-horizontal {
          position: absolute;
          z-index: 2;
          background: #ffffff;
        }

        .site-navbar-logo-cross-vertical {
          width: 4px;
          height: 14px;
        }

        .site-navbar-logo-cross-horizontal {
          width: 14px;
          height: 4px;
        }

        .site-navbar-location {
          position: relative;
          width: 195px;
          flex-shrink: 0;
        }

        .site-navbar-location-button {
          display: flex;
          width: 100%;
          min-height: 48px;
          align-items: center;
          gap: 10px;
          padding: 6px 9px;
          border: 1px solid transparent;
          border-radius: 12px;
          background: transparent;
          color: #344054;
          font-family: inherit;
          cursor: pointer;
          transition:
            border-color 200ms ease,
            background-color 200ms ease;
        }

        .site-navbar-location-button:hover {
          border-color: #d6e8e5;
          background: #f5faf9;
        }

        .site-navbar-location-icon {
          display: flex;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #087b75;
          background: #e9f8f5;
        }

        .site-navbar-location-text {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
          align-items: flex-start;
        }

        .site-navbar-location-text span,
        .site-navbar-location-text strong {
          font-size: var(--nav-text-13);
        }

        .site-navbar-location-text span {
          color: #667085;
        }

        .site-navbar-location-text strong {
          max-width: 105px;
          overflow: hidden;
          color: #101828;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .is-rotated {
          transform: rotate(180deg);
        }

        .site-navbar-dropdown {
          position: absolute;
          z-index: 130;
          overflow: hidden;
          border: 1px solid
            rgba(15, 23, 42, 0.09);
          border-radius: 16px;
          background: rgba(
            255,
            255,
            255,
            0.99
          );
          box-shadow:
            0 26px 65px -30px
              rgba(15, 23, 42, 0.38),
            0 10px 24px -20px
              rgba(15, 23, 42, 0.2);
          backdrop-filter: blur(18px);
          animation: siteNavbarDropdownIn
            200ms ease both;
        }

        .site-navbar-location-dropdown {
          top: calc(100% + 10px);
          left: 0;
          width: 320px;
          padding: 12px;
        }

        .site-navbar-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 4px 4px 12px;
          border-bottom: 1px solid
            rgba(15, 23, 42, 0.08);
        }

        .site-navbar-dropdown-header > div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .site-navbar-dropdown-header span,
        .site-navbar-dropdown-header strong {
          font-size: var(--nav-text-13);
        }

        .site-navbar-dropdown-header span {
          color: #667085;
        }

        .site-navbar-dropdown-header strong {
          color: #101828;
        }

        .site-navbar-dropdown-header button {
          display: flex;
          width: 32px;
          height: 32px;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 9px;
          color: #667085;
          background: transparent;
          cursor: pointer;
        }

        .site-navbar-dropdown-header button:hover {
          color: #101828;
          background: #f2f4f7;
        }

        .site-navbar-location-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 10px;
        }

        .site-navbar-location-list button {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border: 0;
          border-radius: 11px;
          color: #344054;
          background: transparent;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
        }

        .site-navbar-location-list
          button:hover,
        .site-navbar-location-list
          button.is-selected {
          color: #087b75;
          background: #eff9f7;
        }

        .site-navbar-location-list
          button
          > span:first-child {
          display: flex;
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #f1f4f4;
        }

        .site-navbar-location-list
          button
          > span:nth-child(2) {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
        }

        .site-navbar-location-list strong,
        .site-navbar-location-list small {
          font-size: var(--nav-text-13);
        }

        .site-navbar-location-list small {
          color: #8a94a3;
        }

        .site-navbar-search {
          min-width: 0;
          flex: 1;
        }

        .site-navbar-search-box {
          position: relative;
          display: flex;
          height: 48px;
          align-items: center;
          border: 1px solid #d8dee3;
          border-radius: 14px;
          background: #fafcfc;
          transition:
            border-color 220ms ease,
            box-shadow 220ms ease,
            background-color 220ms ease;
        }

        .site-navbar-search-box.is-focused {
          border-color: #087b75;
          background: #ffffff;
          box-shadow: 0 0 0 4px
            rgba(8, 123, 117, 0.08);
        }

        .site-navbar-search-box > svg {
          margin-left: 14px;
          flex-shrink: 0;
          color: #667085;
        }

        .site-navbar-search-box > input {
          min-width: 0;
          height: 100%;
          flex: 1;
          padding-inline: 11px;
          border: 0;
          outline: none;
          color: #101828;
          background: transparent;
          font-family: inherit;
          font-size: var(--nav-text-13);
        }

        .site-navbar-search-box
          > input::placeholder {
          color: #98a2b3;
        }

        .site-navbar-search-clear {
          display: flex;
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 8px;
          color: #98a2b3;
          background: transparent;
          cursor: pointer;
        }

        .site-navbar-search-clear:hover {
          background: #f2f4f7;
          color: #344054;
        }

        .site-navbar-search-submit {
          align-self: stretch;
          min-width: 94px;
          border: 0;
          border-radius: 0 14px 14px 0;
          color: #ffffff;
          background: linear-gradient(
            135deg,
            #0c9187,
            #087b75
          );
          font-family: inherit;
          font-size: var(--nav-text-13);
          font-weight: 750;
          cursor: pointer;
        }

        .site-navbar-search-submit:hover {
          background: linear-gradient(
            135deg,
            #087b75,
            #06635e
          );
        }

        .site-navbar-search-panel {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          z-index: 140;
          width: 100%;
          overflow: hidden;
          border: 1px solid
            rgba(15, 23, 42, 0.09);
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 28px 65px -30px
            rgba(15, 23, 42, 0.4);
        }

        .site-navbar-search-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 13px 14px;
          border-bottom: 1px solid
            rgba(15, 23, 42, 0.08);
        }

        .site-navbar-search-panel-header span,
        .site-navbar-search-panel-header small {
          font-size: var(--nav-text-13);
        }

        .site-navbar-search-panel-header span {
          color: #344054;
          font-weight: 750;
        }

        .site-navbar-search-panel-header small {
          color: #98a2b3;
        }

        .site-navbar-search-results {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 8px;
        }

        .site-navbar-search-results button {
          display: flex;
          width: 100%;
          align-items: center;
          gap: 10px;
          padding: 9px;
          border: 0;
          border-radius: 11px;
          color: #344054;
          background: transparent;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
        }

        .site-navbar-search-results
          button:hover {
          background: #f5f9f8;
        }

        .site-navbar-result-icon {
          display: flex;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #087b75;
          background: #e9f8f5;
        }

        .site-navbar-result-content {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
        }

        .site-navbar-result-content strong,
        .site-navbar-result-content small,
        .site-navbar-result-price {
          font-size: var(--nav-text-13);
        }

        .site-navbar-result-content strong {
          overflow: hidden;
          color: #101828;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .site-navbar-result-content small {
          color: #8a94a3;
        }

        .site-navbar-result-price {
          color: #087b75;
          font-weight: 800;
        }

        .site-navbar-empty-search,
        .site-navbar-empty-cart {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          padding: 26px;
          color: #98a2b3;
          text-align: center;
        }

        .site-navbar-empty-search strong,
        .site-navbar-empty-search span,
        .site-navbar-empty-cart strong {
          font-size: var(--nav-text-13);
        }

        .site-navbar-empty-search strong,
        .site-navbar-empty-cart strong {
          color: #344054;
        }

        .site-navbar-actions {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          gap: 4px;
        }

        .site-navbar-action-wrapper {
          position: relative;
        }

        .site-navbar-account-button,
        .site-navbar-cart-button {
          display: flex;
          min-height: 44px;
          align-items: center;
          gap: 8px;
          padding: 5px 8px;
          border: 0;
          border-radius: 11px;
          background: transparent;
          color: #344054;
          font-family: inherit;
          cursor: pointer;
        }

        .site-navbar-account-button:hover,
        .site-navbar-cart-button:hover {
          background: #f4f7f7;
        }

        .site-navbar-account-button
          > span:first-child {
          display: flex;
          width: 35px;
          height: 35px;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #f1f4f4;
        }

        .site-navbar-account-button
          > span:last-child,
        .site-navbar-cart-button
          > span:last-child {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .site-navbar-account-button small,
        .site-navbar-account-button strong,
        .site-navbar-cart-button small,
        .site-navbar-cart-button strong {
          font-size: var(--nav-text-13);
        }

        .site-navbar-account-button small,
        .site-navbar-cart-button small {
          color: #667085;
        }

        .site-navbar-account-button strong,
        .site-navbar-cart-button strong {
          color: #101828;
        }

        .site-navbar-icon-button {
          position: relative;
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 11px;
          color: #344054;
          background: transparent;
          cursor: pointer;
        }

        .site-navbar-icon-button:hover {
          color: #087b75;
          background: #eff8f6;
        }

        .site-navbar-icon-button > span {
          position: absolute;
          top: 1px;
          right: 1px;
          display: flex;
          min-width: 18px;
          height: 18px;
          align-items: center;
          justify-content: center;
          padding-inline: 4px;
          border: 2px solid #ffffff;
          border-radius: 999px;
          color: #ffffff;
          background: #e5484d;
          font-size: var(--nav-text-13);
          font-weight: 800;
        }

        .site-navbar-cart-icon {
          position: relative;
          display: flex;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #087b75;
          background: #e9f8f5;
        }

        .site-navbar-cart-icon b {
          position: absolute;
          top: -5px;
          right: -5px;
          display: flex;
          min-width: 18px;
          height: 18px;
          align-items: center;
          justify-content: center;
          padding-inline: 4px;
          border: 2px solid #ffffff;
          border-radius: 999px;
          color: #ffffff;
          background: #087b75;
          font-size: var(--nav-text-13);
        }

        .site-navbar-account-dropdown {
          top: calc(100% + 11px);
          right: 0;
          width: 280px;
          padding: 12px;
        }

        .site-navbar-account-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 4px 13px;
        }

        .site-navbar-account-heading > span {
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #087b75;
          background: #e9f8f5;
        }

        .site-navbar-account-heading > div {
          display: flex;
          flex-direction: column;
        }

        .site-navbar-account-heading strong,
        .site-navbar-account-heading small {
          font-size: var(--nav-text-13);
        }

        .site-navbar-account-heading small {
          color: #8a94a3;
        }

        .site-navbar-account-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding-bottom: 11px;
          border-bottom: 1px solid
            rgba(15, 23, 42, 0.08);
        }

        .site-navbar-account-buttons a {
          display: flex;
          min-height: 40px;
          align-items: center;
          justify-content: center;
          border: 1px solid #d8dee3;
          border-radius: 10px;
          color: #344054;
          font-size: var(--nav-text-13);
          font-weight: 750;
          text-decoration: none;
        }

        .site-navbar-account-buttons
          a.primary {
          border-color: #087b75;
          color: #ffffff;
          background: #087b75;
        }

        .site-navbar-account-links {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding-top: 9px;
        }

        .site-navbar-account-links a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          color: #475467;
          font-size: var(--nav-text-13);
          text-decoration: none;
        }

        .site-navbar-account-links a:hover {
          color: #087b75;
          background: #eff8f6;
        }

        .site-navbar-notification-dropdown {
          top: calc(100% + 11px);
          right: -45px;
          width: 350px;
          padding: 11px;
        }

        .site-navbar-notifications {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 8px;
        }

        .site-navbar-notifications a {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px;
          border-radius: 11px;
          color: #344054;
          text-decoration: none;
        }

        .site-navbar-notifications
          a:hover,
        .site-navbar-notifications
          a.is-unread {
          background: #f5faf9;
        }

        .site-navbar-notifications
          a
          > span:first-child {
          display: flex;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #087b75;
          background: #e9f8f5;
        }

        .site-navbar-notifications
          a
          > span:nth-child(2) {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
        }

        .site-navbar-notifications strong,
        .site-navbar-notifications small {
          font-size: var(--nav-text-13);
        }

        .site-navbar-notifications small {
          color: #667085;
          line-height: 1.5;
        }

        .site-navbar-notifications i {
          width: 7px;
          height: 7px;
          margin-top: 7px;
          border-radius: 50%;
          background: #087b75;
        }

        .site-navbar-cart-dropdown {
          top: calc(100% + 11px);
          right: 0;
          width: 350px;
          padding: 11px;
        }

        .site-navbar-cart-items {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 10px 0;
        }

        .site-navbar-cart-items > div {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 9px;
          border-radius: 11px;
          background: #f8faf9;
        }

        .site-navbar-cart-items
          > div
          > span:first-child {
          display: flex;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: #087b75;
          background: #e9f8f5;
        }

        .site-navbar-cart-items
          > div
          > span:nth-child(2) {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
        }

        .site-navbar-cart-items strong,
        .site-navbar-cart-items small,
        .site-navbar-cart-items b {
          font-size: var(--nav-text-13);
        }

        .site-navbar-cart-items small {
          color: #8a94a3;
        }

        .site-navbar-cart-items b {
          color: #087b75;
        }

        .site-navbar-cart-items
          > div
          > button {
          display: flex;
          width: 30px;
          height: 30px;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 8px;
          color: #98a2b3;
          background: transparent;
          cursor: pointer;
        }

        .site-navbar-cart-items
          > div
          > button:hover {
          color: #d92d20;
          background: #fff0ef;
        }

        .site-navbar-cart-footer {
          padding-top: 10px;
          border-top: 1px solid
            rgba(15, 23, 42, 0.08);
        }

        .site-navbar-cart-footer > span {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .site-navbar-cart-footer small,
        .site-navbar-cart-footer strong {
          font-size: var(--nav-text-13);
        }

        .site-navbar-cart-footer > div {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 11px;
        }

        .site-navbar-cart-footer a {
          display: flex;
          min-height: 40px;
          align-items: center;
          justify-content: center;
          border: 1px solid #d8dee3;
          border-radius: 10px;
          color: #344054;
          font-size: var(--nav-text-13);
          font-weight: 750;
          text-decoration: none;
        }

        .site-navbar-cart-footer
          a.primary {
          border-color: #087b75;
          color: #ffffff;
          background: #087b75;
        }

        .site-navbar-navigation-list {
          display: flex;
          min-height: 48px;
          align-items: stretch;
          justify-content: center;
          gap: 14px;
        }

        .site-navbar-navigation-list a {
          position: relative;
          display: flex;
          min-width: 110px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding-inline: 18px;
          color: #344054;
          font-size: var(--nav-text-13);
          text-decoration: none;
          transition:
            color 200ms ease,
            background-color 200ms ease;
        }

        .site-navbar-navigation-list
          a:hover,
        .site-navbar-navigation-list
          a.is-active {
          color: #087b75;
          background: #f5faf9;
        }

        .site-navbar-navigation-list
          a
          strong {
          font-size: var(--nav-text-13);
        }

        .site-navbar-navigation-list a i {
          position: absolute;
          right: 18px;
          bottom: 0;
          left: 18px;
          height: 3px;
          border-radius: 999px 999px 0 0;
          background: #087b75;
          opacity: 0;
          transform: scaleX(0.3);
          transition:
            opacity 200ms ease,
            transform 200ms ease;
        }

        .site-navbar-navigation-list
          a:hover
          i,
        .site-navbar-navigation-list
          a.is-active
          i {
          opacity: 1;
          transform: scaleX(1);
        }

        .site-navbar-menu-button,
        .site-navbar-mobile-cart,
        .site-navbar-mobile-search-row,
        .site-navbar-mobile-overlay,
        .site-navbar-mobile-drawer,
        .site-navbar-bottom-nav {
          display: none;
        }

        @keyframes siteNavbarDropdownIn {
          from {
            opacity: 0;
            transform: translateY(-7px)
              scale(0.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 1180px) {
          .site-navbar-container {
            width: min(
              1120px,
              calc(100% - 40px)
            );
          }

          .site-navbar-location {
            width: 175px;
          }

          .site-navbar-actions
            .site-navbar-action-wrapper:first-child {
            display: none;
          }
        }

        @media (max-width: 960px) {
          .site-navbar-location {
            display: none;
          }

          .site-navbar-actions {
            display: none;
          }

          .site-navbar-navigation-list a {
            min-width: 100px;
          }
        }

        @media (max-width: 767px) {
          .site-navbar-container {
            width: calc(100% - 24px);
          }

          .site-navbar-row {
            min-height: 60px;
            gap: 10px;
          }

          .site-navbar-menu-button {
            display: flex;
            width: 40px;
            height: 40px;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            border: 0;
            border-radius: 10px;
            color: #344054;
            background: #f1f4f4;
            cursor: pointer;
          }

          .site-navbar-search,
          .site-navbar-navigation {
            display: none;
          }

          .site-navbar-mobile-cart {
            position: relative;
            display: flex;
            width: 40px;
            height: 40px;
            align-items: center;
            justify-content: center;
            margin-left: auto;
            border-radius: 10px;
            color: #087b75;
            background: #e9f8f5;
            text-decoration: none;
          }

          .site-navbar-mobile-cart span {
            position: absolute;
            top: -4px;
            right: -4px;
            display: flex;
            min-width: 18px;
            height: 18px;
            align-items: center;
            justify-content: center;
            padding-inline: 4px;
            border: 2px solid #ffffff;
            border-radius: 999px;
            color: #ffffff;
            background: #e5484d;
            font-size: var(--nav-text-13);
            font-weight: 800;
          }

          .site-navbar-mobile-search-row {
            display: block;
            padding-bottom: 10px;
          }

          .site-navbar-mobile-search {
            display: flex;
            height: 44px;
            align-items: center;
            overflow: hidden;
            border: 1px solid #d8dee3;
            border-radius: 12px;
            background: #fafcfc;
          }

          .site-navbar-mobile-search > svg {
            margin-left: 13px;
            flex-shrink: 0;
            color: #667085;
          }

          .site-navbar-mobile-search input {
            min-width: 0;
            height: 100%;
            flex: 1;
            padding-inline: 10px;
            border: 0;
            outline: none;
            background: transparent;
            font-family: inherit;
            font-size: var(--nav-text-13);
          }

          .site-navbar-mobile-search button {
            align-self: stretch;
            padding-inline: 15px;
            border: 0;
            color: #ffffff;
            background: #087b75;
            font-family: inherit;
            font-size: var(--nav-text-13);
            font-weight: 750;
          }

          .site-navbar-mobile-overlay {
            position: fixed;
            inset: 0;
            z-index: 190;
            display: block;
            pointer-events: none;
            opacity: 0;
            background: rgba(
              15,
              23,
              42,
              0.46
            );
            backdrop-filter: blur(3px);
            transition: opacity 260ms ease;
          }

          .site-navbar-mobile-overlay.is-open {
            pointer-events: auto;
            opacity: 1;
          }

          .site-navbar-mobile-drawer {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 200;
            display: flex;
            width: min(
              340px,
              calc(100% - 36px)
            );
            flex-direction: column;
            overflow-y: auto;
            padding: 14px;
            background: #ffffff;
            box-shadow: 25px 0 60px -35px
              rgba(15, 23, 42, 0.62);
            transform: translateX(-105%);
            transition: transform 320ms
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              );
          }

          .site-navbar-mobile-drawer.is-open {
            transform: translateX(0);
          }

          .site-navbar-mobile-drawer-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding-bottom: 14px;
            border-bottom: 1px solid
              #e7eceb;
          }

          .site-navbar-mobile-drawer-header
            button {
            display: flex;
            width: 38px;
            height: 38px;
            align-items: center;
            justify-content: center;
            border: 0;
            border-radius: 10px;
            color: #344054;
            background: #f2f4f7;
          }

          .site-navbar-mobile-account {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 14px;
            padding: 12px;
            border-radius: 13px;
            background: linear-gradient(
              135deg,
              #effaf8,
              #f8fffd
            );
          }

          .site-navbar-mobile-account
            > span {
            display: flex;
            width: 40px;
            height: 40px;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            border-radius: 11px;
            color: #ffffff;
            background: #087b75;
          }

          .site-navbar-mobile-account
            > div {
            display: flex;
            min-width: 0;
            flex: 1;
            flex-direction: column;
          }

          .site-navbar-mobile-account
            strong,
          .site-navbar-mobile-account
            small,
          .site-navbar-mobile-account
            a {
            font-size: var(--nav-text-13);
          }

          .site-navbar-mobile-account
            small {
            color: #667085;
          }

          .site-navbar-mobile-account
            > a {
            padding: 7px 10px;
            border-radius: 8px;
            color: #ffffff;
            background: #087b75;
            font-weight: 750;
            text-decoration: none;
          }

          .site-navbar-mobile-location {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
            padding: 11px 12px;
            border: 1px solid #e1e8e6;
            border-radius: 12px;
            color: #087b75;
          }

          .site-navbar-mobile-location
            > div {
            display: flex;
            flex-direction: column;
          }

          .site-navbar-mobile-location
            small,
          .site-navbar-mobile-location
            strong {
            font-size: var(--nav-text-13);
          }

          .site-navbar-mobile-location
            small {
            color: #8a94a3;
          }

          .site-navbar-mobile-links {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-top: 14px;
          }

          .site-navbar-mobile-links a {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 11px;
            border-radius: 11px;
            color: #344054;
            text-decoration: none;
          }

          .site-navbar-mobile-links
            a:hover,
          .site-navbar-mobile-links
            a.is-active {
            color: #087b75;
            background: #eff8f6;
          }

          .site-navbar-mobile-links
            a
            > span {
            display: flex;
            width: 34px;
            height: 34px;
            align-items: center;
            justify-content: center;
            border-radius: 9px;
            background: #f1f4f4;
          }

          .site-navbar-mobile-links
            strong {
            flex: 1;
            font-size: var(--nav-text-13);
          }

          .site-navbar-mobile-track {
            display: flex;
            align-items: center;
            gap: 9px;
            margin-top: 14px;
            padding: 11px;
            border-top: 1px solid
              #e7eceb;
            color: #087b75;
            font-size: var(--nav-text-13);
            font-weight: 750;
            text-decoration: none;
          }

          .site-navbar-bottom-nav {
            position: fixed;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 150;
            display: grid;
            height: 66px;
            grid-template-columns: repeat(
              4,
              1fr
            );
            align-items: center;
            padding: 5px 10px 7px;
            border-top: 1px solid
              rgba(15, 23, 42, 0.09);
            background: rgba(
              255,
              255,
              255,
              0.97
            );
            box-shadow: 0 -14px 35px -30px
              rgba(15, 23, 42, 0.55);
            backdrop-filter: blur(18px);
          }

          .site-navbar-bottom-nav a {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            color: #667085;
            text-decoration: none;
          }

          .site-navbar-bottom-nav
            a.is-active {
            color: #087b75;
          }

          .site-navbar-bottom-nav span {
            font-size: var(--nav-text-13);
            font-weight: 650;
          }
        }

        @media (max-width: 420px) {
          .site-navbar-container {
            width: calc(100% - 18px);
          }

          .site-navbar-logo {
            font-size: var(--nav-text-18);
          }

          .site-navbar-logo-symbol {
            width: 29px;
            height: 29px;
          }

          .site-navbar-mobile-search button {
            padding-inline: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .site-navbar *,
          .site-navbar *::before,
          .site-navbar *::after,
          .site-navbar-mobile-drawer,
          .site-navbar-mobile-overlay {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}

function Dropdown({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`site-navbar-dropdown ${className}`}
    >
      {children}
    </div>
  );
}

function DropdownHeader({
  eyebrow,
  title,
  onClose,
}: {
  eyebrow: string;
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="site-navbar-dropdown-header">
      <div>
        <span>{eyebrow}</span>
        <strong>{title}</strong>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export function Logo() {
  return (
    <div className="site-navbar-logo">
      <span>ar</span>

      <span className="site-navbar-logo-symbol">
        <span className="site-navbar-logo-heart" />
        <span className="site-navbar-logo-cross-vertical" />
        <span className="site-navbar-logo-cross-horizontal" />
      </span>

      <span>gga</span>
    </div>
  );
}