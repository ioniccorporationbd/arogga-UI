# Future API Integration

## Switching source

```env
DATA_SOURCE=api
API_BASE_URL=https://api.example.com
```

Remote repositories currently throw `NotConfiguredError` by design. Implement each remote adapter to call the backend while preserving the same interfaces.

## Frappe / ERPNext mapping

Recommended mapping:

| UI repository | Frappe/ERPNext source |
|---|---|
| ProductRepository | Item, Item Price, Website Item, Item Group, Brand, Bin |
| CartRepository | Quotation or custom Cart DocType |
| WishlistRepository | custom Wishlist DocType |
| OrderRepository | Sales Order, Sales Invoice, Delivery Note |
| ProfileRepository | User, Customer, Contact |
| AddressRepository | Address linked to Customer/Contact |
| NotificationRepository | Notification Log, Communication, custom inbox DocType |

## Backend rules

Never trust client-submitted price, discount, tax, shipping, stock, payment status, order status, role or wallet balance. The backend must recalculate checkout and verify payment webhooks with idempotency keys.

## Migration risks

- Product field names can differ between current JSON and ERPNext. Use normalization at repository boundary.
- Guest cart migration needs a server merge policy.
- Payment webhooks need signature verification and audit logs.
- Search may require Typesense/Meilisearch/Algolia/OpenSearch once catalog size grows.
