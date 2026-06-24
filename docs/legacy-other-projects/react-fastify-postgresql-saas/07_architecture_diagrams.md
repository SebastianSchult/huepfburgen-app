# Architekturdiagramme – Event Rental SaaS

## Ziel

Diese Datei enthält Architekturdiagramme in Markdown/Mermaid-Form für das SaaS-Projekt.  
Sie kann direkt in die Projektdokumentation übernommen werden.

---

## 1. System Context Diagram

```mermaid
flowchart TD
    Customer[Rental Business Customer<br/>Tenant Owner / Staff]
    Support[Platform Support Admin]
    Frontend[Web App<br/>React + TypeScript]
    API[Backend API<br/>Node.js + Fastify]
    DB[(PostgreSQL)]
    Redis[(Redis)]
    Worker[Worker Service]
    Queue[Job Queue]
    Storage[Object Storage]
    N8N[n8n Automation Layer]
    Mail[Email Provider]
    External[Slack / WhatsApp / Webhooks / Calendar]

    Customer --> Frontend
    Support --> Frontend
    Frontend --> API
    API --> DB
    API --> Redis
    API --> Queue
    Queue --> Worker
    Worker --> DB
    Worker --> Storage
    Worker --> Mail
    Worker --> N8N
    N8N --> External
```

### Erklärung
- **Customer** nutzt die SaaS-Plattform innerhalb seines Tenants
- **Support** nutzt kontrollierte Support-Sessions
- **Frontend** ist die Web-Oberfläche
- **API** enthält Kernlogik
- **PostgreSQL** speichert Fachdaten
- **Redis + Queue + Worker** verarbeiten asynchrone Aufgaben
- **Storage** speichert Bilder und PDFs
- **n8n** übernimmt Integrationen

---

## 2. Container Diagram

```mermaid
flowchart LR
    subgraph Client
        FE[React Frontend]
    end

    subgraph Platform
        API[Fastify API]
        AUTH[Auth / JWT / Tenant Middleware]
        BOOK[Booking Module]
        EQUIP[Equipment Module]
        CRM[Customer Module]
        PRICE[Pricing Module]
        DOCS[Document Module]
        NOTIFY[Notification Module]
        DASH[Dashboard Module]
        PLAT[Platform Admin / Support Session Module]
    end

    subgraph Async
        QUEUE[Queue / BullMQ]
        WORKER[Worker]
        N8N[n8n]
    end

    subgraph Data
        PG[(PostgreSQL)]
        REDIS[(Redis)]
        S3[(Object Storage)]
    end

    FE --> API
    API --> AUTH
    API --> BOOK
    API --> EQUIP
    API --> CRM
    API --> PRICE
    API --> DOCS
    API --> NOTIFY
    API --> DASH
    API --> PLAT

    AUTH --> PG
    BOOK --> PG
    EQUIP --> PG
    CRM --> PG
    PRICE --> PG
    DOCS --> PG
    DASH --> PG
    PLAT --> PG

    API --> QUEUE
    QUEUE --> REDIS
    WORKER --> REDIS
    WORKER --> PG
    WORKER --> S3
    WORKER --> N8N
```

### Erklärung
Dieses Diagramm zeigt die logische Zerlegung in:
- **Frontend**
- **modular aufgebautes Backend**
- **asynchrone Verarbeitung**
- **Persistenz- und Storage-Schicht**

---

## 3. Tenant Isolation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as API
    participant MW as Auth/Tenant Middleware
    participant DB as PostgreSQL

    U->>FE: Login
    FE->>API: POST /auth/login
    API-->>FE: JWT with userId, tenantId, role

    U->>FE: Load equipment list
    FE->>API: GET /equipment
    API->>MW: Validate JWT
    MW->>API: userId + tenantId + role resolved
    API->>DB: SELECT * FROM equipment WHERE tenant_id = $1
    DB-->>API: Tenant-specific rows
    API-->>FE: Equipment list
```

### Regel
Der Tenant-Kontext wird **nicht frei vom Frontend** geliefert, sondern aus JWT/Session abgeleitet.

---

## 4. Booking Creation Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant BookingService
    participant PricingService
    participant DB
    participant Queue
    participant Worker

    User->>Frontend: Create booking
    Frontend->>API: POST /bookings
    API->>BookingService: validate request
    BookingService->>DB: check tenant/customer/equipment
    BookingService->>DB: check booking conflicts
    BookingService->>PricingService: calculate totals
    PricingService-->>BookingService: subtotal/deposit/total
    BookingService->>DB: insert booking + items
    BookingService->>Queue: enqueue confirmation + document jobs
    API-->>Frontend: booking response
    Queue->>Worker: process async jobs
```

### Fachliche Regel
- Konflikterkennung und Preislogik gehören ins Backend
- E-Mail/PDF/Reminder laufen asynchron

---

## 5. Support Session / Impersonation Flow

```mermaid
sequenceDiagram
    participant PA as Platform Admin
    participant FE as Admin UI
    participant API as Platform API
    participant DB as PostgreSQL
    participant APP as Tenant App

    PA->>FE: Start support session
    FE->>API: POST /platform/support-sessions
    API->>DB: store session with reason, tenant, expiry
    API-->>FE: impersonation token
    FE->>APP: open app in support mode
    APP->>API: requests with impersonation token
    API->>DB: audit log support actions
    API-->>APP: tenant-scoped data
```

### Pflichtregeln
- Pflichtfeld `reason`
- zeitliche Begrenzung
- Audit Log
- sichtbarer Support-Modus
- kein versteckter Dauerzugriff

---

## 6. Deployment Diagram (MVP bis nächste Stufe)

```mermaid
flowchart TD
    User[User Browser] --> FrontendHost[Frontend Hosting]
    FrontendHost --> APIHost[API Container / Service]
    APIHost --> PG[(Managed PostgreSQL)]
    APIHost --> REDIS[(Managed Redis)]
    APIHost --> STORAGE[(Object Storage)]
    APIHost --> QUEUE[Queue]
    QUEUE --> WorkerHost[Worker Container / Service]
    WorkerHost --> N8N[n8n]
```

### MVP Deployment
- Frontend
- API
- PostgreSQL
- optional Redis
- Docker Compose oder einfacher Cloud-Deploy

### Professioneller Ausbau
- API und Worker getrennt deployen
- Managed DB/Redis
- Storage
- CI/CD
- Monitoring
