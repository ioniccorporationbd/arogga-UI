# Project Audit — Arogga UI


Generated from repository inspection for Part 1 architecture work. This audit is intentionally conservative: possible issues are flagged for review rather than silently deleted.


## Summary


- Routes: **31**
- API routes: **16**
- TS/TSX components/modules inspected: **111 TSX components**, **64 client components**, **47 server components**
- Very large files (>=250 lines): **25**


## 1. Full route inventory
- `/` — `src/app/page.tsx`
- `/[...categoryPath]` — `src/app/[...categoryPath]/page.tsx`
- `/account` — `src/app/account/page.tsx`
- `/account/[section]` — `src/app/account/[section]/page.tsx`
- `/brand/[slug]` — `src/app/brand/[slug]/page.tsx`
- `/cart` — `src/app/cart/page.tsx`
- `/category/[slug]` — `src/app/category/[slug]/page.tsx`
- `/checkout` — `src/app/checkout/page.tsx`
- `/doctor` — `src/app/doctor/page.tsx`
- `/inbox` — `src/app/inbox/page.tsx`
- `/lab` — `src/app/lab/page.tsx`
- `/orders` — `src/app/orders/page.tsx`
- `/product/[slug]` — `src/app/product/[slug]/page.tsx`
- `/products/[slug]` — `src/app/products/[slug]/page.tsx`
- `/profile` — `src/app/profile/page.tsx`
- `/profile/addresses` — `src/app/profile/addresses/page.tsx`
- `/profile/balance` — `src/app/profile/balance/page.tsx`
- `/profile/blog` — `src/app/profile/blog/page.tsx`
- `/profile/faq` — `src/app/profile/faq/page.tsx`
- `/profile/inbox` — `src/app/profile/inbox/page.tsx`
- `/profile/offers` — `src/app/profile/offers/page.tsx`
- `/profile/orders` — `src/app/profile/orders/page.tsx`
- `/profile/patients` — `src/app/profile/patients/page.tsx`
- `/profile/prescriptions` — `src/app/profile/prescriptions/page.tsx`
- `/profile/privacy-policy` — `src/app/profile/privacy-policy/page.tsx`
- `/profile/reports` — `src/app/profile/reports/page.tsx`
- `/profile/reviews` — `src/app/profile/reviews/page.tsx`
- `/profile/wishlist` — `src/app/profile/wishlist/page.tsx`
- `/search` — `src/app/search/page.tsx`
- `/store` — `src/app/store/page.tsx`
- `/wishlist` — `src/app/wishlist/page.tsx`


## 2. Full API route inventory
- `/api/auth/logout` — `src/app/api/auth/logout/route.ts`
- `/api/auth/request-otp` — `src/app/api/auth/request-otp/route.ts`
- `/api/auth/session` — `src/app/api/auth/session/route.ts`
- `/api/auth/verify-otp` — `src/app/api/auth/verify-otp/route.ts`
- `/api/catalog/products` — `src/app/api/catalog/products/route.ts`
- `/api/catalog/suggest` — `src/app/api/catalog/suggest/route.ts`
- `/api/orders` — `src/app/api/orders/route.ts`
- `/api/orders/[orderId]` — `src/app/api/orders/[orderId]/route.ts`
- `/api/orders/[orderId]/buy-again` — `src/app/api/orders/[orderId]/buy-again/route.ts`
- `/api/orders/[orderId]/cancel` — `src/app/api/orders/[orderId]/cancel/route.ts`
- `/api/orders/[orderId]/invoice` — `src/app/api/orders/[orderId]/invoice/route.ts`
- `/api/orders/[orderId]/return` — `src/app/api/orders/[orderId]/return/route.ts`
- `/api/orders/[orderId]/review` — `src/app/api/orders/[orderId]/review/route.ts`
- `/api/orders/[orderId]/tracking` — `src/app/api/orders/[orderId]/tracking/route.ts`
- `/api/products/search` — `src/app/api/products/search/route.ts`
- `/api/profile/[[...section]]` — `src/app/api/profile/[[...section]]/route.ts`


## 3. Full component inventory
- `src/Components/AboveFooterVideo.tsx`
- `src/Components/Footer.tsx`
- `src/Components/HomeComponents/AllHomeProductSections.tsx`
- `src/Components/HomeComponents/AllInOneCareDeals.tsx`
- `src/Components/HomeComponents/AllYouNeed.tsx`
- `src/Components/HomeComponents/BasicSiteBanner.tsx`
- `src/Components/HomeComponents/BestSellingProducts.tsx`
- `src/Components/HomeComponents/BlueDealSections.tsx`
- `src/Components/HomeComponents/BoostAndBalance.tsx`
- `src/Components/HomeComponents/CategoryDealSections.tsx`
- `src/Components/HomeComponents/EspeciallyForYou.tsx`
- `src/Components/HomeComponents/EverydayKGlow.tsx`
- `src/Components/HomeComponents/FlashSale.tsx`
- `src/Components/HomeComponents/FragranceAndPerfume.tsx`
- `src/Components/HomeComponents/FragrancePerfume.tsx`
- `src/Components/HomeComponents/GFORSMegaDeals.tsx`
- `src/Components/HomeComponents/GroceryEssentials.tsx`
- `src/Components/HomeComponents/HimalayaNaturalSavings.tsx`
- `src/Components/HomeComponents/KitchenAndHomeEssentials.tsx`
- `src/Components/HomeComponents/MultiDealSections.tsx`
- `src/Components/HomeComponents/NewAndBestSelling.tsx`
- `src/Components/HomeComponents/NewlyLaunchedItems.tsx`
- `src/Components/HomeComponents/OTCMedicine.tsx`
- `src/Components/HomeComponents/PawsAndClaws.tsx`
- `src/Components/HomeComponents/ProductSection.tsx`
- `src/Components/HomeComponents/ProtectYourHealth.tsx`
- `src/Components/HomeComponents/SeoContentSection.tsx`
- `src/Components/HomeComponents/SharedEcommerceBanner.tsx`
- `src/Components/HomeComponents/ShopYourGlow.tsx`
- `src/Components/HomeComponents/SkinCafeEssentials.tsx`
- `src/Components/HomeComponents/SkinOXInnsaeiStealTheDeal.tsx`
- `src/Components/HomeComponents/StealTheDeal.tsx`
- `src/Components/HomeComponents/SunAndSplash.tsx`
- `src/Components/HomeComponents/SupplementAndOTC.tsx`
- `src/Components/HomeComponents/SupplementFestival.tsx`
- `src/Components/HomeComponents/TinyTots.tsx`
- `src/Components/SectionNavigation.tsx`
- `src/Components/TopNavber.tsx`
- `src/Components/account/AccountShell.tsx`
- `src/Components/auth/LoginModal.tsx`
- `src/Components/auth/MobileLoginModal.tsx`
- `src/Components/auth/ProtectedActionPrompt.tsx`
- `src/Components/cart/AddToCartButton.tsx`
- `src/Components/cart/CartButton.tsx`
- `src/Components/cart/CartDrawer.tsx`
- `src/Components/profile/ProfileDashboard.tsx`
- `src/Components/search/SearchBar.tsx`
- `src/Components/wishlist/WishlistButton.tsx`
- `src/app/[...categoryPath]/CategoryCatalog.tsx`
- `src/app/[...categoryPath]/page.tsx`
- `src/app/account/[section]/page.tsx`
- `src/app/account/layout.tsx`
- `src/app/account/page.tsx`
- `src/app/brand/[slug]/page.tsx`
- `src/app/cart/page.tsx`
- `src/app/category/[slug]/page.tsx`
- `src/app/checkout/page.tsx`
- `src/app/doctor/DoctorComingSoon.tsx`
- `src/app/doctor/page.tsx`
- `src/app/error.tsx`
- `src/app/global-error.tsx`
- `src/app/inbox/page.tsx`
- `src/app/lab/HealthPackageExplorer.tsx`
- `src/app/lab/HeroBannerSlider.tsx`
- `src/app/lab/HomeLabTestSection.tsx`
- `src/app/lab/LabProductSections.tsx`
- `src/app/lab/LabSeoContentSection.tsx`
- `src/app/lab/TrustedLabPartners.tsx`
- `src/app/lab/page.tsx`
- `src/app/layout.tsx`
- `src/app/loading.tsx`
- `src/app/not-found.tsx`
- `src/app/orders/MyOrdersPage.tsx`
- `src/app/orders/page.tsx`
- `src/app/page.tsx`
- `src/app/product/[slug]/page.tsx`
- `src/app/products/[slug]/ProductDetailActions.tsx`
- `src/app/products/[slug]/ProductImageSlider.tsx`
- `src/app/products/[slug]/ProductRecommendations.tsx`
- `src/app/products/[slug]/page.tsx`
- `src/app/profile/addresses/page.tsx`
- `src/app/profile/balance/page.tsx`
- `src/app/profile/blog/page.tsx`
- `src/app/profile/faq/page.tsx`
- `src/app/profile/inbox/page.tsx`
- `src/app/profile/layout.tsx`
- `src/app/profile/offers/page.tsx`
- `src/app/profile/orders/page.tsx`
- `src/app/profile/page.tsx`
- `src/app/profile/patients/page.tsx`
- `src/app/profile/prescriptions/page.tsx`
- `src/app/profile/privacy-policy/page.tsx`
- `src/app/profile/reports/page.tsx`
- `src/app/profile/reviews/page.tsx`
- `src/app/profile/wishlist/page.tsx`
- `src/app/search/page.tsx`
- `src/app/store/AllYourNeeds.tsx`
- `src/app/store/BabyCareHubSection.tsx`
- `src/app/store/CraveCartSection.tsx`
- `src/app/store/HeroBannerSlider.tsx`
- `src/app/store/LifestyleProductSections.tsx`
- `src/app/store/StoreProductSections.tsx`
- `src/app/store/SunAndSplashSection.tsx`
- `src/app/store/VetCareAndBrandsSection.tsx`
- `src/app/store/components/StoreProductCard.tsx`
- `src/app/store/page.tsx`
- `src/app/wishlist/page.tsx`
- `src/context/AppProviders.tsx`
- `src/context/AuthContext.tsx`
- `src/context/CartContext.tsx`
- `src/context/WishlistContext.tsx`


