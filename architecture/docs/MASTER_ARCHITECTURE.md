
# Event Rental SaaS – Master Architecture Document

This document is the **central overview of the entire SaaS architecture**.

---

# System Vision

A cloud-based platform that manages:

- rental inventory
- bookings
- customers
- pricing
- documents
- automation

Designed as a **multi‑tenant SaaS platform**.

---

# Core System Modules

Equipment Management

Manage rental equipment including:

- name
- description
- category
- location
- availability status

---

Booking System

Main functionality:

- calendar-based bookings
- availability checks
- conflict detection

---

Customer CRM

Store and manage:

- contact information
- booking history

---

Document Automation

Automatically generate:

- booking confirmations
- rental contracts
- invoices

---

Public Booking Page

Optional public page where customers can:

- browse equipment
- check availability
- create booking requests

---

# SaaS Platform Layer

The platform includes:

Multi‑tenant architecture  
Subscription plans  
Feature gating  
Admin support sessions  

---

# Internationalization

The system supports:

German and English

Rules:

- internal values remain English
- UI translated with i18n

---

# Worker System

Async tasks handled by workers:

- email sending
- document generation
- reminders

Implemented using:

Redis + BullMQ

---

# Database Layer

Primary database:

PostgreSQL

ORM:

Prisma

Database includes around **20 tables** covering:

- tenants
- users
- equipment
- bookings
- subscriptions
- audit logs

---

# Deployment Architecture

Application containers deployed with Docker.

Typical stack:

Frontend container  
Backend API container  
Worker container  
PostgreSQL database  
Redis queue

---

# Long Term Vision

The system should evolve into a **vertical SaaS platform for event rental businesses**.
