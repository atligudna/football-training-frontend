# Football Planner

> Think football. Not software.

# Product Principles

Version: 1.0  
Status: Draft  
Owner: Atli Guðnason  
Last Updated: 9 July 2026

Related Documents

- 01-Vision.md
- 03-Domain-Model.md
- 04-User-Flows.md

---

# Purpose

These principles define how Football Planner should be designed and developed.

Every feature, screen and technical decision should support one or more of these principles.

If a proposed feature conflicts with these principles, the principles take priority.

---

# Principle 1
## Coach First

Football Planner is built for football coaches.

The application should always reflect how coaches naturally think, organise and run training sessions.

The coach should never need to understand how the software works.

---

# Principle 2
## Think in Football

The application should use football concepts instead of technical concepts.

Examples

Good

- Session
- Pitch
- Warm-up
- Drill
- Station
- Coach

Avoid

- Entity
- Record
- Object
- TrainingBlockID

---

# Principle 3
## Visual Before Text

Whenever possible, information should be visual instead of textual.

Examples

✔ Football pitch

✔ Timeline

✔ Player icons

✔ Cones

✔ Arrows

Instead of

Large tables

Long text descriptions

Complex forms

---

# Principle 4
## Reuse Everything

Nothing should need to be recreated.

Examples

- Drills
- Sessions
- Equipment
- Coaches
- Pitch layouts
- Station layouts

Everything should be reusable.

---

# Principle 5
## Build Around the Pitch

The football pitch is the centre of the application.

Planning should happen on the pitch.

Not inside spreadsheets.

---

# Principle 6
## Mobile First Coaching

Planning often happens on a computer.

Coaching happens on the pitch.

Every important feature should work on a mobile phone.

---

# Principle 7
## Multiple Coaches

Football Planner should support:

- One coach
- Two coaches
- Large coaching staffs

Every session should support multiple coaches working together.

---

# Principle 8
## One Source of Truth

Information should only exist once.

Example

A drill should exist in the Drill Library.

Sessions reference drills.

They do not duplicate them.

---

# Principle 9
## Fast Planning

Creating a session should be fast.

A coach should spend time coaching.

Not managing software.

---

# Principle 10
## Flexibility

Football is different at every level.

Football Planner should support:

- Small teams
- Large academies
- One pitch
- Multiple pitches
- Standard training
- Station training

Without changing how the application works.

---

# Principle 11
## Consistency

The same action should always behave the same way.

Buttons

Navigation

Cards

Forms

Icons

Terminology

Should all be consistent across the application.

---

# Principle 12
## Simplicity

The simplest solution is usually the best solution.

Avoid unnecessary configuration.

Avoid unnecessary clicks.

Avoid unnecessary complexity.

---

# Design Rule

If a football coach needs to think about the software,
then the software has failed.

Football Planner should think like the coach.