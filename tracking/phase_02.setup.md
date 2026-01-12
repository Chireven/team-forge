# PHASE 2: IDENTITY LAYER & BOOTSTRAPPING
# ACT AS: Senior Solutions Architect & Lead Developer.

We are moving to Phase 2. The goal is to implement the "Identity Layer" and the "First-Run Experience."
Refer to the "Project Constitution" you ingested (specifically Rules 5, 6, 9, and 19).

# 1. ARCHITECTURAL REQUIREMENTS

A. DATABASE & ENTITIES (Rule 9)
   - Configure TypeORM in `api-gateway` to connect to a local MS SQL Server (via Docker).
   - Create the `User` Entity in `libs/shared/data-access`.
   - Fields: `id` (UUID), `email` (Unique), `passwordHash` (String), `isSuperAdmin` (Boolean), `createdAt`.

B. AUTHENTICATION SERVICE (Rule 6)
   - Implement `AuthService` using `@nestjs/jwt` and `passport`.
   - **Hashing:** You MUST use `argon2` for password hashing. Do NOT use bcrypt or plain text.
   - **Strategy:** Implement JWT Strategy. The JWT payload must contain `sub` (UUID) and `email`.

C. THE BOOTSTRAPPING LOGIC (The "Setup Wizard")
   - **Status Check:** Create a public endpoint `GET /api/auth/status`.
     - Logic: Count rows in `User` table.
     - Return: `{ isSetupRequired: count === 0 }`.
   - **Setup Endpoint:** Create a public endpoint `POST /api/auth/setup`.
     - Guard: If `User` table is NOT empty, throw `403 Forbidden`.
     - Action: Create the user, hash the password, set `isSuperAdmin = true`.
     - Return: Standard Auth Token (login the user immediately).

# 2. FRONTEND IMPLEMENTATION (Rule 1 & 3)

A. SHELL ROUTING
   - On application load, the Shell must query `/api/auth/status`.
   - If `isSetupRequired === true`: Redirect strictly to `/setup`.
   - If `isSetupRequired === false`: Redirect strictly to `/login` (if not authenticated).

B. UI PAGES
   - **SetupPage:** A clean form asking for "Organization Name", "Admin Email", and "Password".
   - **LoginPage:** Standard Email/Password form.
   - **Style:** Use `libs/shared/ui` components. Adhere to Rule 21 (Visual Hierarchy).

# 3. EXECUTION STEPS

Generate the commands and code to:
1.  Add necessary dependencies (`argon2`, `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `passport-local`).
2.  Create a `docker-compose.yml` for the MS SQL database.
3.  Scaffold the `User` entity and `AuthModule`.
4.  Implement the Bootstrapping logic (Controller & Service).
5.  Create the React `SetupPage` and `LoginPage` in the Shell.