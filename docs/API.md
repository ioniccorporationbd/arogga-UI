Updated: 2026-07-23

Branch: test-branch

# API Inventory

- `/api/auth/logout`
- `/api/auth/request-otp`
- `/api/auth/session`
- `/api/auth/verify-otp`
- `/api/cart/recalculate`
- `/api/catalog/products`
- `/api/catalog/suggest`
- `/api/orders`
- `/api/orders/[orderId]`
- `/api/orders/[orderId]/buy-again`
- `/api/orders/[orderId]/cancel`
- `/api/orders/[orderId]/invoice`
- `/api/orders/[orderId]/return`
- `/api/orders/[orderId]/review`
- `/api/orders/[orderId]/tracking`
- `/api/products/search`
- `/api/profile/[[...section]]`

Important endpoints:
- `POST /api/cart/recalculate` recalculates trusted local cart totals.
- `GET /api/catalog/products` returns paginated card-sized product responses.
- `GET /api/catalog/suggest` returns search suggestions.
- Auth endpoints use session cookies, not client-provided phone headers.
