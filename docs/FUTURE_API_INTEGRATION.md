Updated: 2026-07-23

Branch: test-branch

# Future API Integration Guide

Set `DATA_SOURCE=api` and provide `API_BASE_URL` only after backend endpoints exist.

External providers still required:
- SMS OTP provider.
- Frappe/ERPNext or commerce backend.
- Real payment providers: bKash, Nagad, SSLCommerz, Stripe, PayPal.
- Webhook signing secrets.
- File storage and virus scanning for prescriptions.
- Production search provider.

Never trust browser-submitted price, stock, discount, shipping, VAT, user ID, role, order status, or payment status.
