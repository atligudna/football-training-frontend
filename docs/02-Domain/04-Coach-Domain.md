# Football Planner

> Think football. Not software.

# Coach Domain

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

The Coach Domain defines how coaches interact with Football Planner.

A Coach is both:

- A system user.
- A football coach participating in training sessions.

---

# Coach Structure

Coach

↓

Profile

↓

Teams

↓

Sessions

↓

Pitch Assignments

↓

Responsibilities

↓

Preferences

↓

Permissions

---

# Coach Profile

Every Coach contains:

First Name

Last Name

Email

Phone

Photo

Preferred Language

Timezone

Active

Created Date

---

# Coaching Roles

A Coach may have one or more roles.

Examples

Head Coach

Assistant Coach

Goalkeeper Coach

Fitness Coach

Technical Director

Academy Coach

Club Administrator

---

# Team Assignments

A Coach may work with:

One Team

Multiple Teams

Different age groups

Different clubs (future)

---

# Session Assignment

A Coach may be assigned to:

One Session

Many Sessions

A Coach may also create Sessions.

---

# Pitch Assignment

Within a Session a Coach may be assigned to:

Pitch A

Pitch B

Pitch C

Pitch D

Multiple coaches may share one Pitch.

---

# Responsibilities

Each Coach may have responsibilities.

Examples

Lead Warm-up

Lead Pitch A

Lead Goalkeepers

Equipment

Cool Down

Player Feedback

---

# Coach Mode

Coach Mode shows only information relevant to the assigned Coach.

Example

Coach Atli

↓

Pitch A

↓

Current Drill

↓

Remaining Time

↓

Next Drill

↓

Coaching Points

---

# Notifications

Future

Session starts in 30 minutes

Pitch rotation

Equipment reminder

Training changes

---

# Session Collaboration

Multiple coaches can edit the same Session.

Changes should update in real time.

Examples

Coach A edits Pitch A.

Coach B edits Pitch B.

No conflicts.

---

# Coach Notes

Private notes.

Visible only to coaches.

Examples

Move Jón to Blue Group.

Reduce area.

Use weaker foot.

---

# Coach Preferences

Preferred Session View

Preferred Timeline

Favourite Drills

Default Pitch Layout

Default Session Length

---

# Permissions

Coach permissions are role-based.

Examples

Create Sessions

Edit Sessions

Delete Sessions

Create Drills

Approve Club Drills

Manage Equipment

Manage Players

Invite Coaches

---

# Statistics

Future

Sessions Created

Drills Created

Favourite Drills

Hours Coached

Teams Managed

---

# Business Rules

CR-001

A Coach may belong to multiple Teams.

CR-002

A Coach may lead multiple Sessions.

CR-003

Every Pitch may have one or more Coaches.

CR-004

Coach Mode always follows one assigned Pitch.

CR-005

Only authorised Coaches may edit Club resources.

CR-006

A Coach may own personal Drill Collections.

CR-007

Coach Notes are never visible to players.

---

# Guiding Principle

Football Planner should help coaches work together,
not just work alone.