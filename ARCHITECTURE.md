# Architecture

## Overview

Huepfburgen App is an Angular/Firebase application for managing inflatable castle rentals.

The current architecture is frontend-first:

- Angular standalone components for pages, dialogs, guards, and layout
- Angular Material for UI primitives
- AngularFire for Firebase Auth and Firestore access
- Firestore as the primary data store
- Firebase security rules as the backend authorization boundary
- GitHub Actions for build and ALL-INKL deployment

## Application Areas

- `src/app/pages/home`: public landing/home area
- `src/app/pages/login`: login flow
- `src/app/pages/register`: registration flow
- `src/app/pages/user/bookings`: user booking calendar and request flow
- `src/app/pages/admin/admin`: admin dashboard
- `src/app/pages/admin/bookings`: admin booking management
- `src/app/pages/admin/equipment`: equipment management
- `src/app/pages/admin/users`: user management
- `src/app/features/booking`: shared booking dialog
- `src/app/services`: Firebase-backed data and auth services
- `src/app/guards`: route protection
- `src/app/models`: shared TypeScript data shapes

## Data Model

Primary Firestore collections:

- `users`
- `equipment`
- `bookings`

Planned read-model split:

- `equipment_availability` for sanitized calendar availability data

Booking status values:

- `offen`
- `bestätigt`
- `storniert`

Keep these values synchronized between:

- `src/app/models/booking.ts`
- booking UI components
- `firestore.rules`

## Security Boundary

Firestore rules are the source of truth for data access enforcement.

Current intent:

- Signed-in users can read equipment and bookings.
- Users can create their own open booking requests.
- Admins can create, update, and delete equipment and bookings.
- Admins can manage user documents.

Future direction:

- normal users should read sanitized availability data instead of full booking records,
- admins should keep full booking management access,
- booking owners may later read their own booking details.

## Deployment

The app is served below `/huepfburgen-app/`.

Production deployment must use:

```bash
npm run build:deploy
npm run verify:base-href
```

The GitHub Actions workflow is located at `.github/workflows/deploy-all-inkl.yml`.

## Out-of-Scope Context

`docs/legacy-other-projects/react-fastify-postgresql-saas/` contains architecture notes for another React/Fastify/PostgreSQL SaaS project. It is not the source of truth for this Angular/Firebase app.
