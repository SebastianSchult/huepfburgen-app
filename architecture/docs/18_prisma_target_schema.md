# Prisma Target Schema Draft

Example models:

model Tenant {
 id String @id @default(uuid())
 name String
 slug String @unique
}

model User {
 id String @id @default(uuid())
 tenantId String
 email String @unique
}

model Equipment {
 id String @id @default(uuid())
 tenantId String
 name String
}

Goal: convert to full schema.prisma later.