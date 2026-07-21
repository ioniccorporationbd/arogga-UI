# Dynamic Category Page Update

- Every route from `public/menu-links.json` opens the same reusable category catalog layout.
- Only the category title, breadcrumb, related category links and matching product selection change dynamically.
- Root catch-all route: `src/app/[...categoryPath]/page.tsx`
- Interactive catalog: `src/app/[...categoryPath]/CategoryCatalog.tsx`
- Menu route lookup and product selection: `src/app/[...categoryPath]/category-data.ts`
- Category styles: `src/app/[...categoryPath]/category-page.module.css`
- Product links open `/products/[slug]`.
- Category navigation loads `public/menu-links.json`.

## Run

```powershell
cd C:\projects\arogga
npm install
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

Keep the extracted project path short on Windows to prevent Turbopack path-length errors.
