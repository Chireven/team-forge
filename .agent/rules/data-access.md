---
trigger: always_on
---

# DATA PERSISTENCE & MULTI-DATABASE SUPPORT (MDS)
# This file governs how the application stores and retrieves data.

## 1. Data Access Abstraction Layer

1.  **Strict ORM Mandate:**
    * All data access (CRUD) must be performed exclusively through a standardized ORM (TypeORM is recommended for this stack).
    * **Prohibition:** Writing raw SQL (e.g., `SELECT * FROM...`) inside business logic services is strictly prohibited. Raw SQL couples the code to a specific dialect.

2.  **Configuration Isolation:**
    * Connection strings, credentials, and the "Provider Type" (e.g., `mssql`, `postgres`) must be injected via `process.env`.
    * Business logic modules must never read these configurations directly; they should rely on the `DatabaseModule` to provide the active connection.

3.  **Cross-Database Prohibition:**
    * Queries must not span multiple physical databases in a single transaction.
    * Joins between tables in different databases are prohibited.

## 2. Provider-Specific Management

1.  **Default Provider (MS SQL):**
    * The application defaults to **MS SQL Server**.
    * All CI/CD pipelines and automated tests must pass against the MS SQL provider before merging.

2.  **Dialect Isolation:**
    * Code that deals with specific DB features (e.g., MS SQL Full-Text Search vs. Postgres TSVector) must be isolated in "Driver Strategy" files.
    * The Core Application logic must remain provider-agnostic.

3.  **Migration Tooling:**
    * Schema changes must be managed by a provider-agnostic tool (e.g., TypeORM Migrations).
    * Migrations should be generated automatically where possible to ensure syntax compatibility across supported providers.

## 3. User Experience & Validation

1.  **Startup Validation:**
    * The `DatabaseModule` must run a connection check on application startup.
    * If the connection fails or the schema version does not match the code version, the application must halt with a clear error message.

2.  **Graceful Degradation:**
    * If a Plugin requires a feature not supported by the active database provider (e.g., JSONB in an old SQL version), the Plugin must disable that specific feature and log a `WARN` event. It must not crash the Shell.

## 4. Repository Structure

To maintain the Monorepo architecture, database logic is organized as follows:

1.  **Core Database Logic:**
    * Location: `libs/shared/data-access/src/lib/core`
    * Contains: Abstract Repository definitions and base Entity classes.

2.  **Database Drivers (The "Plugins"):**
    * Location: `libs/shared/data-access/src/lib/drivers`
    * Contains: Specific implementations for `mssql`, `postgres`, etc.

3.  **Documentation:**
    * Location: `libs/shared/data-access/README.md`