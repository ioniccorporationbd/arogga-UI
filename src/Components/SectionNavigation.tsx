"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Home,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type MenuSection = "store" | "lab" | "doctor";
type NavigationMode = MenuSection;

type RelatedLink = {
  relation: string;
  linkId: string;
  linkCode: string;
  label: string;
  href: string;
};

type SubLink = {
  label: string;
  href: string;
  nodeType?: "subLink";
  linkId?: string;
  linkCode?: string;
  subLinkId?: string;
  subLinkCode?: string;
  subLinkName?: string;
  subLinkHref?: string;
  mainDropdownId?: string;
  mainDropdownCode?: string;
  parentLinkId?: string | null;
  parentLinkCode?: string | null;
  parentDropdownId?: string | null;
  parentDropdownCode?: string | null;
  section?: MenuSection;
  relatedLinks?: RelatedLink[];
};

type SubDropdown = {
  label: string;
  href: string;
  children?: SubLink[];
  nodeType?: "subDropdown";
  linkId?: string;
  linkCode?: string;
  dropdownId?: string | null;
  dropdownCode?: string | null;
  subDropdownId?: string;
  subDropdownCode?: string;
  subDropdownName?: string;
  subDropdownHref?: string;
  subDropdownLinkId?: string;
  subDropdownLinkCode?: string;
  mainDropdownId?: string;
  mainDropdownCode?: string;
  section?: MenuSection;
  relatedLinks?: RelatedLink[];
};

type MainDropdown = {
  label: string;
  href?: string;
  section: MenuSection;
  groups?: SubDropdown[];
  isStatic?: boolean;
  nodeType?: "mainDropdown";
  linkId?: string;
  linkCode?: string;
  dropdownId?: string | null;
  dropdownCode?: string | null;
  mainDropdownId?: string;
  mainDropdownCode?: string;
  mainDropdownName?: string;
  mainDropdownHref?: string;
  mainLinkId?: string;
  mainLinkCode?: string;
  relatedLinks?: RelatedLink[];
};

type MenuData = {
  store: MainDropdown[];
  lab: MainDropdown[];
  doctor: MainDropdown[];
};

type SectionNavigationProps = {
  mode?: NavigationMode;
  dataUrl?: string;
  className?: string;
};

const EMPTY_MENU: MenuData = {
  store: [],
  lab: [],
  doctor: [],
};

const CLOSE_DELAY = 180;

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeHref(href?: string) {
  if (!href || href === "#") return undefined;
  const value = href.trim();
  if (!value) return undefined;
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return value.startsWith("/") ? value : `/${value}`;
}

function isExternalHref(href?: string) {
  return Boolean(
    href?.startsWith("http://") || href?.startsWith("https://"),
  );
}

function getMainName(item: MainDropdown) {
  return item.mainDropdownName || item.label;
}

function getMainHref(item: MainDropdown) {
  return normalizeHref(item.mainDropdownHref || item.href);
}

function getMainLinkId(item: MainDropdown) {
  return (
    item.mainLinkId ||
    item.linkId ||
    `main-link-${slugify(getMainName(item))}`
  );
}

function getMainDropdownId(item: MainDropdown) {
  return (
    item.mainDropdownId ||
    item.dropdownId ||
    `main-dropdown-${slugify(getMainName(item))}`
  );
}

function getSubDropdownName(group: SubDropdown) {
  return group.subDropdownName || group.label;
}

function getSubDropdownHref(group: SubDropdown) {
  return normalizeHref(group.subDropdownHref || group.href);
}

function getSubDropdownId(group: SubDropdown) {
  return (
    group.subDropdownId ||
    group.dropdownId ||
    `sub-dropdown-${slugify(getSubDropdownName(group))}`
  );
}

function getSubDropdownLinkId(group: SubDropdown) {
  return (
    group.subDropdownLinkId ||
    group.linkId ||
    `sub-dropdown-link-${slugify(getSubDropdownName(group))}`
  );
}

function getSubLinkName(child: SubLink) {
  return child.subLinkName || child.label;
}

function getSubLinkHref(child: SubLink) {
  return normalizeHref(child.subLinkHref || child.href);
}

function getSubLinkId(child: SubLink) {
  return (
    child.subLinkId ||
    child.linkId ||
    `sub-link-${slugify(getSubLinkName(child))}`
  );
}