## 4. Client Component inventory
- `src/Components/AboveFooterVideo.tsx`
- `src/Components/Footer.tsx`
- `src/Components/HomeComponents/AllHomeProductSections.tsx`
- `src/Components/HomeComponents/AllInOneCareDeals.tsx`
- `src/Components/HomeComponents/AllYouNeed.tsx`
- `src/Components/HomeComponents/BestSellingProducts.tsx`
- `src/Components/HomeComponents/BoostAndBalance.tsx`
- `src/Components/HomeComponents/EspeciallyForYou.tsx`
- `src/Components/HomeComponents/EverydayKGlow.tsx`
- `src/Components/HomeComponents/FlashSale.tsx`
- `src/Components/HomeComponents/FragranceAndPerfume.tsx`
- `src/Components/HomeComponents/GFORSMegaDeals.tsx`
- `src/Components/HomeComponents/GroceryEssentials.tsx`
- `src/Components/HomeComponents/HimalayaNaturalSavings.tsx`
- `src/Components/HomeComponents/KitchenAndHomeEssentials.tsx`
- `src/Components/HomeComponents/NewlyLaunchedItems.tsx`
- `src/Components/HomeComponents/OTCMedicine.tsx`
- `src/Components/HomeComponents/PawsAndClaws.tsx`
- `src/Components/HomeComponents/ProductSection.tsx`
- `src/Components/HomeComponents/ProtectYourHealth.tsx`
- `src/Components/HomeComponents/SharedEcommerceBanner.tsx`
- `src/Components/HomeComponents/ShopYourGlow.tsx`
- `src/Components/HomeComponents/SkinCafeEssentials.tsx`
- `src/Components/HomeComponents/SkinOXInnsaeiStealTheDeal.tsx`
- `src/Components/HomeComponents/SunAndSplash.tsx`
- `src/Components/HomeComponents/SupplementFestival.tsx`
- `src/Components/HomeComponents/TinyTots.tsx`
- `src/Components/SectionNavigation.tsx`
- `src/Components/TopNavber.tsx`
- `src/Components/account/AccountShell.tsx`
- `src/Components/auth/LoginModal.tsx`
- `src/Components/auth/ProtectedActionPrompt.tsx`
- `src/Components/cart/AddToCartButton.tsx`
- `src/Components/cart/CartButton.tsx`
- `src/Components/cart/CartDrawer.tsx`
- `src/Components/profile/ProfileDashboard.tsx`
- `src/Components/search/SearchBar.tsx`
- `src/Components/wishlist/WishlistButton.tsx`
- `src/app/[...categoryPath]/CategoryCatalog.tsx`
- `src/app/cart/page.tsx`
- `src/app/checkout/page.tsx`
- `src/app/doctor/DoctorComingSoon.tsx`
- `src/app/error.tsx`
- `src/app/global-error.tsx`
- `src/app/lab/HealthPackageExplorer.tsx`
- `src/app/lab/HomeLabTestSection.tsx`
- `src/app/lab/LabProductSections.tsx`
- `src/app/lab/LabSeoContentSection.tsx`
- `src/app/lab/TrustedLabPartners.tsx`
- `src/app/orders/MyOrdersPage.tsx`
- `src/app/products/[slug]/ProductDetailActions.tsx`
- `src/app/products/[slug]/ProductImageSlider.tsx`
- `src/app/products/[slug]/ProductRecommendations.tsx`
- `src/app/store/AllYourNeeds.tsx`
- `src/app/store/BabyCareHubSection.tsx`
- `src/app/store/CraveCartSection.tsx`
- `src/app/store/LifestyleProductSections.tsx`
- `src/app/store/StoreProductSections.tsx`
- `src/app/store/SunAndSplashSection.tsx`
- `src/app/store/VetCareAndBrandsSection.tsx`
- `src/app/store/components/StoreProductCard.tsx`
- `src/app/wishlist/page.tsx`
- `src/context/AppProviders.tsx`
- `src/context/CartContext.tsx`


## 5. Server Component inventory
- `src/Components/HomeComponents/BasicSiteBanner.tsx`
- `src/Components/HomeComponents/BlueDealSections.tsx`
- `src/Components/HomeComponents/CategoryDealSections.tsx`
- `src/Components/HomeComponents/FragrancePerfume.tsx`
- `src/Components/HomeComponents/MultiDealSections.tsx`
- `src/Components/HomeComponents/NewAndBestSelling.tsx`
- `src/Components/HomeComponents/SeoContentSection.tsx`
- `src/Components/HomeComponents/StealTheDeal.tsx`
- `src/Components/HomeComponents/SupplementAndOTC.tsx`
- `src/Components/auth/MobileLoginModal.tsx`
- `src/app/[...categoryPath]/page.tsx`
- `src/app/account/[section]/page.tsx`
- `src/app/account/layout.tsx`
- `src/app/account/page.tsx`
- `src/app/brand/[slug]/page.tsx`
- `src/app/category/[slug]/page.tsx`
- `src/app/doctor/page.tsx`
- `src/app/inbox/page.tsx`
- `src/app/lab/HeroBannerSlider.tsx`
- `src/app/lab/page.tsx`
- `src/app/layout.tsx`
- `src/app/loading.tsx`
- `src/app/not-found.tsx`
- `src/app/orders/page.tsx`
- `src/app/page.tsx`
- `src/app/product/[slug]/page.tsx`
- `src/app/products/[slug]/page.tsx`
- `src/app/profile/addresses/page.tsx`
- `src/app/profile/balance/page.tsx`
- `src/app/profile/blog/page.tsx`
- `src/app/profile/faq/page.tsx`
- `src/app/profile/inbox/page.tsx`
- `src/app/profile/layout.tsx`
- `src/app/profile/offers/page.tsx`
- `src/app/profile/orders/page.tsx`
- `src/app/profile/page.tsx`
- `src/app/profile/patients/page.tsx`
- `src/app/profile/prescriptions/page.tsx`
- `src/app/profile/privacy-policy/page.tsx`
- `src/app/profile/reports/page.tsx`
- `src/app/profile/reviews/page.tsx`
- `src/app/profile/wishlist/page.tsx`
- `src/app/search/page.tsx`
- `src/app/store/HeroBannerSlider.tsx`
- `src/app/store/page.tsx`
- `src/context/AuthContext.tsx`
- `src/context/WishlistContext.tsx`


## 6. Duplicate component inventory
- `layout`: `src/app/layout.tsx`, `src/app/profile/layout.tsx`, `src/app/account/layout.tsx`
- `page`: `src/app/page.tsx`, `src/app/[...categoryPath]/page.tsx`, `src/app/checkout/page.tsx`, `src/app/orders/page.tsx`, `src/app/products/[slug]/page.tsx`, `src/app/product/[slug]/page.tsx`, `src/app/doctor/page.tsx`, `src/app/store/page.tsx`, `src/app/wishlist/page.tsx`, `src/app/cart/page.tsx`, `src/app/profile/page.tsx`, `src/app/profile/prescriptions/page.tsx`, `src/app/profile/orders/page.tsx`, `src/app/profile/faq/page.tsx`, `src/app/profile/blog/page.tsx`, `src/app/profile/reports/page.tsx`, `src/app/profile/addresses/page.tsx`, `src/app/profile/reviews/page.tsx`, `src/app/profile/wishlist/page.tsx`, `src/app/profile/balance/page.tsx`, `src/app/profile/offers/page.tsx`, `src/app/profile/patients/page.tsx`, `src/app/profile/inbox/page.tsx`, `src/app/profile/privacy-policy/page.tsx`, `src/app/brand/[slug]/page.tsx`, `src/app/inbox/page.tsx`, `src/app/account/page.tsx`, `src/app/account/[section]/page.tsx`, `src/app/lab/page.tsx`, `src/app/category/[slug]/page.tsx`, `src/app/search/page.tsx`
- `herobannerslider`: `src/app/store/HeroBannerSlider.tsx`, `src/app/lab/HeroBannerSlider.tsx`


## 7. Duplicate route inventory
- Canonical key `/products/[slug]`: [['/products/[slug]', 'src/app/products/[slug]/page.tsx'], ['/product/[slug]', 'src/app/product/[slug]/page.tsx']]
- Canonical key `/account`: [['/profile', 'src/app/profile/page.tsx'], ['/account', 'src/app/account/page.tsx']]


