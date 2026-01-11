---
trigger: always_on
---

# DATA VALIDATION & INTEGRITY PROTOCOLS
# This file governs how data is checked, cleaned, and trusted.

## 1. Input Validation (The "DTO" Mandate)

1.  **API Boundary Validation:**
    * All data entering the Shell or Plugins via API **must be defined by a strict DTO (Data Transfer Object)**.
    * **Technology:** Use **`class-validator`** decorators (e.g., `@IsString()`, `@IsEmail()`) or **Zod** schemas to enforce rules.
    * **Constraint:** "Implicit" validation (checking `req.body` manually) is strictly prohibited. You must use the framework's global Validation Pipe.

2.  **Fail-Fast Policy:**
    * If a DTO fails validation, the API must immediately throw a `BadRequestException` (HTTP 400).
    * Malformed data must never trigger database connections or business logic execution.

3.  **Shared Schemas (Client-Server Parity):**
    * Where possible, validation schemas/types should be defined in the `libs/shared/data-access` library.
    * Both the Frontend (React Hook Form) and Backend (NestJS DTOs) should reference these shared types to ensure the rules are identical on both sides.

## 2. Transactional Integrity (ACID)

1.  **Atomic Operations:**
    * Any operation involving multiple writes (e.g., "Create User" AND "Create Initial Inventory") **must be wrapped in a Transaction**.
    * **Technology:** Use the **TypeORM `QueryRunner`** or `EntityManager.transaction()`.
    * **Rule:** If the second write fails, the first write must be rolled back automatically.

2.  **Foreign Keys:**
    * Relationships must be enforced at the **Database Level** (Foreign Keys), not just in the code.
    * Do not rely on software logic to prevent orphaned records.

3.  **Idempotency:**
    * State-changing endpoints (POST/PUT) must handle duplicate requests gracefully.
    * *Example:* If a user clicks "Submit" twice, the system should process the first and either ignore the second or return the cached result of the first—it must not create two records.

## 3. Sanitization & Normalization

1.  **Input Normalization:**
    * Inputs must be "Trimmed" and normalized *before* they reach the database.
    * **Standard:** Email addresses are always saved as lowercase.
    * **Sanitization:** Use the shared `libs/shared/utils` library to strip HTML/Script tags from user inputs to prevent XSS.

2.  **Unique Constraints:**
    * Critical fields (Usernames, SKUs, Plugin Slugs) **must have Database Unique Indexes**.
    * The application must catch the unique constraint violation error (e.g., SQL Error 2627) and map it to a user-friendly `ConflictException` (HTTP 409).