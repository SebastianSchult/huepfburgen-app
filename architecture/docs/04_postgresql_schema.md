# PostgreSQL-Schema – MVP

## Grundsätze

- UUIDs als Primärschlüssel
- `tenant_id` in allen Fachtabellen
- Timestamps in allen Tabellen
- Constraints und Indizes von Anfang an
- `updated_at` per Trigger automatisch pflegen

## PostgreSQL Extension

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## Enums

```sql
CREATE TYPE tenant_plan AS ENUM ('basic', 'pro', 'business');
CREATE TYPE tenant_status AS ENUM ('active', 'suspended', 'cancelled');
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'staff', 'viewer', 'super_admin');
CREATE TYPE user_status AS ENUM ('invited', 'active', 'disabled');
CREATE TYPE customer_type AS ENUM ('private', 'business');
CREATE TYPE equipment_status AS ENUM ('available', 'reserved', 'maintenance', 'inactive');
CREATE TYPE booking_status AS ENUM ('draft', 'requested', 'confirmed', 'in_progress', 'completed', 'cancelled');
```

## Hinweis zum Super Admin

Für produktive Multi-Tenant-SaaS-Systeme ist ein globaler `super_admin` in derselben `users`-Tabelle oft nicht die beste Lösung, weil:

- `users` eigentlich tenant-spezifisch sind
- globale Plattform-Admins fachlich eine andere Benutzerklasse darstellen

### Bessere langfristige Lösung
Separate Tabelle für Plattform-Admins, z. B.:

```txt
platform_admins
- id
- email
- password_hash
- status
- created_at
- updated_at
```

Für einen einfachen MVP ist `super_admin` als Rolle denkbar, sauberer ist aber eine globale Plattform-Admin-Struktur.

## Kernschema

```sql
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    plan tenant_plan NOT NULL DEFAULT 'basic',
    status tenant_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'staff',
    status user_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    street TEXT,
    house_number TEXT,
    postal_code TEXT,
    city TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE equipment_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_equipment_categories_tenant_name UNIQUE (tenant_id, name)
);

CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES equipment_categories(id) ON DELETE SET NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT,
    serial_number TEXT,
    status equipment_status NOT NULL DEFAULT 'available',
    image_url TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_equipment_tenant_sku UNIQUE (tenant_id, sku)
);

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type customer_type NOT NULL DEFAULT 'private',
    company_name TEXT,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    street TEXT,
    house_number TEXT,
    postal_code TEXT,
    city TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_customers_name_required CHECK (
        (type = 'private' AND first_name IS NOT NULL AND last_name IS NOT NULL)
        OR
        (type = 'business' AND company_name IS NOT NULL)
    )
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    booking_number TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status booking_status NOT NULL DEFAULT 'draft',
    subtotal_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    deposit_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_bookings_tenant_booking_number UNIQUE (tenant_id, booking_number),
    CONSTRAINT chk_bookings_date_range CHECK (end_date >= start_date),
    CONSTRAINT chk_bookings_amounts_nonnegative CHECK (
        subtotal_amount >= 0 AND deposit_amount >= 0 AND total_amount >= 0
    )
);

CREATE TABLE booking_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    line_total NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_booking_items_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_booking_items_amounts_nonnegative CHECK (unit_price >= 0 AND line_total >= 0)
);

CREATE TABLE equipment_unavailability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_equipment_unavailability_date_range CHECK (end_date >= start_date)
);
```

## Trigger für updated_at

```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Danach Trigger je Tabelle anlegen.

## Fachlicher Hinweis

Später sinnvoll:
- `platform_admins`
- `audit_logs`
- `support_sessions`
- `documents`
- `invoices`
- `pricing_rules`