## 8. localStorage usage inventory
- `src/Components/auth/LoginModal.tsx:252` — `window.localStorage.setItem("arogga-user", JSON.stringify(user));`
- `src/Components/auth/LoginModal.tsx:277` — `window.localStorage.setItem("arogga-user", JSON.stringify(user));`
- `src/context/CartContext.tsx:14` — `try { const raw=localStorage.getItem(KEY); if(!raw) return []; const parsed:unknown=JSON.parse(raw); return Array.isArray(parsed)?parsed.filter((x):x is CartItem=>Boolean(x&&typeof x==="object"&&typeof (x as CartItem).id`
- `src/context/CartContext.tsx:15` — `catch { localStorage.removeItem(KEY); return []; }`
- `src/context/CartContext.tsx:32` — `const persist=useCallback((next:CartItem[])=>{setItems(next);localStorage.setItem(KEY,JSON.stringify(next));window.dispatchEvent(new Event("arogga-cart-updated"));},[]);`
- `src/context/WishlistContext.tsx:57` — `const value = JSON.parse(localStorage.getItem(key) || "[]");`
- `src/context/WishlistContext.tsx:62` — `localStorage.removeItem(key);`
- `src/context/WishlistContext.tsx:74` — `localStorage.setItem(scopedKey, JSON.stringify(legacyItems.map(normalizeItem)));`
- `src/context/WishlistContext.tsx:93` — `localStorage.setItem(getWishlistKey(phone), JSON.stringify(normalized));`
- `src/context/AuthContext.tsx:42` — `const raw = localStorage.getItem(KEY);`
- `src/context/AuthContext.tsx:45` — `localStorage.removeItem(KEY);`
- `src/context/AuthContext.tsx:62` — `localStorage.setItem(KEY, JSON.stringify(nextUser));`
- `src/context/AuthContext.tsx:91` — `localStorage.setItem(KEY, JSON.stringify(authenticatedUser));`
- `src/context/AuthContext.tsx:103` — `localStorage.removeItem(KEY);`
- `src/lib/api-client.ts:8` — `const raw = window.localStorage.getItem("arogga-auth-user");`
- `src/hooks/useCompare.ts:12` — `const parsed: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");`
- `src/hooks/useCompare.ts:15` — `localStorage.removeItem(KEY);`
- `src/hooks/useCompare.ts:25` — `if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(limited));`


## 9. session and cookie usage inventory
- `src/app/api/auth/request-otp/route.ts:25` — `response.cookies.set(OTP_COOKIE_NAME, phone, {`
- `src/app/api/auth/verify-otp/route.ts:27` — `response.cookies.set(AUTH_COOKIE_NAME, createDemoSession(phone), {`
- `src/app/api/auth/verify-otp/route.ts:34` — `response.cookies.delete(OTP_COOKIE_NAME);`
- `src/app/api/auth/logout/route.ts:6` — `response.cookies.delete(AUTH_COOKIE_NAME);`
- `src/app/api/auth/logout/route.ts:7` — `response.cookies.delete(OTP_COOKIE_NAME);`
- `src/app/api/auth/session/route.ts:23` — `response.cookies.delete(AUTH_COOKIE_NAME);`


## 10. Direct /data.json fetch/reference inventory
- `RESPONSIVE_ECOMMERCE_README.md:186` — `public/data.json`
- `RESPONSIVE_ECOMMERCE_README.md:192` — `public/data.json`
- `README.md:49` — `The storefront uses one canonical public catalog file: `public/data.json`.`
- `PRODUCTION_FOUNDATION.md:50` — `Existing `public/data.json` remains intact so old routes keep working.`
- `src/Components/HomeComponents/README.md:3` — `This folder contains 20 independent home-page product section components. Each component renders one section and requests at least 20 product cards from `/public/data.json`.`
- `src/Components/HomeComponents/README.md:25` — `- Reads `/data.json` from the public directory.`
- `src/Components/HomeComponents/product-data.ts:52` — `export const PRODUCT_DATA_URL = "/data.json";`
- `src/Components/HomeComponents/UPDATED_README.md:3` — `All product-based home components now use the nested `public/data.json` model through shared files:`
- `src/Components/HomeComponents/UPDATED_README.md:22` — `Place the folder in your components directory and keep product data at `public/data.json`.`
- `src/lib/data.ts:8` — `export const LOCAL_PRODUCT_DATA_FILE = "data.json";`
- `src/lib/data.ts:9` — `export const LOCAL_PRODUCT_DATA_URL = "/data.json";`
- `src/lib/products.ts:79` — `// Flat API-ready fields mirrored in public/data.json. Existing nested fields stay for backward compatibility.`
- `src/app/api/products/search/route.ts:46` — `const file = await readFile(path.join(process.cwd(), "public", "data.json"), "utf8");`
- `src/app/products/[slug]/page.tsx:240` — `<strong>public/data.json</strong>`
- `src/app/products/[slug]/page.tsx:280` — `<p className="pd-video-note">This video is loaded dynamically from the product record in <strong>public/data.json</strong>.</p>`
- `src/app/store/CraveCartSection.tsx:67` — `const response = await fetch("/data.json", {`
- `src/app/store/CraveCartSection.tsx:74` — ``Unable to load data.json. Status: ${response.status}`,`
- `src/app/store/CraveCartSection.tsx:82` — `"public/data.json must contain a JSON array.",`
- `src/app/store/LifestyleProductSections.tsx:124` — `const response = await fetch("/data.json", {`
- `src/app/store/LifestyleProductSections.tsx:131` — ``Unable to load /data.json. Status: ${response.status}`,`
- `src/app/store/LifestyleProductSections.tsx:139` — `"public/data.json must contain a JSON array.",`
- `src/app/store/BabyCareHubSection.tsx:91` — `const response = await fetch("/data.json", {`
- `src/app/store/BabyCareHubSection.tsx:98` — ``Unable to load data.json. Status: ${response.status}`,`
- `src/app/store/BabyCareHubSection.tsx:106` — `"public/data.json must contain a JSON array.",`
- `src/app/store/VetCareAndBrandsSection.tsx:166` — `const response = await fetch("/data.json", {`
- `src/app/store/VetCareAndBrandsSection.tsx:173` — ``Unable to load public/data.json. Status: ${response.status}`,`
- `src/app/store/VetCareAndBrandsSection.tsx:181` — `"public/data.json must contain a JSON array of products.",`
- `src/app/store/VetCareAndBrandsSection.tsx:1854` — `available in data.json.`
- `src/app/store/SunAndSplashSection.tsx:68` — `const response = await fetch("/data.json", {`
- `src/app/store/SunAndSplashSection.tsx:75` — ``Unable to load data.json. Status: ${response.status}`,`
- `src/app/store/SunAndSplashSection.tsx:83` — `"public/data.json must contain a JSON array.",`
- `src/app/store/hooks/useStoreProducts.ts:22` — `const response = await fetch("/data.json", {`
- `src/app/brand/[slug]/page.tsx:15` — `description: `Shop ${label} products from the local data.json catalog.`,`
- `src/app/lab/HomeLabTestSection.tsx:107` — `const response = await fetch("/data.json", {`
- `src/app/lab/HomeLabTestSection.tsx:114` — ``Unable to load /data.json. Status: ${response.status}`,`
- `src/app/lab/HomeLabTestSection.tsx:122` — `"public/data.json must contain a JSON array.",`
- `src/app/lab/HealthPackageExplorer.tsx:340` — `const response = await fetch("/data.json", {`
- `src/app/lab/HealthPackageExplorer.tsx:347` — ``Unable to load /data.json. Status: ${response.status}`,`
- `src/app/lab/HealthPackageExplorer.tsx:355` — `"public/data.json must contain a JSON array.",`
- `src/app/lab/LabProductSections.tsx:9` — `{ id: "lab-featured", title: "Popular Health Products", subtitle: "20 products selected from data.json", href: "/lab", minimumCards: 20, background: "#f3fbff", headingColor: "#086f83" },`
- `src/app/lab/LabSeoContentSection.tsx:188` — `const response = await fetch("/data.json", {`
- `src/app/lab/LabSeoContentSection.tsx:195` — ``Unable to load public/data.json. Status: ${response.status}`,`
- `src/app/lab/LabSeoContentSection.tsx:203` — `"public/data.json must contain a JSON array of products.",`
- `src/app/lab/LabSeoContentSection.tsx:219` — `: "Unable to load data.json.",`
- `src/app/lab/TrustedLabPartners.tsx:179` — `const response = await fetch("/data.json", {`
- `src/app/lab/TrustedLabPartners.tsx:186` — ``Unable to load /data.json. Status: ${response.status}`,`
- `src/app/lab/TrustedLabPartners.tsx:194` — `"public/data.json must contain a JSON array.",`
- `src/app/lab/TrustedLabPartners.tsx:212` — `: "Unable to load data.json.",`
- `src/app/category/[slug]/page.tsx:15` — `description: `Shop ${label} products from the local data.json catalog with filters, sorting and pagination.`,`
- `src/app/search/page.tsx:28` — `<p style={{ color: "#667085" }}>{results.length} products found from <code>public/data.json</code></p>`
- `src/hooks/useProducts.ts:9` — `const response = await fetch("/data.json", { cache: "force-cache" });`
- `src/hooks/useProducts.ts:10` — `if (!response.ok) throw new Error(`Unable to load /data.json (${response.status})`);`
- `public/catalog/index.json:2` — `"generatedFrom": "public/data.json",`


## 11. x-user-phone usage inventory
- `src/lib/api-client.ts:12` — `config.headers["x-user-phone"] = user.phone;`
- `src/app/orders/MyOrdersPage.tsx:69` — `const res = await fetch(`/api/orders?${query.toString()}`, { headers: { "x-user-phone": phone } });`
- `src/app/api/orders/route.ts:5` — `return request.headers.get("x-user-phone") || undefined;`
- `src/app/api/orders/[orderId]/route.ts:5` — `return request.headers.get("x-user-phone") || undefined;`
- `src/app/api/orders/[orderId]/return/route.ts:3` — `function userPhone(request: NextRequest) { return request.headers.get("x-user-phone") || undefined; }`
- `src/app/api/orders/[orderId]/buy-again/route.ts:3` — `function userPhone(request: NextRequest) { return request.headers.get("x-user-phone") || undefined; }`
- `src/app/api/orders/[orderId]/invoice/route.ts:3` — `function userPhone(request: NextRequest) { return request.headers.get("x-user-phone") || undefined; }`
- `src/app/api/orders/[orderId]/cancel/route.ts:4` — `function userPhone(request: NextRequest) { return request.headers.get("x-user-phone") || undefined; }`
- `src/app/api/orders/[orderId]/tracking/route.ts:3` — `function userPhone(request: NextRequest) { return request.headers.get("x-user-phone") || undefined; }`
- `src/app/api/orders/[orderId]/review/route.ts:3` — `function userPhone(request: NextRequest) { return request.headers.get("x-user-phone") || undefined; }`
- `src/app/api/profile/[[...section]]/route.ts:51` — `return request.headers.get("x-user-phone") || request.nextUrl.searchParams.get("phone");`


