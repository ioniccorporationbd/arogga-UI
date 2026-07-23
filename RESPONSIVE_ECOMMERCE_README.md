# Arogga UI Responsive E-commerce System

This file documents the complete responsive standard applied to the current Arogga UI project. The target experience is a healthcare e-commerce marketplace that remains usable, readable, touch-friendly, keyboard-friendly, and visually balanced from **320px up to 3840px**.

## 1. Tech Stack in This Project

| Requirement | Project status |
|---|---|
| Next.js App Router | Implemented (`src/app`) |
| TypeScript | Implemented |
| Tailwind CSS | Installed/imported via Tailwind v4 (`src/app/globals.css`) |
| shadcn/ui | Design-compatible patterns documented; package/components are not currently installed in repo |
| Lucide React icons | Implemented |
| TanStack Query | Implemented in `AppProviders` + profile hooks |
| Zustand | Implemented for profile UI store and existing state flows |
| React Hook Form | Installed and used in profile-ready form architecture |
| Zod validation | Implemented in `src/lib/validators.ts` |
| Framer Motion | Installed and used in profile dashboard |
| Swiper | Implemented for banners/product sliders |
| Axios / typed API client | Implemented in `src/lib/api-client.ts` |

## 2. Global Responsive Rules

The project now uses a hardening layer in `src/app/globals.css`:

- centered large-screen containers from `1760px` to `1920px` depending on Full HD/2K/4K width;
- fluid gutters with `clamp()`;
- fluid typography variables;
- safe text wrapping for long IDs, phone numbers, addresses, emails, order IDs and URLs;
- `min-width: 0` on layout primitives to prevent flex/grid overflow;
- `overflow-x: clip` / no unwanted horizontal page scroll;
- 44px minimum touch targets for buttons, links, inputs and controls;
- responsive media defaults for images, video, iframe and canvas;
- safe-area support through `env(safe-area-inset-*)`;
- reduced-motion fallback.

## 3. Breakpoint Strategy

| Range | Device class | Layout behavior |
|---|---|---|
| 300px–479px | Small mobile | compact header, single/compact grids, stacked forms/cards, drawer navigation |
| 480px–767px | Large mobile | wider mobile rows, 2–3 card grids where readable |
| 768px–1023px | Tablet | scrollable category nav, two-column sections when safe |
| 1024px–1279px | Small desktop | desktop header/category navigation, multi-column grids |
| 1280px–1599px | Desktop | centered content, 4–6 product columns |
| 1600px–1919px | Large desktop | balanced whitespace, 5-column product targets |
| 1920px+ | Full HD | centered shell, 6-column product targets |
| 2560px | 2K monitor | centered `1840px` content, extra whitespace instead of oversized UI |
| 3840px | 4K monitor | centered `1920px` content, preserved hierarchy and readable line length |

## 4. Shared Layout Components

### `src/context/AppProviders.tsx`

Responsibilities:

- TanStack `QueryClientProvider`;
- Auth provider;
- Wishlist provider;
- Cart provider;
- global login modal;
- Sonner toasts;
- app shell wrapper.

Responsive/accessibility behavior:

- overlay modals remain inside viewport;
- toasts use compact professional style;
- no duplicate layout logic is placed in pages.

### `src/Components/TopNavber.tsx` + `TopNavber.module.css`

Responsive behavior:

| Width | Behavior |
|---|---|
| 300–767px | menu button, compact logo, cart, full-width search row, drawer navigation, low-priority labels hidden |
| 768–1180px | wrapped tablet layout with search row and compact actions |
| 1180–3840px | full desktop layout with search, location, account, orders, inbox, cart and category row; shell stays centered on ultra-wide screens |

Accessibility:

- icon buttons include labels;
- dropdowns use `aria-expanded`;
- Escape closes dropdown/drawer;
- buttons maintain 44px touch area.

### `src/Components/SectionNavigation.tsx` + `SectionNavigation.module.css`

