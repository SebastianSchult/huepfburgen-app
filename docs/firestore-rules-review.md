# Firestore Rules Review

Date: 2026-06-24

## Scope

This review covers the current `firestore.rules` file against the active Angular/Firebase app flows.

Active collections:

- `users`
- `equipment`
- `bookings`

## Current Intended Flows

### Users

- Registration needs to check whether an email exists in `users`.
- Admin user management needs to list, create, update, and delete user placeholders.
- Admin detection reads `users/{uid}` and checks `role == 'admin'`.

Current rule shape:

- `users` read access is open to everyone.
- Users can create/update their own profile with role `user`.
- Admins can create/update/delete user documents.

Risk:

- Public read access to `users` exposes user emails and roles.

Current status:

- Accepted temporarily because the registration flow currently depends on reading placeholder users by email.
- Should be redesigned after the availability-vs-booking-data split and registration hardening.

### Equipment

- Signed-in users can read equipment for booking selection and calendars.
- Admins can create, update, and delete equipment.

Current rule shape:

- Signed-in users can read equipment.
- Admins can write equipment.

Risk:

- No major immediate issue for MVP.
- Image handling should move away from large Base64 Firestore fields later.

### Bookings

- Signed-in users need availability context for booking calendars.
- Users can create their own open booking requests.
- Admins can update booking status and manage booking records.

Current rule shape:

- Signed-in users can read all bookings.
- Users can create bookings only for themselves and only with status `offen`.
- Admins can update/delete bookings.

Risk:

- Signed-in users can read booking details for other users, including `bookedFor` and `locationOverride`.

Current status:

- Accepted temporarily because the current calendar uses booking records directly for availability.
- Should be replaced with a less sensitive availability read model or sanitized public booking projection.

## Recommended Follow-Up

1. Introduce an availability-focused read model or query shape that exposes only blocked dates per equipment.
2. Restrict normal user booking reads to their own bookings.
3. Keep full booking detail reads admin-only.
4. Replace public `users` reads with a safer registration invitation or callable/backend-mediated lookup.
5. Add Firestore rules tests before tightening access rules.

