---
trigger: always_on
---

# IDENTITY & ACCESS CONTROL POLICY
# This file governs User Identity, Authentication, and Role Definitions.

## 1. User Account Identity (The Core "Passport")

1.  **Local Account Mandate:** * Every active user **must possess a unique account record** in the Core Shell database, regardless of external authentication providers (e.g., SSO/Azure AD).
    * The Core is the "System of Record" for User IDs.

2.  **Data Minimization (PII):** * User records in the Core are **prohibited** from storing extraneous Personally Identifiable Information (PII) unless required for authentication.
    * **Mandatory Fields:** UUID (Primary Key), Auth Identifier (Hash/SAML ID), Display Name, Email.
    * **Plugin Data:** Plugins requiring extra user data (e.g., "Shoe Size" or "Office Location") must store it in their own database tables, linked by the Core UUID.

3.  **Password Security:** * Local passwords **must be stored using strictly modern hashing** (Argon2 or PBKDF2).
    * MD5 and SHA-1 are **strictly prohibited**.

## 2. Security & Protection

1.  **Transport Security:** All authentication flows (login, reset, profile) **must occur over HTTPS/TLS**.
2.  **Brute-Force Protection:** The Core must enforce account lockouts (e.g., 30 mins after 5 failed attempts).
3.  **Audit Trail:** All security events (Role changes, Logins, Lockouts) must be logged with `ActorID`, `Timestamp`, and `ActionType`.

## 3. Role Architecture (Federated Model)

This section mandates the separation between **System Roles** (Core Infrastructure) and **Domain Roles** (Plugin Business Logic).

### A. System Roles (Infrastructure & Maintenance)
* **Definition:** Roles that govern the "Shell" and technical operations (e.g., **Super Admin**, **System Auditor**).
* **Ownership:** Defined and managed strictly by the **Core**.
* **Scope:** Grants access to technical endpoints (e.g., `/api/system/logs`, `/api/plugins/manage`).
* **Constraint:** A System Role (like "Admin") **does not** implicitly grant business access. Being a "System Admin" does not automatically make you an "HR Manager."

### B. Domain Roles (Business Logic)
* **Definition:** Roles that define a user's function within a specific feature set (e.g., **Inventory Manager**, **Ticketing Agent**).
* **Ownership:** **Plugins define these roles.** * *Example:* The "Ticketing Plugin" registers the "Helpdesk Agent" role with the Core at startup.
* **Assignment:** The Core stores the assignment ("User A is a Helpdesk Agent"), but the Plugin enforces the logic ("Helpdesk Agents can close tickets").
* **Mutability:** A user may hold multiple Domain Roles across different Plugins simultaneously.

### C. The "Non-Impact" Mandate
The assignment of a System Role **must not** override Domain Role logic. 
* *Rule:* Business logic checks inside a Plugin must strictly check for the relevant Domain Role/Permission. They must not hardcode checks for "System Admin."