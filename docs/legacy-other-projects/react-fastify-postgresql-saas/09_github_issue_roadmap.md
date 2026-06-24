# GitHub-Issue-Roadmap – Event Rental SaaS

## Ziel

Diese Roadmap zerlegt das Projekt in umsetzbare GitHub-Issues.  
Die Reihenfolge ist so gewählt, dass zuerst das technische Fundament entsteht und danach die Fachlogik.

---

## Epic 1 – Project Foundation

### Issue 1
Set up monorepo or repo structure for frontend, backend, docs

### Issue 2
Add architecture docs folder and initial project documentation

### Issue 3
Initialize React frontend with TypeScript and Tailwind

### Issue 4
Initialize Fastify backend with TypeScript

### Issue 5
Add linting and formatting for frontend and backend

### Issue 6
Set up environment configuration strategy

### Issue 7
Add Docker Compose for local development

### Issue 8
Add health check endpoint to backend

### Issue 9
Set up shared error handling and logging

### Issue 10
Create base README with local setup instructions

---

## Epic 2 – Database Foundation

### Issue 11
Set up PostgreSQL locally and connect backend

### Issue 12
Choose ORM and add initial configuration

### Issue 13
Implement initial enums and base schema

### Issue 14
Create tenants table and migration

### Issue 15
Create users table and migration

### Issue 16
Create locations table and migration

### Issue 17
Create equipment_categories table and migration

### Issue 18
Create equipment table and migration

### Issue 19
Create customers table and migration

### Issue 20
Create bookings table and migration

### Issue 21
Create booking_items table and migration

### Issue 22
Create equipment_unavailability table and migration

### Issue 23
Add indexes and constraints for MVP tables

### Issue 24
Add updated_at trigger or ORM equivalent

### Issue 25
Add database seed foundation

---

## Epic 3 – Authentication and Tenant Safety

### Issue 26
Implement password hashing strategy

### Issue 27
Implement login endpoint

### Issue 28
Implement JWT generation and verification

### Issue 29
Add auth middleware for protected routes

### Issue 30
Add tenant-aware request context

### Issue 31
Implement GET /auth/me endpoint

### Issue 32
Define role-based authorization helpers

### Issue 33
Protect routes by tenant and role

### Issue 34
Add auth test cases for basic flows

---

## Epic 4 – Equipment Module

### Issue 35
Implement equipment category CRUD endpoints

### Issue 36
Implement locations CRUD endpoints

### Issue 37
Implement equipment list endpoint with filters

### Issue 38
Implement equipment detail endpoint

### Issue 39
Implement create equipment endpoint

### Issue 40
Implement update equipment endpoint

### Issue 41
Implement archive equipment behavior

### Issue 42
Add equipment validation schemas

### Issue 43
Add equipment module tests

---

## Epic 5 – Customer Module

### Issue 44
Implement customers list endpoint with search and pagination

### Issue 45
Implement customer detail endpoint

### Issue 46
Implement create customer endpoint

### Issue 47
Implement update customer endpoint

### Issue 48
Implement archive/delete customer rules

### Issue 49
Add customer validation schemas

### Issue 50
Add customer module tests

---

## Epic 6 – Booking Module

### Issue 51
Implement booking number generation per tenant

### Issue 52
Implement bookings list endpoint with filters

### Issue 53
Implement booking detail endpoint including booking items

### Issue 54
Implement create booking endpoint

### Issue 55
Implement update booking endpoint

### Issue 56
Implement cancel/archive booking behavior

### Issue 57
Implement booking item persistence

### Issue 58
Implement date-range validation rules

### Issue 59
Implement booking conflict detection against existing bookings

### Issue 60
Implement equipment unavailability conflict detection

### Issue 61
Implement pricing calculation service for MVP

### Issue 62
Add booking validation schemas

### Issue 63
Add booking module tests

---

## Epic 7 – Availability and Calendar Logic

