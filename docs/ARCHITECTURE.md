Updated: 2026-07-23

Branch: test-branch

# Architecture Report

## Current architecture
- Next.js App Router with local-first repositories.
- `DATA_SOURCE=local` by default.
- Server catalog API uses cached product indexes for card responses.
- Product details continue to load full local product data.
- Auth uses HttpOnly session-cookie APIs.
- Cart/wishlist/order/account are local-first and API-ready.

## Repository seam
`src/repositories` contains interface contracts plus local/remote implementations. Remote implementations intentionally remain not configured until a real API exists.

## Final foundations added
- `data/` canonical generated indexes.
- `src/styles/design-tokens.css`.
- `src/components/ui`.
- `src/lib/security`.
- Playwright/Vitest/MSW configs.
