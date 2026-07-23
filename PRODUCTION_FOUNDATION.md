# Arogga Production Foundation Notes

This repository is being upgraded in safe, scoped production phases. The current phase adds backend-ready foundations without removing existing UI/business behavior.

## Architecture direction

```text
src/
├── app/                 # Next.js App Router routes and API handlers
├── Components/          # Existing visual/client components, preserved for compatibility
├── context/             # Small client state modules: auth, cart, wishlist, query providers
├── lib/                 # Server/client utilities, product normalization and catalog querying
└── app/api/             # Server-only API boundaries for auth, catalog, orders, profile
```

Future refactors can move `src/Components/*` into lowercase feature folders (`components/navbar`, `components/cart`, `features/catalog`, etc.) incrementally. Do not do a big-bang rename unless imports and route coverage are automated.

## Current API list

### Auth

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/auth/request-otp` | Validate Bangladesh mobile and issue demo OTP challenge with rate limit |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit OTP and set HttpOnly session cookie |
| `POST` | `/api/auth/logout` | Clear auth and OTP cookies |
| `GET` | `/api/auth/session` | Read current HttpOnly session without exposing cookie |
| `DELETE` | `/api/auth/session` | Backward-compatible session clear |

Development OTP: `123456`. Production must replace the demo OTP check with an SMS provider adapter and signed/encrypted session storage.

### Catalog

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/catalog/products` | Server-side filtered, sorted, paginated lightweight product list |
| `GET` | `/api/catalog/suggest` | Lightweight search suggestions |
| `GET` | `/api/products/search` | Existing search API, preserved |

## Catalog data files

| File | Purpose |
|---|---|
| `public/data/products.json` | Backward-compatible full product records |
| `public/data/products-index.json` | Lightweight list/filter/sort records |
| `public/data/search-index.json` | Minimal search/autocomplete records |
| `public/data/categories.json` | Category summary records |
| `public/data/brands.json` | Brand summary records |

Existing `public/data.json` remains intact so old routes keep working.

## Production notes

- Keep trusted order totals, discounts, tax, shipping, stock and payment status on the server only.
- Replace demo auth session with signed server/session-store implementation before production.
- Add CSRF protection for unsafe methods before accepting live payments/orders.
- Add payment provider webhook verification and idempotency keys before production payments.
- Move static JSON to ERPNext/Frappe/API/database once the catalog grows beyond development scale.
- Keep search adapter boundary ready for Typesense, Meilisearch, Algolia, or OpenSearch.

## Commands

```bash
npm install
npm run lint -- --quiet
npm run build
npm run dev
```

## Important routes

```text
/
/store
/search?q=medicine
/category/[slug]
/brand/[slug]
/product/[slug]
/products/[slug]
/cart
/checkout
/orders
/wishlist
/inbox
/profile
/profile/orders
/profile/inbox
/profile/wishlist
/profile/addresses
/profile/patients
/profile/prescriptions
/profile/reviews
/profile/offers
```
