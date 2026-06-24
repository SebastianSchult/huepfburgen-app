# Availability vs Booking Data Concept

Date: 2026-06-24

## Problem

The current user booking calendar reads booking records directly to show blocked equipment dates.

That is simple for the MVP, but it mixes two different needs:

- Availability: users need to know whether equipment is blocked.
- Booking details: admins need customer, owner, status, and location context.

The current approach makes signed-in users able to read more booking detail than they need.

## Target Direction

Separate availability data from booking detail data.

Normal users should see:

- equipment id,
- blocked start date,
- blocked end date,
- public status label such as `blocked` or `requested`,
- no user email,
- no `createdBy`,
- no `bookedFor`,
- no `locationOverride`.

Admins should keep access to full booking records.

Booking owners may later get access to their own booking details.

## Option A: Sanitized Availability Projection

Create a separate Firestore collection, for example:

```txt
equipment_availability/{availabilityId}
```

Suggested fields:

```ts
{
  equipmentId: string;
  startDate: string;
  endDate: string;
  status: 'requested' | 'blocked';
  sourceBookingId?: string;
}
```

Rules direction:

- signed-in users can read availability documents,
- only admins or trusted automation can write availability documents,
- full bookings become admin-only plus owner-specific reads.

Pros:

- clean security boundary,
- simple calendar reads,
- future-proof for maintenance blocks.

Cons:

- requires keeping booking and availability data in sync.

## Option B: Client-Side Sanitizing Query

Keep reading `bookings` but only render non-sensitive fields.

Pros:

- no migration.

Cons:

- does not solve the Firestore security issue because rules still expose the full document.

Decision:

- Not recommended beyond the current MVP phase.

## Option C: Backend/Callable Availability Endpoint

Expose availability through a backend function or callable API.

Pros:

- strongest control over output shape,
- avoids public reads of full booking data.

Cons:

- more infrastructure than the current Angular/Firebase-only app has.

Decision:

- Useful later, but not the smallest next step.

## Recommended Next Step

Use Option A when tightening Firestore rules:

1. Add an `equipment_availability` read model.
2. Populate it from confirmed and open bookings.
3. Update user calendars to read availability documents.
4. Restrict normal user reads on `bookings` to owner-only.
5. Keep admins on full booking reads.

## Open Questions

- Should open booking requests block availability immediately or only after admin confirmation?
- Should cancelled bookings remain visible to users as historical blocks? Current recommendation: no.
- Should maintenance/unavailability use the same read model? Current recommendation: yes.

