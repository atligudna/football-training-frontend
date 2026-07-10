# Football Planner

> Think football. Not software.

# Session Domain

Version: 1.0
Status: Draft
Owner: Atli Guðnason
Last Updated: 9 July 2026

Related Documents

- 00-Glossary.md
- 01-Domain-Model.md
- 04-Use-Cases.md

---

# Purpose

A Session represents one complete football training session.

It is the most important object in Football Planner.

Everything else exists to support a Session.

---

# Definition

A Session is one planned football training event.

A Session always contains:

- Session Information
- Warm-up
- One or more Pitches
- Cool Down

A Session belongs to exactly one Team.

---

# Session Structure

Session

↓

Session Information

↓

Warm-up

↓

Pitch A

↓

Pitch B

↓

Pitch C

↓

Pitch D

↓

Cool Down

---

# Session Information

Every Session contains:

Title

Description

Date

Start Time

End Time

Duration

Location

Season

Age Group

Team

Training Theme

Status

Created By

Created Date

Last Updated

---

# Session Status

A Session may have one of the following states.

Draft

The coach is still planning.

Planned

Ready to use.

Active

Training is currently running.

Completed

Training has finished.

Archived

Stored for future reference.

---

# Session Workflow

Draft

↓

Planned

↓

Active

↓

Completed

↓

Archived

---

# Warm-up

Every Session starts with one Warm-up.

Warm-up contains:

Duration

Drill

Equipment

Coach Notes

Player Focus

---

# Pitches

A Session contains between one and four Pitches.

Supported layouts:

• One Pitch

• Two Pitches

• Three Pitches

• Four Pitches

Every Pitch is independent.

---

# Pitch

Each Pitch contains:

Name

Coach(s)

Player Group

Training

Timeline

Equipment

---

# Training

A Pitch contains exactly one Training.

Training Types

Standard Training

Station Training

---

# Standard Training

Standard Training consists of Blocks.

Example

Passing

↓

Possession

↓

Finishing

↓

Game

Each Block has:

Duration

Drill

Equipment

Coaching Points

Player Focus

---

# Station Training

Station Training consists of Stations.

Each Station has:

Name

Duration

Drill

Equipment

Rotation Order

Rotation Time

Example

Station 1

↓

Station 2

↓

Station 3

↓

Station 4

↓

Station 5

---

# Cool Down

Every Session ends with one Cool Down.

Contains:

Duration

Drill

Coach Reflection

---

# Training Theme

Every Session may contain one Training Theme.

Examples

Playing Forward

Pressing

First Touch

Transition

Building from the Back

Every Drill should support the Theme.

---

# Coaching Philosophy

A Session may optionally reference one Coaching Philosophy.

Example

FH Methodology

↓

Playing Forward

↓

High Press

↓

Positive Communication

This allows clubs to build consistent coaching identities.

---

# Coach Assignments

One Session may contain multiple coaches.

Example

Head Coach

Assistant Coach

Goalkeeper Coach

Pitch Coach

Every Pitch may have one or more assigned coaches.

---

# Player Groups

Each Pitch has one Player Group.

Examples

Blue Group

Red Group

Goalkeepers

Advanced Group

Development Group

---

# Equipment

Equipment can be assigned to:

Session

Pitch

Drill

Examples

20 Balls

30 Cones

8 Bibs

2 Goals

---

# Timeline

Every Pitch owns its own Timeline.

Timeline controls:

Current Block

Remaining Time

Next Block

Coach Mode

---

# Coach Mode

Coach Mode always follows one Timeline.

Displays

Current Drill

Remaining Time

Coaching Points

Player Focus

Next Activity

---

# Player View

Player View displays simplified information.

Shows

Today's Theme

Today's Training

Player Focus

Coach Message

Weekly Challenge

Does NOT display

Coach Notes

Internal Planning

Administration

---

# Session Review

After training a coach may record:

What worked well

What should improve

Notes for next session

Would reuse session?

Rating

---

# Session Templates

Any completed Session may become a Template.

Templates may be:

Personal

Team

Club

---

# Printing

A Session should support printable formats.

Examples

Full Coach Version

Assistant Coach Version

Player Version

Equipment List

Timeline Only

---

# Business Rules

SR-001

Every Session has exactly one Warm-up.

SR-002

Every Session has exactly one Cool Down.

SR-003

A Session contains between one and four Pitches.

SR-004

Every Pitch contains exactly one Training.

SR-005

Training is either Standard or Station.

SR-006

A Session belongs to exactly one Team.

SR-007

A Session may have one Training Theme.

SR-008

Every Pitch has one Timeline.

SR-009

Every Block references one Drill.

SR-010

Every Station references one Drill.

SR-011

A Session may become a Template.

SR-012

A completed Session may contain a Review.

---

# Future Extensions

The Session Domain is designed to support future features.

Examples

AI Session Builder

Animated Drills

Attendance

Player Development

GPS Tracking

Video Analysis

Club Methodology

Match Preparation

Season Planning

without requiring structural changes.