## 12. Hardcoded OTP inventory
- `PRODUCTION_FOUNDATION.md:30` — `Development OTP: `123456`. Production must replace the demo OTP check with an SMS provider adapter and signed/encrypted session storage.`
- `src/Components/auth/MobileLoginModal.tsx:12` — `const DEMO_OTP = "123456";`
- `src/Components/auth/MobileLoginModal.tsx:123` — `if (!response.ok || !data?.ok) throw new Error(data?.error || `Invalid OTP. Demo OTP is ${DEMO_OTP}.`);`
- `src/Components/auth/MobileLoginModal.tsx:264` — `<div className={styles.demoHint}>Development demo OTP: {DEMO_OTP}</div>`
- `src/Components/auth/LoginModal.tsx:48` — `const DEMO_OTP = "123456";`
- `src/Components/auth/LoginModal.tsx:236` — `if (joinedOtp !== DEMO_OTP) {`
- `src/Components/auth/LoginModal.tsx:237` — `setError("The verification code is incorrect. Use 123456 in demo mode.");`
- `src/Components/auth/LoginModal.tsx:374` — `<div className={styles.demoOtp}>Demo verification code: <strong>{DEMO_OTP}</strong></div>`
- `src/Components/auth/LoginModal.tsx:434` — `<button type="button" onClick={() => setPassword("123456")}>Use demo password</button>`
- `src/lib/auth-server.ts:3` — `export const DEMO_OTP = "123456";`
- `src/app/api/auth/request-otp/route.ts:2` — `import { DEMO_OTP, OTP_COOKIE_NAME, checkRateLimit, normalizePhone, phoneSchema } from "@/lib/auth-server";`
- `src/app/api/auth/request-otp/route.ts:21` — `demoOtp: process.env.NODE_ENV === "production" ? undefined : DEMO_OTP,`
- `src/app/api/auth/verify-otp/route.ts:2` — `import { AUTH_COOKIE_NAME, DEMO_OTP, OTP_COOKIE_NAME, checkRateLimit, createDemoSession, normalizePhone, verifyOtpSchema } from "@/lib/auth-server";`
- `src/app/api/auth/verify-otp/route.ts:22` — `if (parsed.data.otp !== DEMO_OTP) {`
- `src/app/api/auth/verify-otp/route.ts:23` — `return NextResponse.json({ ok: false, error: "Invalid OTP. Development OTP is 123456." }, { status: 401 });`


## 13. Hardcoded price and total inventory
- `src/lib/orders.ts:251` — `coupon: index % 2 ? { code: "AROGGA75", discount: 75 } : undefined,`
- `src/app/orders/MyOrdersPage.tsx:62` — `total: 0,`
- `src/app/products/[slug]/ProductImageSlider.tsx:23` — `discount = 0,`


## 14. Very large component/module inventory
- `2116` — `src/app/lab/HealthPackageExplorer.tsx`
- `2003` — `src/app/lab/HomeLabTestSection.tsx`
- `1926` — `src/app/store/BabyCareHubSection.tsx`
- `1892` — `src/app/store/VetCareAndBrandsSection.tsx`
- `1607` — `src/app/store/LifestyleProductSections.tsx`
- `1563` — `src/app/store/SunAndSplashSection.tsx`
- `1537` — `src/app/store/CraveCartSection.tsx`
- `1450` — `src/app/lab/LabSeoContentSection.tsx`
- `1431` — `src/Components/HomeComponents/EspeciallyForYou.tsx`
- `1375` — `src/app/lab/TrustedLabPartners.tsx`
- `1290` — `src/Components/SectionNavigation.tsx`
- `1287` — `src/Components/AboveFooterVideo.tsx`
- `1187` — `src/Components/Footer.tsx`
- `955` — `src/Components/HomeComponents/AllYouNeed.tsx`
- `799` — `src/app/store/AllYourNeeds.tsx`
- `682` — `src/Components/HomeComponents/ProductSection.tsx`
- `581` — `src/Components/cart/CartDrawer.tsx`
- `492` — `src/Components/auth/LoginModal.tsx`
- `465` — `src/Components/HomeComponents/SeoContentSection.tsx`
- `448` — `src/app/products/[slug]/page.tsx`
- `383` — `src/lib/orders.ts`
- `353` — `src/Components/TopNavber.tsx`
- `347` — `src/types/product.ts`
- `285` — `src/Components/auth/MobileLoginModal.tsx`
- `255` — `src/app/[...categoryPath]/category-data.ts`


## 15. Image optimization inventory
Next/Image references:
- `src/Components/TopNavber.tsx:3` — `import Image from "next/image";`
- `src/Components/TopNavber.tsx:124` — `<Image`
- `src/Components/HomeComponents/AllYouNeed.tsx:3` — `import Image from "next/image";`
- `src/Components/HomeComponents/AllYouNeed.tsx:895` — `<Image`
- `src/Components/cart/CartButton.tsx:2` — `import Image from "next/image";`
- `src/Components/cart/CartButton.tsx:8` — `export default function CartButton(){const {items,count,subtotal,removeItem,updateQuantity}=useCart();const [open,setOpen]=useState(false);const ref=useRef<HTMLDivElement>(null);useEffect(()=>{const close=(e:MouseEvent)=`
- `src/Components/cart/CartDrawer.tsx:3` — `import Image from "next/image";`
- `src/Components/cart/CartDrawer.tsx:265` — `<Image src={item.image} alt={item.name} fill sizes="78px" unoptimized />`
- `src/Components/profile/ProfileDashboard.tsx:3` — `import Image from "next/image";`
- `src/Components/profile/ProfileDashboard.tsx:142` — `<Image src={data?.user.avatar || "https://images.unsplash.com/photo-1606813902914-5f8f7ec4d1ad?auto=format&fit=crop&w=500&q=80"} alt="Profile avatar" width={54} height={54} unoptimized />`
- `src/Components/profile/ProfileDashboard.tsx:175` — `return <><section className="pd-stat-grid">{data.stats.map((stat) => <motion.article whileHover={{ y: -4 }} key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.help}</small></motion.articl`
- `src/Components/profile/ProfileDashboard.tsx:180` — `return <><DashboardFeatureStrip section={section} /><section className="pd-toolbar"><label><Search /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${copy[section].title.toLowerCas`
- `src/Components/search/SearchBar.tsx:3` — `import Image from "next/image";`
- `src/Components/search/SearchBar.tsx:9` — `export default function SearchBar({compact=false}:{compact?:boolean}){const router=useRouter();const [query,setQuery]=useState("");const [results,setResults]=useState<Result[]>([]);const [open,setOpen]=useState(false);co`
- `src/app/[...categoryPath]/CategoryCatalog.tsx:3` — `import Image from "next/image";`
- `src/app/[...categoryPath]/CategoryCatalog.tsx:183` — `<Image src={image} alt={product.media?.featuredImage?.alt || product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1000px) 25vw, 180px" className={styles.productImage} unoptimized />`
- `src/app/orders/MyOrdersPage.tsx:3` — `import Image from "next/image";`
- `src/app/orders/MyOrdersPage.tsx:205` — `return <section className="orders-table-card"><div className="orders-table-scroll"><table className="orders-table"><thead><tr><th>Product</th><th>Order ID</th><th>Date</th><th>Qty</th><th>Total</th><th>Status</th><th>Act`
- `src/app/orders/MyOrdersPage.tsx:209` — `return <div className="orders-modal-backdrop"><aside className="order-product-modal" role="dialog" aria-modal="true" aria-labelledby="order-product-title"><header><div><span>Product order details</span><h2 id="order-prod`
- `src/app/products/[slug]/ProductImageSlider.tsx:3` — `import Image from "next/image";`
- `src/app/products/[slug]/ProductImageSlider.tsx:66` — `<Image src={slide.src} alt={slide.alt} fill sizes="72px" className="pd-thumb-image" unoptimized />`
- `src/app/products/[slug]/ProductImageSlider.tsx:84` — `<Image`
- `src/app/wishlist/page.tsx:3` — `import Image from "next/image";`
- `src/app/wishlist/page.tsx:54` — `<Image src={product.image} alt={product.name} fill sizes="260px" unoptimized />`
- `src/app/cart/page.tsx:3` — `import Image from "next/image";`
- `src/app/cart/page.tsx:54` — `{item.image && <Image src={item.image} alt={item.name} fill sizes="92px" style={{ objectFit: "contain" }} unoptimized />}`
- `src/app/search/page.tsx:1` — `import Image from "next/image";`
- `src/app/search/page.tsx:40` — `<div style={{ position: "relative", height: 180, borderRadius: 14, background: "#f8fbfa", overflow: "hidden" }}><Image src={product.media.featuredImage.url} alt={product.name} fill sizes="220px" style={{ objectFit: "cont`


