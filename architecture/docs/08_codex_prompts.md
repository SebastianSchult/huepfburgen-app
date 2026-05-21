# Codex-Prompts – Startpaket für das SaaS-Projekt

## Nutzung

Diese Prompts sind dafür gedacht, Codex schrittweise an klar abgegrenzten Aufgaben arbeiten zu lassen.  
Wichtig: immer nur ein Modul oder einen kleinen vertikalen Slice gleichzeitig umsetzen lassen.

---

## Prompt 1 – Backend-Grundgerüst erstellen

```text
Create a production-oriented backend starter for a multi-tenant SaaS rental platform.

Tech stack:
- Node.js
- TypeScript
- Fastify
- Prisma or Drizzle
- PostgreSQL
- Zod for validation

Requirements:
- Modular folder structure
- Environment config
- Health endpoint
- API prefix /api/v1
- Error handling middleware
- Request logging
- JWT-ready auth foundation
- Tenant-aware architecture
- Docker-ready setup

Expected output:
1. Proposed folder structure
2. All files to create
3. Minimal implementation
4. Clear comments for future modules

Before making changes, list all files you will create or modify.
```

---

## Prompt 2 – Auth + Tenant Middleware

```text
Implement the authentication foundation for a multi-tenant SaaS backend.

Requirements:
- Email/password login endpoint
- JWT generation
- JWT verification middleware
- Attach authenticated user context to request
- Resolve tenantId from JWT, not from request payload
- Role field support: owner, admin, staff, viewer
- Add GET /api/v1/auth/me
- Use Zod validation
- Keep code modular

Important:
- Do not add business logic beyond auth
- Add clear types for AuthUser and Request context
- Show modified files before changes
```

---

## Prompt 3 – PostgreSQL schema / ORM models

```text
Create the initial database schema for a multi-tenant SaaS rental platform.

Entities:
- tenants
- users
- locations
- equipment_categories
- equipment
- customers
- bookings
- booking_items
- equipment_unavailability

Requirements:
- UUID primary keys
- tenant_id in all business tables
- timestamps
- sensible indexes and constraints
- enum types for user roles, booking status, equipment status
- prepare for future support_sessions, audit_logs, platform_admins

Deliver:
1. ORM schema
2. SQL migration
3. Seed-friendly structure
4. Notes on tenant safety
```

---

## Prompt 4 – Equipment module

```text
Implement the Equipment module for a multi-tenant SaaS backend.

Endpoints:
- GET /api/v1/equipment
- GET /api/v1/equipment/:id
- POST /api/v1/equipment
- PATCH /api/v1/equipment/:id
- DELETE /api/v1/equipment/:id

Requirements:
- Tenant-safe queries only
- Filter support: search, status, categoryId, locationId, pagination
- Zod validation
- route/controller/service/repository structure
- soft delete or archive behavior instead of hard delete
- proper error handling
- response DTOs

Before coding:
- list files to modify
- explain query/filter strategy briefly
```

---

## Prompt 5 – Customers module

```text
Implement the Customers module for a multi-tenant SaaS backend.

Endpoints:
- GET /api/v1/customers
- GET /api/v1/customers/:id
- POST /api/v1/customers
- PATCH /api/v1/customers/:id
- DELETE /api/v1/customers/:id

Requirements:
- Tenant-safe access
- Search + pagination
- private/business customer logic
- validation with Zod
- clear error messages
- archive instead of hard delete if bookings exist

Before making changes, show all affected files.
```

---

## Prompt 6 – Booking module with conflict detection

```text
Implement the Booking module for a multi-tenant SaaS backend.

Endpoints:
- GET /api/v1/bookings
- GET /api/v1/bookings/:id
- POST /api/v1/bookings
- PATCH /api/v1/bookings/:id
- DELETE /api/v1/bookings/:id

Requirements:
- tenant-safe queries
- booking_number generation per tenant
- validate start_date/end_date
- detect equipment conflicts against bookings and equipment_unavailability
- support multiple booking items
- calculate subtotal, deposit, total
- modular structure with service layer
- add unit-testable logic where reasonable

Important:
- Do not trust pricing from frontend
- Backend owns booking conflict rules
- show file list before coding
```

---

## Prompt 7 – Availability module

```text
Implement availability endpoints for the rental SaaS backend.

Endpoints:
- GET /api/v1/availability
- POST /api/v1/availability/check

Requirements:
- return tenant-safe availability results
- support startDate/endDate filtering
- optional category filter
- detect reasons: booking_conflict, maintenance, manual_block
- keep logic reusable for BookingService

Deliver:
- routes
- controller
- service
- repository/query helpers
- response schemas
```

---

## Prompt 8 – Platform admins + support sessions

```text
Design and implement the platform support foundation for the SaaS backend.

Entities:
- platform_admins
- support_sessions
- audit_logs

Requirements:
- separate platform admin auth from tenant users
- support session creation with mandatory reason
- tenant impersonation token or server-side support context
- expiration handling
- audit logging for every support session start/end
- visible foundation for future support-mode UI
- secure separation between tenant users and global platform admins

Important:
- do not model platform admins as normal tenant users
- show files before changes
- explain security assumptions
```

---

## Prompt 9 – Worker / Queue foundation

```text
Create the async processing foundation for the SaaS backend.

Stack:
- BullMQ
- Redis
- Node.js worker

Requirements:
- define job types for:
  - booking confirmation email
  - document generation
  - reminder scheduling
- create queue module
- create worker bootstrap
- keep implementation minimal but production-oriented
- add retry strategy placeholders
- add notes for n8n integration later

Before coding, show all files to create or modify.
```

---

## Prompt 10 – OpenAPI / API docs

```text
Generate API documentation foundation for the current Fastify-based SaaS backend.

Requirements:
- document all current MVP endpoints
- include auth requirements
- include tenant-safe behavior notes
- include platform admin / support session endpoints if available
- keep examples realistic
- organize docs so they can grow with the project
```

---

## Empfohlene Reihenfolge

1. Backend-Grundgerüst
2. Auth + Tenant Middleware
3. Schema / ORM
4. Equipment
5. Customers
6. Bookings
7. Availability
8. Platform support
9. Queue / Worker
10. API docs

---

## Arbeitsregel mit Codex

Vor jedem größeren Schritt:
- Datei-Liste zeigen lassen
- Scope klein halten
- einen klaren Endpunkt oder ein Modul pro Schritt
- nach jedem Schritt lokal testen
- erst dann nächsten Prompt geben
