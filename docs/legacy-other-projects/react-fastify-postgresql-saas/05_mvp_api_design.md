# MVP API Design – REST API

## Grundprinzipien

- Tenant-Kontext kommt aus Login/JWT
- `/api/v1` als Basis
- Ressourcenorientierte Endpunkte
- Serverseitige Validierung
- Einheitliches Fehlerformat

## Auth API

### POST `/api/v1/auth/login`
Login mit E-Mail und Passwort

### GET `/api/v1/auth/me`
Aktuellen Nutzer laden

### POST `/api/v1/auth/logout`
Logout

## Tenant API

### GET `/api/v1/tenant`
Aktuellen Tenant laden

### PATCH `/api/v1/tenant`
Tenant-Grunddaten ändern

## Users API

### GET `/api/v1/users`
Alle Nutzer im Tenant

### POST `/api/v1/users`
Nutzer anlegen

### PATCH `/api/v1/users/:id`
Nutzer aktualisieren

### DELETE `/api/v1/users/:id`
Nutzer deaktivieren / archivieren

## Locations API

### GET `/api/v1/locations`
Standorte laden

### POST `/api/v1/locations`
Standort anlegen

### PATCH `/api/v1/locations/:id`
Standort ändern

### DELETE `/api/v1/locations/:id`
Standort archivieren / löschen

## Equipment Categories API

### GET `/api/v1/equipment-categories`
Kategorien laden

### POST `/api/v1/equipment-categories`
Kategorie anlegen

### PATCH `/api/v1/equipment-categories/:id`
Kategorie ändern

### DELETE `/api/v1/equipment-categories/:id`
Kategorie löschen

## Equipment API

### GET `/api/v1/equipment`
Filter:
- search
- status
- categoryId
- locationId
- page
- pageSize

### GET `/api/v1/equipment/:id`
Einzelnes Equipment laden

### POST `/api/v1/equipment`
Equipment anlegen

### PATCH `/api/v1/equipment/:id`
Equipment ändern

### DELETE `/api/v1/equipment/:id`
Equipment archivieren

## Customers API

### GET `/api/v1/customers`
Kundenliste mit Suche und Pagination

### GET `/api/v1/customers/:id`
Kundendetail

### POST `/api/v1/customers`
Kunde anlegen

### PATCH `/api/v1/customers/:id`
Kunde ändern

### DELETE `/api/v1/customers/:id`
Kunde archivieren

## Bookings API

### GET `/api/v1/bookings`
Filter:
- status
- from
- to
- customerId
- page
- pageSize

### GET `/api/v1/bookings/:id`
Buchungsdetail inkl. Items

### POST `/api/v1/bookings`
Buchung anlegen

Das Backend prüft:
- Datumslogik
- Konflikte
- Verfügbarkeit
- Preislogik
- Buchungsnummer

### PATCH `/api/v1/bookings/:id`
Buchung ändern / Status ändern

### DELETE `/api/v1/bookings/:id`
Buchung stornieren / archivieren

## Availability API

### GET `/api/v1/availability`
Verfügbarkeitsübersicht

### POST `/api/v1/availability/check`
Gezielte Prüfung einzelner Equipment-Items

## Equipment Unavailability API

### GET `/api/v1/equipment/:id/unavailability`
Sperrzeiten laden

### POST `/api/v1/equipment/:id/unavailability`
Sperrzeit anlegen

### DELETE `/api/v1/equipment/:id/unavailability/:blockId`
Sperrzeit entfernen

## Dashboard API

### GET `/api/v1/dashboard/summary`
Kennzahlen und anstehende Buchungen

## Fehlerformat

```json
{
  "error": {
    "code": "BOOKING_CONFLICT",
    "message": "One or more equipment items are not available for the selected period",
    "details": []
  }
}
```

## Rollenmodell

### owner
- volle Rechte im Tenant

### admin
- fast volle Rechte

### staff
- operative Arbeit

### viewer
- nur lesen

## Super-Admin-Hinweis

Support-Zugriff für Plattform-Admins sollte nicht einfach normale Tenant-Owner-Rechte simulieren, sondern kontrolliert und auditierbar sein.

Dafür siehe `06_super_admin_support_access.md`.
