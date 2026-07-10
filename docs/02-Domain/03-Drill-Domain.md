# Football Planner

> Think football. Not software.

# Drill Domain

Version: 1.0
Status: Draft
Owner: Atli Guðnason
Last Updated: 9 July 2026

Related Documents

- 00-Glossary.md
- 01-Domain-Model.md
- 02-Session-Domain.md

---

# Purpose

A Drill represents one reusable football learning activity.

A Drill is the smallest reusable coaching unit in Football Planner.

Drills never belong to Sessions.

Sessions reference Drills.

This allows every Drill to be reused hundreds of times.

---

# Definition

A Drill is a structured coaching activity designed to teach one or more football concepts.

Every Drill contains:

- Technical information
- Coaching information
- Player information
- Visual information
- Equipment
- Learning objectives

---

# Drill Structure

Drill

↓

Information

↓

Objectives

↓

Coaching

↓

Players

↓

Visual Design

↓

Equipment

↓

Metadata

---

# Drill Information

Every Drill contains:

Name

Description

Category

Age Group

Difficulty

Duration

Minimum Players

Maximum Players

Recommended Area

Created By

Created Date

Last Updated

Version

---

# Drill Categories

Examples

Passing

Receiving

Finishing

1v1

2v1

Defending

Pressing

Possession

Transition

Small Sided Game

Goalkeeping

Coordination

Speed

Agility

Warm-up

Cool Down

Technical

Tactical

Physical

Mental

---

# Learning Objective

Every Drill has one primary objective.

Examples

Improve passing accuracy.

Improve first touch.

Create overloads.

Develop pressing behaviour.

Improve finishing.

---

# Secondary Objectives

A Drill may contain multiple secondary objectives.

Examples

Communication

Scanning

Decision Making

Speed of Play

Movement

Support Angles

---

# Training Theme

A Drill may support one or more Training Themes.

Examples

Playing Forward

Transition

Pressing

Building from the Back

Switching Play

---

# Coaching Points

Coaching Points are visible only to coaches.

Examples

Open body before receiving.

Play through the ball.

Communicate early.

Encourage scanning.

Positive first touch.

Multiple Coaching Points may exist.

---

# Player Focus

Player Focus is visible to players.

Examples

Receive on your back foot.

Scan before receiving.

Play forward if possible.

Support the ball.

Move after passing.

Player Focus should use simple language.

---

# Coach Notes

Optional notes for coaches.

Examples

Reduce area if intensity is too low.

Increase touches if players struggle.

Change to one-touch.

Use weaker foot only.

---

# Progressions

A Drill may contain Progressions.

Examples

Reduce space.

Increase pressure.

Add defenders.

Limit touches.

Increase speed.

---

# Regressions

A Drill may contain Regressions.

Examples

Increase space.

Allow unlimited touches.

Remove defenders.

Reduce distance.

---

# Equipment

Equipment required.

Examples

12 Balls

20 Cones

8 Bibs

2 Goals

4 Poles

---

# Visual Pitch

Every Drill owns one visual football pitch.

The pitch contains:

Players

Goals

Balls

Cones

Areas

Lines

Arrows

Text Labels

---

# Animation

Future Version

The visual pitch may become animated.

Example

Player Movement

Passing Sequence

Rotation

Pressing Trigger

---

# Time

Estimated Duration

Setup Time

Explanation Time

Working Time

Rest Time

Rotation Time

---

# Coach Preparation

Estimated setup before training.

Example

3 minutes

---

# Session Usage

A Drill may be used:

In Warm-up

In Standard Training

In Station Training

In Cool Down

---

# Player Numbers

Recommended

Minimum

Maximum

---

# Area

Recommended Pitch Size

Example

20 x 20

30 x 25

Half Pitch

Full Pitch

---

# Success Criteria

How does the coach know the Drill works?

Examples

80% successful passes

Players scan before receiving

Quick transitions

High intensity

---

# Common Mistakes

Typical player errors.

Examples

Standing still

Poor body shape

Watching the ball

Late communication

---

# Coach Questions

Reflection questions.

Examples

What did players struggle with?

Should I reduce space?

Was the objective achieved?

Would I reuse this Drill?

---

# Attachments

Optional

Images

Videos

PDF

External Links

---

# Tags

Examples

Passing

U11

Possession

One Touch

Pressing

Warm-up

Game Based

---

# Favourite

A coach may mark a Drill as Favourite.

---

# Rating

A coach may rate a Drill.

1–5 stars.

---

# Session Statistics

Future

Number of uses

Average rating

Average duration

Most common age group

---

# Business Rules

DR-001

Every Drill has exactly one Learning Objective.

DR-002

Every Drill may have many Coaching Points.

DR-003

Every Drill may have many Player Focus items.

DR-004

Every Drill owns one Pitch Drawing.

DR-005

A Drill may be reused infinitely.

DR-006

A Drill may belong to many Categories.

DR-007

A Drill may support many Training Themes.

DR-008

Every Drill may contain Progressions.

DR-009

Every Drill may contain Regressions.

DR-010

A Drill is independent of Sessions.

---

# Guiding Principle

A Drill is not simply an exercise.

A Drill is a reusable coaching package.