### Issue 64
Implement GET /availability endpoint

### Issue 65
Implement POST /availability/check endpoint

### Issue 66
Implement equipment unavailability CRUD endpoints

### Issue 67
Add reusable availability query helpers

### Issue 68
Add availability tests

---

## Epic 8 – Dashboard and Basic UX Data

### Issue 69
Implement dashboard summary endpoint

### Issue 70
Add upcoming bookings query

### Issue 71
Add dashboard stats tests

---

## Epic 9 – Frontend Foundation

### Issue 72
Set up frontend routing and layout shell

### Issue 73
Implement auth screens and protected routes

### Issue 74
Create dashboard page scaffold

### Issue 75
Create equipment page scaffold

### Issue 76
Create customers page scaffold

### Issue 77
Create bookings page scaffold

### Issue 78
Add shared table and form UI components

### Issue 79
Add API client layer

### Issue 80
Add toast/error handling foundation

---

## Epic 10 – Frontend MVP Features

### Issue 81
Connect equipment list page to API

### Issue 82
Add equipment create/edit form

### Issue 83
Connect customer list page to API

### Issue 84
Add customer create/edit form

### Issue 85
Connect bookings list page to API

### Issue 86
Add booking create/edit flow

### Issue 87
Add availability UI for booking flow

### Issue 88
Add dashboard widgets

---

## Epic 11 – Platform Admin and Support Sessions

### Issue 89
Create platform_admins schema and migration

### Issue 90
Create support_sessions schema and migration

### Issue 91
Create audit_logs schema and migration

### Issue 92
Implement platform admin login

### Issue 93
Implement create support session endpoint

### Issue 94
Implement end support session endpoint

### Issue 95
Implement support session listing endpoint

### Issue 96
Implement impersonation token flow

### Issue 97
Implement audit logging for support actions

### Issue 98
Add support mode UI banner foundation

### Issue 99
Add support session tests

---

## Epic 12 – Async Processing and Automations

### Issue 100
Add Redis integration

### Issue 101
Add BullMQ queue setup

### Issue 102
Create worker bootstrap

### Issue 103
Add booking confirmation job

### Issue 104
Add document generation job placeholder

### Issue 105
Add reminder job placeholder

### Issue 106
Define n8n webhook integration strategy

### Issue 107
Add worker logging and retry configuration

---

## Epic 13 – Quality, Docs, and Delivery

### Issue 108
Add API documentation foundation

### Issue 109
Add architecture diagrams to docs

### Issue 110
Add seed/demo tenant data

### Issue 111
Add end-to-end smoke test plan

### Issue 112
Add CI pipeline for lint/test/build

### Issue 113
Add deployment notes for MVP

### Issue 114
Add monitoring/logging notes for next phase

### Issue 115
Add product roadmap and backlog grooming document

---

## Priorisierte erste 15 Issues

Wenn schnell gestartet werden soll, zuerst:

1. Issue 1
2. Issue 3
3. Issue 4
4. Issue 5
5. Issue 6
6. Issue 7
7. Issue 8
8. Issue 11
9. Issue 12
10. Issue 13
11. Issue 14
12. Issue 15
13. Issue 26
14. Issue 27
15. Issue 28

Danach:
- Issue 29 bis 34
- dann Equipment
- dann Customers
- dann Bookings

---

## Label-Vorschlag

- `epic`
- `backend`
- `frontend`
- `database`
- `auth`
- `booking`
- `equipment`
- `customer`
- `platform-admin`
- `support`
- `queue`
- `documentation`
- `mvp`
- `phase-2`

---

## Meilensteine

### Milestone 1 – Foundation
Issues 1–34

### Milestone 2 – Core Rental MVP
Issues 35–68

### Milestone 3 – Frontend MVP
Issues 69–88

### Milestone 4 – Support & Operations
Issues 89–107

### Milestone 5 – Quality & Delivery
Issues 108–115
