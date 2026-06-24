# QA Guidelines

## Local Verification

Use the smallest verification set that matches the change.

For general code changes:

```bash
npm run build
```

For deployment-sensitive changes:

```bash
npm run build:deploy
npm run verify:base-href
```

For unit tests:

```bash
npm test
```

For CI-style unit tests:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

## Manual Smoke Tests

Before deployment-sensitive work is considered done, manually verify:

- Home page loads.
- Login page loads.
- Registration page loads.
- Auth guard redirects unauthenticated users away from protected routes.
- Admin guard blocks non-admin users.
- User booking calendar opens.
- Booking dialog can create an open request.
- Admin bookings page shows open, confirmed, and cancelled bookings correctly.
- Admin dashboard shows upcoming confirmed rentals.
- Equipment list loads and admin equipment actions still work.

## Regression Focus

High-risk areas:

- Booking date handling
- Booking status transitions
- Firestore document shape changes
- Firebase Auth state handling
- Admin role detection
- Deployment base href
- Mobile layout for booking and admin views

Booking dialog checks should cover:

- required equipment and dates,
- start date not in the past,
- end date not before start date,
- overlaps with non-cancelled existing bookings.

Admin booking confirmation checks should cover:

- open booking exists before status update,
- same-equipment conflicts against already confirmed bookings,
- cancelled bookings do not block confirmation.

Admin booking empty states should be checked for:

- no open bookings,
- no confirmed bookings,
- no cancelled bookings,
- desktop and mobile layouts.

## Known Build Warning

`npm run build` and `npm run build:deploy` currently pass but emit an Angular budget warning:

- Initial bundle: `1.04 MB`
- Configured budget: `900 kB`
- Over budget: about `135 kB`

This is tracked as a performance follow-up and should not block the current stabilization sequence.

## Test Data

Keep test or demo data clearly separated from real customer data.

When using Firestore manually, record any required assumptions in `KNOWN_ISSUES.md` or `docs/`.