## 16. Unoptimized image inventory
- `src/Components/Footer.tsx:301` — `<img`
- `src/Components/Footer.tsx:490` — `<img`
- `src/Components/Footer.tsx:706` — `<img`
- `src/Components/Footer.tsx:991` — `<img`
- `src/Components/Footer.tsx:1044` — `<img`
- `src/Components/Footer.tsx:1073` — `<img`
- `src/Components/HomeComponents/EspeciallyForYou.tsx:1290` — `<img`
- `src/Components/HomeComponents/SharedEcommerceBanner.tsx:133` — `<img`
- `src/Components/HomeComponents/ProductSection.tsx:190` — `<img`
- `src/app/doctor/DoctorComingSoon.tsx:95` — `<img src={DOCTOR_IMAGE} alt="Smiling doctor consultation" className="absolute inset-0 h-full w-full object-cover" loading="eager" draggable={false} />`
- `src/app/store/CraveCartSection.tsx:1184` — `<img`
- `src/app/store/LifestyleProductSections.tsx:1268` — `<img`
- `src/app/store/BabyCareHubSection.tsx:397` — `<img`
- `src/app/store/BabyCareHubSection.tsx:1568` — `<img`
- `src/app/store/VetCareAndBrandsSection.tsx:1499` — `<img`
- `src/app/store/VetCareAndBrandsSection.tsx:1635` — `<img`
- `src/app/store/AllYourNeeds.tsx:757` — `<img`
- `src/app/store/SunAndSplashSection.tsx:1205` — `<img`
- `src/app/store/components/StoreProductCard.tsx:34` — `<img`
- `src/app/lab/HomeLabTestSection.tsx:1568` — `<img`
- `src/app/lab/HomeLabTestSection.tsx:1727` — `<img`
- `src/app/lab/HealthPackageExplorer.tsx:1602` — `<img`
- `src/app/lab/HealthPackageExplorer.tsx:1751` — `<img`
- `src/app/lab/HealthPackageExplorer.tsx:1805` — `<img`
- `src/app/lab/HealthPackageExplorer.tsx:1894` — `<img`
- `src/app/lab/HealthPackageExplorer.tsx:1913` — `<img`
- `src/app/lab/HealthPackageExplorer.tsx:1929` — `<img`
- `src/app/lab/TrustedLabPartners.tsx:1227` — `<img`


## 17. window.location.reload inventory
- `src/app/store/CraveCartSection.tsx:1528` — `window.location.reload()`
- `src/app/store/LifestyleProductSections.tsx:1599` — `onClick={() => window.location.reload()}`
- `src/app/store/BabyCareHubSection.tsx:1917` — `window.location.reload()`
- `src/app/store/VetCareAndBrandsSection.tsx:1884` — `onClick={() => window.location.reload()}`
- `src/app/store/SunAndSplashSection.tsx:1554` — `window.location.reload()`
- `src/app/lab/HomeLabTestSection.tsx:1994` — `window.location.reload()`


