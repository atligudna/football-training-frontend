# Football Planner

> Think football. Not software.

# Equipment Domain

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

Equipment represents all physical resources required to run football training.

Equipment may belong to:

- Club
- Session
- Pitch
- Drill

---

# Equipment Structure

Equipment

↓

Category

↓

Item

↓

Inventory

↓

Availability

↓

Usage

---

# Equipment Categories

Examples

Balls

Cones

Goals

Mini Goals

Bibs

Poles

Hurdles

Ladders

Rings

Mannequins

Medicine Balls

Resistance Bands

Stopwatch

Whistle

First Aid

---

# Equipment Item

Each Equipment Item contains:

Name

Category

Quantity

Condition

Storage Location

Owner

Barcode (future)

Image

---

# Equipment Condition

Excellent

Good

Needs Repair

Broken

Lost

---

# Equipment Assignment

Equipment may be assigned to:

Club

↓

Session

↓

Pitch

↓

Drill

---

# Equipment Calculation

Football Planner should automatically calculate:

Total Balls

Total Cones

Total Goals

Required Bibs

Required Poles

Example

Session

↓

Pitch A

12 cones

↓

Pitch B

16 cones

↓

Warm-up

8 cones

↓

Total

36 cones

---

# Equipment Checklist

Before Training

✓ Balls

✓ Bibs

✓ Goals

✓ Cones

✓ Whistle

After Training

✓ Equipment Returned

---

# Equipment Availability

Future

Available

Reserved

Missing

Maintenance

---

# Equipment Requests

Future

Coach requests equipment.

Club approves.

---

# Shared Club Inventory

One inventory shared across all coaches.

---

# Printing

Equipment list may be printed separately.

---

# Business Rules

ER-001

Equipment may belong to many Drills.

ER-002

Equipment may belong to many Sessions.

ER-003

A Session automatically calculates required Equipment.

ER-004

Club Inventory is shared.

ER-005

Broken Equipment cannot be assigned.

---

# Guiding Principle

The coach should never have to manually count equipment twice.