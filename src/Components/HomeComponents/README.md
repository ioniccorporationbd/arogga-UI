# HomeComponents — 20 Product Sections

This folder contains 20 independent home-page product section components. Each component renders one section and requests at least 20 product cards from `/public/data.json`.

## Usage

Import the combined component:

```tsx
import { AllHomeProductSections } from "@/components/HomeComponents";

export default function HomePage() {
  return <AllHomeProductSections />;
}
```

Or import individual sections:

```tsx
import { BestSellingProducts, FlashSale } from "@/components/HomeComponents";
```

## Data rules

- Reads `/data.json` from the public directory.
- Supports the nested product structure (`brand.name`, `pricing.regularPrice`, `media.featuredImage.url`, etc.).
- Shows active/public products.
- Each section uses a keyword filter and falls back to all catalog products when no section-specific match exists.
- Each section displays a minimum of 20 cards. When fewer than 20 matching products exist, available products repeat to complete the row.
- Cards remain in one horizontal row with scrolling and arrow navigation.