## 18. Hydration risk inventory
- `package-lock.json:3902` — `"is-document.all": "^1.0.0"`
- `package-lock.json:4402` — `"node_modules/is-document.all": {`
- `package-lock.json:4404` — `"resolved": "https://registry.npmjs.org/is-document.all/-/is-document.all-1.0.0.tgz",`
- `src/Components/Footer.tsx:237` — `() => new Date().getFullYear(),`
- `src/Components/Footer.tsx:804` — `window.setTimeout(() => {`
- `src/Components/Footer.tsx:1114` — `window.cancelAnimationFrame(frameId);`
- `src/Components/Footer.tsx:1116` — `frameId = window.requestAnimationFrame(`
- `src/Components/Footer.tsx:1118` — `const scrollTop = window.scrollY;`
- `src/Components/Footer.tsx:1121` — `document.documentElement.scrollHeight -`
- `src/Components/Footer.tsx:1122` — `window.innerHeight;`
- `src/Components/Footer.tsx:1140` — `window.addEventListener("scroll", update, {`
- `src/Components/Footer.tsx:1144` — `window.addEventListener("resize", update);`
- `src/Components/Footer.tsx:1147` — `window.cancelAnimationFrame(frameId);`
- `src/Components/Footer.tsx:1148` — `window.removeEventListener(`
- `src/Components/Footer.tsx:1152` — `window.removeEventListener(`
- `src/Components/Footer.tsx:1163` — `window.scrollTo({`
- `src/Components/TopNavber.tsx:65` — `document.addEventListener("keydown", closeOnEscape);`
- `src/Components/TopNavber.tsx:66` — `return () => document.removeEventListener("keydown", closeOnEscape);`
- `src/Components/SectionNavigation.tsx:606` — `window.addEventListener(`
- `src/Components/SectionNavigation.tsx:621` — `window.removeEventListener(`
- `src/Components/SectionNavigation.tsx:630` — `const frame = window.requestAnimationFrame(closeMenu);`
- `src/Components/SectionNavigation.tsx:631` — `return () => window.cancelAnimationFrame(frame);`
- `src/Components/SectionNavigation.tsx:654` — `document.addEventListener(`
- `src/Components/SectionNavigation.tsx:658` — `document.addEventListener(`
- `src/Components/SectionNavigation.tsx:664` — `document.removeEventListener(`
- `src/Components/SectionNavigation.tsx:668` — `document.removeEventListener(`
- `src/Components/SectionNavigation.tsx:700` — `window.matchMedia("(hover: none)").matches;`
- `src/Components/HomeComponents/EspeciallyForYou.tsx:131` — `window.matchMedia("(prefers-reduced-motion: reduce)").matches`
- `src/Components/HomeComponents/EspeciallyForYou.tsx:133` — `const frame = window.requestAnimationFrame(() => setIsVisible(true));`
- `src/Components/HomeComponents/EspeciallyForYou.tsx:134` — `return () => window.cancelAnimationFrame(frame);`
- `src/Components/HomeComponents/ProductSection.tsx:120` — `const styles = window.getComputedStyle(element);`
- `src/Components/HomeComponents/ProductSection.tsx:122` — `const visibleCount = window.innerWidth >= 1280 ? 6 : window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : 1;`
- `src/Components/cart/AddToCartButton.tsx:50` — `window.setTimeout(() => setAdded(false), 1400);`
- `src/Components/cart/CartButton.tsx:8` — `export default function CartButton(){const {items,count,subtotal,removeItem,updateQuantity}=useCart();const [open,setOpen]=useState(false);const ref=useRef<HTMLDivElement>(null);useEffect(()=>{const close=(e:MouseEvent)=`
- `src/Components/cart/CartDrawer.tsx:131` — `const deliveryDate = new Date();`
- `src/Components/cart/CartDrawer.tsx:141` — `return `ARG-${Date.now().toString().slice(-7)}`;`
- `src/Components/profile/ProfileDashboard.tsx:152` — `<ProfileHeader section={section} onMenu={() => setSidebarOpen(true)} notificationCount={data?.notifications.filter((n) => !n.read).length || 0} onAction={() => section === "privacy-policy" ? window.print() : setModal(sec`
- `src/Components/search/SearchBar.tsx:9` — `export default function SearchBar({compact=false}:{compact?:boolean}){const router=useRouter();const [query,setQuery]=useState("");const [results,setResults]=useState<Result[]>([]);const [open,setOpen]=useState(false);co`
- `src/Components/auth/MobileLoginModal.tsx:42` — `const previousOverflow = document.body.style.overflow;`
- `src/Components/auth/MobileLoginModal.tsx:43` — `document.body.style.overflow = "hidden";`
- `src/Components/auth/MobileLoginModal.tsx:49` — `document.addEventListener("keydown", handleEscape);`
- `src/Components/auth/MobileLoginModal.tsx:51` — `document.body.style.overflow = previousOverflow;`
- `src/Components/auth/MobileLoginModal.tsx:52` — `document.removeEventListener("keydown", handleEscape);`
- `src/Components/auth/MobileLoginModal.tsx:58` — `const id = window.setInterval(() => setTimer((value) => Math.max(0, value - 1)), 1000);`
- `src/Components/auth/MobileLoginModal.tsx:59` — `return () => window.clearInterval(id);`
- `src/Components/auth/MobileLoginModal.tsx:94` — `window.setTimeout(() => refs.current[0]?.focus(), 60);`
- `src/Components/auth/MobileLoginModal.tsx:144` — `window.setTimeout(() => refs.current[0]?.focus(), 60);`
- `src/Components/auth/LoginModal.tsx:94` — `const previousOverflow = document.body.style.overflow;`
- `src/Components/auth/LoginModal.tsx:95` — `document.body.style.overflow = "hidden";`
- `src/Components/auth/LoginModal.tsx:97` — `const timer = window.setTimeout(() => firstInputRef.current?.focus(), 80);`
- `src/Components/auth/LoginModal.tsx:111` — `if (event.shiftKey && document.activeElement === first) {`
- `src/Components/auth/LoginModal.tsx:114` — `} else if (!event.shiftKey && document.activeElement === last) {`
- `src/Components/auth/LoginModal.tsx:121` — `document.addEventListener("keydown", handleKeyDown);`
- `src/Components/auth/LoginModal.tsx:124` — `window.clearTimeout(timer);`
- `src/Components/auth/LoginModal.tsx:125` — `document.body.style.overflow = previousOverflow;`
- `src/Components/auth/LoginModal.tsx:126` — `document.removeEventListener("keydown", handleKeyDown);`
- `src/Components/auth/LoginModal.tsx:132` — `const timer = window.setInterval(() => {`
- `src/Components/auth/LoginModal.tsx:135` — `return () => window.clearInterval(timer);`
- `src/Components/auth/LoginModal.tsx:188` — `await new Promise((resolve) => window.setTimeout(resolve, 650));`
- `src/Components/auth/LoginModal.tsx:192` — `window.setTimeout(() => otpRefs.current[0]?.focus(), 80);`
- `src/Components/auth/LoginModal.tsx:242` — `await new Promise((resolve) => window.setTimeout(resolve, 650));`
- `src/Components/auth/LoginModal.tsx:252` — `window.localStorage.setItem("arogga-user", JSON.stringify(user));`
- `src/Components/auth/LoginModal.tsx:254` — `window.setTimeout(onClose, 900);`
- `src/Components/auth/LoginModal.tsx:268` — `await new Promise((resolve) => window.setTimeout(resolve, 650));`
- `src/Components/auth/LoginModal.tsx:277` — `window.localStorage.setItem("arogga-user", JSON.stringify(user));`
- `src/Components/auth/LoginModal.tsx:281` — `window.setTimeout(onClose, 900);`
- `src/context/CartContext.tsx:14` — `try { const raw=localStorage.getItem(KEY); if(!raw) return []; const parsed:unknown=JSON.parse(raw); return Array.isArray(parsed)?parsed.filter((x):x is CartItem=>Boolean(x&&typeof x==="object"&&typeof (x as CartItem).id`
- `src/context/CartContext.tsx:15` — `catch { localStorage.removeItem(KEY); return []; }`
- `src/context/CartContext.tsx:31` — `useEffect(()=>{  setItems(safeRead()); const sync=()=>setItems(safeRead()); window.addEventListener("storage",sync); window.addEventListener("arogga-cart-updated",sync); return()=>{window.removeEventListener("storage",sy`
- `src/context/CartContext.tsx:32` — `const persist=useCallback((next:CartItem[])=>{setItems(next);localStorage.setItem(KEY,JSON.stringify(next));window.dispatchEvent(new Event("arogga-cart-updated"));},[]);`
- `src/context/WishlistContext.tsx:51` — `addedAt: item.addedAt || new Date().toISOString(),`
- `src/context/WishlistContext.tsx:57` — `const value = JSON.parse(localStorage.getItem(key) || "[]");`
- `src/context/WishlistContext.tsx:62` — `localStorage.removeItem(key);`
- `src/context/WishlistContext.tsx:74` — `localStorage.setItem(scopedKey, JSON.stringify(legacyItems.map(normalizeItem)));`
- `src/context/WishlistContext.tsx:93` — `localStorage.setItem(getWishlistKey(phone), JSON.stringify(normalized));`
- `src/context/AuthContext.tsx:42` — `const raw = localStorage.getItem(KEY);`
- `src/context/AuthContext.tsx:45` — `localStorage.removeItem(KEY);`
- `src/context/AuthContext.tsx:62` — `localStorage.setItem(KEY, JSON.stringify(nextUser));`
- `src/context/AuthContext.tsx:91` — `localStorage.setItem(KEY, JSON.stringify(authenticatedUser));`
- `src/context/AuthContext.tsx:103` — `localStorage.removeItem(KEY);`
- `src/context/AppProviders.tsx:29` — `window.addEventListener("arogga-toast", handleToast);`
- `src/context/AppProviders.tsx:30` — `return () => window.removeEventListener("arogga-toast", handleToast);`
- `src/lib/api-client.ts:8` — `const raw = window.localStorage.getItem("arogga-auth-user");`
- `src/lib/auth-server.ts:26` — `const now = Date.now();`
- `src/lib/auth-server.ts:42` — `return Buffer.from(JSON.stringify({ phone, name: "Arogga User", issuedAt: Date.now(), demo: true })).toString("base64url");`
- `src/lib/product-status.ts:60` — `const date = new Date(availableFrom);`
- `src/lib/product-status.ts:66` — `return Date.now() < date.getTime();`
- `src/lib/product-status.ts:76` — `const date = new Date(availableUntil);`
- `src/lib/product-status.ts:82` — `return Date.now() > date.getTime();`
- `src/lib/toast.ts:26` — `window.dispatchEvent(new CustomEvent<AroggaToastDetail>("arogga-toast", {`
- `src/lib/orders.ts:151` — `const date = new Date("2026-07-22T10:00:00.000Z");`
- `src/lib/orders.ts:158` — `return new Date(isoDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });`
- `src/lib/orders.ts:160` — `function timeText(isoDate: string) { return new Date(isoDate).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); }`
- `src/lib/orders.ts:165` — `const d = new Date(createdAt);`
- `src/lib/orders.ts:185` — `date: dateText(new Date().toISOString()),`
- `src/lib/orders.ts:186` — `time: timeText(new Date().toISOString()),`
- `src/lib/orders.ts:226` — `const estimated = new Date(createdAt); estimated.setDate(estimated.getDate() + 3 + (index % 3));`
- `src/lib/orders.ts:291` — `if (query.from) result = result.filter((o) => new Date(o.createdAt) >= new Date(String(query.from)));`
- `src/lib/orders.ts:292` — `if (query.to) result = result.filter((o) => new Date(o.createdAt) <= new Date(String(query.to)));`
- `src/lib/orders.ts:296` — `if (sort === "oldest") return +new Date(a.createdAt) - +new Date(b.createdAt);`
- `src/lib/orders.ts:299` — `if (sort === "updated") return +new Date(b.updatedAt) - +new Date(a.updatedAt);`
- `src/lib/orders.ts:300` — `return +new Date(b.createdAt) - +new Date(a.createdAt);`
- `src/lib/orders.ts:337` — `updatedAt: new Date().toISOString(),`
- `src/lib/orders.ts:350` — `returnRequestId: `RTN-${Date.now().toString().slice(-7)}`,`
- `src/lib/orders.ts:351` — `updatedAt: new Date().toISOString(),`
- `src/lib/orders.ts:364` — `updatedAt: new Date().toISOString(),`
- `src/lib/validators.ts:9` — `dateOfBirth: z.string().refine((value) => !Number.isNaN(Date.parse(value)) && new Date(value) < new Date(), "Select a valid past date"),`
- `src/app/sitemap.ts:8` — `const now = new Date();`
- `src/app/orders/MyOrdersPage.tsx:85` — `return value ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Not scheduled";`
- `src/app/orders/MyOrdersPage.tsx:122` — `const id = window.setTimeout(() => {`
- `src/app/orders/MyOrdersPage.tsx:128` — `return () => window.clearTimeout(id);`
- `src/app/api/profile/[[...section]]/route.ts:64` — `return NextResponse.json({ ok: true, section, id: `${section.toUpperCase()}-${Date.now()}`, message: "Action completed", body });`
- `src/app/products/[slug]/ProductDetailActions.tsx:78` — `window.setTimeout(() => setAdded(false), 1400);`
- `src/app/products/[slug]/ProductImageSlider.tsx:41` — `const timer = window.setInterval(() => {`
- `src/app/products/[slug]/ProductImageSlider.tsx:44` — `return () => window.clearInterval(timer);`
- `src/app/store/CraveCartSection.tsx:163` — `window.addEventListener(`
- `src/app/store/CraveCartSection.tsx:177` — `window.removeEventListener(`
- `src/app/store/CraveCartSection.tsx:199` — `window.getComputedStyle(container);`
- `src/app/store/CraveCartSection.tsx:212` — `window.innerWidth >= 1280`
- `src/app/store/CraveCartSection.tsx:214` — `: window.innerWidth >= 1024`
- `src/app/store/CraveCartSection.tsx:216` — `: window.innerWidth >= 768`
- `src/app/store/CraveCartSection.tsx:218` — `: window.innerWidth >= 640`
- `src/app/store/CraveCartSection.tsx:1528` — `window.location.reload()`
- `src/app/store/LifestyleProductSections.tsx:1060` — `window.addEventListener(`
- `src/app/store/LifestyleProductSections.tsx:1074` — `window.removeEventListener(`
- `src/app/store/LifestyleProductSections.tsx:1099` — `const style = window.getComputedStyle(container);`
- `src/app/store/LifestyleProductSections.tsx:1110` — `window.innerWidth >= 1280`
- `src/app/store/LifestyleProductSections.tsx:1112` — `: window.innerWidth >= 1024`
- `src/app/store/LifestyleProductSections.tsx:1114` — `: window.innerWidth >= 768`
- `src/app/store/LifestyleProductSections.tsx:1116` — `: window.innerWidth >= 640`
- `src/app/store/LifestyleProductSections.tsx:1599` — `onClick={() => window.location.reload()}`
- `src/app/store/BabyCareHubSection.tsx:182` — `window.addEventListener(`
- `src/app/store/BabyCareHubSection.tsx:196` — `window.removeEventListener(`
- `src/app/store/BabyCareHubSection.tsx:217` — `const styles = window.getComputedStyle(container);`
- `src/app/store/BabyCareHubSection.tsx:228` — `window.innerWidth >= 1280`
- `src/app/store/BabyCareHubSection.tsx:230` — `: window.innerWidth >= 1024`
- `src/app/store/BabyCareHubSection.tsx:232` — `: window.innerWidth >= 768`
- `src/app/store/BabyCareHubSection.tsx:234` — `: window.innerWidth >= 640`
- `src/app/store/BabyCareHubSection.tsx:1917` — `window.location.reload()`
- `src/app/store/VetCareAndBrandsSection.tsx:296` — `window.addEventListener("resize", updateScrollButtons);`
- `src/app/store/VetCareAndBrandsSection.tsx:307` — `window.removeEventListener(`
- `src/app/store/VetCareAndBrandsSection.tsx:333` — `window.getComputedStyle(container);`
- `src/app/store/VetCareAndBrandsSection.tsx:346` — `window.innerWidth >= 1280`
- `src/app/store/VetCareAndBrandsSection.tsx:348` — `: window.innerWidth >= 1024`
- `src/app/store/VetCareAndBrandsSection.tsx:350` — `: window.innerWidth >= 768`
- `src/app/store/VetCareAndBrandsSection.tsx:352` — `: window.innerWidth >= 640`
- `src/app/store/VetCareAndBrandsSection.tsx:1884` — `onClick={() => window.location.reload()}`
- `src/app/store/SunAndSplashSection.tsx:159` — `window.addEventListener(`
- `src/app/store/SunAndSplashSection.tsx:173` — `window.removeEventListener(`
- `src/app/store/SunAndSplashSection.tsx:194` — `const styles = window.getComputedStyle(container);`
- `src/app/store/SunAndSplashSection.tsx:205` — `window.innerWidth >= 1280`
- `src/app/store/SunAndSplashSection.tsx:207` — `: window.innerWidth >= 1024`
- `src/app/store/SunAndSplashSection.tsx:209` — `: window.innerWidth >= 768`
- `src/app/store/SunAndSplashSection.tsx:211` — `: window.innerWidth >= 640`
- `src/app/store/SunAndSplashSection.tsx:1554` — `window.location.reload()`
- `src/app/lab/HomeLabTestSection.tsx:204` — `window.addEventListener(`
- `src/app/lab/HomeLabTestSection.tsx:218` — `window.removeEventListener(`
- `src/app/lab/HomeLabTestSection.tsx:244` — `window.getComputedStyle(container);`
- `src/app/lab/HomeLabTestSection.tsx:257` — `window.innerWidth >= 1280`
- `src/app/lab/HomeLabTestSection.tsx:259` — `: window.innerWidth >= 1024`
- `src/app/lab/HomeLabTestSection.tsx:261` — `: window.innerWidth >= 768`
- `src/app/lab/HomeLabTestSection.tsx:1994` — `window.location.reload()`
- `src/app/lab/HealthPackageExplorer.tsx:424` — `window.addEventListener("resize", updateScrollState);`
- `src/app/lab/HealthPackageExplorer.tsx:435` — `window.removeEventListener(`
- `src/app/lab/HealthPackageExplorer.tsx:457` — `window.getComputedStyle(container);`
- `src/app/lab/HealthPackageExplorer.tsx:470` — `window.innerWidth >= 1280`
- `src/app/lab/HealthPackageExplorer.tsx:472` — `: window.innerWidth >= 1024`
- `src/app/lab/HealthPackageExplorer.tsx:474` — `: window.innerWidth >= 768`
- `src/app/lab/LabSeoContentSection.tsx:74` — `"The sample collector arrives during the selected collection window.",`
- `src/hooks/useCompare.ts:12` — `const parsed: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");`
- `src/hooks/useCompare.ts:15` — `localStorage.removeItem(KEY);`
- `src/hooks/useCompare.ts:25` — `if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(limited));`
- `public/data.json:48688` — `"subtitle": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliabilit",`
- `public/data.json:48729` — `"shortDescription": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/data.json:48730` — `"description": "Rolex Datejust is a real ecommerce catalog item with dynamic product details, unique product imagery, current price, stock, ratings and delivery information for online shopping. The Rolex Datejust is an i`
- `public/data.json:49035` — `"metaDescription": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/data.json:49046` — `"description": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/data.json:49129` — `"description": "Rolex Datejust is a real ecommerce catalog item with dynamic product details, unique product imagery, current price, stock, ratings and delivery information for online shopping. The Rolex Datejust is an i`
- `public/data.json:49130` — `"shortDescription": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/data/products.json:48688` — `"subtitle": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliabilit",`
- `public/data/products.json:48729` — `"shortDescription": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/data/products.json:48730` — `"description": "Rolex Datejust is a real ecommerce catalog item with dynamic product details, unique product imagery, current price, stock, ratings and delivery information for online shopping. The Rolex Datejust is an i`
- `public/data/products.json:49035` — `"metaDescription": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/data/products.json:49046` — `"description": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/data/products.json:49129` — `"description": "Rolex Datejust is a real ecommerce catalog item with dynamic product details, unique product imagery, current price, stock, ratings and delivery information for online shopping. The Rolex Datejust is an i`
- `public/data/products.json:49130` — `"shortDescription": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/catalog/categories/fashion-accessories.json:2047` — `"subtitle": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliabilit",`
- `public/catalog/categories/fashion-accessories.json:2088` — `"shortDescription": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/catalog/categories/fashion-accessories.json:2089` — `"description": "Rolex Datejust is a real ecommerce catalog item with dynamic product details, unique product imagery, current price, stock, ratings and delivery information for online shopping. The Rolex Datejust is an i`
- `public/catalog/categories/fashion-accessories.json:2394` — `"metaDescription": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/catalog/categories/fashion-accessories.json:2405` — `"description": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/catalog/categories/fashion-accessories.json:2488` — `"description": "Rolex Datejust is a real ecommerce catalog item with dynamic product details, unique product imagery, current price, stock, ratings and delivery information for online shopping. The Rolex Datejust is an i`
- `public/catalog/categories/fashion-accessories.json:2489` — `"shortDescription": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/catalog/brands/rolex.json:1033` — `"subtitle": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliabilit",`
- `public/catalog/brands/rolex.json:1074` — `"shortDescription": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/catalog/brands/rolex.json:1075` — `"description": "Rolex Datejust is a real ecommerce catalog item with dynamic product details, unique product imagery, current price, stock, ratings and delivery information for online shopping. The Rolex Datejust is an i`
- `public/catalog/brands/rolex.json:1380` — `"metaDescription": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/catalog/brands/rolex.json:1391` — `"description": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`
- `public/catalog/brands/rolex.json:1474` — `"description": "Rolex Datejust is a real ecommerce catalog item with dynamic product details, unique product imagery, current price, stock, ratings and delivery information for online shopping. The Rolex Datejust is an i`
- `public/catalog/brands/rolex.json:1475` — `"shortDescription": "The Rolex Datejust is an iconic and versatile timepiece with a date window. Known for its timeless design and reliability, it's a symbol of Rolex's watchmaking excellence.",`


