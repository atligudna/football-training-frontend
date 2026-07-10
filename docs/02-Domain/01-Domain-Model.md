# Football Planner

> Think football. Not software.

# Domain Model

Version: 1.0
Status: Draft
Owner: Atli Guðnason
Last Updated: 9 July 2026

Related Documents

- 00-Glossary.md
- 01-Vision.md
- 04-Use-Cases.md

---

# Purpose

The Domain Model describes the core business objects of Football Planner.

It defines how the application thinks about football training.

The Domain Model is independent of:

- Database
- API
- Frontend
- Backend

It represents the real coaching world.

---

# Domain Hierarchy

Football Planner

↓

Club

↓

Team

↓

Session

↓

Pitch

↓

Training

↓

Block / Station

↓

Drill

---

# Core Domain Objects

Football Planner

The complete platform.

Contains:

- Clubs
- Users
- Libraries
- Settings

---

Club

Represents a football club.

Contains:

- Coaches
- Teams
- Equipment
- Fields
- Shared Drill Library

---

Team

Represents one football team.

Examples

U11 Boys

U13 Girls

Senior Men

A Team owns:

- Players
- Coaches
- Sessions

---

Session

Represents one football training session.

A Session always contains:

- Session Information
- Warm-up
- One or more Pitches
- Cool Down

A Session belongs to exactly one Team.

---

Pitch

Represents one independent training area.

Examples

Pitch A

Pitch B

Pitch C

Pitch D

Each Pitch has:

- Coach
- Player Group
- Training Type

---

Training

Represents the content of one Pitch.

A Training is either:

- Standard Training
- Station Training

Never both.

---

Block

Represents one time segment inside Standard Training.

Examples

Passing

Possession

Game

Finishing

Each Block contains one Drill.

---

Station

Represents one station inside Station Training.

Each Station contains:

- One Drill
- Duration
- Equipment

---

Drill

A reusable football exercise.

Drills never belong to Sessions.

Sessions reference Drills.

---

Coach

Represents one coach.

A Coach may lead:

- One Session
- One Pitch
- Multiple Teams

---

Player Group

Represents the players assigned to one Pitch.

Examples

Blue Group

Red Group

Goalkeepers

---

Equipment

Represents physical equipment.

Examples

Balls

Cones

Goals

Bibs

Poles

Equipment may belong to:

- Drill
- Session

---

Training Theme

Represents today's learning objective.

Examples

Playing Forward

First Touch

Pressing

Transition

Every Session has zero or one Theme.

---

Coaching Point

Information for the coach.

Visible only to coaches.

---

Player Focus

Information for players.

Visible to players.

---

Timeline

Represents the chronological order of activities during a Session.

---

Session Template

Reusable Session.

Creates new Sessions.

---

# Domain Relationships

Club

owns

Teams

↓

Team

owns

Sessions

↓

Session

contains

Warm-up

↓

Pitches

↓

Cool Down

↓

Pitch

contains

Training

↓

Training

contains

Blocks

or

Stations

↓

Blocks

contain

Drills

↓

Stations

contain

Drills

---

# Business Rules

BR-001

Every Session belongs to one Team.

BR-002

Every Session contains exactly one Warm-up.

BR-003

Every Session contains exactly one Cool Down.

BR-004

A Session contains between one and four Pitches.

BR-005

Every Pitch has one Training Type.

BR-006

Training Type is either Standard or Station.

BR-007

Blocks exist only inside Standard Training.

BR-008

Stations exist only inside Station Training.

BR-009

A Drill may be reused infinitely.

BR-010

A Session never owns a Drill.

It references a Drill.

BR-011

Every Pitch has one Player Group.

BR-012

Every Pitch may have one or more Coaches.

BR-013

Every Session may have one Training Theme.

BR-014

Coaching Points belong to Drills.

BR-015

Player Focus belongs to Drills.

---

# Guiding Principle

Football Planner should model football,
not software.