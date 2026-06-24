# Hüpfburgen SaaS – Architektur- und Planungsdokumente

Dieses Paket fasst den bisherigen Stand der SaaS-Planung als Markdown-Dateien zusammen.

## Inhalt

- `00_overview.md` – Gesamtüberblick und Zielbild
- `01_multi_tenant_architecture.md` – Multi-Tenant-Grundlage
- `02_target_architecture.md` – Zielarchitektur mit API, Worker, Queue, Redis, n8n
- `03_domains_and_data_model.md` – Fachliche Module und MVP-Datenmodell
- `04_postgresql_schema.md` – Konkretes PostgreSQL-MVP-Schema
- `05_mvp_api_design.md` – REST-API für den MVP
- `06_super_admin_support_access.md` – Super-Admin-Konzept für Support und Fehleranalyse

## Empfehlung für die weitere Arbeit mit Codex

1. Zuerst `01_multi_tenant_architecture.md` und `06_super_admin_support_access.md` lesen
2. Danach `04_postgresql_schema.md` als Grundlage für DB/Migrations nutzen
3. Anschließend `05_mvp_api_design.md` als Basis für Fastify-Routen und Services verwenden

## Wichtige Leitlinien

- Multi-Tenant von Anfang an sauber einplanen
- `tenant_id` in allen fachlichen Tabellen
- Preislogik und Verfügbarkeitslogik ins Backend
- Queue/Worker früh architektonisch vorsehen
- Super-Admin-Zugriff nur mit Audit-Log und sicherer Impersonation
