Updated: 2026-07-23

Branch: test-branch

# Local Data Guide

Fully local features:
- Catalog indexes and product detail records generated from `public/data.json`.
- Product listing/search/filter/sort via `/api/catalog/products`.
- Cart and wishlist local persistence.
- Account drawer, inbox, addresses, local orders.
- Local checkout and local simulated payment.

Local data paths:
```text
data/products/
data/products-index.json
data/search-index.json
data/categories.json
data/brands.json
data/navigation.json
public/data.json
public/data/*.json
```

Browser storage is used only for local demo cart/wishlist/account/order state, not auth truth.
