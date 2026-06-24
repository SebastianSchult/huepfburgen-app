# C – MVP-Roadmap in Entwicklungsphasen

## Ziel

Diese Roadmap beschreibt die empfohlene Entwicklungsreihenfolge für das SaaS-Projekt.  
Sie ist stärker phasenorientiert als die GitHub-Issue-Liste und eignet sich gut als Umsetzungsplan.

---

## Phase 0 – Architektur und Entscheidungen

### Ziele
- Zielbild festziehen
- Datenmodell definieren
- API-Form festlegen
- Support-/Super-Admin-Konzept dokumentieren

### Ergebnisse
- Architekturdiagramme
- PostgreSQL-Schema
- MVP-API-Plan
- Plattform-Admin-Konzept

---

## Phase 1 – Technisches Fundament

### Backend
- Fastify-Projekt aufsetzen
- TypeScript-Konfiguration
- Zod-Validation
- Logging
- Fehlerbehandlung
- `/api/v1`-Grundstruktur

### Frontend
- React + TypeScript + Tailwind
- Routing
- Layout-Shell
- Auth-Grundstruktur

### Infrastruktur
- Docker Compose
- PostgreSQL lokal
- optional Redis

### Ergebnis
Ein lauffähiges Grundgerüst ohne Fachlogik.

---

## Phase 2 – Datenbank und Auth

### Datenbank
- ORM einrichten
- Migrationen
- Tenants
- Users
- Rollen
- Kern-Fachtabellen

### Auth
- Login
- JWT
- Auth Middleware
- Tenant-Kontext
- Rollenprüfung

### Ergebnis
Benutzer können sich sicher anmelden und tenant-spezifisch arbeiten.

---

## Phase 3 – Equipment und Kunden

### Equipment
- Kategorien
- Standorte
- Equipment CRUD
- Filter
- Archivierung

### Kunden
- Kundenliste
- Suche
- CRUD
- private/business-Logik

### Ergebnis
Das System kann Inventar und Kundendaten professionell verwalten.

---

## Phase 4 – Buchungen und Verfügbarkeit

### Booking Core
- Buchungen anlegen
- Buchungsnummern
- Booking Items
- Datumsvalidierung
- Statusmodell

### Availability
- Konflikterkennung
- Equipment-Unavailability
- Verfügbarkeitsprüfung
- Kalenderlogik als API-Grundlage

### Pricing
- einfache Preislogik im Backend
- subtotal
- deposit
- total

### Ergebnis
Das System kann das zentrale Vermietgeschäft fachlich korrekt abbilden.

---

## Phase 5 – Frontend MVP

### UI-Bereiche
- Dashboard
- Equipment
- Kunden
- Buchungen

### Technische Aufgaben
- API-Anbindung
- Tabellen
- Formulare
- Fehleranzeigen
- Ladezustände

### Ergebnis
Nutzbares End-to-End-MVP.

---

## Phase 6 – Plattform-Support und SaaS-Betrieb

### Plattform-Admin
- platform_admins
- Plattform-Login
- Support-Sessions
- Impersonation
- Audit Logs
- sichtbarer Support-Modus

### Ergebnis
Support und Fehlersuche sind professionell und auditierbar möglich.

---

## Phase 7 – Async Jobs und Automationen

### Async Foundation
- Redis
- BullMQ
- Worker

### Jobs
- Buchungsbestätigung
- Dokumenten-Generierung
- Reminder

### Integrationen
- n8n
- Slack
- WhatsApp
- Webhooks

### Ergebnis
Das System gewinnt operative Reife.

---

## Phase 8 – Dokumente, Rechnungen, Wachstum

### Fachlicher Ausbau
- Angebote
- Rechnungen
- Mietverträge
- PDF-Workflows

### SaaS-Ausbau
- Plans / Limits
- Billing
- Usage Tracking
- Branding / White Label

### Ergebnis
Schritt vom MVP zum echten vermarktbaren SaaS.

---

## Phase 9 – Qualität und Portfolio-Stärke

### Qualität
- Tests
- CI/CD
- Monitoring
- Seed-Daten
- Demo-Tenant

### Portfolio
- Architektur-Dokumentation
- README
- Diagramme
- Roadmap
- Entscheidungsdokumente

### Ergebnis
Das Projekt zeigt nicht nur Coding, sondern Architektur- und Systemdenken.

---

## Empfohlene Priorität

Wenn du fokussiert bauen willst:

1. Phase 1
2. Phase 2
3. Phase 3
4. Phase 4
5. Phase 5

Dann hast du ein starkes MVP.

Danach:
6. Phase 6
7. Phase 7
8. Phase 8
9. Phase 9

---

## Praktische Empfehlung für dich

Da du das Projekt auch als Lern- und Karriereprojekt nutzt, ist die beste Reihenfolge:

- zuerst **saubere Architektur**
- dann **saubere Backend-Fachlogik**
- dann **Frontend**
- danach **Support / Betrieb / Async / Automationen**

So lernst du nicht nur React oder CRUD, sondern echtes SaaS-Systemdesign.
