# Unified Product Update

- Product source: `public/tara.json`
- Valid product count: 3,000
- Shared fetch function: `fetchTaraProducts()`
- Shared random selection function: `getRandomProducts()`
- Shared card and row: `src/Components/HomeComponents/ProductSection.tsx`
- Every configured row displays 20 products.
- Home, Store, and Lab use the same card design and data-loading technique.
- Store-specific duplicate product sections were removed from the active Store page.
- Lab uses the same shared rows through `LabProductSections.tsx`.
- Product details read `tara.json` through `src/lib/server-products.ts`.

## Important files

- `public/tara.json`
- `src/Components/HomeComponents/product-data.ts`
- `src/Components/HomeComponents/ProductSection.tsx`
- `src/app/store/StoreProductSections.tsx`
- `src/app/lab/LabProductSections.tsx`
- `src/lib/server-products.ts`
