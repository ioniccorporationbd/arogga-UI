# Routes

## Canonical routes

```text
/products/[slug]
/account
/account/orders
/account/inbox
/account/wishlist
/account/addresses
/account/patients
/account/prescriptions
/account/reviews
/cart
/checkout
/orders
/inbox
/wishlist
```

## Legacy redirects

Configured in `next.config.ts`:

| Legacy route | Canonical route |
|---|---|
| `/product/:slug` | `/products/:slug` |
| `/profile` | `/account` |
| `/profile/orders` | `/account/orders` |
| `/profile/inbox` | `/account/inbox` |
| `/profile/wishlist` | `/account/wishlist` |
| `/profile/addresses` | `/account/addresses` |
| `/profile/patients` | `/account/patients` |
| `/profile/prescriptions` | `/account/prescriptions` |
| `/profile/reviews` | `/account/reviews` |

Legacy route files are not deleted yet; redirects must remain verified before route removal.
