# Independent Lab Test Module

Updated: 2026-07-23

## Scope

The Lab Test module is now a separate local-first healthcare diagnostics ecosystem that does not depend on the Store product catalog.

## Routes

- `/lab`
- `/lab/tests`
- `/lab/tests/[slug]`
- `/lab/diagnostics/[slug]`
- `/lab/cart`

## Local data

- `public/data/lab-tests.json` — 220 local lab tests.
- `public/data/diagnostic-centers.json` — 12 verified diagnostic centers.

## Architecture

- `src/features/lab/domain.ts` — Zod schemas, TypeScript types, filtering/sorting/pagination, cart calculations.
- `src/features/lab/repository.ts` — `LabRepository`, `LocalLabRepository`, `RemoteLabRepository` placeholder.
- `src/features/lab/client.ts` — React Query hooks and local lab cart/wishlist store.
- `src/features/lab/components/LabTestsExperience.tsx` — listing, filters, test cards, lab navigation.

## API-ready endpoints

- `GET /api/lab/tests`
- `GET /api/lab/diagnostics`

Remote mode intentionally remains NotConfigured until a real healthcare backend/API exists.

## Store safety

Store data, routes, product cart, product wishlist, checkout, and account features are not removed. Lab has its own data, cart route, repository, and UI.
