"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type MenuSection = "store" | "lab" | "doctor";

type MegaLeaf = {
  label: string;
  href: string;
};

type MegaGroup = {
  label: string;
  href: string;
  children?: MegaLeaf[];
};

type MegaItem = {
  label: string;
  href?: string;
  section: MenuSection;
  isStatic?: boolean;
  groups?: MegaGroup[];
};

type MenuData = {
  store: MegaItem[];
  lab: MegaItem[];
  doctor: MegaItem[];
};

const EMPTY_MENU: MenuData = {
  store: [],
  lab: [],
  doctor: [],
};

const CLOSE_DELAY = 180;

function normalizeHref(href?: string) {
  if (!href || href === "#") return undefined;

  const value = href.trim();
  if (!value) return undefined;

  return value.startsWith("/") ? value : `/${value}`;
}

function isStaticHome(item: MegaItem) {
  return (
    item.isStatic === true ||
    item.label.trim().toLowerCase() === "home"
  );
}

function isRouteActive(pathname: string, href?: string) {
  const normalizedHref = normalizeHref(href);

  if (!normalizedHref) return false;

  return (
    pathname === normalizedHref ||
    pathname.startsWith(`${normalizedHref}/`)
  );
}

function findBestGroupIndex(
  pathname: string,
  groups: MegaGroup[],
) {
  const index = groups.findIndex((group) =>
    isRouteActive(pathname, group.href),
  );

  return index >= 0 ? index : 0;
}

function getVisibleItems(menuData: MenuData) {
  /*
   * Arogga-like main store category bar:
   * Home + all Store categories.
   *
   * Lab and Doctor navigation normally stay in the upper service tabs.
   * Set this to combine all sections if your design needs that:
   *
   * return [
   *   ...menuData.store,
   *   ...menuData.lab,
   *   ...menuData.doctor,
   * ];
   */
  return menuData.store;
}