Behavior:

- route-aware Store/Lab/Doctor category mode;
- duplicate Store/Lab/Doctor shortcut pills removed;
- quick dropdowns remain: main menu and wise filters;
- horizontal tabs scroll on narrow devices;
- mega menu becomes a bottom-sheet style overlay on mobile.

## 5. Banner System

### `src/Components/HomeComponents/SharedEcommerceBanner.tsx`

Used by:

- home page: `src/Components/HomeComponents/BasicSiteBanner.tsx`;
- store page: `src/app/store/HeroBannerSlider.tsx`;
- lab page: `src/app/lab/HeroBannerSlider.tsx`.

Rules:

- exactly **7 image-only ecommerce/healthcare banner slides**;
- no visible banner title/subtitle/CTA text;
- optimized `.webp` assets in `public/banners/`;
- first slide loads eagerly, later slides lazy-load;
- Swiper navigation, pagination, keyboard and A11y enabled;
- height uses fluid `clamp()` with max `700px`;
- mobile height is smaller and does not force desktop-only layout.

Banner assets:

```text
public/banners/ecommerce-banner-01.webp
public/banners/ecommerce-banner-02.webp
public/banners/ecommerce-banner-03.webp
public/banners/ecommerce-banner-04.webp
public/banners/ecommerce-banner-05.webp
public/banners/ecommerce-banner-06.webp
public/banners/ecommerce-banner-07.webp
```

## 6. Page Coverage

| Page/Route | Responsive standard |
|---|---|
| `/` homepage | shared image-only banner, responsive homepage sections, no page-wide overflow |
| `/store` | shared banner, category navigation, product/category sections |
| `/lab` | shared banner, lab test sections, package/health concern sections |
| `/doctor` | global header/navigation and existing doctor content under global responsive shell |
| `/[...categoryPath]` | responsive listing shell, filters stack on mobile, adaptive category and product grids |
| `/products/[slug]` | mobile-first product detail order, responsive gallery, sticky mobile action area |
| `/cart` | cart flows through responsive drawer/cards and protected action behavior |
| `/checkout` | global form and layout rules apply; checkout should use one-column mobile and two-column desktop when expanded |
| `/wishlist` | adaptive grid from one column to large desktop grids |
| `/orders` | redirects to `/profile/orders` |
| `/profile` | profile dashboard with responsive sidebar/cards/forms |
| `/profile/orders` | simplified product/status order table/card behavior with mobile hardening |
| `/profile/wishlist` | profile dashboard wrapper + meaningful image records |
| `/profile/inbox` | profile dashboard inbox records with images and action modal |
| `/profile/balance` | profile dashboard section cards/actions |
| `/profile/offers` | profile dashboard offer records/actions |
| `/profile/prescriptions` | profile dashboard prescription records/actions |
| `/profile/addresses` | profile dashboard address records/actions |
| `/profile/patients` | profile dashboard patient records/actions |
| `/profile/reviews` | profile dashboard review records/actions |
| `/profile/reports` | profile dashboard report records/actions |
| `/profile/blog` | profile dashboard blog records/actions |
| `/profile/faq` | profile dashboard FAQ records/actions |
| `/profile/privacy-policy` | profile dashboard policy content/actions |
| `/search` | global shell and input defaults; search results should keep no-overflow behavior |
| `/inbox` | redirects to `/profile/inbox` |
| `/account` and `/account/[section]` | legacy redirects to `/profile` pages |

## 7. Component Coverage

