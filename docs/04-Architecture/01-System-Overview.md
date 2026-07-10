# Football Planner

> Think football. Not software.

# System Overview

Version: 1.0
Status: Draft
Owner: Atli Guðnason

---

# Purpose

This document describes the overall architecture of Football Planner.

The application consists of multiple independent applications working together as one platform.

---

# Platform Overview

Football Planner

│

├── Web Application

├── Mobile Application

├── Backend API

├── Database

├── Storage

└── Authentication

---

# Applications

## Coach Web

Used for planning.

Supports

- Dashboard
- Training Stories
- Drill Library
- Equipment
- Analytics

---

## Coach Mobile

Used during training.

Supports

- Coach Mode
- Timeline
- Player Focus
- Timer

---

## Player Mobile

Used before and after training.

Supports

- Today's Story
- Challenges
- Coach Messages
- Reflection

---

## Backend

Business logic.

REST API.

Authentication.

Permissions.

Notifications.

---

## Database

Stores

- Users
- Clubs
- Teams
- Training Stories
- Drills
- Equipment

---

# Technology Stack

Frontend

Next.js

React

TypeScript

Tailwind

TanStack Query

---

Backend

Node.js

Express

TypeScript

PostgreSQL

Prisma (planned)

---

Mobile

React Native (future)

or Flutter (evaluation)

---

Authentication

JWT

Refresh Tokens

Role-based permissions

---

Storage

Images

Pitch Drawings

Videos

PDF exports

---

# Guiding Principle

Each application should have one clear responsibility.
