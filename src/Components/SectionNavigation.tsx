"use client";

import {
  BadgePercent,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  FlaskConical,
  Home,
  SlidersHorizontal,
  Stethoscope,
  Store,
  X,
  Zap,
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

import styles from "./SectionNavigation.module.css";

type MenuSection = "store" | "lab" | "doctor";
type NavigationMode = MenuSection | "auto";
type QuickPanel = "browse" | "filters" | null;

type RelatedLink = {
  relation?: string;
  linkId?: string;
  linkCode?: string;
  label?: string;
  href?: string;
};

type MegaLeaf = {
  label?: string;
  href?: string;
  subLinkName?: string;
  subLinkHref?: string;
  subLinkId?: string;
  subLinkCode?: string;
  linkId?: string;
  linkCode?: string;
  parentDropdownId?: string | null;
  parentDropdownCode?: string | null;
  mainDropdownId?: string;
  mainDropdownCode?: string;
  relatedLinks?: RelatedLink[];
};

type MegaGroup = {
  label?: string;
  href?: string;
  subDropdownName?: string;
  subDropdownHref?: string;
  subDropdownId?: string;
  subDropdownCode?: string;
  subDropdownLinkId?: string;
  subDropdownLinkCode?: string;
  linkId?: string;
  linkCode?: string;
  dropdownId?: string | null;
  dropdownCode?: string | null;
  mainDropdownId?: string;
  mainDropdownCode?: string;
  children?: MegaLeaf[];
  relatedLinks?: RelatedLink[];
};

type MegaItem = {
  label?: string;
  href?: string;
  section?: MenuSection;
  isStatic?: boolean;
  mainDropdownName?: string;
  mainDropdownHref?: string;
  mainDropdownId?: string;
  mainDropdownCode?: string;
  mainLinkId?: string;
  mainLinkCode?: string;
  linkId?: string;
  linkCode?: string;
  dropdownId?: string | null;
  dropdownCode?: string | null;
  groups?: MegaGroup[];
  relatedLinks?: RelatedLink[];
};

type MenuData = {
  store: MegaItem[];
  lab: MegaItem[];
  doctor: MegaItem[];
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

function cleanText(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeHref(href?: string) {
  const value = cleanText(href);

  if (!value || value === "#") {
    return undefined;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return value.startsWith("/") ? value : `/${value}`;
}

function isExternalHref(href?: string) {
  return Boolean(
    href?.startsWith("http://") ||
      href?.startsWith("https://"),
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getMainName(item: MegaItem) {
  return (
    cleanText(item.mainDropdownName) ||
    cleanText(item.label) ||
    "Category"
  );
}

function getMainHref(item: MegaItem) {
  return normalizeHref(
    item.mainDropdownHref || item.href,
  );
}

function getMainDropdownId(item: MegaItem) {
  return (
    cleanText(item.mainDropdownId) ||
    cleanText(item.dropdownId || undefined) ||
    `main-dropdown-${slugify(getMainName(item))}`
  );
}

function getMainLinkId(item: MegaItem) {
  return (
    cleanText(item.mainLinkId) ||
    cleanText(item.linkId) ||
    `main-link-${slugify(getMainName(item))}`
  );
}

function getGroupName(group: MegaGroup) {
  return (
    cleanText(group.subDropdownName) ||
    cleanText(group.label) ||
    "Subcategory"
  );
}

function getGroupHref(group: MegaGroup) {
  return normalizeHref(
    group.subDropdownHref || group.href,
  );
}

function getGroupDropdownId(group: MegaGroup) {
  return (
    cleanText(group.subDropdownId) ||
    cleanText(group.dropdownId || undefined) ||
    `sub-dropdown-${slugify(getGroupName(group))}`
  );
}

function getGroupLinkId(group: MegaGroup) {
  return (
    cleanText(group.subDropdownLinkId) ||
    cleanText(group.linkId) ||
    `sub-dropdown-link-${slugify(getGroupName(group))}`
  );
}

function getLeafName(leaf: MegaLeaf) {
  return (
    cleanText(leaf.subLinkName) ||
    cleanText(leaf.label) ||
    "Item"
  );
}

function getLeafHref(leaf: MegaLeaf) {
  return normalizeHref(leaf.subLinkHref || leaf.href);
}

function getLeafId(leaf: MegaLeaf) {
  return (
    cleanText(leaf.subLinkId) ||
    cleanText(leaf.linkId) ||
    `sub-link-${slugify(getLeafName(leaf))}`
  );
}

function isStaticHome(item: MegaItem) {
  return (
    item.isStatic === true ||
    getMainName(item).toLowerCase() === "home"
  );
}

function isRouteActive(
  pathname: string,
  href?: string,
) {
  const normalized = normalizeHref(href);

  if (!normalized || isExternalHref(normalized)) {
    return false;
  }

  if (normalized === "/") {
    return pathname === "/";
  }

  return (
    pathname === normalized ||
    pathname.startsWith(`${normalized}/`)
  );
}

function isMenuData(value: unknown): value is Partial<MenuData> {
  return Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value),
  );
}

function getSectionItems(
  menuData: MenuData,
  mode: MenuSection,
) {
  return menuData[mode] ?? [];
}

function findBestGroupIndex(
  pathname: string,
  groups: MegaGroup[],
) {
  const index = groups.findIndex((group) =>
    isRouteActive(pathname, getGroupHref(group)),
  );

  return index >= 0 ? index : 0;
}

function getNavigationLabel(mode: NavigationMode) {
  if (mode === "lab") return "Lab test categories";
  if (mode === "doctor") return "Doctor categories";
  return "Store categories";
}

function resolveMode(pathname: string, mode: NavigationMode): MenuSection {
  if (mode !== "auto") return mode;
  if (pathname === "/lab" || pathname.startsWith("/lab/")) return "lab";
  if (pathname === "/doctor" || pathname.startsWith("/doctor/")) return "doctor";
  return "store";
}

function getModeMeta(mode: MenuSection) {
  if (mode === "lab") {
    return {
      eyebrow: "LAB FILTERS",
      title: "Find tests faster",
      subtitle: "Browse health concern, organ packages and checkup groups.",
      cta: "Lab Menu",
    };
  }

  if (mode === "doctor") {
    return {
      eyebrow: "DOCTOR FILTERS",
      title: "Find the right care",
      subtitle: "Choose physicians, specialists and family care quickly.",
      cta: "Doctor Menu",
    };
  }

  return {
    eyebrow: "STORE FILTERS",
    title: "Shop by category",
    subtitle: "Medicine, healthcare, beauty and wellness filters in one menu.",
    cta: "Store Menu",
  };
}

function getModeIcon(mode: MenuSection) {
  if (mode === "lab") return <FlaskConical size={16} />;
  if (mode === "doctor") return <Stethoscope size={16} />;
  return <Store size={16} />;
}

function collectQuickFilters(items: MegaItem[]) {
  const links: Array<{ label: string; href: string; emoji: string; eyebrow: string }> = [];

  for (const item of items) {
    for (const group of item.groups ?? []) {
      const groupHref = getGroupHref(group);
      const groupName = getGroupName(group);
      if (groupHref && links.length < 4) {
        links.push({ label: groupName, href: groupHref, emoji: getGroupEmoji(groupName), eyebrow: getMainName(item) });
      }

      for (const leaf of group.children ?? []) {
        const leafHref = getLeafHref(leaf);
        const leafName = getLeafName(leaf);
        if (leafHref && links.length < 10) {
          links.push({ label: leafName, href: leafHref, emoji: getChildEmoji(leafName), eyebrow: groupName });
        }
      }

      if (links.length >= 10) return links;
    }
  }

  return links;
}

export default function SectionNavigation({
  mode = "auto",
  dataUrl = "/menu-links.json",
  className = "",
}: SectionNavigationProps) {
  const pathname = usePathname();
  const currentMode = resolveMode(pathname, mode);
  const modeMeta = getModeMeta(currentMode);

  const rootRef = useRef<HTMLElement | null>(null);
  const tabsRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [menuData, setMenuData] =
    useState<MenuData>(EMPTY_MENU);
  const [loading, setLoading] = useState(true);
  const [menuError, setMenuError] =
    useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] =
    useState<string | null>(null);
  const [quickPanel, setQuickPanel] =
    useState<QuickPanel>(null);
  const [activeGroupId, setActiveGroupId] =
    useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] =
    useState(false);
  const [canScrollRight, setCanScrollRight] =
    useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMenu() {
      try {
        setLoading(true);
        setMenuError(null);

        const response = await fetch(dataUrl, {
          cache: "no-store",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Could not load ${dataUrl}. HTTP ${response.status}`,
          );
        }

        const raw: unknown = await response.json();

        if (!isMenuData(raw)) {
          throw new Error(
            "The menu JSON root must be an object.",
          );
        }

        const nextData: MenuData = {
          store: Array.isArray(raw.store)
            ? raw.store
            : [],
          lab: Array.isArray(raw.lab)
            ? raw.lab
            : [],
          doctor: Array.isArray(raw.doctor)
            ? raw.doctor
            : [],
        };

        if (
          nextData.store.length === 0 &&
          nextData.lab.length === 0 &&
          nextData.doctor.length === 0
        ) {
          throw new Error(
            "The JSON loaded, but store, lab and doctor are empty.",
          );
        }

        if (!controller.signal.aborted) {
          setMenuData(nextData);
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "SectionNavigation menu loading error:",
          error,
        );

        if (!controller.signal.aborted) {
          setMenuData(EMPTY_MENU);
          setMenuError(
            error instanceof Error
              ? error.message
              : "Menu data could not be loaded.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadMenu();

    return () => controller.abort();
  }, [dataUrl]);

  const items = useMemo(
    () => getSectionItems(menuData, currentMode),
    [menuData, currentMode],
  );

  const quickFilters = useMemo(
    () => collectQuickFilters(items),
    [items],
  );

  const openItem = useMemo(() => {
    if (!openDropdownId) return null;

    return (
      items.find(
        (item) =>
          getMainDropdownId(item) === openDropdownId,
      ) ?? null
    );
  }, [items, openDropdownId]);

  const groups = useMemo(
    () =>
      (openItem?.groups ?? []).filter(
        (group) =>
          Boolean(getGroupName(group)) &&
          Boolean(getGroupHref(group)),
      ),
    [openItem],
  );

  const activeGroup = useMemo(() => {
    if (groups.length === 0) return null;

    return (
      groups.find(
        (group) =>
          getGroupDropdownId(group) === activeGroupId,
      ) ?? groups[0]
    );
  }, [activeGroupId, groups]);

  const clearCloseTimer = useCallback(() => {
    if (!closeTimerRef.current) return;

    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setOpenDropdownId(null);
    setActiveGroupId(null);
    setQuickPanel(null);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();

    closeTimerRef.current = setTimeout(() => {
      setOpenDropdownId(null);
      setActiveGroupId(null);
      setQuickPanel(null);
    }, CLOSE_DELAY);
  }, [clearCloseTimer]);

  const openMenu = useCallback(
    (item: MegaItem) => {
      clearCloseTimer();

      const itemGroups = (item.groups ?? []).filter(
        (group) => Boolean(getGroupHref(group)),
      );

      if (
        isStaticHome(item) ||
        itemGroups.length === 0
      ) {
        closeMenu();
        return;
      }

      const bestIndex = findBestGroupIndex(
        pathname,
        itemGroups,
      );

      const selected =
        itemGroups[bestIndex] ?? itemGroups[0];

      setQuickPanel(null);
      setOpenDropdownId(getMainDropdownId(item));
      setActiveGroupId(
        selected
          ? getGroupDropdownId(selected)
          : null,
      );
    },
    [
      clearCloseTimer,
      closeMenu,
      pathname,
    ],
  );

  const updateScrollButtons = useCallback(() => {
    const element = tabsRef.current;
    if (!element) return;

    const max =
      element.scrollWidth - element.clientWidth;

    setCanScrollLeft(element.scrollLeft > 2);
    setCanScrollRight(
      element.scrollLeft < max - 2,
    );
  }, []);

  useEffect(() => {
    updateScrollButtons();

    const element = tabsRef.current;
    if (!element) return;

    element.addEventListener(
      "scroll",
      updateScrollButtons,
      { passive: true },
    );
    window.addEventListener(
      "resize",
      updateScrollButtons,
    );

    const observer = new ResizeObserver(
      updateScrollButtons,
    );
    observer.observe(element);

    return () => {
      element.removeEventListener(
        "scroll",
        updateScrollButtons,
      );
      window.removeEventListener(
        "resize",
        updateScrollButtons,
      );
      observer.disconnect();
    };
  }, [items, updateScrollButtons]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(closeMenu);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, currentMode, closeMenu]);

  useEffect(() => {
    function handleOutsideClick(
      event: globalThis.MouseEvent,
    ) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    }

    function handleEscape(
      event: globalThis.KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

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
  }, [closeMenu]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  function scrollTabs(direction: "left" | "right") {
    tabsRef.current?.scrollBy({
      left: direction === "left" ? -340 : 340,
      behavior: "smooth",
    });
  }

  function handleTopClick(
    event: MouseEvent<HTMLAnchorElement>,
    item: MegaItem,
  ) {
    const hasDropdown =
      (item.groups?.length ?? 0) > 0;

    if (!hasDropdown) {
      closeMenu();
      return;
    }

    const touchDevice =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none)").matches;

    const dropdownId = getMainDropdownId(item);

    if (
      touchDevice &&
      openDropdownId !== dropdownId
    ) {
      event.preventDefault();
      openMenu(item);
    }
  }

  function handleTopKeyDown(
    event: KeyboardEvent<HTMLAnchorElement>,
    item: MegaItem,
  ) {
    const hasDropdown =
      (item.groups?.length ?? 0) > 0;

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
  }

  function handleGroupKeyDown(
    event: KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) {
    if (event.key === "Escape") {
      closeMenu();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      rootRef.current
        ?.querySelector<HTMLAnchorElement>(
          "[data-mega-child='true']",
        )
        ?.focus();
      return;
    }

    if (
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp"
    ) {
      return;
    }

    event.preventDefault();

    const nextIndex =
      event.key === "ArrowDown"
        ? Math.min(index + 1, groups.length - 1)
        : Math.max(index - 1, 0);

    const nextGroup = groups[nextIndex];
    if (!nextGroup) return;

    const nextId = getGroupDropdownId(nextGroup);
    setActiveGroupId(nextId);

    document
      .getElementById(getGroupLinkId(nextGroup))
      ?.focus();
  }

  if (loading) {
    return (
      <section
        className={`${styles.navigation} ${className}`}
        aria-label={getNavigationLabel(currentMode)}
      >
        <div className={styles.shell}>
          <div className={styles.status}>
            Loading menu...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      className={`${styles.navigation} ${className}`}
      aria-label={getNavigationLabel(currentMode)}
      onMouseEnter={clearCloseTimer}
      onMouseLeave={scheduleClose}
    >
      <div className={styles.shell}>
        {menuError ? (
          <div className={styles.error} role="alert">
            <strong>Menu error:</strong> {menuError}
            <span>
              Put the JSON file at{" "}
              <code>public/menu-links.json</code>.
            </span>
          </div>
        ) : null}

        <div className={styles.toolbar}>
          <div className={styles.toolbarTitle}>
            <span>{modeMeta.eyebrow}</span>
            <strong>{getModeIcon(currentMode)} {modeMeta.title}</strong>
            <small>{modeMeta.subtitle}</small>
          </div>

          <div className={styles.quickActions}>
            <button
              type="button"
              className={quickPanel === "browse" ? styles.quickActive : ""}
              aria-expanded={quickPanel === "browse"}
              onClick={() => {
                clearCloseTimer();
                setOpenDropdownId(null);
                setActiveGroupId(null);
                setQuickPanel((current) => current === "browse" ? null : "browse");
              }}
            >
              <SlidersHorizontal size={15} /> {modeMeta.cta}
              <ChevronDown size={13} />
            </button>
            <button
              type="button"
              className={quickPanel === "filters" ? styles.quickActive : ""}
              aria-expanded={quickPanel === "filters"}
              onClick={() => {
                clearCloseTimer();
                setOpenDropdownId(null);
                setActiveGroupId(null);
                setQuickPanel((current) => current === "filters" ? null : "filters");
              }}
            >
              <Filter size={15} /> Wise filters
              <ChevronDown size={13} />
            </button>
          </div>
        </div>

        {quickPanel ? (
          <div className={styles.quickPanel} role="menu" aria-label={`${modeMeta.title} dropdown`}>
            {quickPanel === "browse" ? (
              <>
                <div className={styles.quickPanelHero}>
                  <BadgePercent size={18} />
                  <strong>{currentMode === "lab" ? "Lab test menu" : currentMode === "doctor" ? "Doctor care menu" : "Store mega menu"}</strong>
                  <span>Open a main dropdown or jump directly to a high value category.</span>
                </div>
                <div className={styles.quickCardGrid}>
                  {items.slice(0, 8).map((item) => {
                    const name = getMainName(item);
                    const href = getMainHref(item);
                    const dropdownId = getMainDropdownId(item);
                    if (!href) return null;
                    return (
                      <Link key={dropdownId} href={href} role="menuitem" onClick={closeMenu}>
                        <span>{getGroupEmoji(name)}</span>
                        <strong>{name}</strong>
                        <small>{(item.groups ?? []).length} dropdowns</small>
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className={styles.quickPanelHero}>
                  <Zap size={18} />
                  <strong>Popular wise filters</strong>
                  <span>Fast filters from {currentMode === "lab" ? "lab tests" : currentMode === "doctor" ? "doctor care" : "store categories"}.</span>
                </div>
                <div className={styles.filterGrid}>
                  {quickFilters.map((filter) => (
                    <Link key={`${filter.eyebrow}-${filter.href}`} href={filter.href} role="menuitem" onClick={closeMenu}>
                      <span>{filter.emoji}</span>
                      <strong>{filter.label}</strong>
                      <small>{filter.eyebrow}</small>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null}

        <div className={styles.tabsContainer}>
          {canScrollLeft ? (
            <button
              type="button"
              className={`${styles.scrollButton} ${styles.scrollLeft}`}
              aria-label="Scroll categories left"
              onClick={() => scrollTabs("left")}
            >
              <ChevronLeft size={18} />
            </button>
          ) : null}

          <nav
            ref={tabsRef}
            className={styles.tabs}
            aria-label={getNavigationLabel(currentMode)}
          >
            {items.map((item, index) => {
              const mainName = getMainName(item);
              const mainHref = getMainHref(item);
              const mainLinkId = getMainLinkId(item);
              const dropdownId =
                getMainDropdownId(item);

              if (isStaticHome(item)) {
                return (
                  <span
                    key={mainLinkId || `home-${index}`}
                    id={mainLinkId}
                    className={`${styles.tab} ${styles.homeTab} ${
                      pathname === "/" ? styles.active : ""
                    }`}
                    aria-current={
                      pathname === "/" ? "page" : undefined
                    }
                  >
                    <Home size={14} />
                    <span>{mainName}</span>
                    <i aria-hidden="true" />
                  </span>
                );
              }

              if (!mainHref) return null;

              const hasDropdown =
                (item.groups?.length ?? 0) > 0;
              const routeActive = isRouteActive(
                pathname,
                mainHref,
              );
              const open =
                openDropdownId === dropdownId;

              return (
                <Link
                  key={mainLinkId}
                  id={mainLinkId}
                  href={mainHref}
                  target={
                    isExternalHref(mainHref)
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    isExternalHref(mainHref)
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className={[
                    styles.tab,
                    routeActive ? styles.active : "",
                    open ? styles.open : "",
                  ].join(" ")}
                  data-main-link-id={mainLinkId}
                  data-main-link-code={
                    item.mainLinkCode ||
                    item.linkCode ||
                    undefined
                  }
                  data-main-dropdown-id={
                    hasDropdown
                      ? dropdownId
                      : undefined
                  }
                  data-main-dropdown-code={
                    hasDropdown
                      ? item.mainDropdownCode ||
                        item.dropdownCode ||
                        undefined
                      : undefined
                  }
                  aria-current={
                    routeActive ? "page" : undefined
                  }
                  aria-haspopup={
                    hasDropdown ? "menu" : undefined
                  }
                  aria-expanded={
                    hasDropdown ? open : undefined
                  }
                  aria-controls={
                    hasDropdown
                      ? `${dropdownId}-panel`
                      : undefined
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
                  <span>{mainName}</span>

                  {hasDropdown ? (
                    <ChevronDown
                      size={13}
                      className={styles.chevron}
                      aria-hidden="true"
                    />
                  ) : null}

                  <i aria-hidden="true" />
                </Link>
              );
            })}
          </nav>

          {canScrollRight ? (
            <button
              type="button"
              className={`${styles.scrollButton} ${styles.scrollRight}`}
              aria-label="Scroll categories right"
              onClick={() => scrollTabs("right")}
            >
              <ChevronRight size={18} />
            </button>
          ) : null}
        </div>
      </div>

      {openItem && groups.length > 0 ? (
        <div
          className={styles.overlay}
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
        >
          <div
            id={`${getMainDropdownId(openItem)}-panel`}
            className={styles.megaMenu}
            role="menu"
            aria-label={`${getMainName(openItem)} categories`}
          >
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Close category menu"
              onClick={closeMenu}
            >
              <X size={18} />
            </button>

            <aside className={styles.groups}>
              <Link
                href={getMainHref(openItem) || "/"}
                className={styles.allLink}
                onClick={closeMenu}
              >
                <span className={styles.icon}>
                  {getGroupEmoji(getMainName(openItem))}
                </span>
                <span>
                  All {getMainName(openItem)}
                </span>
              </Link>

              {groups.map((group, index) => {
                const groupName =
                  getGroupName(group);
                const groupHref =
                  getGroupHref(group);
                const dropdownId =
                  getGroupDropdownId(group);
                const groupLinkId =
                  getGroupLinkId(group);
                const selected =
                  activeGroupId === dropdownId;
                const routeActive = isRouteActive(
                  pathname,
                  groupHref,
                );

                if (!groupHref) return null;

                return (
                  <Link
                    key={dropdownId}
                    id={groupLinkId}
                    href={groupHref}
                    role="menuitem"
                    className={[
                      styles.groupLink,
                      selected ? styles.selected : "",
                      routeActive
                        ? styles.routeActive
                        : "",
                    ].join(" ")}
                    data-sub-dropdown-id={dropdownId}
                    data-sub-dropdown-code={
                      group.subDropdownCode ||
                      group.dropdownCode ||
                      undefined
                    }
                    data-sub-dropdown-link-id={
                      groupLinkId
                    }
                    data-sub-dropdown-link-code={
                      group.subDropdownLinkCode ||
                      group.linkCode ||
                      undefined
                    }
                    aria-current={
                      routeActive ? "page" : undefined
                    }
                    onMouseEnter={() => {
                      clearCloseTimer();
                      setActiveGroupId(dropdownId);
                    }}
                    onFocus={() =>
                      setActiveGroupId(dropdownId)
                    }
                    onClick={closeMenu}
                    onKeyDown={(event) =>
                      handleGroupKeyDown(event, index)
                    }
                  >
                    <span className={styles.icon}>
                      {getGroupEmoji(groupName)}
                    </span>
                    <span>{groupName}</span>
                    <ChevronRight
                      size={16}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </aside>

            <section className={styles.children}>
              <header className={styles.childHeader}>
                <div>
                  <span>Explore</span>
                  <h3>
                    {activeGroup
                      ? getGroupName(activeGroup)
                      : getMainName(openItem)}
                  </h3>
                </div>

                {activeGroup &&
                getGroupHref(activeGroup) ? (
                  <Link
                    href={
                      getGroupHref(activeGroup) || "/"
                    }
                    onClick={closeMenu}
                  >
                    View all
                    <ChevronRight size={14} />
                  </Link>
                ) : null}
              </header>

              {activeGroup?.children?.length ? (
                <div className={styles.childGrid}>
                  {activeGroup.children.map((leaf) => {
                    const leafName =
                      getLeafName(leaf);
                    const leafHref =
                      getLeafHref(leaf);
                    const leafId = getLeafId(leaf);

                    if (!leafHref) return null;

                    const active = isRouteActive(
                      pathname,
                      leafHref,
                    );

                    return (
                      <Link
                        key={leafId}
                        id={leafId}
                        href={leafHref}
                        data-mega-child="true"
                        data-sub-link-id={leafId}
                        data-sub-link-code={
                          leaf.subLinkCode ||
                          leaf.linkCode ||
                          undefined
                        }
                        data-parent-sub-dropdown-id={
                          getGroupDropdownId(activeGroup)
                        }
                        role="menuitem"
                        className={
                          active ? styles.activeChild : ""
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
                        <span className={styles.childIcon}>
                          {getChildEmoji(leafName)}
                        </span>
                        <span>{leafName}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.empty}>
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

function getGroupEmoji(label: string) {
  const value = label.toLowerCase();

  if (value.includes("medicine")) return "💊";
  if (value.includes("health")) return "🩺";
  if (value.includes("skin")) return "🧴";
  if (value.includes("hair")) return "💇";
  if (value.includes("beauty")) return "💄";
  if (value.includes("baby")) return "👶";
  if (value.includes("herbal")) return "🌿";
  if (value.includes("home")) return "🏠";
  if (value.includes("supplement")) return "⚕️";
  if (value.includes("food")) return "🥗";
  if (value.includes("pet")) return "🐾";
  if (value.includes("veterinary")) return "🐾";
  if (value.includes("lab")) return "🧪";
  if (value.includes("doctor")) return "🩺";
  if (value.includes("women")) return "🌷";
  if (value.includes("men")) return "🧔";

  return "🛍️";
}

function getChildEmoji(label: string) {
  const value = label.toLowerCase();

  if (value.includes("tablet")) return "💊";
  if (value.includes("capsule")) return "💊";
  if (value.includes("syrup")) return "🥄";
  if (value.includes("drop")) return "💧";
  if (value.includes("spray")) return "🌫️";
  if (value.includes("inhaler")) return "🫁";
  if (value.includes("injection")) return "💉";
  if (value.includes("test")) return "🧪";
  if (value.includes("heart")) return "❤️";
  if (value.includes("skin")) return "🧴";
  if (value.includes("hair")) return "💇";
  if (value.includes("baby")) return "👶";
  if (value.includes("food")) return "🥗";
  if (value.includes("pet")) return "🐾";
  if (value.includes("package")) return "📦";
  if (value.includes("offer")) return "🏷️";

  return "🛍️";
}
