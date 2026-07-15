"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Baby,
  Bell,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock3,
  FlaskConical,
  Heart,
  History,
  Home,
  Inbox,
  LocateFixed,
  MapPin,
  Menu,
  Mic,
  PackageCheck,
  PawPrint,
  Percent,
  Pill,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Stethoscope,
  Store,
  Trash2,
  TrendingUp,
  Upload,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type DropdownName =
  | "delivery"
  | "search-category"
  | "account"
  | "notifications"
  | "cart"
  | "more"
  | null;

type NavigationItem = {
  label: string;
  href: string;
  badge?: string;
};

type SearchSuggestion = {
  id: number;
  title: string;
  category: string;
  price?: string;
  href: string;
};

type LocationItem = {
  name: string;
  detail: string;
};

type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: "order" | "lab" | "offer";
};

type CartItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
};

const navigationItems: NavigationItem[] = [
  {
    label: "All",
    href: "/",
  },
  {
    label: "Medicine",
    href: "/medicine",
  },
  {
    label: "Healthcare",
    href: "/healthcare",
  },
  {
    label: "Doctor",
    href: "/doctor",
  },
  {
    label: "Lab",
    href: "/lab",
  },
  {
    label: "Beauty",
    href: "/beauty",
  },
  {
    label: "Baby Care",
    href: "/baby-care",
  },
  {
    label: "Pet Care",
    href: "/pet-care",
  },
  {
    label: "Offers",
    href: "/offers",
    badge: "Hot",
  },
];

const searchCategories = [
  "All Categories",
  "Medicine",
  "Healthcare",
  "Beauty",
  "Baby Care",
  "Lab Tests",
  "Medical Devices",
];

const trendingSearches = [
  "Paracetamol",
  "Vitamin D",
  "Napa",
  "Diabetes",
  "Blood Pressure",
  "Baby Care",
];

const searchSuggestions: SearchSuggestion[] = [
  {
    id: 1,
    title: "Napa 500mg Tablet",
    category: "Medicine",
    price: "৳20",
    href: "/product/napa-500mg",
  },
  {
    id: 2,
    title: "Paracetamol 500mg",
    category: "Medicine",
    price: "৳18",
    href: "/product/paracetamol-500mg",
  },
  {
    id: 3,
    title: "Vitamin D3 Capsule",
    category: "Supplement",
    price: "৳320",
    href: "/product/vitamin-d3",
  },
  {
    id: 4,
    title: "Digital Blood Pressure Monitor",
    category: "Medical Device",
    price: "৳2,450",
    href: "/product/blood-pressure-monitor",
  },
  {
    id: 5,
    title: "CBC Blood Test",
    category: "Lab Test",
    price: "৳450",
    href: "/lab/cbc",
  },
];

const locations: LocationItem[] = [
  {
    name: "Bangladesh",
    detail: "Nationwide delivery",
  },
  {
    name: "Dhaka",
    detail: "Fast delivery available",
  },
  {
    name: "Chattogram",
    detail: "Standard delivery",
  },
  {
    name: "Sylhet",
    detail: "Standard delivery",
  },
  {
    name: "Rajshahi",
    detail: "Standard delivery",
  },
];

const notifications: NotificationItem[] = [
  {
    id: 1,
    title: "Order confirmed",
    description: "Your medicine order has been confirmed.",
    time: "5 minutes ago",
    unread: true,
    icon: "order",
  },
  {
    id: 2,
    title: "Lab report ready",
    description: "Your CBC lab report is now available.",
    time: "1 hour ago",
    unread: true,
    icon: "lab",
  },
  {
    id: 3,
    title: "Special offer",
    description: "Save up to 25% on selected healthcare products.",
    time: "Yesterday",
    unread: false,
    icon: "offer",
  },
];

const cartItems: CartItem[] = [
  {
    id: 1,
    name: "Napa 500mg Tablet",
    quantity: 2,
    price: 20,
    image: "NP",
  },
  {
    id: 2,
    name: "Vitamin D3 Capsule",
    quantity: 1,
    price: 320,
    image: "VD",
  },
];

const moreMenuItems = [
  {
    label: "Medical Devices",
    href: "/medical-devices",
    icon: <ShoppingBag size={18} />,
  },
  {
    label: "Supplements",
    href: "/supplements",
    icon: <Sparkles size={18} />,
  },
  {
    label: "Prescription Upload",
    href: "/upload-prescription",
    icon: <Upload size={18} />,
  },
  {
    label: "Order Tracking",
    href: "/track-order",
    icon: <PackageCheck size={18} />,
  },
];