export default function SectionNavigation() {
  const pathname = usePathname();

  const rootRef = useRef<HTMLElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [menuData, setMenuData] =
    useState<MenuData>(EMPTY_MENU);
  const [loading, setLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(
    null,
  );

  const [openHref, setOpenHref] = useState<string | null>(
    null,
  );
  const [activeGroupIndex, setActiveGroupIndex] =
    useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] =
    useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMenu() {
      try {
        setLoading(true);
        setMenuError(null);

        const response = await fetch("/menu-links.json", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load menu-links.json: ${response.status}`,
          );
        }

        const data = (await response.json()) as Partial<MenuData>;

        if (controller.signal.aborted) return;

        setMenuData({
          store: Array.isArray(data.store)
            ? data.store
            : [],
          lab: Array.isArray(data.lab) ? data.lab : [],
          doctor: Array.isArray(data.doctor)
            ? data.doctor
            : [],
        });
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(error);
        setMenuData(EMPTY_MENU);
        setMenuError("Menu data could not be loaded.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMenu();

    return () => controller.abort();
  }, []);

  const items = useMemo(
    () => getVisibleItems(menuData),
    [menuData],
  );

  const openItem = useMemo(() => {
    if (!openHref) return null;

    return (
      items.find(
        (item) =>
          !isStaticHome(item) &&
          normalizeHref(item.href) === openHref,
      ) ?? null
    );
  }, [items, openHref]);

  const groups = openItem?.groups ?? [];

  const activeGroup =
    groups[activeGroupIndex] ?? groups[0] ?? null;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setOpenHref(null);
    setActiveGroupIndex(0);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();

    closeTimerRef.current = setTimeout(() => {
      setOpenHref(null);
      setActiveGroupIndex(0);
    }, CLOSE_DELAY);
  }, [clearCloseTimer]);

  const openMenu = useCallback(
    (item: MegaItem) => {
      clearCloseTimer();

      const href = normalizeHref(item.href);
      const itemGroups = item.groups ?? [];

      if (
        isStaticHome(item) ||
        !href ||
        itemGroups.length === 0
      ) {
        setOpenHref(null);
        setActiveGroupIndex(0);
        return;
      }

      setOpenHref(href);
      setActiveGroupIndex(
        findBestGroupIndex(pathname, itemGroups),
      );
    },
    [clearCloseTimer, pathname],
  );

  const updateScrollButtons = useCallback(() => {
    const element = tabsRef.current;

    if (!element) return;

    const maxScrollLeft =
      element.scrollWidth - element.clientWidth;

    setCanScrollLeft(element.scrollLeft > 2);
    setCanScrollRight(
      element.scrollLeft < maxScrollLeft - 2,
    );
  }, []);

  useEffect(() => {
    updateScrollButtons();

    const tabs = tabsRef.current;
    if (!tabs) return;

    tabs.addEventListener("scroll", updateScrollButtons, {
      passive: true,
    });
    window.addEventListener(
      "resize",
      updateScrollButtons,
    );

    const resizeObserver = new ResizeObserver(
      updateScrollButtons,
    );
    resizeObserver.observe(tabs);

    return () => {
      tabs.removeEventListener(
        "scroll",
        updateScrollButtons,
      );
      window.removeEventListener(
        "resize",
        updateScrollButtons,
      );
      resizeObserver.disconnect();
    };
  }, [items, updateScrollButtons]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(closeMenu);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, closeMenu]);

  useEffect(() => {
    const onOutsidePointer = (
      event: globalThis.MouseEvent,
    ) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const onEscape = (
      event: globalThis.KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener(
      "mousedown",
      onOutsidePointer,
    );
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        onOutsidePointer,
      );
      document.removeEventListener(
        "keydown",
        onEscape,
      );
    };
  }, [closeMenu]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  const scrollTabs = (direction: "left" | "right") => {
    tabsRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const handleTopClick = (
    event: MouseEvent<HTMLAnchorElement>,
    item: MegaItem,
  ) => {
    const hasDropdown = (item.groups?.length ?? 0) > 0;

    if (!hasDropdown) {
      closeMenu();
      return;
    }

    const touchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches;

    const href = normalizeHref(item.href);

    if (touchDevice && openHref !== href) {
      event.preventDefault();
      openMenu(item);
    }
  };

  const handleTopKeyDown = (
    event: KeyboardEvent<HTMLAnchorElement>,
    item: MegaItem,
  ) => {
    const hasDropdown = (item.groups?.length ?? 0) > 0;

    if (!hasDropdown) return;

    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openMenu(item);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
    }
  };

  const handleGroupKeyDown = (
    event: KeyboardEvent<HTMLAnchorElement>,
    groupIndex: number,
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveGroupIndex(
        Math.min(groupIndex + 1, groups.length - 1),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveGroupIndex(Math.max(groupIndex - 1, 0));
    }

    if (event.key === "ArrowRight") {
      const firstChild =
        document.querySelector<HTMLAnchorElement>(
          ".arogga-mega-child-grid a",
        );

      firstChild?.focus();
    }

    if (event.key === "Escape") {
      closeMenu();
    }
  };

  if (loading) {
    return (
      <section className="arogga-section-navigation">
        <div className="arogga-section-shell">
          <div className="arogga-menu-status">
            Loading menu...
          </div>
        </div>

        <NavigationStyles />
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      className="arogga-section-navigation"
      aria-label="Product category navigation"
      onMouseEnter={clearCloseTimer}
      onMouseLeave={scheduleClose}
    >
      <div className="arogga-section-shell">
        {menuError && (
          <div
            className="arogga-menu-error"
            role="status"
          >
            {menuError}
          </div>
        )}

        <div className="arogga-tabs-container">
          {canScrollLeft && (
            <button
              type="button"
              className="arogga-tab-scroll is-left"
              aria-label="Scroll categories left"
              onClick={() => scrollTabs("left")}
            >
              <ChevronLeft size={18} />
            </button>
          )}

          <nav
            ref={tabsRef}
            className="arogga-category-tabs"
            aria-label="Store categories"
          >
            {items.map((item, index) => {
              const staticHome = isStaticHome(item);

              if (staticHome) {
                return (
                  <span
                    key={`home-${index}`}
                    className={[
                      "arogga-category-tab",
                      "arogga-static-home",
                      pathname === "/" ? "is-active" : "",
                    ].join(" ")}
                    aria-current={
                      pathname === "/" ? "page" : undefined
                    }
                    aria-disabled="true"
                  >
                    <Home size={14} aria-hidden="true" />
                    <span>{item.label}</span>
                    <i aria-hidden="true" />
                  </span>
                );
              }

              const href = normalizeHref(item.href);
              if (!href) return null;

              const hasDropdown =
                (item.groups?.length ?? 0) > 0;
              const active = isRouteActive(
                pathname,
                href,
              );
              const open = openHref === href;

              return (
                <Link
                  key={`${item.section}-${href}-${index}`}
                  href={href}
                  className={[
                    "arogga-category-tab",
                    active ? "is-active" : "",
                    open ? "is-open" : "",
                  ].join(" ")}
                  aria-current={
                    active ? "page" : undefined
                  }
                  aria-haspopup={
                    hasDropdown ? "menu" : undefined
                  }
                  aria-expanded={
                    hasDropdown ? open : undefined
                  }
                  onMouseEnter={() => openMenu(item)}
                  onFocus={() => openMenu(item)}
                  onClick={(event) =>
                    handleTopClick(event, item)
                  }
                  onKeyDown={(event) =>
                    handleTopKeyDown(event, item)
                  }
                >
                  <span>{item.label}</span>

                  {hasDropdown && (
                    <ChevronDown
                      size={13}
                      aria-hidden="true"
                      className="arogga-tab-chevron"
                    />
                  )}

                  <i aria-hidden="true" />
                </Link>
              );
            })}
          </nav>

          {canScrollRight && (
            <button
              type="button"
              className="arogga-tab-scroll is-right"
              aria-label="Scroll categories right"
              onClick={() => scrollTabs("right")}
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>

      {openItem && groups.length > 0 && (
        <div
          className="arogga-mega-overlay"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
        >
          <div
            className="arogga-mega-menu"
            role="menu"
            aria-label={`${openItem.label} categories`}
          >
            <button
              type="button"
              className="arogga-mega-close"
              aria-label="Close category menu"
              onClick={closeMenu}
            >
              <X size={18} />
            </button>

            <aside
              className="arogga-mega-groups"
              aria-label={`${openItem.label} category groups`}
            >
              <Link
                href={normalizeHref(openItem.href) ?? "/"}
                className="arogga-all-link"
                onClick={closeMenu}
              >
                <span className="arogga-menu-icon">
                  🖼️
                </span>
                <span>All {openItem.label}</span>
              </Link>

              {groups.map((group, groupIndex) => {
                const groupActive =
                  activeGroupIndex === groupIndex;
                const routeActive = isRouteActive(
                  pathname,
                  group.href,
                );

                return (
                  <Link
                    key={`${group.href}-${groupIndex}`}
                    href={normalizeHref(group.href) ?? "/"}
                    role="menuitem"
                    aria-current={
                      routeActive ? "page" : undefined
                    }
                    className={[
                      "arogga-group-link",
                      groupActive ? "is-active" : "",
                      routeActive
                        ? "is-route-active"
                        : "",
                    ].join(" ")}
                    onMouseEnter={() => {
                      clearCloseTimer();
                      setActiveGroupIndex(groupIndex);
                    }}
                    onFocus={() =>
                      setActiveGroupIndex(groupIndex)
                    }
                    onClick={closeMenu}
                    onKeyDown={(event) =>
                      handleGroupKeyDown(
                        event,
                        groupIndex,
                      )
                    }
                  >
                    <span className="arogga-menu-icon">
                      {getGroupEmoji(group.label)}
                    </span>
                    <span>{group.label}</span>
                    <ChevronRight
                      size={16}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </aside>

            <section className="arogga-mega-children">
              <header className="arogga-child-header">
                <div>
                  <span>Explore</span>
                  <h3>{activeGroup?.label}</h3>
                </div>

                {activeGroup && (
                  <Link
                    href={
                      normalizeHref(activeGroup.href) ??
                      "/"
                    }
                    onClick={closeMenu}
                  >
                    View all
                    <ChevronRight size={14} />
                  </Link>
                )}
              </header>

              {activeGroup?.children?.length ? (
                <div className="arogga-mega-child-grid">
                  {activeGroup.children.map(
                    (child, childIndex) => {
                      const childHref = normalizeHref(
                        child.href,
                      );

                      if (!childHref) return null;

                      const active = isRouteActive(
                        pathname,
                        childHref,
                      );

                      return (
                        <Link
                          key={`${childHref}-${childIndex}`}
                          href={childHref}
                          role="menuitem"
                          className={
                            active ? "is-active" : ""
                          }
                          aria-current={
                            active ? "page" : undefined
                          }
                          onClick={closeMenu}
                          onKeyDown={(event) => {
                            if (
                              event.key === "Escape"
                            ) {
                              closeMenu();
                            }
                          }}
                        >
                          <span className="arogga-child-icon">
                            {getChildEmoji(
                              child.label,
                            )}
                          </span>
                          <span>{child.label}</span>
                        </Link>
                      );
                    },
                  )}
                </div>
              ) : (
                <div className="arogga-empty-children">
                  No subcategories available.
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      <NavigationStyles />
    </section>
  );
}

function getGroupEmoji(label: string) {
  const value = label.toLowerCase();

  if (value.includes("skin")) return "🧴";
  if (value.includes("hair")) return "💇";
  if (value.includes("personal")) return "🧼";
  if (
    value.includes("fragrance") ||
    value.includes("perfume")
  ) {
    return "🌸";
  }
  if (value.includes("makeup")) return "💄";
  if (
    value.includes("men") ||
    value.includes("groom")
  ) {
    return "🪒";
  }
  if (
    value.includes("baby") ||
    value.includes("mother")
  ) {
    return "👶";
  }
  if (
    value.includes("medicine") ||
    value.includes("pain")
  ) {
    return "💊";
  }
  if (value.includes("heart")) return "❤️";
  if (value.includes("lab")) return "🧪";
  if (value.includes("doctor")) return "🩺";
  if (value.includes("pet")) return "🐾";
  if (value.includes("food")) return "🥗";
  if (value.includes("home")) return "🏠";
  if (value.includes("tool")) return "🧰";

  return "🛍️";
}

function getChildEmoji(label: string) {
  const value = label.toLowerCase();

  if (value.includes("oral")) return "🪥";
  if (value.includes("deodor")) return "🧴";
  if (
    value.includes("bath") ||
    value.includes("body")
  ) {
    return "🧼";
  }
  if (value.includes("feminine")) return "🌷";
  if (value.includes("cream")) return "🧴";
  if (value.includes("tablet")) return "💊";
  if (value.includes("capsule")) return "💊";
  if (value.includes("syrup")) return "🥄";
  if (value.includes("drop")) return "💧";
  if (value.includes("spray")) return "🌫️";
  if (value.includes("inhaler")) return "🫁";
  if (value.includes("injection")) return "💉";
  if (value.includes("test")) return "🧪";
  if (value.includes("package")) return "📦";
  if (value.includes("collection")) return "🧺";
  if (value.includes("offer")) return "🏷️";

  return "🛍️";
}

function NavigationStyles() {
  return (
    <style jsx global>{`
      .arogga-section-navigation {
        position: relative;
        z-index: 95;
        width: 100%;
        border-bottom: 1px solid #e5e7eb;
        background: #ffffff;
        font-family: inherit;
      }

      .arogga-section-shell {
        width: min(1440px, calc(100% - 48px));
        margin-inline: auto;
      }

      .arogga-menu-status,
      .arogga-menu-error {
        display: flex;
        min-height: 50px;
        align-items: center;
        color: #667085;
        font-size: 13px;
      }

      .arogga-menu-error {
        min-height: 34px;
        color: #b42318;
      }

      .arogga-tabs-container {
        position: relative;
      }

      .arogga-category-tabs {
        display: flex;
        min-height: 50px;
        align-items: stretch;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-behavior: smooth;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }

      .arogga-category-tabs::-webkit-scrollbar {
        display: none;
      }

      .arogga-category-tab {
        position: relative;
        display: inline-flex;
        min-height: 50px;
        flex: 0 0 auto;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 0 14px;
        border: 0;
        color: #172033;
        background: transparent;
        font-size: 13px;
        font-weight: 500;
        line-height: 1;
        text-decoration: none;
        white-space: nowrap;
        transition:
          color 150ms ease,
          background-color 150ms ease;
      }

      .arogga-category-tab:not(
          .arogga-static-home
        ):hover,
      .arogga-category-tab.is-open,
      .arogga-category-tab.is-active {
        color: #087b75;
        background: #f4fbfa;
      }

      .arogga-static-home {
        color: #087b75;
        cursor: default;
        user-select: none;
      }

      .arogga-tab-chevron {
        transition: transform 160ms ease;
      }

      .arogga-category-tab.is-open
        .arogga-tab-chevron {
        transform: rotate(180deg);
      }

      .arogga-category-tab > i {
        position: absolute;
        right: 12px;
        bottom: 0;
        left: 12px;
        height: 2px;
        border-radius: 999px 999px 0 0;
        background: #087b75;
        opacity: 0;
        transform: scaleX(0.35);
        transition:
          opacity 150ms ease,
          transform 150ms ease;
      }

      .arogga-category-tab.is-active > i,
      .arogga-category-tab.is-open > i,
      .arogga-category-tab:not(
          .arogga-static-home
        ):hover
        > i {
        opacity: 1;
        transform: scaleX(1);
      }

      .arogga-tab-scroll {
        position: absolute;
        top: 50%;
        z-index: 8;
        display: flex;
        width: 34px;
        height: 34px;
        align-items: center;
        justify-content: center;
        border: 1px solid #d0d5dd;
        border-radius: 9px;
        color: #475467;
        background: rgba(255, 255, 255, 0.96);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
        cursor: pointer;
        transform: translateY(-50%);
      }

      .arogga-tab-scroll.is-left {
        left: -12px;
      }

      .arogga-tab-scroll.is-right {
        right: -12px;
      }

      .arogga-mega-overlay {
        position: absolute;
        top: 100%;
        right: 0;
        left: 0;
        z-index: 150;
        padding: 0 24px 24px;
        pointer-events: none;
      }

      .arogga-mega-menu {
        position: relative;
        display: grid;
        width: min(760px, calc(100vw - 48px));
        max-height: min(520px, calc(100vh - 150px));
        grid-template-columns: 280px minmax(330px, 1fr);
        overflow: hidden;
        margin-left: max(
          24px,
          calc((100vw - min(1440px, 100vw - 48px)) / 2 + 190px)
        );
        border: 1px solid #e4e7ec;
        border-top: 0;
        border-radius: 0 0 12px 12px;
        background: #ffffff;
        box-shadow:
          0 22px 45px -18px rgba(15, 23, 42, 0.28),
          0 10px 22px -14px rgba(15, 23, 42, 0.18);
        pointer-events: auto;
        animation: aroggaMegaIn 150ms ease both;
      }

      .arogga-mega-close {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 10;
        display: none;
        width: 36px;
        height: 36px;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 9px;
        color: #475467;
        background: #f2f4f7;
        cursor: pointer;
      }

      .arogga-mega-groups {
        min-width: 0;
        overflow-y: auto;
        padding: 10px;
        border-right: 1px solid #eaecf0;
        background: #ffffff;
      }

      .arogga-all-link,
      .arogga-group-link {
        display: grid;
        min-height: 44px;
        grid-template-columns: 28px minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border: 1px solid transparent;
        border-radius: 7px;
        color: #344054;
        background: #ffffff;
        font-size: 13px;
        font-weight: 500;
        line-height: 1.25;
        text-decoration: none;
        transition:
          color 140ms ease,
          background-color 140ms ease,
          border-color 140ms ease,
          transform 140ms ease;
      }

      .arogga-all-link {
        margin-bottom: 4px;
      }

      .arogga-all-link:hover,
      .arogga-group-link:hover,
      .arogga-group-link.is-active,
      .arogga-group-link.is-route-active {
        color: #087b75;
        border-color: #d5eeeb;
        background: #edf9f7;
      }

      .arogga-group-link:hover,
      .arogga-group-link.is-active {
        transform: translateX(2px);
      }

      .arogga-menu-icon {
        display: flex;
        width: 25px;
        height: 25px;
        align-items: center;
        justify-content: center;
        border: 1px solid #eaecf0;
        border-radius: 5px;
        background: #ffffff;
        font-size: 14px;
      }

      .arogga-mega-children {
        min-width: 0;
        overflow-y: auto;
        padding: 18px 18px 22px;
        background: #ffffff;
      }

      .arogga-child-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 16px;
        padding: 0 2px 14px;
        border-bottom: 1px solid #eaecf0;
      }

      .arogga-child-header span {
        display: block;
        color: #98a2b3;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .arogga-child-header h3 {
        margin: 4px 0 0;
        color: #101828;
        font-size: 17px;
        line-height: 1.25;
      }

      .arogga-child-header > a {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        color: #087b75;
        font-size: 12px;
        font-weight: 700;
        text-decoration: none;
        white-space: nowrap;
      }

      .arogga-mega-child-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
        padding-top: 14px;
      }

      .arogga-mega-child-grid > a {
        display: grid;
        min-height: 44px;
        grid-template-columns: 30px minmax(0, 1fr);
        align-items: center;
        gap: 9px;
        padding: 8px 10px;
        border: 1px solid #e4e7ec;
        border-radius: 7px;
        color: #475467;
        background: #ffffff;
        font-size: 13px;
        font-weight: 500;
        line-height: 1.3;
        text-decoration: none;
        transition:
          color 140ms ease,
          background-color 140ms ease,
          border-color 140ms ease,
          transform 140ms ease;
      }

      .arogga-mega-child-grid > a:hover,
      .arogga-mega-child-grid > a.is-active {
        color: #087b75;
        border-color: #bfe3df;
        background: #edf9f7;
        transform: translateX(2px);
      }

      .arogga-child-icon {
        display: flex;
        width: 28px;
        height: 28px;
        align-items: center;
        justify-content: center;
        border: 1px solid #eaecf0;
        border-radius: 6px;
        background: #ffffff;
        font-size: 14px;
      }

      .arogga-empty-children {
        padding: 28px 4px;
        color: #667085;
        font-size: 13px;
      }

      @keyframes aroggaMegaIn {
        from {
          opacity: 0;
          transform: translateY(-5px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 1100px) {
        .arogga-section-shell {
          width: calc(100% - 24px);
        }

        .arogga-mega-menu {
          margin-left: 12px;
        }
      }

      @media (max-width: 767px) {
        .arogga-section-shell {
          width: 100%;
        }

        .arogga-category-tabs {
          min-height: 48px;
          padding-inline: 8px;
        }

        .arogga-category-tab {
          min-height: 48px;
          padding-inline: 12px;
          font-size: 12px;
        }

        .arogga-tab-scroll {
          display: none;
        }

        .arogga-mega-overlay {
          position: fixed;
          inset: 0;
          z-index: 250;
          display: flex;
          align-items: flex-end;
          padding: 0;
          background: rgba(15, 23, 42, 0.44);
          backdrop-filter: blur(3px);
          pointer-events: auto;
        }

        .arogga-mega-menu {
          width: 100%;
          max-height: 86vh;
          grid-template-columns: 1fr;
          overflow-y: auto;
          margin: 0;
          border: 0;
          border-radius: 18px 18px 0 0;
        }

        .arogga-mega-close {
          display: flex;
        }

        .arogga-mega-groups {
          display: grid;
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
          gap: 5px;
          overflow: visible;
          padding: 54px 12px 12px;
          border-right: 0;
          border-bottom: 1px solid #eaecf0;
          background: #f9fafb;
        }

        .arogga-all-link,
        .arogga-group-link {
          min-height: 43px;
          padding: 7px 8px;
          font-size: 12px;
        }

        .arogga-mega-children {
          overflow: visible;
          padding: 16px 14px 24px;
        }

        .arogga-mega-child-grid {
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
        }
      }

      @media (max-width: 480px) {
        .arogga-mega-groups,
        .arogga-mega-child-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .arogga-section-navigation *,
        .arogga-section-navigation *::before,
        .arogga-section-navigation *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `}</style>
  );
}
