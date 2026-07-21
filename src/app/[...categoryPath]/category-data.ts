import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import type { EcommerceProduct } from "@/lib/products";

type MenuLeaf = {
  label?: string;
  href?: string;
  subLinkName?: string;
  subLinkHref?: string;
};

type MenuGroup = {
  label?: string;
  href?: string;
  subDropdownName?: string;
  subDropdownHref?: string;
  children?: MenuLeaf[];
};

type MenuItem = {
  label?: string;
  href?: string;
  mainDropdownName?: string;
  mainDropdownHref?: string;
  groups?: MenuGroup[];
};

type MenuData = {
  store?: MenuItem[];
  lab?: MenuItem[];
  doctor?: MenuItem[];
};

export type CategoryRoute = {
  label: string;
  href: string;
  parentLabel?: string;
  rootLabel?: string;
  siblings: { label: string; href: string }[];
};

let menuCache: MenuData | null = null;

function normalizeHref(value?: string) {
  const href = value?.trim();
  if (!href) return "";
  return href.startsWith("/") ? href : `/${href}`;
}

function cleanName(...values: Array<string | undefined>) {
  return values.find((value) => value?.trim())?.trim() || "Category";
}

async function getMenuData() {
  if (menuCache) return menuCache;

  const filePath = path.join(process.cwd(), "public", "menu-links.json");
  const raw = await readFile(filePath, "utf8");
  const parsed: unknown = JSON.parse(raw);
  menuCache = parsed && typeof parsed === "object" ? (parsed as MenuData) : {};
  return menuCache;
}

export async function findCategoryRoute(pathname: string): Promise<CategoryRoute | null> {
  const menu = await getMenuData();
  const normalizedPath = normalizeHref(pathname);
  const sections = [menu.store ?? [], menu.lab ?? [], menu.doctor ?? []];

  for (const items of sections) {
    for (const item of items) {
      const itemName = cleanName(item.mainDropdownName, item.label);
      const itemHref = normalizeHref(item.mainDropdownHref || item.href);
      const groups = item.groups ?? [];

      if (itemHref === normalizedPath) {
        return {
          label: itemName,
          href: itemHref,
          rootLabel: itemName,
          siblings: groups
            .map((group) => ({
              label: cleanName(group.subDropdownName, group.label),
              href: normalizeHref(group.subDropdownHref || group.href),
            }))
            .filter((entry) => entry.href),
        };
      }

      for (const group of groups) {
        const groupName = cleanName(group.subDropdownName, group.label);
        const groupHref = normalizeHref(group.subDropdownHref || group.href);
        const children = group.children ?? [];

        if (groupHref === normalizedPath) {
          return {
            label: groupName,
            href: groupHref,
            parentLabel: itemName,
            rootLabel: itemName,
            siblings: children
              .map((child) => ({
                label: cleanName(child.subLinkName, child.label),
                href: normalizeHref(child.subLinkHref || child.href),
              }))
              .filter((entry) => entry.href),
          };
        }

        for (const child of children) {
          const childName = cleanName(child.subLinkName, child.label);
          const childHref = normalizeHref(child.subLinkHref || child.href);

          if (childHref === normalizedPath) {
            return {
              label: childName,
              href: childHref,
              parentLabel: groupName,
              rootLabel: itemName,
              siblings: children
                .map((entry) => ({
                  label: cleanName(entry.subLinkName, entry.label),
                  href: normalizeHref(entry.subLinkHref || entry.href),
                }))
                .filter((entry) => entry.href),
            };
          }
        }
      }
    }
  }

  return null;
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function productSearchText(product: EcommerceProduct) {
  return normalizeSearchText(
    [
      product.name,
      product.shortName,
      product.subtitle,
      product.brand?.name,
      product.taxonomy?.department?.name,
      product.taxonomy?.category?.name,
      product.taxonomy?.subCategory?.name,
      ...(product.taxonomy?.tags ?? []),
      ...(product.taxonomy?.collections ?? []).map((item) => item.name),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function scoreProduct(product: EcommerceProduct, category: CategoryRoute) {
  const search = productSearchText(product);
  const phrases = [category.label, category.parentLabel, category.rootLabel]
    .filter(Boolean)
    .map((value) => normalizeSearchText(value as string));

  let score = 0;
  for (const phrase of phrases) {
    if (!phrase) continue;
    if (search.includes(phrase)) score += 12;
    for (const token of phrase.split(" ").filter((token) => token.length > 2)) {
      if (search.includes(token)) score += 2;
    }
  }

  if (product.status === "active") score += 1;
  if ((product.inventory?.availableQuantity ?? 0) > 0) score += 1;
  return score;
}

export function selectCategoryProducts(
  products: EcommerceProduct[],
  category: CategoryRoute,
  limit = 240,
) {
  const scored = products
    .map((product) => ({ product, score: scoreProduct(product, category) }))
    .sort((a, b) => b.score - a.score || b.product.ratings.count - a.product.ratings.count);

  const matching = scored.filter((entry) => entry.score >= 3);
  const source = matching.length >= 24 ? matching : scored;

  return source.slice(0, limit).map((entry) => entry.product);
}