| Component area | Responsive behavior |
|---|---|
| Header | mobile drawer + compact row + full-width mobile search |
| Category navigation | scrollable tabs + dropdowns fitting viewport |
| Hero/banner | 7 image-only Swiper slides, max 700px height |
| Product grid | adaptive `auto-fit/minmax` grids, no fixed desktop-only columns |
| Product cards | clamped names, responsive image containment, reachable add buttons |
| Product details | gallery stacks on mobile, sticky action area, desktop two-column layout |
| Cart drawer | width uses viewport, full-screen on tiny devices, scrollable content |
| Login modal | full-width mobile modal, centered desktop modal, visual pane hidden on mobile |
| Wishlist | adaptive product card grid and wrapping actions |
| Orders | filters stack on mobile, actions wrap, tables guarded with overflow handling |
| Profile dashboard | sidebar becomes non-overlapping mobile layout; cards/forms auto-fit |
| Forms | 44px inputs, wrapping labels/errors, one column on narrow screens |
| Modals/drawers | safe-area padding, viewport max height, scrollable bodies |
| Tables | guarded overflow and mobile card-friendly fallback behavior |

## 8. Product Data Source

The canonical catalog file is:

```text
public/data.json
```

Do not reintroduce duplicate product files:

```text
public/data.json
public/products.json
public/products-index.json
```

## 9. Product Grid Column Targets

| Width | Target product columns |
|---|---|
| 320–339px | 1 column for safest readability |
| 340–575px | 2 compact columns when cards remain readable |
| 576–767px | 2 columns |
| 768–1023px | 3 columns |
| 1024–1279px | 4 columns |
| 1280–1439px | 4 columns |
| 1440–1919px | 5 columns |
| 1920px+ | 6 columns, centered in a max-width shell |
| 2560px / 3840px | keep 6 columns and add whitespace, do not stretch text/UI |

Applied directly to catalog listings and wishlist grids, with global product-grid helpers for shared ecommerce sections.

## 10. Responsive Testing Matrix

Primary widths to test:

```text
320, 360, 390, 414, 576, 768, 834, 1024, 1280,
1440, 1536, 1920, 2560, 3840
```

Also test:

- browser zoom 125%;
- browser zoom 150%;
- browser zoom 200%;
- portrait and landscape;
- keyboard-only navigation;
- long product names;
- long addresses/order IDs;
- empty states;
- missing images;
- loading states;
- logged-out protected actions.

## 11. Validation Commands

```powershell
git checkout test-branch
git pull origin test-branch
npm install
npm run lint -- --quiet
npm run build
npm run dev
```

Manual pages to check:

```text
/
/store
/lab
/doctor
/products/100001
/wishlist
/profile
/profile/orders
/profile/inbox
/search?q=cream
```

## 12. Current Known Notes

- The project uses Tailwind CSS v4 import support, but most existing components are CSS/CSS-module based rather than shadcn-generated components.
- The profile API is API-ready mock data under `src/app/api/profile/[[...section]]/route.ts`; connect real backend auth/data before production launch.
- Full automated viewport testing is recommended with Playwright before release; current work uses lint/build plus browser QA.
- Some older page-specific sections are preserved visually but protected by global responsive hardening to avoid horizontal scrolling and broken mobile layouts.

## 13. Final Acceptance Checklist

- [x] Shared responsive foundation exists.
- [x] Header adapts mobile/tablet/desktop.
- [x] Category navigation/dropdowns fit smaller screens.
- [x] Home/Store/Lab banners are image-only and have 7 slides.
- [x] Product/category grids use adaptive sizing.
- [x] Product details stack on mobile.
- [x] Cart drawer fits viewport.
- [x] Wishlist grid adapts.
- [x] Orders controls/actions wrap.
- [x] Profile dashboard avoids sidebar overlap on smaller screens.
- [x] Login modal fits mobile viewport.
- [x] Global no-horizontal-scroll and touch-target rules are present.
- [x] README documents all major pages/components.

## 14. Premium Performance/Accessibility Targets

Target Lighthouse goals before production release:

- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

Implementation rules:

- lazy-load non-critical images;
- preload only above-the-fold critical assets;
- keep controls at least 44x44px;
- preserve keyboard focus rings;
- do not rely on hover for essential actions;
- respect reduced motion;
- keep large screens centered instead of stretching UI across 2K/4K.