function isStaticHome(item: MainDropdown) {
  return (
    item.isStatic === true ||
    getMainName(item).trim().toLowerCase() === "home"
  );
}

function isRouteActive(pathname: string, href?: string) {
  const normalizedHref = normalizeHref(href);
  if (!normalizedHref || isExternalHref(normalizedHref)) return false;
  return (
    pathname === normalizedHref ||
    pathname.startsWith(`${normalizedHref}/`)
  );
}

function getSectionItems(data: MenuData, mode: NavigationMode) {
  if (mode === "lab") return data.lab;
  if (mode === "doctor") return data.doctor;
  return data.store;
}

function findBestGroup(
  pathname: string,
  groups: SubDropdown[],
): SubDropdown | null {
  return (
    groups.find((group) =>
      isRouteActive(pathname, getSubDropdownHref(group)),
    ) ||
    groups[0] ||
    null
  );
}

function getNavigationLabel(mode: NavigationMode) {
  if (mode === "lab") return "Lab category navigation";
  if (mode === "doctor") return "Doctor category navigation";
  return "Store category navigation";
}

function getCategoryIcon(label: string) {
  const value = label.toLowerCase();
  if (value.includes("medicine") || value.includes("tablet") || value.includes("capsule")) return "💊";
  if (value.includes("health") || value.includes("medical") || value.includes("doctor")) return "🩺";
  if (value.includes("skin") || value.includes("cream") || value.includes("beauty")) return "🧴";
  if (value.includes("hair")) return "💇";
  if (value.includes("baby") || value.includes("mother") || value.includes("mom")) return "👶";
  if (value.includes("food") || value.includes("nutrition")) return "🥗";
  if (value.includes("home") || value.includes("clean")) return "🏠";
  if (value.includes("pet") || value.includes("animal") || value.includes("veterinary")) return "🐾";
  if (value.includes("lab") || value.includes("test") || value.includes("organ")) return "🧪";
  if (value.includes("women") || value.includes("feminine")) return "🌷";
  if (value.includes("men")) return "🧔";
  if (value.includes("supplement") || value.includes("vitamin")) return "⚕️";
  if (value.includes("herbal") || value.includes("natural")) return "🌿";
  if (value.includes("sexual") || value.includes("intimate")) return "💗";
  if (value.includes("package") || value.includes("collection")) return "📦";
  return "🛍️";
}

