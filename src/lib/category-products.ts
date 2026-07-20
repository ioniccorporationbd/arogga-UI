import "server-only";

import menuLinks from "../../public/menu-links.json";

import type { EcommerceProduct } from "@/lib/products";
import { getServerProducts } from "@/lib/server-products";

export type CategoryQuery = {
  page?: string;
  sort?: string;
  brand?: string;
  min?: string;
  max?: string;
  inStock?: string;
  q?: string;
};

export type CategoryResult = {
  title: string;

  breadcrumb: {
    label: string;
    href?: string;
  }[];

  products: EcommerceProduct[];

  total: number;
  page: number;
  pageSize: number;
  pageCount: number;

  brands: {
    name: string;
    count: number;
  }[];

  priceRange: {
    min: number;
    max: number;
  };
};

type MenuNode = {
  label: string;
  href?: string;
  groups?: MenuNode[];
  children?: MenuNode[];
};

/*
 * 100 product cards per page.
 */
const PAGE_SIZE = 100;

function normalize(value: string) {
  return decodeURIComponent(value)
    .toLowerCase()
    .replace(/\?.*$/, "")
    .replace(/\d+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function words(value: string) {
  return normalize(value)
    .split(/\s+/)
    .filter((word) => word.length > 1);
}

function flattenMenu(
  nodes: MenuNode[],
  parents: MenuNode[] = []
): {
  node: MenuNode;
  parents: MenuNode[];
}[] {
  return nodes.flatMap((node) => {
    const nested = [
      ...(node.groups ?? []),
      ...(node.children ?? []),
    ];

    return [
      {
        node,
        parents,
      },
      ...flattenMenu(nested, [...parents, node]),
    ];
  });
}

const allMenuNodes = flattenMenu([
  ...((menuLinks as { store?: MenuNode[] }).store ?? []),
  ...((menuLinks as { lab?: MenuNode[] }).lab ?? []),
  ...((menuLinks as { doctor?: MenuNode[] })
    .doctor ?? []),
]);

function resolveMenu(pathname: string) {
  const exact = allMenuNodes.find(
    ({ node }) => node.href === pathname
  );

  if (exact) {
    return exact;
  }

  const normalizedPath = normalize(pathname);

  return allMenuNodes
    .filter(({ node }) => node.href)
    .sort(
      (a, b) =>
        (b.node.href?.length ?? 0) -
        (a.node.href?.length ?? 0)
    )
    .find(({ node }) =>
      normalizedPath.includes(
        normalize(node.href ?? "")
      )
    );
}

function productSearchText(
  product: EcommerceProduct
) {
  return normalize(
    [
      product.name,
      product.shortName,
      product.subtitle,

      product.brand?.name,
      product.brand?.manufacturer,

      product.taxonomy?.department?.name,
      product.taxonomy?.department?.slug,

      product.taxonomy?.category?.name,
      product.taxonomy?.category?.slug,

      product.taxonomy?.subCategory?.name,
      product.taxonomy?.subCategory?.slug,

      ...(product.taxonomy?.tags ?? []),

      ...(product.taxonomy?.collections ?? []).flatMap(
        (collection) => [
          collection.name,
          collection.slug,
        ]
      ),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function currentPrice(
  product: EcommerceProduct
) {
  return (
    product.pricing.salePrice ??
    product.pricing.regularPrice
  );
}

export async function getCategoryProducts(
  pathSegments: string[],
  query: CategoryQuery
): Promise<CategoryResult> {
  const pathname = `/${pathSegments.join("/")}`;

  const menuMatch = resolveMenu(pathname);

  const fallbackTitle =
    pathSegments
      .at(-1)
      ?.replace(/-/g, " ") || "Products";

  const title =
    menuMatch?.node.label ||
    fallbackTitle.replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );

  const routeTerms = new Set([
    ...pathSegments.flatMap(words),
    ...words(title),

    ...(menuMatch?.parents ?? []).flatMap((node) =>
      words(node.label)
    ),
  ]);

  const ignoredTerms = new Set([
    "category",
    "store",
    "shop",
    "products",
    "product",
    "all",
    "home",
  ]);

  const matchTerms = [...routeTerms].filter(
    (term) => !ignoredTerms.has(term)
  );

  const allProducts = await getServerProducts();

  /*
   * URLs such as /all-products will show every product,
   * because "all" and "products" are ignored terms.
   */
  let filteredProducts = allProducts.filter(
    (product) => {
      if (
        product.status !== "active" ||
        product.visibility !== "public"
      ) {
        return false;
      }

      if (!matchTerms.length) {
        return true;
      }

      const text = productSearchText(product);

      const matchedTermCount = matchTerms.filter(
        (term) => text.includes(term)
      ).length;

      return (
        matchedTermCount >=
        Math.min(2, matchTerms.length)
      );
    }
  );

  /*
   * Fallback matching.
   */
  if (
    !filteredProducts.length &&
    matchTerms.length
  ) {
    filteredProducts = allProducts.filter(
      (product) => {
        const text = productSearchText(product);

        return matchTerms.some((term) =>
          text.includes(term)
        );
      }
    );
  }

  /*
   * Product search.
   */
  const search = normalize(query.q ?? "");

  if (search) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        productSearchText(product).includes(search)
    );
  }

  /*
   * Brand filter.
   */
  if (query.brand) {
    const selectedBrand = normalize(query.brand);

    filteredProducts = filteredProducts.filter(
      (product) =>
        normalize(product.brand?.name ?? "") ===
        selectedBrand
    );
  }

  /*
   * Price filter.
   */
  const minimumPrice = Number(query.min);
  const maximumPrice = Number(query.max);

  if (Number.isFinite(minimumPrice)) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        currentPrice(product) >= minimumPrice
    );
  }

  if (
    Number.isFinite(maximumPrice) &&
    maximumPrice > 0
  ) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        currentPrice(product) <= maximumPrice
    );
  }

  /*
   * Stock filter.
   */
  if (query.inStock === "1") {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.inventory.availableQuantity > 0
    );
  }

  /*
   * Generate brand filter list.
   */
  const brandMap = new Map<string, number>();

  for (const product of filteredProducts) {
    const brandName =
      product.brand?.name || "Other";

    brandMap.set(
      brandName,
      (brandMap.get(brandName) ?? 0) + 1
    );
  }

  /*
   * Generate category price range.
   */
  const prices = filteredProducts.map(
    currentPrice
  );

  const priceRange = {
    min: prices.length
      ? Math.floor(Math.min(...prices))
      : 0,

    max: prices.length
      ? Math.ceil(Math.max(...prices))
      : 0,
  };

  /*
   * Sorting.
   */
  switch (query.sort) {
    case "price-low":
      filteredProducts.sort(
        (first, second) =>
          currentPrice(first) -
          currentPrice(second)
      );
      break;

    case "price-high":
      filteredProducts.sort(
        (first, second) =>
          currentPrice(second) -
          currentPrice(first)
      );
      break;

    case "rating":
      filteredProducts.sort(
        (first, second) =>
          (second.ratings.average ?? 0) -
          (first.ratings.average ?? 0)
      );
      break;

    case "discount":
      filteredProducts.sort(
        (first, second) =>
          (second.pricing.discount
            ?.percentage ?? 0) -
          (first.pricing.discount
            ?.percentage ?? 0)
      );
      break;

    default:
      filteredProducts.sort(
        (first, second) =>
          (second.ratings.count ?? 0) -
          (first.ratings.count ?? 0)
      );
  }

  /*
   * Pagination.
   */
  const total = filteredProducts.length;

  const pageCount = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE)
  );

  const requestedPage = Number(query.page) || 1;

  const page = Math.min(
    Math.max(1, requestedPage),
    pageCount
  );

  const startIndex =
    (page - 1) * PAGE_SIZE;

  const paginatedProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );

  /*
   * Breadcrumb.
   */
  const breadcrumb = [
    {
      label: "Home",
      href: "/",
    },

    ...(menuMatch?.parents ?? [])
      .filter((node) => node.label !== "Home")
      .map((node) => ({
        label: node.label,
        href: node.href,
      })),

    {
      label: title,
    },
  ];

  return {
    title,
    breadcrumb,

    products: paginatedProducts,

    total,
    page,
    pageSize: PAGE_SIZE,
    pageCount,

    brands: [...brandMap.entries()]
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort(
        (first, second) =>
          second.count - first.count
      )
      .slice(0, 30),

    priceRange,
  };
}