export default function TopNavber() {
  const router = useRouter();
  const pathname = usePathname();

  const headerRef = useRef<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");
  const [selectedLocation, setSelectedLocation] =
    useState("Bangladesh");

  const [openDropdown, setOpenDropdown] =
    useState<DropdownName>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [countdown, setCountdown] = useState({
    hours: 2,
    minutes: 15,
    seconds: 10,
  });

  const filteredSuggestions = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return searchSuggestions.slice(0, 4);
    }

    return searchSuggestions.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    });
  }, [searchText]);

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }, []);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, []);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((item) => item.unread).length;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown((current) => {
        let totalSeconds =
          current.hours * 3600 +
          current.minutes * 60 +
          current.seconds;

        if (totalSeconds <= 0) {
          return {
            hours: 2,
            minutes: 15,
            seconds: 10,
          };
        }

        totalSeconds -= 1;

        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        headerRef.current &&
        !headerRef.current.contains(target)
      ) {
        setOpenDropdown(null);
        setSearchFocused(false);
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        setSearchFocused(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
      );
      document.removeEventListener("keydown", handleEscape);
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

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchText.trim();

    if (!query) {
      searchInputRef.current?.focus();
      return;
    }

    const params = new URLSearchParams({
      q: query,
      category: selectedCategory,
    });

    router.push(`/search?${params.toString()}`);

    setSearchFocused(false);
    setOpenDropdown(null);
  };

  const handleSuggestionClick = (
    suggestion: SearchSuggestion,
  ) => {
    setSearchText(suggestion.title);
    setSearchFocused(false);
    setOpenDropdown(null);
    router.push(suggestion.href);
  };

  const handleTrendingSearch = (search: string) => {
    setSearchText(search);
    router.push(`/search?q=${encodeURIComponent(search)}`);
    setSearchFocused(false);
  };

  const handleSearchKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === "ArrowDown" &&
      filteredSuggestions.length > 0
    ) {
      event.preventDefault();

      const firstSuggestion = document.querySelector(
        "[data-search-suggestion]",
      ) as HTMLButtonElement | null;

      firstSuggestion?.focus();
    }
  };

  const toggleDropdown = (name: DropdownName) => {
    setOpenDropdown((current) =>
      current === name ? null : name,
    );
  };

  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === "/";

    return (
      pathname === href || pathname.startsWith(`${href}/`)
    );
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`top-navbar ${
          isScrolled ? "top-navbar-scrolled" : ""
        }`}
      >
        <div className="top-navbar-main">
          <div className="top-navbar-container">
            <div className="top-navbar-top-row">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="top-navbar-mobile-menu-button"
                aria-label="Open navigation menu"
              >
                <Menu size={23} />
              </button>

              <Link
                href="/"
                aria-label="Arogga home"
                className="top-navbar-logo-link"
              >
                <Logo size="small" />
              </Link>

              <div className="top-navbar-delivery">
                <button
                  type="button"
                  onClick={() => toggleDropdown("delivery")}
                  className={`top-navbar-delivery-button ${
                    openDropdown === "delivery"
                      ? "is-open"
                      : ""
                  }`}
                  aria-expanded={
                    openDropdown === "delivery"
                  }
                  aria-haspopup="menu"
                >
                  <span className="top-navbar-delivery-icon">
                    <MapPin size={22} strokeWidth={1.7} />
                  </span>

                  <span className="top-navbar-delivery-text">
                    <span>Deliver to</span>
                    <strong>{selectedLocation}</strong>
                  </span>

                  <ChevronDown
                    size={16}
                    className={
                      openDropdown === "delivery"
                        ? "rotate-icon"
                        : ""
                    }
                  />
                </button>

                {openDropdown === "delivery" && (
                  <div className="top-navbar-dropdown top-navbar-location-dropdown">
                    <div className="top-navbar-dropdown-heading">
                      <div>
                        <span>Delivery location</span>
                        <strong>Select your area</strong>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown(null)
                        }
                        aria-label="Close location menu"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="top-navbar-current-location"
                    >
                      <span>
                        <LocateFixed size={18} />
                      </span>

                      <div>
                        <strong>
                          Use current location
                        </strong>
                        <small>
                          Enable location permission
                        </small>
                      </div>

                      <ChevronRight size={17} />
                    </button>

                    <div className="top-navbar-location-list">
                      {locations.map((location) => {
                        const selected =
                          selectedLocation ===
                          location.name;

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
                            <span className="top-navbar-location-pin">
                              <MapPin size={16} />
                            </span>

                            <span>
                              <strong>
                                {location.name}
                              </strong>
                              <small>
                                {location.detail}
                              </small>
                            </span>

                            {selected && (
                              <Check size={17} />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <Link
                      href="/addresses"
                      className="top-navbar-manage-address"
                      onClick={() =>
                        setOpenDropdown(null)
                      }
                    >
                      Manage saved addresses
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSearch}
                className="top-navbar-search-form"
              >
                <div
                  className={`top-navbar-search-wrapper ${
                    searchFocused ? "is-focused" : ""
                  }`}
                >
                  <div className="top-navbar-search-category">
                    <button
                      type="button"
                      onClick={() =>
                        toggleDropdown(
                          "search-category",
                        )
                      }
                      aria-expanded={
                        openDropdown ===
                        "search-category"
                      }
                    >
                      <span>{selectedCategory}</span>

                      <ChevronDown
                        size={14}
                        className={
                          openDropdown ===
                          "search-category"
                            ? "rotate-icon"
                            : ""
                        }
                      />
                    </button>

                    {openDropdown ===
                      "search-category" && (
                      <div className="top-navbar-dropdown top-navbar-category-dropdown">
                        {searchCategories.map(
                          (category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => {
                                setSelectedCategory(
                                  category,
                                );
                                setOpenDropdown(null);
                                searchInputRef.current?.focus();
                              }}
                              className={
                                selectedCategory ===
                                category
                                  ? "is-selected"
                                  : ""
                              }
                            >
                              <span>{category}</span>

                              {selectedCategory ===
                                category && (
                                <Check size={15} />
                              )}
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  <Search
                    size={20}
                    strokeWidth={1.8}
                    className="top-navbar-search-icon"
                  />

                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchText}
                    onChange={(event) =>
                      setSearchText(event.target.value)
                    }
                    onFocus={() => {
                      setSearchFocused(true);
                      setOpenDropdown(null);
                    }}
                    onKeyDown={handleSearchKeyDown}
                    placeholder='Search medicines, products, doctors...'
                    autoComplete="off"
                    aria-label="Search products"
                  />

                  {searchText && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchText("");
                        searchInputRef.current?.focus();
                      }}
                      className="top-navbar-search-clear"
                      aria-label="Clear search"
                    >
                      <X size={17} />
                    </button>
                  )}

                  <div className="top-navbar-search-tools">
                    <button
                      type="button"
                      aria-label="Voice search"
                    >
                      <Mic size={18} />
                    </button>

                    <button
                      type="button"
                      aria-label="Image search"
                    >
                      <Camera size={18} />
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="top-navbar-search-submit"
                  >
                    <Search size={18} />
                    <span>Search</span>
                  </button>

                  {searchFocused && (
                    <div className="top-navbar-search-panel">
                      <div className="top-navbar-search-panel-section">
                        <div className="top-navbar-search-panel-title">
                          <span>
                            <TrendingUp size={16} />
                            Trending searches
                          </span>

                          <small>Popular now</small>
                        </div>

                        <div className="top-navbar-trending-list">
                          {trendingSearches.map(
                            (search) => (
                              <button
                                key={search}
                                type="button"
                                onClick={() =>
                                  handleTrendingSearch(
                                    search,
                                  )
                                }
                              >
                                {search}
                              </button>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="top-navbar-search-panel-section">
                        <div className="top-navbar-search-panel-title">
                          <span>
                            {searchText ? (
                              <Search size={16} />
                            ) : (
                              <History size={16} />
                            )}

                            {searchText
                              ? "Search results"
                              : "Suggested products"}
                          </span>

                          <small>
                            {
                              filteredSuggestions.length
                            }{" "}
                            items
                          </small>
                        </div>

                        <div className="top-navbar-suggestion-list">
                          {filteredSuggestions.length >
                          0 ? (
                            filteredSuggestions.map(
                              (suggestion) => (
                                <button
                                  key={suggestion.id}
                                  type="button"
                                  data-search-suggestion
                                  onClick={() =>
                                    handleSuggestionClick(
                                      suggestion,
                                    )
                                  }
                                >
                                  <span className="top-navbar-suggestion-icon">
                                    {suggestion.category ===
                                    "Lab Test" ? (
                                      <FlaskConical
                                        size={19}
                                      />
                                    ) : (
                                      <Pill size={19} />
                                    )}
                                  </span>

                                  <span className="top-navbar-suggestion-content">
                                    <strong>
                                      {suggestion.title}
                                    </strong>

                                    <small>
                                      {
                                        suggestion.category
                                      }
                                    </small>
                                  </span>

                                  {suggestion.price && (
                                    <span className="top-navbar-suggestion-price">
                                      {suggestion.price}
                                    </span>
                                  )}

                                  <ChevronRight size={17} />
                                </button>
                              ),
                            )
                          ) : (
                            <div className="top-navbar-no-search-result">
                              <Search size={28} />
                              <strong>
                                No products found
                              </strong>
                              <span>
                                Try another keyword.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Link
                        href="/upload-prescription"
                        className="top-navbar-prescription-link"
                        onClick={() =>
                          setSearchFocused(false)
                        }
                      >
                        <span>
                          <Upload size={18} />
                        </span>

                        <div>
                          <strong>
                            Upload prescription
                          </strong>
                          <small>
                            Order medicines from a
                            prescription
                          </small>
                        </div>

                        <ChevronRight size={17} />
                      </Link>
                    </div>
                  )}
                </div>
              </form>

              <div className="top-navbar-actions">
                <div className="top-navbar-action-wrapper">
                  <button
                    type="button"
                    onClick={() =>
                      toggleDropdown("account")
                    }
                    className="top-navbar-action-button"
                    aria-expanded={
                      openDropdown === "account"
                    }
                  >
                    <span className="top-navbar-action-icon">
                      <UserRound
                        size={22}
                        strokeWidth={1.7}
                      />
                    </span>

                    <span>
                      <small>Account</small>
                      <strong>Login</strong>
                    </span>
                  </button>

                  {openDropdown === "account" && (
                    <div className="top-navbar-dropdown top-navbar-account-dropdown">
                      <div className="top-navbar-account-header">
                        <span>
                          <UserRound size={23} />
                        </span>

                        <div>
                          <strong>
                            Welcome to Arogga
                          </strong>
                          <small>
                            Login to manage your account
                          </small>
                        </div>
                      </div>

                      <div className="top-navbar-account-buttons">
                        <Link
                          href="/login"
                          className="primary"
                          onClick={() =>
                            setOpenDropdown(null)
                          }
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

                      <div className="top-navbar-account-links">
                        <AccountMenuLink
                          href="/orders"
                          icon={
                            <ClipboardList size={17} />
                          }
                          label="My orders"
                        />

                        <AccountMenuLink
                          href="/wishlist"
                          icon={<Heart size={17} />}
                          label="Wishlist"
                        />

                        <AccountMenuLink
                          href="/inbox"
                          icon={<Inbox size={17} />}
                          label="Messages"
                        />

                        <AccountMenuLink
                          href="/help"
                          icon={
                            <CircleHelp size={17} />
                          }
                          label="Help center"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/wishlist"
                  className="top-navbar-icon-action"
                  aria-label="Wishlist"
                >
                  <Heart size={22} strokeWidth={1.7} />
                </Link>

                <div className="top-navbar-action-wrapper">
                  <button
                    type="button"
                    onClick={() =>
                      toggleDropdown("notifications")
                    }
                    className="top-navbar-icon-action"
                    aria-label="Notifications"
                    aria-expanded={
                      openDropdown ===
                      "notifications"
                    }
                  >
                    <Bell size={22} strokeWidth={1.7} />

                    {unreadNotificationCount > 0 && (
                      <span className="top-navbar-action-badge">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </button>

                  {openDropdown ===
                    "notifications" && (
                    <div className="top-navbar-dropdown top-navbar-notification-dropdown">
                      <div className="top-navbar-dropdown-heading">
                        <div>
                          <span>Notifications</span>
                          <strong>
                            Recent updates
                          </strong>
                        </div>

                        <button
                          type="button"
                          aria-label="Close notifications"
                          onClick={() =>
                            setOpenDropdown(null)
                          }
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="top-navbar-notification-list">
                        {notifications.map(
                          (notification) => (
                            <Link
                              key={notification.id}
                              href="/notifications"
                              onClick={() =>
                                setOpenDropdown(null)
                              }
                              className={
                                notification.unread
                                  ? "is-unread"
                                  : ""
                              }
                            >
                              <span
                                className={`top-navbar-notification-icon notification-${notification.icon}`}
                              >
                                {notification.icon ===
                                "order" ? (
                                  <PackageCheck
                                    size={18}
                                  />
                                ) : notification.icon ===
                                  "lab" ? (
                                  <FlaskConical
                                    size={18}
                                  />
                                ) : (
                                  <Percent size={18} />
                                )}
                              </span>

                              <span>
                                <strong>
                                  {notification.title}
                                </strong>

                                <small>
                                  {
                                    notification.description
                                  }
                                </small>

                                <i>
                                  <Clock3 size={12} />
                                  {notification.time}
                                </i>
                              </span>

                              {notification.unread && (
                                <b />
                              )}
                            </Link>
                          ),
                        )}
                      </div>

                      <Link
                        href="/notifications"
                        className="top-navbar-dropdown-footer-link"
                        onClick={() =>
                          setOpenDropdown(null)
                        }
                      >
                        View all notifications
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  )}
                </div>

                <div className="top-navbar-action-wrapper">
                  <button
                    type="button"
                    onClick={() =>
                      toggleDropdown("cart")
                    }
                    className="top-navbar-cart-button"
                    aria-expanded={
                      openDropdown === "cart"
                    }
                  >
                    <span className="top-navbar-cart-icon">
                      <ShoppingCart
                        size={23}
                        strokeWidth={1.7}
                      />

                      <span>{cartCount}</span>
                    </span>

                    <span>
                      <small>Cart</small>
                      <strong>৳{cartSubtotal}</strong>
                    </span>
                  </button>

                  {openDropdown === "cart" && (
                    <div className="top-navbar-dropdown top-navbar-cart-dropdown">
                      <div className="top-navbar-dropdown-heading">
                        <div>
                          <span>Shopping cart</span>
                          <strong>
                            {cartCount} items
                          </strong>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setOpenDropdown(null)
                          }
                          aria-label="Close shopping cart"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="top-navbar-cart-list">
                        {cartItems.map((item) => (
                          <div key={item.id}>
                            <span className="top-navbar-cart-image">
                              {item.image}
                            </span>

                            <span className="top-navbar-cart-content">
                              <strong>
                                {item.name}
                              </strong>

                              <small>
                                Quantity: {item.quantity}
                              </small>

                              <b>
                                ৳
                                {item.price *
                                  item.quantity}
                              </b>
                            </span>

                            <button
                              type="button"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="top-navbar-cart-summary">
                        <span>
                          <small>Subtotal</small>
                          <strong>
                            ৳{cartSubtotal}
                          </strong>
                        </span>

                        <p>
                          Delivery charge calculated at
                          checkout.
                        </p>

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
                    </div>
                  )}
                </div>
              </div>

              <Link
                href="/cart"
                className="top-navbar-mobile-cart"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={23} />

                <span>{cartCount}</span>
              </Link>
            </div>

            <div className="top-navbar-mobile-search-row">
              <form
                onSubmit={handleSearch}
                className="top-navbar-mobile-search"
              >
                <Search size={19} />

                <input
                  type="search"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(event.target.value)
                  }
                  placeholder="Search medicines and products"
                  aria-label="Search medicines and products"
                />

                <button type="submit">Search</button>
              </form>
            </div>
          </div>
        </div>

        <div className="top-navbar-navigation">
          <div className="top-navbar-container">
            <div className="top-navbar-navigation-row">
              <Link
                href="/flash-sale"
                className="top-navbar-flash-sale"
              >
                <span className="top-navbar-flash-icon">
                  <Zap
                    size={17}
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </span>

                <span>
                  <strong>Flash Sale</strong>
                  <small>Save up to 72%</small>
                </span>

                <span className="top-navbar-countdown">
                  {String(countdown.hours).padStart(
                    2,
                    "0",
                  )}
                  :
                  {String(countdown.minutes).padStart(
                    2,
                    "0",
                  )}
                  :
                  {String(countdown.seconds).padStart(
                    2,
                    "0",
                  )}
                </span>
              </Link>

              <nav
                className="top-navbar-desktop-nav"
                aria-label="Primary navigation"
              >
                {navigationItems.map((item) => {
                  const active = isActiveRoute(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={
                        active ? "is-active" : ""
                      }
                    >
                      <span>{item.label}</span>

                      {item.badge && (
                        <small>{item.badge}</small>
                      )}

                      <i />
                    </Link>
                  );
                })}

                <div className="top-navbar-more-wrapper">
                  <button
                    type="button"
                    onClick={() =>
                      toggleDropdown("more")
                    }
                    className={
                      openDropdown === "more"
                        ? "is-active"
                        : ""
                    }
                  >
                    More
                    <ChevronDown
                      size={14}
                      className={
                        openDropdown === "more"
                          ? "rotate-icon"
                          : ""
                      }
                    />
                  </button>

                  {openDropdown === "more" && (
                    <div className="top-navbar-dropdown top-navbar-more-dropdown">
                      {moreMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() =>
                            setOpenDropdown(null)
                          }
                        >
                          <span>{item.icon}</span>

                          <strong>{item.label}</strong>

                          <ChevronRight size={16} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>

              <Link
                href="/track-order"
                className="top-navbar-track-order"
              >
                <PackageCheck size={18} />
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`top-navbar-mobile-overlay ${
          mobileMenuOpen ? "is-open" : ""
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      />

      <aside
        className={`top-navbar-mobile-drawer ${
          mobileMenuOpen ? "is-open" : ""
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="top-navbar-mobile-drawer-header">
          <Logo size="small" />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="top-navbar-mobile-account-card">
          <span>
            <UserRound size={23} />
          </span>

          <div>
            <strong>Welcome to Arogga</strong>
            <small>Login to manage your account</small>
          </div>

          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </Link>
        </div>

        <div className="top-navbar-mobile-delivery-card">
          <MapPin size={20} />

          <div>
            <small>Deliver to</small>
            <strong>{selectedLocation}</strong>
          </div>

          <ChevronRight size={18} />
        </div>

        <nav className="top-navbar-mobile-drawer-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={
                isActiveRoute(item.href)
                  ? "is-active"
                  : ""
              }
            >
              <span>
                <MobileNavigationIcon
                  label={item.label}
                />
              </span>

              <strong>{item.label}</strong>

              {item.badge && <small>{item.badge}</small>}

              <ChevronRight size={17} />
            </Link>
          ))}
        </nav>

        <div className="top-navbar-mobile-drawer-links">
          <Link
            href="/upload-prescription"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Upload size={18} />
            Upload Prescription
          </Link>

          <Link
            href="/track-order"
            onClick={() => setMobileMenuOpen(false)}
          >
            <PackageCheck size={18} />
            Track Order
          </Link>

          <Link
            href="/help"
            onClick={() => setMobileMenuOpen(false)}
          >
            <CircleHelp size={18} />
            Help Center
          </Link>
        </div>
      </aside>

      <nav
        className="top-navbar-mobile-bottom-nav"
        aria-label="Mobile navigation"
      >
        <MobileBottomLink
          href="/"
          label="Home"
          icon={<Home size={21} />}
          active={pathname === "/"}
        />

        <MobileBottomLink
          href="/store"
          label="Store"
          icon={<Store size={21} />}
          active={isActiveRoute("/store")}
        />

        <Link
          href="/search"
          className="top-navbar-mobile-bottom-search"
          aria-label="Search"
        >
          <Search size={23} />
        </Link>

        <MobileBottomLink
          href="/orders"
          label="Orders"
          icon={<ClipboardList size={21} />}
          active={isActiveRoute("/orders")}
        />

        <MobileBottomLink
          href="/account"
          label="Account"
          icon={<UserRound size={21} />}
          active={isActiveRoute("/account")}
        />
      </nav>

      <style jsx global>{`
        .top-navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          color: #111827;
          transition:
            box-shadow 260ms ease,
            transform 260ms ease;
        }

        .top-navbar-main {
          border-bottom: 1px solid rgba(15, 23, 42, 0.075);
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(20px);
          transition:
            background-color 260ms ease,
            box-shadow 260ms ease;
        }

        .top-navbar-scrolled .top-navbar-main {
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 14px 35px -28px rgba(15, 23, 42, 0.55);
        }

        .top-navbar-container {
          width: min(1440px, calc(100% - 32px));
          margin: 0 auto;
        }

        .top-navbar-top-row {
          min-height: 76px;
          display: flex;
          align-items: center;
          gap: 18px;
          transition: min-height 260ms ease;
        }

        .top-navbar-scrolled .top-navbar-top-row {
          min-height: 68px;
        }

        .top-navbar-logo-link {
          display: inline-flex;
          flex-shrink: 0;
          border-radius: 10px;
          text-decoration: none;
          transition: transform 250ms ease;
        }

        .top-navbar-logo-link:hover {
          transform: translateY(-1px) scale(1.02);
        }

        .top-navbar-delivery {
          position: relative;
          width: 205px;
          flex-shrink: 0;
        }

        .top-navbar-delivery-button {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 9px;
          border: 1px solid transparent;
          border-radius: 13px;
          color: #344054;
          background: transparent;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
          transition:
            border-color 220ms ease,
            background-color 220ms ease,
            box-shadow 220ms ease;
        }

        .top-navbar-delivery-button:hover,
        .top-navbar-delivery-button.is-open {
          border-color: rgba(8, 123, 117, 0.12);
          background: #f6faf9;
        }

        .top-navbar-delivery-button.is-open {
          box-shadow: 0 0 0 3px rgba(8, 123, 117, 0.07);
        }

        .top-navbar-delivery-icon {
          width: 35px;
          height: 35px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 11px;
          color: #087b75;
          background: #e8f8f5;
        }

        .top-navbar-delivery-text {
          min-width: 0;
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 1px;
        }

        .top-navbar-delivery-text span {
          color: #667085;
          font-size: 12px;
          line-height: 1.3;
        }

        .top-navbar-delivery-text strong {
          overflow: hidden;
          color: #101828;
          font-size: 13px;
          line-height: 1.4;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .rotate-icon {
          transform: rotate(180deg);
        }

        .top-navbar-dropdown {
          position: absolute;
          z-index: 120;
          overflow: hidden;
          border: 1px solid rgba(15, 23, 42, 0.09);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.98);
          box-shadow:
            0 26px 65px -30px rgba(15, 23, 42, 0.35),
            0 10px 25px -20px rgba(15, 23, 42, 0.18);
          backdrop-filter: blur(18px);
          animation: topNavbarDropdownIn 200ms ease both;
        }

        .top-navbar-location-dropdown {
          top: calc(100% + 10px);
          left: 0;
          width: 330px;
          padding: 12px;
        }

        .top-navbar-dropdown-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 5px 5px 12px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.07);
        }

        .top-navbar-dropdown-heading > div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .top-navbar-dropdown-heading span {
          color: #667085;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .top-navbar-dropdown-heading strong {
          color: #101828;
          font-size: 14px;
        }

        .top-navbar-dropdown-heading button {
          width: 31px;
          height: 31px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 9px;
          color: #667085;
          background: transparent;
          cursor: pointer;
        }

        .top-navbar-dropdown-heading button:hover {
          color: #101828;
          background: #f2f4f7;
        }

        .top-navbar-current-location {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 11px;
          margin-top: 10px;
          padding: 11px;
          border: 1px solid rgba(8, 123, 117, 0.13);
          border-radius: 12px;
          color: #087b75;
          background: #effaf8;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
        }

        .top-navbar-current-location > span {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 10px;
          color: white;
          background: #087b75;
        }

        .top-navbar-current-location > div {
          min-width: 0;
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 2px;
        }

        .top-navbar-current-location strong {
          color: #087b75;
          font-size: 13px;
        }

        .top-navbar-current-location small {
          color: #5f7774;
          font-size: 12px;
        }

        .top-navbar-location-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
          margin-top: 9px;
        }

        .top-navbar-location-list button {
          width: 100%;
          display: flex;
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

        .top-navbar-location-list button:hover,
        .top-navbar-location-list button.is-selected {
          background: #f4f8f7;
        }

        .top-navbar-location-list button.is-selected {
          color: #087b75;
        }

        .top-navbar-location-pin {
          width: 31px;
          height: 31px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 9px;
          background: #f0f3f4;
        }

        .top-navbar-location-list button > span:nth-child(2) {
          min-width: 0;
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 2px;
        }

        .top-navbar-location-list strong {
          font-size: 12px;
        }

        .top-navbar-location-list small {
          color: #8a94a3;
          font-size: 12px;
        }

        .top-navbar-manage-address {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          padding: 11px 10px 5px;
          border-top: 1px solid rgba(15, 23, 42, 0.07);
          color: #087b75;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
        }

        .top-navbar-search-form {
          min-width: 0;
          flex: 1;
        }

        .top-navbar-search-wrapper {
          position: relative;
          height: 49px;
          display: flex;
          align-items: center;
          overflow: visible;
          border: 1px solid #d9dee3;
          border-radius: 15px;
          background: #fafcfc;
          transition:
            border-color 220ms ease,
            box-shadow 220ms ease,
            background-color 220ms ease;
        }

        .top-navbar-search-wrapper.is-focused {
          border-color: #087b75;
          background: white;
          box-shadow:
            0 0 0 4px rgba(8, 123, 117, 0.08),
            0 16px 35px -30px rgba(8, 123, 117, 0.45);
        }

        .top-navbar-search-category {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .top-navbar-search-category > button {
          width: 133px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 7px;
          padding: 0 12px;
          border: 0;
          border-right: 1px solid #e2e5e9;
          color: #344054;
          background: transparent;
          font-family: inherit;
          font-size: 12px;
          font-weight: 650;
          cursor: pointer;
        }

        .top-navbar-search-category > button span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .top-navbar-category-dropdown {
          top: calc(100% + 11px);
          left: -1px;
          width: 220px;
          padding: 8px;
        }

        .top-navbar-category-dropdown button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 11px;
          border: 0;
          border-radius: 9px;
          color: #344054;
          background: transparent;
          font-family: inherit;
          font-size: 12px;
          text-align: left;
          cursor: pointer;
        }

        .top-navbar-category-dropdown button:hover,
        .top-navbar-category-dropdown button.is-selected {
          color: #087b75;
          background: #eff9f7;
        }

        .top-navbar-search-icon {
          margin-left: 13px;
          flex-shrink: 0;
          color: #667085;
        }

        .top-navbar-search-wrapper > input {
          min-width: 0;
          height: 100%;
          flex: 1;
          padding: 0 10px;
          border: 0;
          outline: none;
          color: #101828;
          background: transparent;
          font-family: inherit;
          font-size: 13px;
        }

        .top-navbar-search-wrapper > input::placeholder {
          color: #98a2b3;
        }

        .top-navbar-search-clear {
          width: 29px;
          height: 29px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 0;
          border-radius: 8px;
          color: #98a2b3;
          background: transparent;
          cursor: pointer;
        }

        .top-navbar-search-clear:hover {
          color: #344054;
          background: #f2f4f7;
        }

        .top-navbar-search-tools {
          display: flex;
          align-items: center;
          gap: 1px;
          padding-right: 7px;
        }

        .top-navbar-search-tools button {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 9px;
          color: #667085;
          background: transparent;
          cursor: pointer;
          transition:
            color 180ms ease,
            background-color 180ms ease;
        }

        .top-navbar-search-tools button:hover {
          color: #087b75;
          background: #edf8f6;
        }

        .top-navbar-search-submit {
          height: calc(100% + 2px);
          min-width: 98px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin: -1px -1px -1px 0;
          padding: 0 17px;
          border: 0;
          border-radius: 0 15px 15px 0;
          color: white;
          background: linear-gradient(135deg, #0c9187, #087b75);
          box-shadow: 0 12px 24px -16px rgba(8, 123, 117, 0.85);
          font-family: inherit;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
          transition:
            transform 200ms ease,
            background-color 200ms ease;
        }

        .top-navbar-search-submit:hover {
          background: linear-gradient(135deg, #087b75, #05655f);
        }

        .top-navbar-search-submit:active {
          transform: scale(0.98);
        }

        .top-navbar-search-panel {
          position: absolute;
          top: calc(100% + 11px);
          left: 0;
          z-index: 125;
          width: 100%;
          overflow: hidden;
          border: 1px solid rgba(15, 23, 42, 0.09);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.99);
          box-shadow:
            0 30px 70px -30px rgba(15, 23, 42, 0.38),
            0 14px 28px -22px rgba(15, 23, 42, 0.2);
          backdrop-filter: blur(20px);
          animation: topNavbarDropdownIn 210ms ease both;
        }

        .top-navbar-search-panel-section {
          padding: 14px;
        }

        .top-navbar-search-panel-section + .top-navbar-search-panel-section {
          border-top: 1px solid rgba(15, 23, 42, 0.07);
        }

        .top-navbar-search-panel-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 11px;
        }

        .top-navbar-search-panel-title > span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #344054;
          font-size: 12px;
          font-weight: 750;
        }

        .top-navbar-search-panel-title small {
          color: #98a2b3;
          font-size: 12px;
        }

        .top-navbar-trending-list {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .top-navbar-trending-list button {
          padding: 7px 11px;
          border: 1px solid #e1e6e9;
          border-radius: 999px;
          color: #475467;
          background: #fafcfc;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .top-navbar-trending-list button:hover {
          border-color: rgba(8, 123, 117, 0.23);
          color: #087b75;
          background: #eff9f7;
        }

        .top-navbar-suggestion-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .top-navbar-suggestion-list > button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px;
          border: 0;
          border-radius: 12px;
          color: #344054;
          background: transparent;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
        }

        .top-navbar-suggestion-list > button:hover,
        .top-navbar-suggestion-list > button:focus {
          outline: none;
          background: #f5f9f8;
        }

        .top-navbar-suggestion-icon {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 10px;
          color: #087b75;
          background: #e8f8f5;
        }

        .top-navbar-suggestion-content {
          min-width: 0;
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 2px;
        }

        .top-navbar-suggestion-content strong {
          overflow: hidden;
          color: #101828;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .top-navbar-suggestion-content small {
          color: #8a94a3;
          font-size: 12px;
        }

        .top-navbar-suggestion-price {
          flex-shrink: 0;
          color: #087b75;
          font-size: 12px;
          font-weight: 800;
        }

        .top-navbar-no-search-result {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 24px;
          color: #98a2b3;
          text-align: center;
        }

        .top-navbar-no-search-result strong {
          color: #344054;
          font-size: 13px;
        }

        .top-navbar-no-search-result span {
          font-size: 12px;
        }

        .top-navbar-prescription-link {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px 14px;
          border-top: 1px solid rgba(15, 23, 42, 0.07);
          color: #087b75;
          background: #f4fbfa;
          text-decoration: none;
        }

        .top-navbar-prescription-link > span {
          width: 35px;
          height: 35px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 10px;
          color: white;
          background: #087b75;
        }

        .top-navbar-prescription-link > div {
          min-width: 0;
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 2px;
        }

        .top-navbar-prescription-link strong {
          font-size: 12px;
        }

        .top-navbar-prescription-link small {
          color: #66827e;
          font-size: 12px;
        }

        .top-navbar-actions {
          display: flex;
          align-items: center;
          gap: 3px;
          flex-shrink: 0;
        }

        .top-navbar-action-wrapper {
          position: relative;
        }

        .top-navbar-action-button,
        .top-navbar-cart-button {
          min-height: 45px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 8px;
          border: 0;
          border-radius: 12px;
          color: #344054;
          background: transparent;
          font-family: inherit;
          cursor: pointer;
        }

        .top-navbar-action-button:hover,
        .top-navbar-cart-button:hover {
          background: #f4f7f7;
        }

        .top-navbar-action-icon {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 10px;
          color: #344054;
          background: #f2f4f7;
        }

        .top-navbar-action-button > span:last-child,
        .top-navbar-cart-button > span:last-child {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1px;
        }

        .top-navbar-action-button small,
        .top-navbar-cart-button small {
          color: #667085;
          font-size: 12px;
          line-height: 1.3;
        }

        .top-navbar-action-button strong,
        .top-navbar-cart-button strong {
          color: #101828;
          font-size: 12px;
          line-height: 1.3;
        }

        .top-navbar-icon-action {
          position: relative;
          width: 42px;
          height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 12px;
          color: #344054;
          background: transparent;
          cursor: pointer;
          text-decoration: none;
        }

        .top-navbar-icon-action:hover {
          color: #087b75;
          background: #eff8f6;
        }

        .top-navbar-action-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          min-width: 17px;
          height: 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid white;
          border-radius: 999px;
          color: white;
          background: #e5484d;
          font-size: 12px;
          font-weight: 800;
        }

        .top-navbar-cart-icon {
          position: relative;
          width: 35px;
          height: 35px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 10px;
          color: #087b75;
          background: #e8f8f5;
        }

        .top-navbar-cart-icon > span {
          position: absolute;
          top: -5px;
          right: -5px;
          min-width: 18px;
          height: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid white;
          border-radius: 999px;
          color: white;
          background: #087b75;
          font-size: 12px;
          font-weight: 800;
        }

        .top-navbar-account-dropdown {
          top: calc(100% + 12px);
          right: 0;
          width: 285px;
          padding: 12px;
        }

        .top-navbar-account-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 4px 13px;
        }

        .top-navbar-account-header > span {
          width: 43px;
          height: 43px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 13px;
          color: #087b75;
          background: #e8f8f5;
        }

        .top-navbar-account-header > div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .top-navbar-account-header strong {
          color: #101828;
          font-size: 13px;
        }

        .top-navbar-account-header small {
          color: #8a94a3;
          font-size: 12px;
        }

        .top-navbar-account-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding-bottom: 11px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.07);
        }

        .top-navbar-account-buttons a {
          min-height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d9dee3;
          border-radius: 10px;
          color: #344054;
          background: white;
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
        }

        .top-navbar-account-buttons a.primary {
          border-color: #087b75;
          color: white;
          background: #087b75;
        }

        .top-navbar-account-links {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding-top: 9px;
        }

        .top-navbar-account-links a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          color: #475467;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
        }

        .top-navbar-account-links a:hover {
          color: #087b75;
          background: #eff8f6;
        }

        .top-navbar-notification-dropdown {
          top: calc(100% + 12px);
          right: -60px;
          width: 355px;
          padding: 11px;
        }

        .top-navbar-notification-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 8px 0;
        }

        .top-navbar-notification-list > a {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px;
          border-radius: 12px;
          color: #344054;
          text-decoration: none;
        }

        .top-navbar-notification-list > a:hover,
        .top-navbar-notification-list > a.is-unread {
          background: #f5faf9;
        }

        .top-navbar-notification-icon {
          width: 38px;
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 11px;
        }

        .notification-order {
          color: #087b75;
          background: #e5f8f4;
        }

        .notification-lab {
          color: #7357bf;
          background: #f0ebfc;
        }

        .notification-offer {
          color: #c76a14;
          background: #fff2df;
        }

        .top-navbar-notification-list > a > span:nth-child(2) {
          min-width: 0;
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 3px;
        }

        .top-navbar-notification-list strong {
          color: #101828;
          font-size: 12px;
        }

        .top-navbar-notification-list small {
          color: #667085;
          font-size: 12px;
          line-height: 1.5;
        }

        .top-navbar-notification-list i {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #98a2b3;
          font-size: 12px;
          font-style: normal;
        }

        .top-navbar-notification-list b {
          width: 7px;
          height: 7px;
          margin-top: 7px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #087b75;
        }

        .top-navbar-dropdown-footer-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 10px;
          border-top: 1px solid rgba(15, 23, 42, 0.07);
          color: #087b75;
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
        }

        .top-navbar-cart-dropdown {
          top: calc(100% + 12px);
          right: 0;
          width: 355px;
          padding: 11px;
        }

        .top-navbar-cart-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 10px 0;
        }

        .top-navbar-cart-list > div {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 9px;
          border-radius: 11px;
          background: #f8faf9;
        }

        .top-navbar-cart-image {
          width: 43px;
          height: 43px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 11px;
          color: #087b75;
          background: #e4f6f3;
          font-size: 12px;
          font-weight: 800;
        }

        .top-navbar-cart-content {
          min-width: 0;
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 2px;
        }

        .top-navbar-cart-content strong {
          overflow: hidden;
          color: #101828;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .top-navbar-cart-content small {
          color: #8a94a3;
          font-size: 12px;
        }

        .top-navbar-cart-content b {
          color: #087b75;
          font-size: 12px;
        }

        .top-navbar-cart-list > div > button {
          width: 29px;
          height: 29px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 8px;
          color: #98a2b3;
          background: transparent;
          cursor: pointer;
        }

        .top-navbar-cart-list > div > button:hover {
          color: #d92d20;
          background: #fff0ef;
        }

        .top-navbar-cart-summary {
          padding-top: 10px;
          border-top: 1px solid rgba(15, 23, 42, 0.07);
        }

        .top-navbar-cart-summary > span {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .top-navbar-cart-summary small {
          color: #667085;
          font-size: 12px;
        }

        .top-navbar-cart-summary strong {
          color: #101828;
          font-size: 15px;
        }

        .top-navbar-cart-summary p {
          margin: 6px 0 11px;
          color: #98a2b3;
          font-size: 12px;
        }

        .top-navbar-cart-summary > div {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .top-navbar-cart-summary a {
          min-height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d8dee3;
          border-radius: 10px;
          color: #344054;
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
        }

        .top-navbar-cart-summary a.primary {
          border-color: #087b75;
          color: white;
          background: #087b75;
        }

        .top-navbar-navigation {
          border-bottom: 1px solid rgba(15, 23, 42, 0.075);
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(18px);
        }

        .top-navbar-navigation-row {
          min-height: 46px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .top-navbar-flash-sale {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          color: #101828;
          text-decoration: none;
        }

        .top-navbar-flash-icon {
          width: 29px;
          height: 29px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          color: #d97706;
          background: #fff1d7;
        }

        .top-navbar-flash-sale > span:nth-child(2) {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .top-navbar-flash-sale strong {
          font-size: 12px;
        }

        .top-navbar-flash-sale small {
          color: #8a94a3;
          font-size: 12px;
        }

        .top-navbar-countdown {
          padding: 5px 7px;
          border-radius: 7px;
          color: #b54708;
          background: #fff4e5;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.03em;
        }

        .top-navbar-desktop-nav {
          display: flex;
          align-items: stretch;
          justify-content: center;
          gap: 4px;
          flex: 1;
          align-self: stretch;
        }

        .top-navbar-desktop-nav > a,
        .top-navbar-more-wrapper > button {
          position: relative;
          min-width: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 0 9px;
          border: 0;
          color: #344054;
          background: transparent;
          font-family: inherit;
          font-size: 12px;
          font-weight: 650;
          text-decoration: none;
          cursor: pointer;
        }

        .top-navbar-desktop-nav > a:hover,
        .top-navbar-desktop-nav > a.is-active,
        .top-navbar-more-wrapper > button:hover,
        .top-navbar-more-wrapper > button.is-active {
          color: #087b75;
        }

        .top-navbar-desktop-nav > a > small {
          position: absolute;
          top: 2px;
          right: 1px;
          padding: 2px 4px;
          border-radius: 999px;
          color: white;
          background: #e5484d;
          font-size: 12px;
          font-weight: 800;
        }

        .top-navbar-desktop-nav > a > i {
          position: absolute;
          right: 9px;
          bottom: 0;
          left: 9px;
          height: 3px;
          border-radius: 999px 999px 0 0;
          background: #087b75;
          opacity: 0;
          transform: scaleX(0.3);
          transition:
            opacity 200ms ease,
            transform 220ms ease;
        }

        .top-navbar-desktop-nav > a:hover > i,
        .top-navbar-desktop-nav > a.is-active > i {
          opacity: 1;
          transform: scaleX(1);
        }

        .top-navbar-more-wrapper {
          position: relative;
          display: flex;
          align-items: stretch;
        }

        .top-navbar-more-dropdown {
          top: calc(100% + 9px);
          right: 0;
          width: 245px;
          padding: 8px;
        }

        .top-navbar-more-dropdown a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          color: #344054;
          text-decoration: none;
        }

        .top-navbar-more-dropdown a:hover {
          color: #087b75;
          background: #eff8f6;
        }

        .top-navbar-more-dropdown a > span {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 9px;
          background: #f1f4f4;
        }

        .top-navbar-more-dropdown a strong {
          flex: 1;
          font-size: 12px;
        }

        .top-navbar-track-order {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          padding: 8px 11px;
          border-radius: 10px;
          color: #087b75;
          background: #eef9f7;
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
        }

        .top-navbar-mobile-menu-button,
        .top-navbar-mobile-cart,
        .top-navbar-mobile-search-row,
        .top-navbar-mobile-bottom-nav,
        .top-navbar-mobile-overlay,
        .top-navbar-mobile-drawer {
          display: none;
        }

        .top-navbar-logo {
          display: flex;
          align-items: center;
          color: #087b75;
          font-weight: 900;
          line-height: 1;
          white-space: nowrap;
        }

        .top-navbar-logo-small {
          font-size: 34px;
          letter-spacing: -2.7px;
        }

        .top-navbar-logo-large {
          font-size: 48px;
          letter-spacing: -4px;
        }

        .top-navbar-logo-symbol {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin: 0 1px;
          border: solid #087b75;
          border-radius: 50%;
        }

        .top-navbar-logo-small .top-navbar-logo-symbol {
          width: 35px;
          height: 35px;
          border-width: 4px;
        }

        .top-navbar-logo-large .top-navbar-logo-symbol {
          width: 54px;
          height: 54px;
          border-width: 6px;
        }

        .top-navbar-logo-heart {
          position: absolute;
          border-radius: 50%;
          background: #ef4545;
        }

        .top-navbar-logo-small .top-navbar-logo-heart {
          width: 23px;
          height: 23px;
        }

        .top-navbar-logo-large .top-navbar-logo-heart {
          width: 38px;
          height: 38px;
        }

        .top-navbar-logo-cross-vertical,
        .top-navbar-logo-cross-horizontal {
          position: absolute;
          z-index: 1;
          background: white;
        }

        .top-navbar-logo-small .top-navbar-logo-cross-vertical {
          width: 5px;
          height: 16px;
        }

        .top-navbar-logo-small .top-navbar-logo-cross-horizontal {
          width: 16px;
          height: 5px;
        }

        .top-navbar-logo-large .top-navbar-logo-cross-vertical {
          width: 7px;
          height: 26px;
        }

        .top-navbar-logo-large .top-navbar-logo-cross-horizontal {
          width: 26px;
          height: 7px;
        }

        @keyframes topNavbarDropdownIn {
          from {
            opacity: 0;
            transform: translateY(-7px) scale(0.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 1279px) {
          .top-navbar-actions
            .top-navbar-action-wrapper:first-child,
          .top-navbar-actions
            > .top-navbar-icon-action:first-of-type {
            display: none;
          }

          .top-navbar-delivery {
            width: 185px;
          }

          .top-navbar-search-category > button {
            width: 115px;
          }

          .top-navbar-desktop-nav > a {
            padding: 0 6px;
          }
        }

        @media (max-width: 1100px) {
          .top-navbar-delivery {
            display: none;
          }

          .top-navbar-desktop-nav > a:nth-child(7),
          .top-navbar-desktop-nav > a:nth-child(8) {
            display: none;
          }

          .top-navbar-search-tools {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .top-navbar-container {
            width: min(100% - 24px, 900px);
          }

          .top-navbar-top-row {
            min-height: 62px;
            gap: 10px;
          }

          .top-navbar-mobile-menu-button {
            width: 40px;
            height: 40px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border: 0;
            border-radius: 11px;
            color: #344054;
            background: #f2f5f5;
            cursor: pointer;
          }

          .top-navbar-logo-small {
            font-size: 29px;
            letter-spacing: -2.3px;
          }

          .top-navbar-logo-small .top-navbar-logo-symbol {
            width: 30px;
            height: 30px;
            border-width: 4px;
          }

          .top-navbar-logo-small .top-navbar-logo-heart {
            width: 19px;
            height: 19px;
          }

          .top-navbar-logo-small .top-navbar-logo-cross-vertical {
            width: 4px;
            height: 14px;
          }

          .top-navbar-logo-small .top-navbar-logo-cross-horizontal {
            width: 14px;
            height: 4px;
          }

          .top-navbar-search-form,
          .top-navbar-actions,
          .top-navbar-navigation {
            display: none;
          }

          .top-navbar-mobile-cart {
            position: relative;
            width: 40px;
            height: 40px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-left: auto;
            border-radius: 11px;
            color: #087b75;
            background: #e9f8f5;
            text-decoration: none;
          }

          .top-navbar-mobile-cart span {
            position: absolute;
            top: -4px;
            right: -4px;
            min-width: 18px;
            height: 18px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 4px;
            border: 2px solid white;
            border-radius: 999px;
            color: white;
            background: #e5484d;
            font-size: 12px;
            font-weight: 800;
          }

          .top-navbar-mobile-search-row {
            display: block;
            padding-bottom: 10px;
          }

          .top-navbar-mobile-search {
            height: 44px;
            display: flex;
            align-items: center;
            overflow: hidden;
            border: 1px solid #dce2e6;
            border-radius: 13px;
            background: #f9fbfb;
          }

          .top-navbar-mobile-search > svg {
            margin-left: 13px;
            flex-shrink: 0;
            color: #667085;
          }

          .top-navbar-mobile-search input {
            min-width: 0;
            height: 100%;
            flex: 1;
            padding: 0 10px;
            border: 0;
            outline: none;
            color: #101828;
            background: transparent;
            font-family: inherit;
            font-size: 12px;
          }

          .top-navbar-mobile-search button {
            align-self: stretch;
            padding: 0 16px;
            border: 0;
            color: white;
            background: #087b75;
            font-family: inherit;
            font-size: 12px;
            font-weight: 750;
          }

          .top-navbar-mobile-overlay {
            position: fixed;
            inset: 0;
            z-index: 190;
            display: block;
            pointer-events: none;
            opacity: 0;
            background: rgba(15, 23, 42, 0.46);
            backdrop-filter: blur(3px);
            transition: opacity 260ms ease;
          }

          .top-navbar-mobile-overlay.is-open {
            pointer-events: auto;
            opacity: 1;
          }

          .top-navbar-mobile-drawer {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 200;
            width: min(345px, calc(100% - 38px));
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding: 14px;
            background: white;
            box-shadow: 25px 0 60px -35px rgba(15, 23, 42, 0.6);
            transform: translateX(-105%);
            transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .top-navbar-mobile-drawer.is-open {
            transform: translateX(0);
          }

          .top-navbar-mobile-drawer-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding-bottom: 14px;
            border-bottom: 1px solid #eaedef;
          }

          .top-navbar-mobile-drawer-header > button {
            width: 37px;
            height: 37px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 0;
            border-radius: 10px;
            color: #344054;
            background: #f2f4f7;
          }

          .top-navbar-mobile-account-card {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 14px;
            padding: 12px;
            border-radius: 14px;
            background: linear-gradient(135deg, #effaf8, #f8fffd);
          }

          .top-navbar-mobile-account-card > span {
            width: 40px;
            height: 40px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 12px;
            color: white;
            background: #087b75;
          }

          .top-navbar-mobile-account-card > div {
            min-width: 0;
            display: flex;
            flex: 1;
            flex-direction: column;
            gap: 2px;
          }

          .top-navbar-mobile-account-card strong {
            color: #101828;
            font-size: 12px;
          }

          .top-navbar-mobile-account-card small {
            color: #667085;
            font-size: 12px;
          }

          .top-navbar-mobile-account-card > a {
            padding: 7px 10px;
            border-radius: 8px;
            color: white;
            background: #087b75;
            font-size: 12px;
            font-weight: 750;
            text-decoration: none;
          }

          .top-navbar-mobile-delivery-card {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
            padding: 11px 12px;
            border: 1px solid #e4e9eb;
            border-radius: 13px;
            color: #087b75;
          }

          .top-navbar-mobile-delivery-card > div {
            display: flex;
            flex: 1;
            flex-direction: column;
            gap: 1px;
          }

          .top-navbar-mobile-delivery-card small {
            color: #8a94a3;
            font-size: 12px;
          }

          .top-navbar-mobile-delivery-card strong {
            color: #101828;
            font-size: 12px;
          }

          .top-navbar-mobile-drawer-nav {
            display: flex;
            flex-direction: column;
            gap: 3px;
            margin-top: 14px;
          }

          .top-navbar-mobile-drawer-nav > a {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border-radius: 11px;
            color: #344054;
            text-decoration: none;
          }

          .top-navbar-mobile-drawer-nav > a:hover,
          .top-navbar-mobile-drawer-nav > a.is-active {
            color: #087b75;
            background: #eff8f6;
          }

          .top-navbar-mobile-drawer-nav > a > span {
            width: 34px;
            height: 34px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-radius: 10px;
            background: #f1f4f4;
          }

          .top-navbar-mobile-drawer-nav strong {
            flex: 1;
            font-size: 12px;
          }

          .top-navbar-mobile-drawer-nav small {
            padding: 3px 6px;
            border-radius: 999px;
            color: white;
            background: #e5484d;
            font-size: 12px;
            font-weight: 800;
          }

          .top-navbar-mobile-drawer-links {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-top: 13px;
            padding-top: 12px;
            border-top: 1px solid #eaedef;
          }

          .top-navbar-mobile-drawer-links a {
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 10px;
            border-radius: 10px;
            color: #475467;
            font-size: 12px;
            font-weight: 600;
            text-decoration: none;
          }

          .top-navbar-mobile-drawer-links a:hover {
            color: #087b75;
            background: #eff8f6;
          }

          .top-navbar-mobile-bottom-nav {
            position: fixed;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 150;
            height: 66px;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            align-items: center;
            padding: 5px 10px 7px;
            border-top: 1px solid rgba(15, 23, 42, 0.09);
            background: rgba(255, 255, 255, 0.96);
            box-shadow: 0 -14px 35px -30px rgba(15, 23, 42, 0.55);
            backdrop-filter: blur(18px);
          }

          .top-navbar-mobile-bottom-link {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            color: #667085;
            font-size: 12px;
            font-weight: 650;
            text-decoration: none;
          }

          .top-navbar-mobile-bottom-link.is-active {
            color: #087b75;
          }

          .top-navbar-mobile-bottom-search {
            width: 48px;
            height: 48px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            justify-self: center;
            margin-top: -24px;
            border: 5px solid white;
            border-radius: 50%;
            color: white;
            background: linear-gradient(135deg, #0c9187, #087b75);
            box-shadow: 0 13px 25px -12px rgba(8, 123, 117, 0.85);
            text-decoration: none;
          }
        }

        @media (max-width: 420px) {
          .top-navbar-container {
            width: calc(100% - 18px);
          }

          .top-navbar-logo-small {
            font-size: 26px;
            letter-spacing: -2px;
          }

          .top-navbar-logo-small .top-navbar-logo-symbol {
            width: 28px;
            height: 28px;
          }

          .top-navbar-mobile-search button {
            padding: 0 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .top-navbar *,
          .top-navbar *::before,
          .top-navbar *::after,
          .top-navbar-mobile-drawer,
          .top-navbar-mobile-overlay {
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

function AccountMenuLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link href={href}>
      {icon}
      <span>{label}</span>
      <ChevronRight size={15} className="ml-auto" />
    </Link>
  );
}

function MobileBottomLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`top-navbar-mobile-bottom-link ${
        active ? "is-active" : ""
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileNavigationIcon({
  label,
}: {
  label: string;
}) {
  switch (label) {
    case "All":
      return <Home size={18} />;

    case "Medicine":
      return <Pill size={18} />;

    case "Healthcare":
      return <Heart size={18} />;

    case "Doctor":
      return <Stethoscope size={18} />;

    case "Lab":
      return <FlaskConical size={18} />;

    case "Beauty":
      return <Sparkles size={18} />;

    case "Baby Care":
      return <Baby size={18} />;

    case "Pet Care":
      return <PawPrint size={18} />;

    case "Offers":
      return <Percent size={18} />;

    default:
      return <Store size={18} />;
  }
}

export function Logo({
  size = "large",
}: {
  size?: "small" | "large";
}) {
  return (
    <div
      className={`top-navbar-logo ${
        size === "large"
          ? "top-navbar-logo-large"
          : "top-navbar-logo-small"
      }`}
    >
      <span>ar</span>

      <span className="top-navbar-logo-symbol">
        <span className="top-navbar-logo-heart" />
        <span className="top-navbar-logo-cross-vertical" />
        <span className="top-navbar-logo-cross-horizontal" />
      </span>

      <span>gga</span>
    </div>
  );
}