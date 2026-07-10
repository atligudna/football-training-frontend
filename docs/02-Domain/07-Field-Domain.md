# Football Planner

> Think football. Not software.

# Field Domain

Version: 1.0
Status: Draft
Owner: Atli Guðnason
Last Updated: 9 July 2026

Related Documents

- 01-Domain-Model.md
- 02-Session-Domain.md
- 03-Drill-Domain.md

---

# Purpose

The Field Domain defines the visual football environment used throughout Football Planner.

Planning should happen on a football pitch.

Not inside tables.

---

# Field Hierarchy

Club Field

↓

Session Layout

↓

Pitch

↓

Station

↓

Drill Drawing

---

# Club Field

Represents the physical football field.

Examples

Full Pitch

Half Pitch

Indoor Pitch

Artificial Turf

Grass

---

# Session Layout

A Session may be divided into:

One Pitch

Two Pitches

Three Pitches

Four Pitches

The coach chooses the layout when creating the Session.

---

# Pitch

Each Pitch is an independent training area.

Every Pitch contains:

Coach

Player Group

Training

Timeline

Drawing

---

# Standard Layout

One timeline.

Several Blocks.

One active Drill at a time.

---

# Station Layout

One Pitch.

Multiple Stations.

Each Station has:

Drill

Drawing

Rotation Time

Rotation Order

---

# Drawing Canvas

Every Drill owns one Drawing.

The Drawing supports:

Players

Balls

Goals

Mini Goals

Cones

Poles

Hurdles

Areas

Lines

Arrows

Text

---

# Object Library

Objects available:

Players

Goalkeepers

Ball

Cone

Goal

Mini Goal

Pole

Ladder

Hurdle

Ring

Rectangle

Circle

Arrow

Text

---

# Object Behaviour

Objects support:

Move

Rotate

Resize

Duplicate

Delete

Snap to Grid

Lock

Unlock

Layer Order

---

# Grid System

Optional snap grid.

Supports:

1 m

2 m

5 m

Grid may be hidden.

---

# Pitch Templates

Examples

Full Pitch

Half Pitch

Penalty Area

Technical Area

Goalkeeper Area

Small-Sided Game

Coach may create custom templates.

---

# Multi-Pitch Planning

One Session may contain:

Pitch A

Pitch B

Pitch C

Pitch D

Each Pitch has an independent drawing.

---

# Station Planning

Within one Pitch

Station 1

Station 2

Station 3

Station 4

Station 5

Each Station has its own drawing.

---

# Coach View

Coach sees:

Current Drill

Current Drawing

Next Drawing

Timeline

---

# Player View

Players see simplified drawings.

Coach Notes are hidden.

---

# Printing

Support printing:

Coach Version

Assistant Version

Player Version

Drawing Only

---

# Future

Animation

Player Movement

Passing Sequences

Rotation Animation

Video Overlay

3D Pitch

AR Visualisation

---

# Business Rules

FD-001

Every Drill owns one Drawing.

FD-002

A Session contains one to four Pitches.

FD-003

Each Pitch owns one Drawing Workspace.

FD-004

Station Training contains one Drawing per Station.

FD-005

Drawings are reusable.

FD-006

Objects snap to grid by default.

FD-007

Player View hides coach-only information.

---

# Guiding Principle

The football pitch is the primary planning surface.

Everything else supports the pitch.