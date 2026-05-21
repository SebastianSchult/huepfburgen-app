# Multi-Tenant Architecture

## Kernentscheidung

Die wichtigste Architekturentscheidung für echtes SaaS ist die Multi-Tenant-Architektur.

Statt pro Kunde eine eigene Instanz zu betreiben, nutzen viele Kunden dieselbe Plattform, während ihre Daten logisch über `tenant_id` getrennt bleiben.

## Bedeutung

Beispiel:

- Hüpfburgen Müller
- PartyRent Hamburg
- EventTech Berlin

Alle nutzen dieselbe Software, sehen aber nur ihre eigenen Daten.

## Empfohlenes Modell

### Shared Database + Tenant ID

Alle Kunden teilen sich eine Datenbank.  
Die Trennung erfolgt über `tenant_id`.

Das ist für dieses Projekt der beste Start, weil es:

- günstig
- einfach
- schnell umsetzbar
- ideal für den MVP

ist.

## Datenmodell-Prinzip

Jede fachliche Tabelle bekommt eine `tenant_id`, z. B.:

- equipment
- customers
- bookings
- booking_items
- locations
- pricing_rules
- documents
- invoices

## Beispiel

```sql
SELECT *
FROM equipment
WHERE tenant_id = $1;
```

## Warum das entscheidend ist

Ohne Multi-Tenant:

- pro Kunde eigene DB
- pro Kunde eigenes Deployment
- hoher Betriebsaufwand

Mit Multi-Tenant:

- eine Plattform
- eine Infrastruktur
- viele Kunden
- deutlich besser skalierbar

## Tenant-Tabelle

```txt
tenants
- id
- name
- slug
- plan
- status
- created_at
- updated_at
```

## Login- und Sicherheitslogik

Der Tenant-Kontext darf nicht frei vom Frontend übergeben werden.  
Er wird aus dem Login bzw. JWT abgeleitet.

JWT enthält typischerweise:
- userId
- tenantId
- role

## Sicherheitsregel

Jede Query und jede fachliche Aktion muss tenant-spezifisch gefiltert werden.

## Spätere Erweiterungen

- Subdomains pro Tenant
- White Labeling
- Stripe Billing
- Feature Limits je Tarif
