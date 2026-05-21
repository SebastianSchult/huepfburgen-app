# Super Admin und Support-Zugriff

## Ziel

Es soll von Anfang an eine Möglichkeit geben, dass Plattform-Support sich bei technischen Problemen kontrolliert in eine Kundenorganisation einloggen kann, um Fehler zu reproduzieren oder zu analysieren.

## Warum das sinnvoll ist

Gerade bei SaaS ist das für Support, Onboarding und Fehlersuche oft sehr hilfreich.

Beispiele:
- Kunde meldet Berechtigungsproblem
- Buchungskonflikt tritt nur in bestimmter Organisation auf
- UI- oder Datenproblem ist tenant-spezifisch
- Support muss einen Workflow in echter Umgebung nachvollziehen

## Wichtig: Nicht als normale Tenant-Rolle modellieren

Ein globaler Support-Admin sollte **nicht einfach ein normaler User innerhalb jedes Tenants** sein.

Besser trennen zwischen:

- Tenant-Usern
- globalen Plattform-Admins

## Empfohlenes Modell

### Option A – Separate globale Plattform-Admins
Eigene Tabelle:

```txt
platform_admins
- id
- email
- password_hash
- role
- status
- created_at
- updated_at
```

Mögliche Rollen:
- super_admin
- support_admin
- billing_admin
- read_only_support

Das ist die sauberste Lösung.

### Option B – `super_admin` in users
Für MVP einfacher, aber fachlich unsauberer.  
Nur dann sinnvoll, wenn Geschwindigkeit wichtiger ist als perfekte Trennung.

## Empfohlene Support-Funktion

Nicht "direkt als Kunde einloggen", sondern:

> **Impersonation / Support Session**

Das bedeutet:
- Plattform-Admin startet bewusst eine Support-Session
- Ziel-Tenant wird gewählt
- optional Ziel-User wird gewählt
- Session ist zeitlich begrenzt
- Aktion wird geloggt
- Kunde kann das später nachvollziehen

## Wichtige Sicherheitsprinzipien

### 1. Vollständiges Audit Log
Jede Support-Session muss protokolliert werden:

- wer hat die Session gestartet
- wann
- für welchen Tenant
- optional für welchen Ziel-User
- warum
- wann beendet

### 2. Begründung verpflichtend
Support-Zugriff sollte ein Pflichtfeld `reason` haben.

Beispiele:
- "Bug reproduction for booking conflict"
- "Customer requested setup assistance"

### 3. Zeitliche Begrenzung
Support-Session läuft z. B. nach 15 bis 60 Minuten automatisch ab.

### 4. Sichtbarer Support-Modus
Im Frontend sollte klar sichtbar sein:
- "You are in support mode"
- "Impersonating tenant XYZ"

### 5. Optional read-only
Für manche Fälle genügt ein read-only Support-Zugriff.

### 6. Kein dauerhaftes Mitschwimmen
Keine versteckten permanenten Hintertüren.

## Datenmodell-Vorschlag

### platform_admins

```txt
platform_admins
- id
- email
- password_hash
- role
- status
- created_at
- updated_at
```

### support_sessions

```txt
support_sessions
- id
- platform_admin_id
- tenant_id
- target_user_id nullable
- reason
- started_at
- expires_at
- ended_at nullable
- status
```

### audit_logs

```txt
audit_logs
- id
- actor_type
- actor_id
- tenant_id nullable
- action
- entity_type
- entity_id nullable
- metadata_json
- created_at
```

## API-Ideen

### POST `/api/v1/platform-auth/login`
Login für globale Plattform-Admins

### POST `/api/v1/platform/support-sessions`
Support-Session starten

Request:
```json
{
  "tenantId": "uuid",
  "targetUserId": "uuid",
  "reason": "Bug reproduction for booking issue"
}
```

### Response
```json
{
  "supportSession": {
    "id": "uuid",
    "tenantId": "uuid",
    "targetUserId": "uuid",
    "reason": "Bug reproduction for booking issue",
    "expiresAt": "2026-03-14T10:00:00Z",
    "impersonationToken": "jwt-or-session-token"
  }
}
```

### POST `/api/v1/platform/support-sessions/:id/end`
Support-Session beenden

### GET `/api/v1/platform/support-sessions`
Aktive und historische Sessions anzeigen

## JWT-Ansatz

Es gibt zwei saubere Varianten:

### Variante 1 – spezieller Impersonation-Token
Nach Start einer Support-Session wird ein spezieller Token ausgegeben mit Claims wie:

- platformAdminId
- tenantId
- impersonatedUserId
- supportSessionId
- roleScope
- expiresAt

### Variante 2 – Plattform-Admin-Session + Server-Side Context
Der Server verwaltet die Support-Session intern und setzt den Kontext serverseitig.

Für APIs ist Variante 1 oft einfacher.

## UI-Ideen

Im Support-Modus sollte die Anwendung sichtbar markieren:
- rotes oder auffälliges Banner
- Tenant-Name
- Ziel-User
- Startzeit
- verbleibende Zeit
- Button "Support Session beenden"

## Empfehlung für dieses Projekt

Für dein Projekt ist von Anfang an sinnvoll:

### Direkt einplanen
- separate `platform_admins`
- `support_sessions`
- `audit_logs`
- sichtbarer Support-Modus
- verpflichtende Begründung
- zeitlich begrenzte Impersonation

### Für MVP minimal
Wenn du noch nicht alles bauen willst:
- Datenmodell vorbereiten
- API-Platzhalter definieren
- Security-Konzept dokumentieren

## Klare Empfehlung

Die beste Lösung ist:

> **Globale Plattform-Admins + zeitlich begrenzte Support-Sessions + Audit-Logging**

Nicht:
- versteckte Dauerzugriffe
- unprotokolliertes Einloggen als Kunde
- globale Adminrechte ohne Nachvollziehbarkeit

## Nutzen für dein Portfolio

Dieses Thema hebt dein Projekt architektonisch stark auf:

- SaaS-Betriebsdenken
- Plattform-Security
- Supportability
- Auditierbarkeit
- Enterprise-Nähe

Das ist besonders wertvoll für spätere Rollen Richtung:
- Solutions Engineer
- Solutions Architect
- Platform Engineer
