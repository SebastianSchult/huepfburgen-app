# Fachliche Module und MVP-Datenmodell

## Fachliche Module

### A. Identity & Access
- Login
- Nutzerverwaltung
- Rollen
- Berechtigungen
- Tenant-Zuordnung

### B. Tenant Management
- Verleiher/Firma
- Tarifplan
- Status
- Einstellungen

### C. Equipment Management
- Equipment
- Kategorien
- Standorte
- Status
- Bilder
- Wartung

### D. Customer Management
- Kundendaten
- Kontaktinfos
- Notizen
- Historie

### E. Booking Management
- Buchungen
- Buchungspositionen
- Zeiträume
- Konflikterkennung
- Status

### F. Pricing
- Tagespreise
- Wochenendpreise
- Kaution
- Rabatte
- Sonderregeln

### G. Documents & Invoicing
- Angebote
- Rechnungen
- Mietverträge
- PDFs
- Nummernkreise

### H. Notifications & Automation
- E-Mails
- Reminder
- Queue Jobs
- Webhooks
- n8n-Trigger

## Was im MVP Pflicht ist

- Identity & Access
- Tenant Management
- Equipment Management
- Customer Management
- Booking Management
- einfache Preislogik

## Kerntabellen des MVP

### tenants
- id
- name
- slug
- plan
- status
- created_at
- updated_at

### users
- id
- tenant_id
- first_name
- last_name
- email
- password_hash
- role
- status
- created_at
- updated_at

### locations
- id
- tenant_id
- name
- address fields
- notes
- created_at
- updated_at

### equipment_categories
- id
- tenant_id
- name
- description
- created_at
- updated_at

### equipment
- id
- tenant_id
- category_id
- location_id
- name
- description
- sku
- serial_number
- status
- image_url
- active
- created_at
- updated_at

### customers
- id
- tenant_id
- type
- company_name
- first_name
- last_name
- email
- phone
- address fields
- notes
- created_at
- updated_at

### bookings
- id
- tenant_id
- customer_id
- booking_number
- start_date
- end_date
- status
- subtotal_amount
- deposit_amount
- total_amount
- notes
- created_by_user_id
- created_at
- updated_at

### booking_items
- id
- tenant_id
- booking_id
- equipment_id
- quantity
- unit_price
- line_total
- created_at
- updated_at

### equipment_unavailability
- id
- tenant_id
- equipment_id
- start_date
- end_date
- reason
- created_at
- updated_at

## Beziehungen

```txt
tenants
 ├── users
 ├── locations
 ├── equipment_categories
 ├── equipment
 │    └── equipment_unavailability
 ├── customers
 ├── bookings
 │    └── booking_items
```

## Wichtige Modellierungsentscheidungen

### booking_items ist Pflicht
Eine Buchung kann mehrere Mietobjekte enthalten.

### equipment_unavailability ist Pflicht
Zeitbezogene Sperrungen dürfen nicht nur über ein Statusfeld gelöst werden.

### tenant_id in allen Fachtabellen
Das vereinfacht Security, Reporting und Queries.

## Was später ergänzt werden kann

- documents
- invoices
- pricing_rules
- notifications
- audit_logs
