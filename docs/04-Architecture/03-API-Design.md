# Football Planner

# API Design

---

# Philosophy

REST first.

Simple resources.

Predictable endpoints.

---

# Resources

/auth

/users

/clubs

/teams

/training-stories

/drills

/equipment

/players

/messages

/challenges

---

# Example

GET

/api/training-stories

POST

/api/training-stories

GET

/api/training-stories/:id

PUT

/api/training-stories/:id

DELETE

/api/training-stories/:id

---

# Nested Resources

/training-stories/:id/pitches

/training-stories/:id/coaches

/drills/:id/drawing

/drills/:id/equipment

---

# Response

Always

success

data

errors

meta

---

# Authentication

Bearer Token

Refresh Token

Role Permissions

---

# API Principles

Consistent naming.

Versioned.

Stateless.
