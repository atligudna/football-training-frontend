# Football Planner

> Think football. Not software.

# Requirements Matrix

Version: 1.0
Status: Draft
Owner: Atli Guðnason
Last Updated: 9 July 2026

Related Documents

- 01-Vision.md
- 02-Product-Principles.md
- 03-Personas.md
- 04-Use-Cases.md
- 02-Domain/01-Domain-Model.md

---

# Purpose

The Requirements Matrix is the master tracking document for Football Planner.

Every feature in the application should be represented by a Use Case.

Each Use Case has:

- Priority
- Business Value
- Implementation Complexity
- MVP Status
- Development Status

This document defines what should be built first.

---

# Priority Levels

🔴 MUST

Required for Version 1.0.

🟡 SHOULD

Important but not required for Version 1.0.

🔵 COULD

Planned for future releases.

---

# Development Status

⬜ Planned

🟨 In Progress

🟩 Completed

⏸ Deferred

❌ Cancelled

---

# Requirements Matrix

| ID | Use Case | Priority | Business Value | Complexity | MVP | Status |
|----|----------|----------|----------------|------------|-----|--------|
| UC-001 | Login | 🔴 MUST | High | Low | ✅ | 🟩 |
| UC-002 | Create Session | 🔴 MUST | High | High | ✅ | ⬜ |
| UC-003 | Edit Session | 🔴 MUST | High | Medium | ✅ | ⬜ |
| UC-004 | Duplicate Session | 🟡 SHOULD | High | Low | ❌ | ⬜ |
| UC-005 | Delete Session | 🟡 SHOULD | Medium | Low | ❌ | ⬜ |
| UC-006 | Add Pitches | 🔴 MUST | High | Medium | ✅ | ⬜ |
| UC-007 | Configure Pitch | 🔴 MUST | High | Medium | ✅ | ⬜ |
| UC-008 | Standard Training | 🔴 MUST | High | High | ✅ | ⬜ |
| UC-009 | Station Training | 🔴 MUST | High | High | ✅ | ⬜ |
| UC-010 | Assign Coach to Pitch | 🔴 MUST | High | Low | ✅ | ⬜ |
| UC-011 | Create Drill | 🔴 MUST | High | Medium | ✅ | ⬜ |
| UC-012 | Edit Drill | 🔴 MUST | High | Medium | ✅ | ⬜ |
| UC-013 | Search Drill Library | 🔴 MUST | High | Medium | ✅ | ⬜ |
| UC-014 | Visual Pitch Builder | 🟡 SHOULD | Very High | High | ❌ | ⬜ |
| UC-015 | Training Timeline | 🟡 SHOULD | Very High | High | ❌ | ⬜ |
| UC-016 | Coach Mode | 🔴 MUST | Very High | Medium | ❌ | ⬜ |
| UC-017 | Print Session | 🟡 SHOULD | Medium | Medium | ❌ | ⬜ |
| UC-018 | Session Templates | 🟡 SHOULD | High | Medium | ❌ | ⬜ |
| UC-019 | Share Session | 🔵 COULD | Medium | Medium | ❌ | ⬜ |
| UC-020 | Dashboard | 🔴 MUST | High | Medium | ✅ | 🟨 |
| UC-021 | Live Session Adjustments | 🟡 SHOULD | High | Medium | ❌ | ⬜ |
| UC-022 | Session Review | 🟡 SHOULD | Medium | Medium | ❌ | ⬜ |
| UC-023 | Player View | 🟡 SHOULD | High | High | ❌ | ⬜ |
| UC-024 | Weekly Challenge | 🔵 COULD | Medium | Medium | ❌ | ⬜ |
| UC-025 | Quote of the Day | 🔵 COULD | Low | Low | ❌ | ⬜ |
| UC-026 | Player Focus | 🟡 SHOULD | High | Low | ❌ | ⬜ |
| UC-027 | Training Theme | 🟡 SHOULD | High | Low | ❌ | ⬜ |

---

# Definition of MVP

Version 1.0 is complete when a coach can:

- Log in
- Build a complete football session
- Add Warm-up
- Add 1–4 Pitches
- Build Standard and Station Training
- Assign coaches
- Build reusable drills
- Search the Drill Library
- View the Dashboard
- Save and reuse sessions

Without using paper.

---

# Notes

This document should be updated continuously throughout development.

No feature should be implemented without a corresponding Use Case.