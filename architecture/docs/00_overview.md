# Überblick – Event Rental SaaS

## Ziel

Das bestehende Hüpfburgen-Verleih-Projekt soll zu einer professionellen Multi-Tenant-SaaS-Plattform weiterentwickelt werden.

## Zielgruppen

- Hüpfburgenverleiher
- Zeltverleiher
- Eventtechnik-Verleiher
- Fotobox-Verleiher
- Partyservice
- Catering-Services

## Produktziel

Die Plattform soll Inventarverwaltung, Buchungssystem, CRM, Preislogik, Dokumente und Automationen kombinieren.

## Hauptfunktionen

### Equipment Management
- Name
- Beschreibung
- Bilder
- Standort
- Status
- Kategorien
- Wartungsstatus

### Buchungssystem
- Kalenderbasierte Buchungen
- Startdatum / Enddatum
- Verfügbarkeitsprüfung
- Konflikterkennung
- Mehrere Standorte
- Mehrere Equipment-Items pro Buchung

### CRM
- Kundendaten
- Adressen
- Telefonnummern
- E-Mail
- Notizen
- Buchungshistorie

### Preislogik
- Tagespreise
- Wochenendpreise
- Staffelpreise
- Kaution
- Rabatte
- saisonale Regeln

### Dokumente
- Angebote
- Rechnungen
- Mietverträge
- PDF-Export

### Automationen
- Buchungsbestätigungen
- Reminder
- Rechnungsversand
- Slack / WhatsApp / Webhooks
- n8n-Integrationen

## Lern- und Karriereziel

Dieses Projekt dient gleichzeitig als:

- reales SaaS-Produkt
- Lernprojekt für Systemdesign
- Portfolio-Projekt für Solutions Engineer / System Engineer / Solutions Architect

## Technische Zielrichtung

- Frontend: React + TypeScript + Tailwind
- Backend: Node.js + TypeScript + Fastify
- Datenbank: PostgreSQL
- Zusatzsysteme: Redis, Queue, Worker, n8n
- Deployment: Docker, Cloud Hosting, CI/CD

## SaaS-Ziel

Die Lösung soll nicht nur für den eigenen Verleih funktionieren, sondern als Multi-Tenant-Plattform für viele Vermieter nutzbar sein.

Beispielhafte Preisstruktur:
- Basic: 29 €/Monat
- Pro: 59 €/Monat
- Business: 99 €/Monat