export default function SectionNavigation({
  mode = "store",
  dataUrl = "/SectionNavigation.json",
  className = "",
}: SectionNavigationProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [menuData, setMenuData] = useState<MenuData>(EMPTY_MENU);
  const [loading, setLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [activeSubDropdownId, setActiveSubDropdownId] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMenu() {
      try {
        setLoading(true);
        setMenuError(null);

        const response = await fetch(dataUrl, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load ${dataUrl}: ${response.status}`);
        }

        const data = (await response.json()) as Partial<MenuData>;
        if (controller.signal.aborted) return;

        setMenuData({
          store: Array.isArray(data.store) ? data.store : [],
          lab: Array.isArray(data.lab) ? data.lab : [],
          doctor: Array.isArray(data.doctor) ? data.doctor : [],
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Navigation loading failed:", error);
        setMenuData(EMPTY_MENU);
        setMenuError("Navigation data could not be loaded.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadMenu();
    return () => controller.abort();
  }, [dataUrl]);

  const items = useMemo(
    () => getSectionItems(menuData, mode),
    [menuData, mode],
  );

  const openItem = useMemo(() => {
    if (!openDropdownId) return null;
    return (
      items.find(
        (item) => getMainDropdownId(item) === openDropdownId,
      ) || null
    );
  }, [items, openDropdownId]);

  const subDropdowns = useMemo(
    () => openItem?.groups || [],
    [openItem],
  );

  const activeSubDropdown = useMemo(() => {
    if (!subDropdowns.length) return null;
    return (
      subDropdowns.find(
        (group) => getSubDropdownId(group) === activeSubDropdownId,
      ) ||
      subDropdowns[0] ||
      null
    );
  }, [activeSubDropdownId, subDropdowns]);

  const clearCloseTimer = useCallback(() => {
    if (!closeTimerRef.current) return;
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setOpenDropdownId(null);
    setActiveSubDropdownId(null);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(closeMenu, CLOSE_DELAY);
  }, [clearCloseTimer, closeMenu]);

  const openMenu = useCallback(
    (item: MainDropdown) => {
      clearCloseTimer();
      const groups = item.groups || [];
      if (isStaticHome(item) || groups.length === 0) {
        closeMenu();
        return;
      }

      const firstGroup = findBestGroup(pathname, groups);
      setOpenDropdownId(getMainDropdownId(item));
      setActiveSubDropdownId(
        firstGroup ? getSubDropdownId(firstGroup) : null,
      );
    },
    [clearCloseTimer, closeMenu, pathname],
  );

  const updateScrollButtons = useCallback(() => {
    const element = tabsRef.current;
    if (!element) return;
    const maxScroll = element.scrollWidth - element.clientWidth;
    setCanScrollLeft(element.scrollLeft > 2);
    setCanScrollRight(element.scrollLeft < maxScroll - 2);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const element = tabsRef.current;
    if (!element) return;

    element.addEventListener("scroll", updateScrollButtons, {
      passive: true,
    });
    window.addEventListener("resize", updateScrollButtons);
    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(element);

    return () => {
      element.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
      observer.disconnect();
    };
  }, [items, updateScrollButtons]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(closeMenu);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, mode, closeMenu]);

  useEffect(() => {
    function onOutside(event: globalThis.MouseEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    }

    function onEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") closeMenu();
    }

    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [closeMenu]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  function scrollTabs(direction: "left" | "right") {
    tabsRef.current?.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
  }

  function handleTopClick(
    event: MouseEvent<HTMLAnchorElement>,
    item: MainDropdown,
  ) {
    const hasDropdown = (item.groups?.length || 0) > 0;
    if (!hasDropdown) {
      closeMenu();
      return;
    }

    const touchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches;

    if (
      touchDevice &&
      openDropdownId !== getMainDropdownId(item)
    ) {
      event.preventDefault();
      openMenu(item);
    }
  }

  function handleTopKeyDown(
    event: KeyboardEvent<HTMLAnchorElement>,
    item: MainDropdown,
  ) {
    if ((item.groups?.length || 0) === 0) return;

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
  }

  function handleSubDropdownKeyDown(
    event: KeyboardEvent<HTMLAnchorElement>,
    currentIndex: number,
  ) {
    if (event.key === "Escape") {
      closeMenu();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      document
        .querySelector<HTMLAnchorElement>("[data-sub-link='true']")
        ?.focus();
      return;
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();

    const nextIndex =
      event.key === "ArrowDown"
        ? Math.min(currentIndex + 1, subDropdowns.length - 1)
        : Math.max(currentIndex - 1, 0);

    const nextGroup = subDropdowns[nextIndex];
    if (!nextGroup) return;

    setActiveSubDropdownId(getSubDropdownId(nextGroup));
    document.getElementById(getSubDropdownLinkId(nextGroup))?.focus();
  }

  if (loading) {
    return (
      <section className={`relative z-[95] w-full border-b border-slate-200 bg-white ${className}`}>
        <div className="mx-auto flex min-h-14 w-[min(1440px,calc(100%-48px))] items-center max-md:w-full max-md:px-3">
          <div className="h-4 w-52 animate-pulse rounded bg-slate-200" />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      className={`relative z-[95] w-full border-b border-slate-200 bg-white ${className}`}
      aria-label={getNavigationLabel(mode)}
      onMouseEnter={clearCloseTimer}
      onMouseLeave={scheduleClose}
    >
      <div className="mx-auto w-[min(1440px,calc(100%-48px))] max-md:w-full">
        {menuError ? (
          <div className="flex min-h-10 items-center px-3 text-sm text-red-600" role="status">
            {menuError}
          </div>
        ) : null}

        <div className="relative">
          {canScrollLeft ? (
            <button
              type="button"
              className="absolute left-0 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-md max-md:hidden"
              aria-label="Scroll categories left"
              onClick={() => scrollTabs("left")}
            >
              <ChevronLeft size={18} />
            </button>
          ) : null}

          <nav
            ref={tabsRef}
            className="flex min-h-14 items-stretch gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label={getNavigationLabel(mode)}
          >
            {items.map((item) => {
              const name = getMainName(item);
              const href = getMainHref(item);
              const mainLinkId = getMainLinkId(item);
              const dropdownId = getMainDropdownId(item);

              if (isStaticHome(item)) {
                return (
                  <span
                    key={mainLinkId}
                    id={mainLinkId}
                    data-main-link-id={mainLinkId}
                    className="inline-flex min-h-14 shrink-0 items-center gap-2 px-4 text-sm font-medium text-teal-700"
                    aria-current={pathname === "/" ? "page" : undefined}
                  >
                    <Home size={15} />
                    {name}
                  </span>
                );
              }

              if (!href) return null;

              const hasDropdown = (item.groups?.length || 0) > 0;
              const active = isRouteActive(pathname, href);
              const open = openDropdownId === dropdownId;

              return (
                <Link
                  key={mainLinkId}
                  id={mainLinkId}
                  href={href}
                  target={isExternalHref(href) ? "_blank" : undefined}
                  rel={isExternalHref(href) ? "noopener noreferrer" : undefined}
                  data-main-link-id={mainLinkId}
                  data-main-link-code={item.mainLinkCode || item.linkCode || undefined}
                  data-main-dropdown-id={hasDropdown ? dropdownId : undefined}
                  data-main-dropdown-code={
                    hasDropdown
                      ? item.mainDropdownCode || item.dropdownCode || undefined
                      : undefined
                  }
                  className={[
                    "relative inline-flex min-h-14 shrink-0 items-center gap-1.5 whitespace-nowrap px-4 text-[15px] font-medium transition",
                    active || open
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-800 hover:bg-slate-50 hover:text-teal-700",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                  aria-haspopup={hasDropdown ? "menu" : undefined}
                  aria-expanded={hasDropdown ? open : undefined}
                  aria-controls={hasDropdown ? `${dropdownId}-content` : undefined}
                  onMouseEnter={() => openMenu(item)}
                  onFocus={() => openMenu(item)}
                  onClick={(event) => handleTopClick(event, item)}
                  onKeyDown={(event) => handleTopKeyDown(event, item)}
                >
                  <span>{name}</span>
                  {hasDropdown ? (
                    <ChevronDown
                      size={14}
                      className={open ? "rotate-180 transition-transform" : "transition-transform"}
                    />
                  ) : null}
                  <span
                    className={[
                      "absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-teal-700 transition",
                      active || open
                        ? "scale-x-100 opacity-100"
                        : "scale-x-50 opacity-0",
                    ].join(" ")}
                  />
                </Link>
              );
            })}
          </nav>

          {canScrollRight ? (
            <button
              type="button"
              className="absolute right-0 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-md max-md:hidden"
              aria-label="Scroll categories right"
              onClick={() => scrollTabs("right")}
            >
              <ChevronRight size={18} />
            </button>
          ) : null}
        </div>
      </div>

      {openItem && subDropdowns.length > 0 ? (
        <div
          className="absolute inset-x-0 top-full z-[150] px-6 pb-6 max-md:fixed max-md:inset-0 max-md:flex max-md:items-end max-md:bg-slate-950/45 max-md:p-0"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
        >
          <div
            id={`${getMainDropdownId(openItem)}-content`}
            data-owner-main-dropdown-id={getMainDropdownId(openItem)}
            className="relative ml-[max(24px,calc((100vw-min(1440px,100vw-48px))/2+150px))] grid max-h-[540px] w-[min(900px,calc(100vw-48px))] grid-cols-[300px_minmax(0,1fr)] overflow-hidden rounded-b-2xl border border-t-0 border-slate-200 bg-white shadow-2xl max-md:ml-0 max-md:max-h-[88vh] max-md:w-full max-md:grid-cols-1 max-md:overflow-y-auto max-md:rounded-b-none max-md:rounded-t-3xl"
            role="menu"
            aria-label={`${getMainName(openItem)} categories`}
          >
            <button
              type="button"
              className="absolute right-4 top-4 z-20 hidden size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 max-md:flex"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <X size={20} />
            </button>

            <aside className="overflow-y-auto border-r border-slate-200 bg-slate-50 p-3 max-md:border-b max-md:border-r-0 max-md:pt-16">
              <Link
                href={getMainHref(openItem) || "/"}
                className="mb-2 flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-800 hover:bg-white hover:text-teal-700"
                onClick={closeMenu}
              >
                <span className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white">
                  {mode === "lab" ? <FlaskConical size={17} /> : <Menu size={17} />}
                </span>
                <span>All {getMainName(openItem)}</span>
              </Link>

              <div className="space-y-1">
                {subDropdowns.map((group, groupIndex) => {
                  const groupName = getSubDropdownName(group);
                  const groupHref = getSubDropdownHref(group);
                  const subDropdownId = getSubDropdownId(group);
                  const subDropdownLinkId = getSubDropdownLinkId(group);
                  const selected = activeSubDropdownId === subDropdownId;
                  const routeActive = isRouteActive(pathname, groupHref);

                  if (!groupHref) return null;

                  return (
                    <Link
                      key={subDropdownId}
                      id={subDropdownLinkId}
                      href={groupHref}
                      data-sub-dropdown-id={subDropdownId}
                      data-sub-dropdown-code={group.subDropdownCode || group.dropdownCode || undefined}
                      data-sub-dropdown-link-id={subDropdownLinkId}
                      data-sub-dropdown-link-code={group.subDropdownLinkCode || group.linkCode || undefined}
                      role="menuitem"
                      className={[
                        "grid min-h-12 grid-cols-[36px_minmax(0,1fr)_20px] items-center gap-2 rounded-xl border px-3 text-sm transition",
                        selected || routeActive
                          ? "border-teal-100 bg-white font-semibold text-teal-700 shadow-sm"
                          : "border-transparent text-slate-700 hover:bg-white hover:text-teal-700",
                      ].join(" ")}
                      aria-current={routeActive ? "page" : undefined}
                      onMouseEnter={() => {
                        clearCloseTimer();
                        setActiveSubDropdownId(subDropdownId);
                      }}
                      onFocus={() => setActiveSubDropdownId(subDropdownId)}
                      onClick={closeMenu}
                      onKeyDown={(event) => handleSubDropdownKeyDown(event, groupIndex)}
                    >
                      <span className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-base">
                        {getCategoryIcon(groupName)}
                      </span>
                      <span className="truncate">{groupName}</span>
                      <ChevronRight size={16} />
                    </Link>
                  );
                })}
              </div>
            </aside>

            <section className="min-w-0 overflow-y-auto bg-white p-6 max-md:overflow-visible max-md:p-4">
              <header className="mb-5 flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Explore</p>
                  <h3 className="mt-1 truncate text-xl font-bold text-slate-950">
                    {activeSubDropdown
                      ? getSubDropdownName(activeSubDropdown)
                      : getMainName(openItem)}
                  </h3>
                </div>

                {activeSubDropdown && getSubDropdownHref(activeSubDropdown) ? (
                  <Link
                    href={getSubDropdownHref(activeSubDropdown) || "/"}
                    className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-teal-700"
                    onClick={closeMenu}
                  >
                    View all
                    <ChevronRight size={15} />
                  </Link>
                ) : null}
              </header>

              {activeSubDropdown?.children?.length ? (
                <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                  {activeSubDropdown.children.map((child) => {
                    const childName = getSubLinkName(child);
                    const childHref = getSubLinkHref(child);
                    const subLinkId = getSubLinkId(child);
                    if (!childHref) return null;
                    const active = isRouteActive(pathname, childHref);

                    return (
                      <Link
                        key={subLinkId}
                        id={subLinkId}
                        href={childHref}
                        data-sub-link="true"
                        data-sub-link-id={subLinkId}
                        data-sub-link-code={child.subLinkCode || child.linkCode || undefined}
                        data-parent-sub-dropdown-id={activeSubDropdownId || undefined}
                        role="menuitem"
                        className={[
                          "grid min-h-[58px] grid-cols-[38px_minmax(0,1fr)] items-center gap-3 rounded-xl border p-3 text-sm font-medium transition",
                          active
                            ? "border-teal-300 bg-teal-50 text-teal-700"
                            : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 hover:shadow-sm",
                        ].join(" ")}
                        aria-current={active ? "page" : undefined}
                        onClick={closeMenu}
                        onKeyDown={(event) => {
                          if (event.key === "Escape") closeMenu();
                        }}
                      >
                        <span className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg">
                          {getCategoryIcon(childName)}
                        </span>
                        <span className="line-clamp-2">{childName}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                  No subcategory links are available.
                </div>
              )}
            </section>
          </div>
        </div>
      ) : null}
    </section>
  );
}
