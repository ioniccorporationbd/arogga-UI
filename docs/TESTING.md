Updated: 2026-07-23

Branch: test-branch

# Testing Guide

Configured:
- Vitest
- React Testing Library
- jest-dom
- MSW
- Playwright

Commands:
```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
npx playwright test
```

Coverage includes auth, OTP rules, pending auth actions, cart variants, recalculation, wishlist gating, account summary, inbox, orders, addresses, checkout idempotency, security helpers, and Playwright route/API smoke tests.
