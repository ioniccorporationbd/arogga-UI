# Store page component refactor

The Store page keeps its original visual design. The product area was separated into reusable files:

- `src/app/store/StoreProductSections.tsx` – section and horizontal row layout.
- `src/app/store/components/StoreProductCard.tsx` – the complete Store product card.
- `src/app/store/components/store-product-types.ts` – Store JSON and card types.
- `src/app/store/hooks/useStoreProducts.ts` – `/public/data.json` loading, validation, normalization, loading state, error state, and AbortController cleanup.

The Store loader now follows the same client-side loading technique used by the homepage product components. Product data is requested from `/data.json` (the browser URL for `public/data.json`).

Validation performed before packaging:

- `npm run lint`: 0 errors; existing non-blocking warnings remain elsewhere in the project.
- `npm run build`: successful production build for Home, Store, Lab, Doctor, and product detail routes.
