# API

## Auth

| Method | Route | Status |
|---|---|---|
| `POST` | `/api/auth/request-otp` | local/demo OTP, rate-limit hook |
| `POST` | `/api/auth/verify-otp` | validates demo OTP and sets HttpOnly session cookie |
| `POST` | `/api/auth/logout` | clears cookies |
| `GET` | `/api/auth/session` | returns session user from cookie |
| `DELETE` | `/api/auth/session` | clears session |

## Catalog

| Method | Route | Status |
|---|---|---|
| `GET` | `/api/catalog/products` | local JSON index, filter/sort/pagination |
| `GET` | `/api/catalog/suggest` | local JSON index suggestions |
| `GET` | `/api/products/search` | existing search route preserved |

## Orders/profile

Existing local API routes remain under `/api/orders` and `/api/profile`. They are not production authority yet and should be moved behind repositories/server validation before external checkout/payment launch.

## Environment

See `.env.example` for `DATA_SOURCE`, `API_BASE_URL`, OTP, payment, search and analytics placeholders.
