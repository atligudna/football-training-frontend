# Football Planner

> Think football. Not software.

# Player Domain

Version: 1.0
Status: Draft
Owner: Atli Guðnason
Last Updated: 9 July 2026

Related Documents

- 01-Domain-Model.md
- 02-Session-Domain.md
- 03-Drill-Domain.md
- 04-Coach-Domain.md

---

# Purpose

The Player Domain defines how players interact with Football Planner.

Players are not administrators.

Players consume information prepared by coaches.

The Player experience should be simple, motivating and focused.

---

# Player Structure

Player

↓

Profile

↓

Teams

↓

Today's Session

↓

Player Focus

↓

Challenges

↓

Development

↓

Attendance

---

# Player Profile

Every Player contains:

First Name

Last Name

Date of Birth

Preferred Foot

Playing Position

Shirt Number

Photo

Guardian Contact (Youth)

Preferred Language

---

# Team Assignment

A Player belongs to one Team.

Future versions may support multiple teams.

---

# Session Participation

Players automatically receive today's Session.

Player View displays:

Training Theme

Warm-up

Training Overview

Cool Down

Coach Message

---

# Player View

The Player View is a simplified version of the coach's session.

Visible

✓ Training Theme

✓ Timeline

✓ Current Activity

✓ Player Focus

✓ Weekly Challenge

✓ Coach Message

✓ Quote of the Day

Hidden

✗ Coach Notes

✗ Session Planning

✗ Internal Timeline Details

✗ Equipment Planning

---

# Player Focus

Every Drill may define Player Focus items.

Examples

Receive on your back foot.

Open your body.

Play forward quickly.

Communicate early.

Players see only these instructions.

---

# Training Theme

Every Session may define one Training Theme.

Examples

Playing Forward

First Touch

Pressing

Transition

The Theme is displayed at the top of the session.

---

# Weekly Challenge

Future

Examples

1000 weak-foot touches.

50 juggling repetitions.

Practice wall passing.

Complete before Sunday.

---

# Coach Message

Optional message from the coach.

Examples

Bring running shoes.

Meet 15 minutes early.

Remember shin guards.

Excellent work last session.

---

# Quote of the Day

Optional motivational quote.

Examples

Hard work beats talent when talent doesn't work hard.

Success is earned every day.

Control the controllables.

---

# Attendance

Future

Players may register attendance.

Coach confirms attendance.

---

# Personal Development

Future

Players may view:

Technical Goals

Season Goals

Achievements

Coach Feedback

---

# Session Reflection

Future

Players answer simple reflection questions.

Examples

What did you improve today?

What was difficult?

What will you focus on next time?

---

# Notifications

Future

Training Reminder

Challenge Deadline

Coach Message

Session Changed

---

# Business Rules

PR-001

A Player belongs to one Team.

PR-002

Players never edit Sessions.

PR-003

Players only see Player View.

PR-004

Coach Notes are never visible.

PR-005

Player Focus belongs to Drills.

PR-006

Weekly Challenges are optional.

PR-007

Quotes are optional.

---

# Guiding Principle

Players should understand

what today's training is,

why they are doing it,

and what they should focus on.