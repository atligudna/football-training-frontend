# Football Planner

> Think football. Not software.

# Use Cases

Version: 1.0
Status: Draft
Owner: Atli Guðnason
Last Updated: 9 July 2026

Related Documents

- 01-Vision.md
- 02-Product-Principles.md
- 03-Personas.md
- 03-Domain-Model.md

---

# Purpose

This document describes what users should be able to accomplish using Football Planner.

These use cases define the functional requirements of the application.

Every major feature should support one or more use cases.

---

# UC-001

## Login

Primary Persona

- Modern Coach

Goal

Log into Football Planner.

Success

The coach reaches the Dashboard.

---

# UC-002

## Create Session

Primary Persona

- Modern Coach

Goal

Create a new football training session.

The coach should be able to define:

- Title
- Date
- Time
- Duration
- Location
- Warm-up
- One to four pitches
- Cool Down

---

# UC-003

## Edit Session

Modify an existing session.

The coach can:

- Change duration
- Add or remove pitches
- Change drills
- Change coaches
- Rename pitches

---

# UC-004

## Duplicate Session

Create a copy of an existing session.

Typical use:

Reuse last week's session as a starting point.

---

# UC-005

## Delete Session

Remove an existing session.

The user should be asked for confirmation.

---

# UC-006

## Add Pitch

The coach chooses between:

- 1 Pitch
- 2 Pitches
- 3 Pitches
- 4 Pitches

Every pitch works independently.

---

# UC-007

## Configure Pitch

Each pitch can have:

- Name
- Coach
- Training Type

Training Types

- Standard
- Station Training

---

# UC-008

## Build Standard Training

The coach creates a sequence of training blocks.

Example

Warm-up

↓

Passing

↓

Possession

↓

Game

↓

Cool Down

---

# UC-009

## Build Station Training

The coach defines:

- Number of stations
- Rotation time
- Station drills

---

# UC-010

## Assign Coach

Assign one or more coaches to a pitch.

Example

Pitch A

Coach

Atli

Pitch B

Coach

Jón

---

# UC-011

## Create Drill

Create a reusable drill.

The drill should include:

- Name
- Description
- Equipment
- Age Group
- Duration
- Football Pitch Drawing

---

# UC-012

## Edit Drill

Modify an existing drill.

---

# UC-013

## Search Drill Library

Search by:

- Category
- Age
- Duration
- Equipment
- Difficulty

---

# UC-014

## Visual Pitch Builder

Create football drills visually.

The coach can place:

- Players
- Balls
- Goals
- Cones
- Arrows
- Areas

using drag and drop.

---

# UC-015

## Timeline

Display the session as a timeline.

Moving the timeline updates the visible drill.

---

# UC-016

## Coach Mode

Run today's training session.

Display:

- Current drill
- Remaining time
- Next drill
- Assigned pitch

---

# UC-017

## Print Session

Generate a printable PDF.

Include:

- Timeline
- Drills
- Equipment
- Pitch drawings

---

# UC-018

## Session Templates

Save a session as a reusable template.

---

# UC-019

## Share Session

Share sessions with other coaches.

---

# UC-020

## Dashboard

Display

- Next training
- Today's session
- Upcoming sessions
- Quick actions
- Coach notes

---

# Future Use Cases

The following are outside the scope of Version 1.

- AI Session Builder
- Animated drills
- Attendance
- Player development
- Parent communication
- Match preparation
- Season planning
- Video analysis