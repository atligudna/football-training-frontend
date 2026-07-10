# Football Planner

> Think football. Not software.

# Testing Strategy

Version: 1.0
Status: Draft
Owner: Atli Guðnason

---

# Purpose

The goal of testing is to ensure Football Planner works reliably for coaches.

Testing should be automated whenever possible.

---

# Testing Pyramid

Unit Tests

↓

Integration Tests

↓

End-to-End Tests

---

# Unit Tests

Test business logic.

Examples

Session creation

Timeline generation

Equipment calculation

Coach assignment

Player grouping

---

# Integration Tests

Test API endpoints.

Examples

Login

Create Session

Create Drill

Assign Coach

Duplicate Session

---

# End-to-End Tests

Test complete user workflows.

Examples

Create Training Story

Run Coach Mode

Duplicate Session

Print Session

---

# Manual Testing

Before every release:

Create a Training Story

Create a Drill

Assign Coaches

Run Coach Mode

Print Session

Login as Player

---

# Test Data

Development database should contain:

Demo Club

Demo Teams

Demo Coaches

Demo Players

Demo Drills

---

# Success Criteria

Every release must pass:

Build

Lint

Unit Tests

Integration Tests

Critical End-to-End Tests