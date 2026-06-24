# Roadmap

## Current Status

The app already contains the core Angular/Firebase foundation:

- Authentication flow
- Protected user routes
- Protected admin routes
- Equipment management
- Booking calendar and booking dialog
- Admin booking views
- Firebase/Firestore integration
- ALL-INKL deployment workflow

## Confirmed Step-by-Step Plan

Each item is handled independently. After every completed item:

1. update the relevant documentation,
2. run the appropriate verification,
3. commit the change,
4. push the commit to GitHub.

### 1. Repository Governance

- [x] 1.1 Add root-level agent and project Markdown files.
- [x] 1.2 Move unrelated `architecture/docs` content into a clearly marked legacy/other-project folder.

### 2. Deployment Reliability

- [x] 2.1 Update GitHub Actions to use `npm run build:deploy` and `npm run verify:base-href`.
- [x] 2.2 Add a separate CI workflow for install, build, and tests.
- [x] 2.3 Document the current bundle budget warning.

### 3. Booking Flow Stabilization

- [x] 3.1 Add stronger booking dialog validation.
- [x] 3.2 Add conflict checks when admins confirm bookings.
- [ ] 3.3 Improve empty states in admin booking views.

### 4. Firestore and Security Rules

- [ ] 4.1 Review Firestore rules against current UI flows.
- [ ] 4.2 Plan and document an availability-vs-booking-data concept.
- [ ] 4.3 Remove or fix the unused permissive admin guard.

### 5. Admin Booking UX

- [ ] 5.1 Add or plan admin booking filters for status, date range, and equipment.

## Completed Work

- [x] 2026-06-24: Root-level repository governance files added according to the SebsBrain starter pattern.
- [x] 2026-06-24: Unrelated SaaS architecture docs moved to `docs/legacy-other-projects/react-fastify-postgresql-saas/`.
- [x] 2026-06-24: Deployment workflow updated to run `npm run build:deploy` and `npm run verify:base-href`.
- [x] 2026-06-24: Separate CI workflow added for install, build, and headless unit tests.
- [x] 2026-06-24: Current Angular bundle budget warning documented as a performance follow-up.
- [x] 2026-06-24: Booking dialog validation now rejects past starts, invalid ranges, and overlapping active bookings through tested helpers.
- [x] 2026-06-24: Admin booking confirmation now checks conflicts against confirmed bookings before updating status.
- [x] Admin upcoming rentals section exists.
- [x] Deploy-safe build script exists in `package.json`.
- [x] README documents the required `/huepfburgen-app/` base href.

## Roadmap Sync Policy

Whenever all planned items in a section are completed, update this file immediately:

- mark completed work,
- create the next small planned section,
- update `DECISIONS.md` if a lasting decision was made,
- update `KNOWN_ISSUES.md` if unresolved risks remain.
