# Architecture

## Current mode

Arogga UI is a Next.js 16 App Router application that currently runs from local JSON/browser state while preserving Arogga-style UI. The architecture added in Part 1 introduces a repository boundary so UI and feature modules can move from local data to API-backed data without rewriting components.

## Repository pattern

Repositories live under `src/repositories/`:

- `interfaces/` defines contracts for auth, catalog, cart, wishlist, orders, profile, addresses and notifications.
- `local/` preserves current local behavior using JSON APIs and browser storage where needed.
- `remote/` exposes matching adapter classes that throw `NotConfiguredError` until real APIs exist.
- `index.ts` selects implementations using `DATA_SOURCE`.

```env
DATA_SOURCE=local
API_BASE_URL=https://api.example.com
```

## Decisions

- Local app remains functional; no database/payment/SMS claims are faked.
- Product list/search can use lightweight server-side indexes instead of loading the full catalog in the browser.
- Auth has HttpOnly-cookie-compatible endpoints even though the OTP provider is still demo/local.
- Canonical account/product routes are defined while legacy routes redirect for compatibility.

## Production-ready vs simulated

Production-ready foundation: route/API shape, repository seam, typed domain contracts, catalog index cache, SEO/error foundations.

Simulated/local-only: SMS OTP delivery, payments, checkout authority, order persistence, profile persistence, notification source, ERP/Frappe sync.
