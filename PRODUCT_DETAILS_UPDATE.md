# Product details update

- All shared product cards load from `public/tara.json`.
- Product image, title, and ADD button open `/products/[slug]`.
- The product detail page reads the matching product by slug on the server.
- Missing optional content is displayed with safe fallback text.
- The page includes gallery, purchase panel, product description, features, benefits, usage, ingredients, warnings, ratings, product information, FAQ, seller details, and disclaimer.
- Three shared recommendation rows appear at the bottom:
  - Similar Products
  - More from Brand
  - Frequently Bought Together
- Each recommendation row contains 20 products and uses the same shared product card design.
- Store includes the 14 configured product rows.

Validation:
- `npm run lint`: 0 errors (existing optimization warnings remain)
- `npm run build`: successful
