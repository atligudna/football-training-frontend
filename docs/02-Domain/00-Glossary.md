# Football Planner

> Think football. Not software.

# Glossary

Version: 1.0
Status: Draft
Owner: Atli Guðnason
Last Updated: 9 July 2026

Related Documents

- 01-Vision.md
- 02-Product-Principles.md
- 03-Domain-Model.md

---

# Purpose

This document defines the terminology used throughout Football Planner.

Using a shared vocabulary ensures consistency across:

- Product documentation
- Database design
- API design
- Frontend
- Backend
- User Interface

Each concept should have one official name.

---

# Session

A complete football training session.

A Session always contains:

- Session Information
- Warm-up
- One or more Pitches
- Cool Down

A Session is the highest level object in Football Planner.

---

# Session Information

General information describing a Session.

Examples:

- Title
- Date
- Start Time
- Duration
- Location
- Age Group
- Team
- Theme

---

# Warm-up

The first activity of every Session.

The Warm-up prepares players physically and mentally for training.

A Session always starts with a Warm-up.

---

# Cool Down

The final activity of every Session.

The Cool Down helps players recover and reflect after training.

A Session always ends with a Cool Down.

---

# Pitch

A football area where a group trains independently.

A Session can contain:

- Pitch A
- Pitch B
- Pitch C
- Pitch D

Each Pitch has its own coach, drills and timeline.

---

# Training Type

Defines how a Pitch is organised.

Supported values:

- Standard Training
- Station Training

Every Pitch has exactly one Training Type.

---

# Standard Training

A training format where all players complete the same sequence of drills.

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

# Station Training

A training format where players rotate between multiple stations.

Each Station contains one Drill.

The coach defines:

- Number of stations
- Rotation time
- Station order

---

# Block

A time segment within a Standard Training.

Examples

Passing

Possession

Finishing

Small Sided Game

Each Block contains one Drill.

---

# Station

One activity inside Station Training.

Players rotate between Stations.

Each Station contains:

- One Drill
- Duration
- Equipment

---

# Drill

A reusable football exercise.

A Drill may be used in many Sessions.

A Drill contains:

- Name
- Description
- Objective
- Coaching Points
- Player Focus
- Equipment
- Duration
- Drawing

---

# Objective

The overall purpose of a Drill.

Example

Improve passing accuracy under pressure.

---

# Coaching Points

Instructions intended for the coach.

Examples

- Open your body
- Pass through the ball
- Scan before receiving
- Communicate early

Coaching Points are normally not shown to players.

---

# Player Focus

Key behaviours the players should focus on during a Drill.

Examples

- Receive on your back foot
- Scan before your first touch
- Play forward whenever possible

Player Focus may be visible in the Player View.

---

# Training Theme

The overall learning objective for a Session.

Examples

- Playing Forward
- Pressing
- Switching Play
- First Touch

All drills should support the chosen Theme.

---

# Coach

A user responsible for running all or part of a Session.

A Coach may be assigned to:

- Entire Session
- Individual Pitch

---

# Player Group

The players assigned to a Pitch.

Examples

- Blue Group
- Red Group
- Goalkeepers

Each Pitch normally has one Player Group.

---

# Equipment

Physical equipment required for a Drill.

Examples

- Balls
- Cones
- Bibs
- Goals
- Poles
- Hurdles

Equipment may belong to a Drill or an entire Session.

---

# Timeline

A visual representation of the order of activities during a Session.

The Timeline controls which Drill is currently active.

---

# Coach Mode

A simplified interface used during training.

Coach Mode focuses on:

- Current Drill
- Remaining Time
- Next Drill
- Assigned Pitch

---

# Player View

A simplified interface for players.

Player View may include:

- Today's Training
- Training Theme
- Player Focus
- Weekly Challenge
- Coach Message

---

# Session Template

A reusable Session that can be used as a starting point for future Sessions.

---

# Dashboard

The main workspace of Football Planner.

The Dashboard provides an overview of:

- Today's Session
- Upcoming Sessions
- Quick Actions
- Recent Activity

---

# Business Rules

The following rules apply throughout Football Planner.

1. Every Session must contain one Warm-up.

2. Every Session must contain one Cool Down.

3. Every Pitch has exactly one Training Type.

4. A Training Type is either Standard Training or Station Training.

5. A Drill may be reused in multiple Sessions.

6. Every Standard Training is made up of Blocks.

7. Every Station Training is made up of Stations.

8. Each Block contains one Drill.

9. Each Station contains one Drill.

10. Every Session belongs to one Team.

---

# Naming Convention

The following terminology should always be used throughout the application.

| Preferred | Avoid |
|-----------|-------|
| Session | Training |
| Pitch | Area |
| Drill | Exercise |
| Block | Step |
| Station | Activity |
| Theme | Topic |
| Coaching Point | Coach Note |
| Player Focus | Instruction |
| Timeline | Schedule |

Always use the preferred terminology in:

- Documentation
- Database
- API
- Frontend
- Backend