## 19. suppressHydrationWarning inventory
- `src/app/layout.tsx:38` — `<html lang="en" suppressHydrationWarning>`
- `src/app/layout.tsx:39` — `<body className="site-wrapper" suppressHydrationWarning>`


## 20. Dead code inventory
Approximate identical-content duplicates:
- No identical component files found.

Potential unused dependencies (heuristic import scan):
- `react-dom`


## 21. Unused dependency inventory
- `react-dom` — Problem: not found in static import/text scan; Severity: Low; Business impact: extra install/security surface; Technical impact: dependency drift; Recommended fix: verify with depcheck before removal; Timing: Later.


## 22–25. Risk and gap reports
| File path | Problem | Severity | Business impact | Technical impact | Recommended fix | Timing |
|---|---|---|---|---|---|---|
| `src/Components/auth/LoginModal.tsx:252` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/Components/auth/LoginModal.tsx:277` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/context/CartContext.tsx:14` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/context/CartContext.tsx:15` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/context/CartContext.tsx:32` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/context/WishlistContext.tsx:57` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/context/WishlistContext.tsx:62` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/context/WishlistContext.tsx:74` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/context/WishlistContext.tsx:93` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/context/AuthContext.tsx:42` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/context/AuthContext.tsx:45` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/context/AuthContext.tsx:62` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/context/AuthContext.tsx:91` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/context/AuthContext.tsx:103` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/lib/api-client.ts:8` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/hooks/useCompare.ts:12` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/hooks/useCompare.ts:15` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `src/hooks/useCompare.ts:25` | Direct browser localStorage access | Medium | Guest cart/auth/wishlist can diverge when remote backend is added | Hydration/client-only coupling and duplicated persistence logic | Move access behind repositories/hooks; keep UI unaware of storage | Immediate for touched modules, later for full migration |
| `RESPONSIVE_ECOMMERCE_README.md:186` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `RESPONSIVE_ECOMMERCE_README.md:192` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `README.md:49` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `PRODUCTION_FOUNDATION.md:50` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/Components/HomeComponents/README.md:3` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/Components/HomeComponents/README.md:25` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/Components/HomeComponents/product-data.ts:52` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/Components/HomeComponents/UPDATED_README.md:3` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/Components/HomeComponents/UPDATED_README.md:22` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/lib/data.ts:8` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/lib/data.ts:9` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/lib/products.ts:79` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/api/products/search/route.ts:46` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/products/[slug]/page.tsx:240` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/products/[slug]/page.tsx:280` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/CraveCartSection.tsx:67` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/CraveCartSection.tsx:74` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/CraveCartSection.tsx:82` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/LifestyleProductSections.tsx:124` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/LifestyleProductSections.tsx:131` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/LifestyleProductSections.tsx:139` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/BabyCareHubSection.tsx:91` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/BabyCareHubSection.tsx:98` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/BabyCareHubSection.tsx:106` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/VetCareAndBrandsSection.tsx:166` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/VetCareAndBrandsSection.tsx:173` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/VetCareAndBrandsSection.tsx:181` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/VetCareAndBrandsSection.tsx:1854` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/SunAndSplashSection.tsx:68` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/app/store/SunAndSplashSection.tsx:75` | Direct catalog JSON reference | High | Large catalog can be downloaded/parsed unnecessarily and blocks real API migration | UI/data layer coupling | Use ProductRepository or /api/catalog/products instead of direct /data.json reads | Immediate for list/search pages |
| `src/lib/api-client.ts:12` | Client-controlled x-user-phone identity header | High | Users could spoof identity if trusted by backend | Auth boundary is not server trusted | Replace with HttpOnly session-derived identity on server APIs | Immediate before production |
| `src/app/orders/MyOrdersPage.tsx:69` | Client-controlled x-user-phone identity header | High | Users could spoof identity if trusted by backend | Auth boundary is not server trusted | Replace with HttpOnly session-derived identity on server APIs | Immediate before production |
| `src/app/api/orders/route.ts:5` | Client-controlled x-user-phone identity header | High | Users could spoof identity if trusted by backend | Auth boundary is not server trusted | Replace with HttpOnly session-derived identity on server APIs | Immediate before production |
| `src/app/api/orders/[orderId]/route.ts:5` | Client-controlled x-user-phone identity header | High | Users could spoof identity if trusted by backend | Auth boundary is not server trusted | Replace with HttpOnly session-derived identity on server APIs | Immediate before production |
| `src/app/api/orders/[orderId]/return/route.ts:3` | Client-controlled x-user-phone identity header | High | Users could spoof identity if trusted by backend | Auth boundary is not server trusted | Replace with HttpOnly session-derived identity on server APIs | Immediate before production |
| `src/app/api/orders/[orderId]/buy-again/route.ts:3` | Client-controlled x-user-phone identity header | High | Users could spoof identity if trusted by backend | Auth boundary is not server trusted | Replace with HttpOnly session-derived identity on server APIs | Immediate before production |
| `src/app/api/orders/[orderId]/invoice/route.ts:3` | Client-controlled x-user-phone identity header | High | Users could spoof identity if trusted by backend | Auth boundary is not server trusted | Replace with HttpOnly session-derived identity on server APIs | Immediate before production |
| `src/app/api/orders/[orderId]/cancel/route.ts:4` | Client-controlled x-user-phone identity header | High | Users could spoof identity if trusted by backend | Auth boundary is not server trusted | Replace with HttpOnly session-derived identity on server APIs | Immediate before production |
| `src/app/api/orders/[orderId]/tracking/route.ts:3` | Client-controlled x-user-phone identity header | High | Users could spoof identity if trusted by backend | Auth boundary is not server trusted | Replace with HttpOnly session-derived identity on server APIs | Immediate before production |
| `src/app/api/orders/[orderId]/review/route.ts:3` | Client-controlled x-user-phone identity header | High | Users could spoof identity if trusted by backend | Auth boundary is not server trusted | Replace with HttpOnly session-derived identity on server APIs | Immediate before production |
| `src/app/api/profile/[[...section]]/route.ts:51` | Client-controlled x-user-phone identity header | High | Users could spoof identity if trusted by backend | Auth boundary is not server trusted | Replace with HttpOnly session-derived identity on server APIs | Immediate before production |
| `PRODUCTION_FOUNDATION.md:30` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/Components/auth/MobileLoginModal.tsx:12` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/Components/auth/MobileLoginModal.tsx:123` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/Components/auth/MobileLoginModal.tsx:264` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/Components/auth/LoginModal.tsx:48` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/Components/auth/LoginModal.tsx:236` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/Components/auth/LoginModal.tsx:237` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/Components/auth/LoginModal.tsx:374` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/Components/auth/LoginModal.tsx:434` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/lib/auth-server.ts:3` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/app/api/auth/request-otp/route.ts:2` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/app/api/auth/request-otp/route.ts:21` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/app/api/auth/verify-otp/route.ts:2` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/app/api/auth/verify-otp/route.ts:22` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/app/api/auth/verify-otp/route.ts:23` | Hardcoded/demo OTP reference | High | Unsafe if confused with production auth | Demo-only auth path can leak into production | Keep behind development/provider adapter and real SMS verification | Immediate before production SMS |
| `src/lib/orders.ts:251` | Hardcoded or browser-side price/total logic | High | Checkout totals can be inaccurate or tampered with | Trusted pricing missing server recalculation | Use server checkout quote/order calculation; UI displays estimates only | Immediate before payment/order production |
| `src/app/orders/MyOrdersPage.tsx:62` | Hardcoded or browser-side price/total logic | High | Checkout totals can be inaccurate or tampered with | Trusted pricing missing server recalculation | Use server checkout quote/order calculation; UI displays estimates only | Immediate before payment/order production |
| `src/app/products/[slug]/ProductImageSlider.tsx:23` | Hardcoded or browser-side price/total logic | High | Checkout totals can be inaccurate or tampered with | Trusted pricing missing server recalculation | Use server checkout quote/order calculation; UI displays estimates only | Immediate before payment/order production |
| `src/Components/Footer.tsx:301` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/Components/Footer.tsx:490` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/Components/Footer.tsx:706` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/Components/Footer.tsx:991` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/Components/Footer.tsx:1044` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/Components/Footer.tsx:1073` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/Components/HomeComponents/EspeciallyForYou.tsx:1290` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/Components/HomeComponents/SharedEcommerceBanner.tsx:133` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/Components/HomeComponents/ProductSection.tsx:190` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/doctor/DoctorComingSoon.tsx:95` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/store/CraveCartSection.tsx:1184` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/store/LifestyleProductSections.tsx:1268` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/store/BabyCareHubSection.tsx:397` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/store/BabyCareHubSection.tsx:1568` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/store/VetCareAndBrandsSection.tsx:1499` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/store/VetCareAndBrandsSection.tsx:1635` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/store/AllYourNeeds.tsx:757` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/store/SunAndSplashSection.tsx:1205` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/store/components/StoreProductCard.tsx:34` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/lab/HomeLabTestSection.tsx:1568` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/lab/HomeLabTestSection.tsx:1727` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/lab/HealthPackageExplorer.tsx:1602` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/lab/HealthPackageExplorer.tsx:1751` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/lab/HealthPackageExplorer.tsx:1805` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/lab/HealthPackageExplorer.tsx:1894` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/lab/HealthPackageExplorer.tsx:1913` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/lab/HealthPackageExplorer.tsx:1929` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/lab/TrustedLabPartners.tsx:1227` | Unoptimized <img> usage | Medium | Slower LCP/CLS and bandwidth waste | Bypasses Next/Image optimization | Use next/image with fixed dimensions or documented exception | Later unless on hero/product critical path |
| `src/app/store/CraveCartSection.tsx:1528` | window.location.reload usage | Medium | Poor UX and state loss | Bypasses React/Next cache/state model | Use router.refresh or local state invalidation | Later unless action is broken |
| `src/app/store/LifestyleProductSections.tsx:1599` | window.location.reload usage | Medium | Poor UX and state loss | Bypasses React/Next cache/state model | Use router.refresh or local state invalidation | Later unless action is broken |
| `src/app/store/BabyCareHubSection.tsx:1917` | window.location.reload usage | Medium | Poor UX and state loss | Bypasses React/Next cache/state model | Use router.refresh or local state invalidation | Later unless action is broken |
| `src/app/store/VetCareAndBrandsSection.tsx:1884` | window.location.reload usage | Medium | Poor UX and state loss | Bypasses React/Next cache/state model | Use router.refresh or local state invalidation | Later unless action is broken |
| `src/app/store/SunAndSplashSection.tsx:1554` | window.location.reload usage | Medium | Poor UX and state loss | Bypasses React/Next cache/state model | Use router.refresh or local state invalidation | Later unless action is broken |
| `src/app/lab/HomeLabTestSection.tsx:1994` | window.location.reload usage | Medium | Poor UX and state loss | Bypasses React/Next cache/state model | Use router.refresh or local state invalidation | Later unless action is broken |
| `src/app/layout.tsx:38` | suppressHydrationWarning present | Medium | Can hide real hydration mismatches | Masks SSR/client divergence | Remove once dynamic client-only values are isolated | Later after SSR audit |
| `src/app/layout.tsx:39` | suppressHydrationWarning present | Medium | Can hide real hydration mismatches | Masks SSR/client divergence | Remove once dynamic client-only values are isolated | Later after SSR audit |
| `src/app/lab/HealthPackageExplorer.tsx` | Large source file (2116 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/app/lab/HomeLabTestSection.tsx` | Large source file (2003 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/app/store/BabyCareHubSection.tsx` | Large source file (1926 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/app/store/VetCareAndBrandsSection.tsx` | Large source file (1892 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/app/store/LifestyleProductSections.tsx` | Large source file (1607 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/app/store/SunAndSplashSection.tsx` | Large source file (1563 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/app/store/CraveCartSection.tsx` | Large source file (1537 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/app/lab/LabSeoContentSection.tsx` | Large source file (1450 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/Components/HomeComponents/EspeciallyForYou.tsx` | Large source file (1431 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/app/lab/TrustedLabPartners.tsx` | Large source file (1375 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/Components/SectionNavigation.tsx` | Large source file (1290 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/Components/AboveFooterVideo.tsx` | Large source file (1287 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/Components/Footer.tsx` | Large source file (1187 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/Components/HomeComponents/AllYouNeed.tsx` | Large source file (955 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/app/store/AllYourNeeds.tsx` | Large source file (799 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/Components/HomeComponents/ProductSection.tsx` | Large source file (682 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/Components/cart/CartDrawer.tsx` | Large source file (581 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/Components/auth/LoginModal.tsx` | Large source file (492 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/Components/HomeComponents/SeoContentSection.tsx` | Large source file (465 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/app/products/[slug]/page.tsx` | Large source file (448 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/lib/orders.ts` | Large source file (383 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/Components/TopNavber.tsx` | Large source file (353 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/types/product.ts` | Large source file (347 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/Components/auth/MobileLoginModal.tsx` | Large source file (285 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `src/app/[...categoryPath]/category-data.ts` | Large source file (255 lines) | Medium | Harder to safely evolve ecommerce flows | Higher regression risk and review overhead | Split into feature components/hooks/services | Later except navbar/cart/auth touched in next phase |
| `package.json` | Possibly unused dependency `react-dom` | Low | Slight install/bundle/security surface cost | May be dead dependency or dynamic import missed | Confirm with depcheck before removal | Later |


## Security risk report

- Client-controlled identity headers and browser-side totals must not be trusted by production APIs.
- Current demo OTP is acceptable only for development and must be replaced by a provider-backed OTP challenge.
- Payment, role, stock, discount, tax and order status must be calculated/verified server-side.

## Accessibility risk report

- Large interactive components need a dedicated keyboard/focus audit.
- Modals and drawers should maintain focus trap, Escape close, aria labels and 44px touch targets.
- Toast messages should remain supplementary; form errors still need inline accessible messages.

## Performance risk report

- Direct JSON fetches and large client components are the highest near-term risk.
- Product listing pages should consume paginated APIs/indexes and avoid parsing the full catalog in the browser.
- Unoptimized `<img>` usage should be migrated to `next/image` on above-the-fold and product-grid surfaces.

## Functionality gap report

- External SMS, payment gateways, database/ERP/Frappe, real remote product API, real search engine and observability integrations are not present.
- Local repositories and remote placeholders now define the seam for those integrations without rewriting UI components.
