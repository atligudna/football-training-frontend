# Football Planner

> Think football. Not software.

# Backend Architecture

Version: 1.0
Status: Draft
Owner: Atli Guðnason

---

# Purpose

The backend is responsible for all business logic.

The frontend should never contain business rules.

---

# Architecture

Client

↓

REST API

↓

Service Layer

↓

Repository Layer

↓

Database

---

# Layers

## Routes

Receive HTTP requests.

Validate input.

Forward request.

No business logic.

---

## Controllers

Coordinate requests.

Call Services.

Return responses.

---

## Services

Contains all business logic.

Examples

Create Session

Duplicate Session

Assign Coach

Calculate Equipment

Generate Timeline

---

## Repositories

Database access only.

CRUD operations.

No business rules.

---

## Database

PostgreSQL

---

# Folder Structure

src/

controllers/

services/

repositories/

middleware/

routes/

schemas/

utils/

types/

config/

---

# Services

AuthService

SessionService

DrillService

CoachService

PlayerService

EquipmentService

AnalyticsService

---

# Error Handling

All errors pass through one global handler.

Standard response:

success

message

details

---

# Validation

Zod

Validation happens before Controllers.

---

# Logging

Application Logs

API Logs

Authentication Logs

Error Logs

---

# Future

Background Jobs

Notifications

Email

AI Services

Push Notifications
