# Football Planner

# Database Design

---

# Philosophy

The database models football.

Not screens.

Not API endpoints.

---

# Core Entities

Club

Coach

Player

Team

Training Story

Pitch

Training

Block

Station

Drill

Equipment

Drawing

Challenge

Message

---

# Relationships

Club

↓

Teams

↓

Training Stories

↓

Pitches

↓

Training

↓

Blocks

↓

Drills

---

# Example

Team

↓

Training Story

↓

Pitch A

↓

Standard Training

↓

Passing Drill

---

# Database Rules

Training Stories reference Drills.

Drills are reusable.

Drawings belong to Drills.

Players belong to Teams.

Coaches belong to Clubs.

---

# Future

Attendance

Statistics

AI

Video

GPS
