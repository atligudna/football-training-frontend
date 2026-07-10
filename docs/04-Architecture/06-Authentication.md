# Football Planner

> Think football. Not software.

# Authentication

Version: 1.0

---

# Purpose

Authentication verifies who the user is.

Authorization decides what the user may do.

---

# Login Flow

Email

↓

Password

↓

JWT Access Token

↓

Refresh Token

↓

Authenticated Session

---

# Tokens

Access Token

Short lifetime

Used on every request.

Refresh Token

Long lifetime

Creates new Access Tokens.

---

# Authentication Methods

Email + Password

Future

Google

Apple

Microsoft

Club SSO

---

# Password Policy

Minimum 8 characters.

Hashed using bcrypt.

Never stored in plain text.

---

# Session Management

Login

Logout

Refresh

Expire

---

# Security

HTTPS only.

Secure Cookies (future).

Token expiration.

Rate limiting.

Password hashing.

---

# Future

Two-Factor Authentication

Biometric Login

Magic Links
