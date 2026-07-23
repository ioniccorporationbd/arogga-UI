Updated: 2026-07-23

Branch: test-branch

# Migration Guide

## Local to remote
1. Keep UI components unchanged.
2. Implement remote repository classes under `src/repositories/remote`.
3. Set `DATA_SOURCE=api`.
4. Configure `API_BASE_URL`.
5. Replace local simulated payment with provider adapters and signed webhooks.
6. Move orders/inbox/addresses/cart/wishlist to authenticated backend APIs.

## Catalog
Use card-sized listing responses for grids and full product records only for details/editing.
