# Updated Home Components

All product-based home components now use the nested `public/data.json` model through shared files:

- `ProductSection.tsx`
- `product-data.ts`

Each product section renders at least 20 cards in one horizontal row. When the JSON contains fewer than 20 products, available products are repeated visually to preserve the requested minimum card count. Cart state uses the real product ID, so repeated cards represent the same cart item.

Expected data fields include:

- `name`
- `brand.name`
- `taxonomy.category.name` / `taxonomy.subCategory.name`
- `pricing.regularPrice` / `pricing.salePrice`
- `inventory.availableQuantity`
- `media.featuredImage.url`
- `ratings.average`
- `shipping.delivery`
- `urls.local`

Place the folder in your components directory and keep product data at `public/data.json`.
