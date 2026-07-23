# Local Data Mode

`DATA_SOURCE=local` is the default and keeps the current application usable without external services.

## Product data

- Full legacy catalog: `public/data.json`
- Backward-compatible full records: `public/data/products.json`
- Lightweight list index: `public/data/products-index.json`
- Search index: `public/data/search-index.json`
- Category summaries: `public/data/categories.json`
- Brand summaries: `public/data/brands.json`

The `JsonProductRepository` uses server-side helpers so list/search features can avoid downloading the entire catalog.

## Browser state

Cart, wishlist, profile and local orders may still use `localStorage` in local mode. Those reads should be contained behind context/repository modules as pages are refactored.

## Auth

Development auth uses:

```text
Mobile: 01712345678
OTP: 123456
```

The API sets HttpOnly cookies to match the production session shape, but a real OTP provider/session store must replace demo behavior before production.
