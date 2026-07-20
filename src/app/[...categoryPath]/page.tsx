import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import CategoryProductCard from "./components/CategoryProductCard";
import {
  getCategoryProducts,
  type CategoryQuery,
} from "@/lib/category-products";

type Props = {
  params: Promise<{
    categoryPath: string[];
  }>;

  searchParams: Promise<CategoryQuery>;
};

const DEFAULT_SORT = "popular";

function getCategoryPath(categoryPath: string[]) {
  return `/${categoryPath
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

function createQueryHref(
  categoryPath: string[],
  currentQuery: CategoryQuery,
  updates: Partial<CategoryQuery>
) {
  const pathname = getCategoryPath(categoryPath);

  const mergedQuery: CategoryQuery = {
    ...currentQuery,
    ...updates,
  };

  const queryParams = new URLSearchParams();

  Object.entries(mergedQuery).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        queryParams.set(key, String(value));
      }
    }
  );

  const queryString = queryParams.toString();

  return queryString
    ? `${pathname}?${queryString}`
    : pathname;
}

function getPaginationPages(
  currentPage: number,
  pageCount: number,
  visiblePages = 7
) {
  const totalVisiblePages = Math.min(
    visiblePages,
    pageCount
  );

  let startPage = Math.max(
    1,
    currentPage - Math.floor(totalVisiblePages / 2)
  );

  let endPage =
    startPage + totalVisiblePages - 1;

  if (endPage > pageCount) {
    endPage = pageCount;

    startPage = Math.max(
      1,
      endPage - totalVisiblePages + 1
    );
  }

  return Array.from(
    {
      length: endPage - startPage + 1,
    },
    (_, index) => startPage + index
  );
}

function hasActiveFilters(query: CategoryQuery) {
  return Boolean(
    query.q ||
      query.brand ||
      query.min ||
      query.max ||
      query.inStock === "1" ||
      (query.sort &&
        query.sort !== DEFAULT_SORT)
  );
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { categoryPath } = await params;
  const query = await searchParams;

  const result = await getCategoryProducts(
    categoryPath,
    query
  );

  return {
    title: `${result.title} | Arogga Store`,

    description: `Shop ${result.title} products online with fast delivery across Bangladesh.`,

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: `${result.title} | Arogga Store`,
      description: `Browse ${result.total.toLocaleString(
        "en-BD"
      )} ${result.title} products.`,
      type: "website",
    },
  };
}

export default async function DynamicCategoryPage({
  params,
  searchParams,
}: Props) {
  const { categoryPath } = await params;
  const query = await searchParams;

  const result = await getCategoryProducts(
    categoryPath,
    query
  );

  const pathname = getCategoryPath(categoryPath);

  const paginationPages = getPaginationPages(
    result.page,
    result.pageCount
  );

  const firstVisibleProduct =
    result.total > 0
      ? (result.page - 1) * result.pageSize + 1
      : 0;

  const lastVisibleProduct = Math.min(
    result.page * result.pageSize,
    result.total
  );

  const activeFilters = hasActiveFilters(query);

  return (
    <main className="category-page-shell">
      <div className="category-page-container">
        <nav
          className="category-breadcrumb"
          aria-label="Breadcrumb"
        >
          {result.breadcrumb.map(
            (item, index) => {
              const isLastItem =
                index ===
                result.breadcrumb.length - 1;

              return (
                <span
                  key={`${item.label}-${index}`}
                  className="category-breadcrumb-item"
                >
                  {item.href && !isLastItem ? (
                    <Link href={item.href}>
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      aria-current={
                        isLastItem
                          ? "page"
                          : undefined
                      }
                    >
                      {item.label}
                    </span>
                  )}

                  {!isLastItem && (
                    <ChevronRight
                      size={14}
                      aria-hidden="true"
                    />
                  )}
                </span>
              );
            }
          )}
        </nav>

        <section className="category-heading-row">
          <div className="category-heading-content">
            <h1>{result.title}</h1>

            <p>
              {result.total.toLocaleString("en-BD")}{" "}
              products found
            </p>
          </div>

          <form
            className="category-search"
            action={pathname}
            method="get"
          >
            <Search
              size={17}
              aria-hidden="true"
            />

            <label
              htmlFor="category-search-input"
              className="sr-only"
            >
              Search products in {result.title}
            </label>

            <input
              id="category-search-input"
              name="q"
              type="search"
              defaultValue={query.q ?? ""}
              placeholder={`Search in ${result.title}`}
              autoComplete="off"
            />

            {query.brand && (
              <input
                type="hidden"
                name="brand"
                value={query.brand}
              />
            )}

            {query.inStock && (
              <input
                type="hidden"
                name="inStock"
                value={query.inStock}
              />
            )}

            {query.min && (
              <input
                type="hidden"
                name="min"
                value={query.min}
              />
            )}

            {query.max && (
              <input
                type="hidden"
                name="max"
                value={query.max}
              />
            )}

            {query.sort && (
              <input
                type="hidden"
                name="sort"
                value={query.sort}
              />
            )}

            <button type="submit">
              Search
            </button>
          </form>
        </section>

        <details className="category-mobile-filter">
          <summary>
            <span>
              <Filter
                size={17}
                aria-hidden="true"
              />

              Filters & sorting
            </span>

            {activeFilters && (
              <span className="category-filter-indicator">
                Active
              </span>
            )}
          </summary>

          <div className="category-mobile-filter-content">
            <div className="category-filter-title">
              <div>
                <SlidersHorizontal
                  size={17}
                  aria-hidden="true"
                />

                <strong>Filters</strong>
              </div>

              {activeFilters && (
                <Link href={pathname}>
                  <X
                    size={15}
                    aria-hidden="true"
                  />

                  Clear all
                </Link>
              )}
            </div>

            <div className="category-filter-block">
              <h3>Availability</h3>

              <Link
                className={
                  query.inStock === "1"
                    ? "is-active"
                    : ""
                }
                href={createQueryHref(
                  categoryPath,
                  query,
                  {
                    inStock:
                      query.inStock === "1"
                        ? ""
                        : "1",
                    page: "1",
                  }
                )}
              >
                <span>In stock only</span>

                {query.inStock === "1" && (
                  <CheckIndicator />
                )}
              </Link>
            </div>

            <div className="category-filter-block">
              <h3>Brands</h3>

              <div className="category-brand-list">
                {result.brands.map((brand) => {
                  const isSelected =
                    query.brand === brand.name;

                  return (
                    <Link
                      key={brand.name}
                      className={
                        isSelected
                          ? "is-active"
                          : ""
                      }
                      href={createQueryHref(
                        categoryPath,
                        query,
                        {
                          brand: isSelected
                            ? ""
                            : brand.name,
                          page: "1",
                        }
                      )}
                    >
                      <span>{brand.name}</span>

                      <small>
                        {brand.count.toLocaleString(
                          "en-BD"
                        )}
                      </small>
                    </Link>
                  );
                })}
              </div>
            </div>

            <PriceFilterForm
              pathname={pathname}
              query={query}
              minimum={result.priceRange.min}
              maximum={result.priceRange.max}
            />

            <SortForm
              query={query}
              pathname={pathname}
            />
          </div>
        </details>

        <div className="category-layout">
          <aside className="category-sidebar">
            <div className="category-filter-title">
              <div>
                <SlidersHorizontal
                  size={17}
                  aria-hidden="true"
                />

                <strong>Filters</strong>
              </div>

              {activeFilters && (
                <Link href={pathname}>
                  Clear
                </Link>
              )}
            </div>

            <div className="category-filter-block">
              <h3>Availability</h3>

              <Link
                className={
                  query.inStock === "1"
                    ? "is-active"
                    : ""
                }
                href={createQueryHref(
                  categoryPath,
                  query,
                  {
                    inStock:
                      query.inStock === "1"
                        ? ""
                        : "1",
                    page: "1",
                  }
                )}
              >
                <span>In stock only</span>

                {query.inStock === "1" && (
                  <CheckIndicator />
                )}
              </Link>
            </div>

            <div className="category-filter-block">
              <h3>Brands</h3>

              <div className="category-brand-list">
                {result.brands.map((brand) => {
                  const isSelected =
                    query.brand === brand.name;

                  return (
                    <Link
                      key={brand.name}
                      className={
                        isSelected
                          ? "is-active"
                          : ""
                      }
                      href={createQueryHref(
                        categoryPath,
                        query,
                        {
                          brand: isSelected
                            ? ""
                            : brand.name,
                          page: "1",
                        }
                      )}
                    >
                      <span>{brand.name}</span>

                      <small>
                        {brand.count.toLocaleString(
                          "en-BD"
                        )}
                      </small>
                    </Link>
                  );
                })}
              </div>
            </div>

            <PriceFilterForm
              pathname={pathname}
              query={query}
              minimum={result.priceRange.min}
              maximum={result.priceRange.max}
            />
          </aside>

          <section className="category-results">
            <div className="category-toolbar">
              <p>
                Showing{" "}
                <strong>
                  {firstVisibleProduct.toLocaleString(
                    "en-BD"
                  )}
                  –
                  {lastVisibleProduct.toLocaleString(
                    "en-BD"
                  )}
                </strong>{" "}
                of{" "}
                <strong>
                  {result.total.toLocaleString(
                    "en-BD"
                  )}
                </strong>
              </p>

              <SortForm
                query={query}
                pathname={pathname}
              />
            </div>

            {activeFilters && (
              <div className="category-active-filters">
                {query.q && (
                  <ActiveFilter
                    label={`Search: ${query.q}`}
                    href={createQueryHref(
                      categoryPath,
                      query,
                      {
                        q: "",
                        page: "1",
                      }
                    )}
                  />
                )}

                {query.brand && (
                  <ActiveFilter
                    label={`Brand: ${query.brand}`}
                    href={createQueryHref(
                      categoryPath,
                      query,
                      {
                        brand: "",
                        page: "1",
                      }
                    )}
                  />
                )}

                {query.inStock === "1" && (
                  <ActiveFilter
                    label="In stock"
                    href={createQueryHref(
                      categoryPath,
                      query,
                      {
                        inStock: "",
                        page: "1",
                      }
                    )}
                  />
                )}

                {(query.min || query.max) && (
                  <ActiveFilter
                    label={`Price: ${
                      query.min ||
                      result.priceRange.min
                    } – ${
                      query.max ||
                      result.priceRange.max
                    }`}
                    href={createQueryHref(
                      categoryPath,
                      query,
                      {
                        min: "",
                        max: "",
                        page: "1",
                      }
                    )}
                  />
                )}

                <Link
                  href={pathname}
                  className="category-clear-all"
                >
                  Clear all
                </Link>
              </div>
            )}

            {result.products.length > 0 ? (
              <div className="category-product-grid">
                {result.products.map(
                  (product) => (
                    <CategoryProductCard
                      key={product.id}
                      product={product}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="category-empty">
                <Search
                  size={34}
                  aria-hidden="true"
                />

                <h2>No matching products</h2>

                <p>
                  Try another category, brand,
                  price range, or search term.
                </p>

                <Link href={pathname}>
                  Clear filters
                </Link>
              </div>
            )}

            {result.pageCount > 1 && (
              <nav
                className="category-pagination"
                aria-label="Product pagination"
              >
                <Link
                  href={createQueryHref(
                    categoryPath,
                    query,
                    {
                      page: String(
                        Math.max(
                          1,
                          result.page - 1
                        )
                      ),
                    }
                  )}
                  className={
                    result.page === 1
                      ? "is-disabled"
                      : ""
                  }
                  aria-disabled={
                    result.page === 1
                  }
                  tabIndex={
                    result.page === 1
                      ? -1
                      : undefined
                  }
                >
                  <ChevronLeft
                    size={16}
                    aria-hidden="true"
                  />

                  <span>Previous</span>
                </Link>

                {paginationPages[0] > 1 && (
                  <>
                    <Link
                      href={createQueryHref(
                        categoryPath,
                        query,
                        {
                          page: "1",
                        }
                      )}
                    >
                      1
                    </Link>

                    {paginationPages[0] > 2 && (
                      <span
                        className="category-pagination-ellipsis"
                        aria-hidden="true"
                      >
                        …
                      </span>
                    )}
                  </>
                )}

                {paginationPages.map((page) => (
                  <Link
                    key={page}
                    className={
                      page === result.page
                        ? "is-current"
                        : ""
                    }
                    href={createQueryHref(
                      categoryPath,
                      query,
                      {
                        page: String(page),
                      }
                    )}
                    aria-current={
                      page === result.page
                        ? "page"
                        : undefined
                    }
                  >
                    {page}
                  </Link>
                ))}

                {paginationPages[
                  paginationPages.length - 1
                ] < result.pageCount && (
                  <>
                    {paginationPages[
                      paginationPages.length - 1
                    ] <
                      result.pageCount - 1 && (
                      <span
                        className="category-pagination-ellipsis"
                        aria-hidden="true"
                      >
                        …
                      </span>
                    )}

                    <Link
                      href={createQueryHref(
                        categoryPath,
                        query,
                        {
                          page: String(
                            result.pageCount
                          ),
                        }
                      )}
                    >
                      {result.pageCount}
                    </Link>
                  </>
                )}

                <Link
                  href={createQueryHref(
                    categoryPath,
                    query,
                    {
                      page: String(
                        Math.min(
                          result.pageCount,
                          result.page + 1
                        )
                      ),
                    }
                  )}
                  className={
                    result.page ===
                    result.pageCount
                      ? "is-disabled"
                      : ""
                  }
                  aria-disabled={
                    result.page ===
                    result.pageCount
                  }
                  tabIndex={
                    result.page ===
                    result.pageCount
                      ? -1
                      : undefined
                  }
                >
                  <span>Next</span>

                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                  />
                </Link>
              </nav>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function PriceFilterForm({
  pathname,
  query,
  minimum,
  maximum,
}: {
  pathname: string;
  query: CategoryQuery;
  minimum: number;
  maximum: number;
}) {
  return (
    <form
      className="category-price-filter"
      action={pathname}
      method="get"
    >
      <h3>Price range</h3>

      <div>
        <label>
          <span className="sr-only">
            Minimum price
          </span>

          <input
            name="min"
            type="number"
            min="0"
            step="1"
            placeholder={String(minimum)}
            defaultValue={query.min ?? ""}
          />
        </label>

        <span aria-hidden="true">–</span>

        <label>
          <span className="sr-only">
            Maximum price
          </span>

          <input
            name="max"
            type="number"
            min="0"
            step="1"
            placeholder={String(maximum)}
            defaultValue={query.max ?? ""}
          />
        </label>
      </div>

      {query.q && (
        <input
          type="hidden"
          name="q"
          value={query.q}
        />
      )}

      {query.brand && (
        <input
          type="hidden"
          name="brand"
          value={query.brand}
        />
      )}

      {query.inStock && (
        <input
          type="hidden"
          name="inStock"
          value={query.inStock}
        />
      )}

      {query.sort && (
        <input
          type="hidden"
          name="sort"
          value={query.sort}
        />
      )}

      <input
        type="hidden"
        name="page"
        value="1"
      />

      <button type="submit">
        Apply price
      </button>
    </form>
  );
}

function SortForm({
  query,
  pathname,
}: {
  query: CategoryQuery;
  pathname: string;
}) {
  return (
    <form
      className="category-sort-form"
      action={pathname}
      method="get"
    >
      <label htmlFor="category-sort">
        <span className="sr-only">
          Sort products
        </span>

        <select
          id="category-sort"
          name="sort"
          defaultValue={
            query.sort ?? DEFAULT_SORT
          }
        >
          <option value="popular">
            Most popular
          </option>

          <option value="price-low">
            Price: low to high
          </option>

          <option value="price-high">
            Price: high to low
          </option>

          <option value="rating">
            Top rated
          </option>

          <option value="discount">
            Biggest discount
          </option>
        </select>
      </label>

      {query.q && (
        <input
          type="hidden"
          name="q"
          value={query.q}
        />
      )}

      {query.brand && (
        <input
          type="hidden"
          name="brand"
          value={query.brand}
        />
      )}

      {query.inStock && (
        <input
          type="hidden"
          name="inStock"
          value={query.inStock}
        />
      )}

      {query.min && (
        <input
          type="hidden"
          name="min"
          value={query.min}
        />
      )}

      {query.max && (
        <input
          type="hidden"
          name="max"
          value={query.max}
        />
      )}

      <input
        type="hidden"
        name="page"
        value="1"
      />

      <button type="submit">
        Sort
      </button>
    </form>
  );
}

function ActiveFilter({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="category-active-filter"
    >
      <span>{label}</span>

      <X
        size={13}
        aria-hidden="true"
      />
    </Link>
  );
}

function CheckIndicator() {
  return (
    <span
      className="category-check-indicator"
      aria-hidden="true"
    >
      ✓
    </span>
  );
}