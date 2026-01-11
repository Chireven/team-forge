---
trigger: always_on
---

# DATABASE SCHEMA HEALTH & SELF-HEALING
# This file governs how the application detects and fixes database configuration drift.

## 1. Plugin Schema Registration

1.  **Registration Mandate:**
    * Every Plugin utilizing the database **must export its Schema Definitions** (Entities) and **Migration Files** via its public API.
    * **The Core's Responsibility:** The Core Application must aggregate these definitions into the central `DataSource` configuration on startup.
    * **Constraint:** Plugins are prohibited from creating their own isolated database connections. They must piggyback on the Core's connection to ensure a unified schema state.

## 2. Drift Detection (The "Check Engine" Light)

1.  **Startup & On-Demand Checks:**
    * The `SchemaService` must run a **non-destructive comparison** between the registered code entities and the live database schema.
    * **Mechanism:** Use the ORM's "Pending Migrations" check (e.g., `dataSource.showMigrations()`).
    * **Reporting:** If pending migrations or schema mismatches are found, the system must log a `WARN` event and flag the system status as "Degraded/Drifted."

2.  **Admin UI Visibility:**
    * The Admin Dashboard must clearly display a "Database Health" status.
    * **"Test Schema" Action:** A button must be available to trigger the comparison logic in real-time and list specifically *which* plugins are out of sync (e.g., "Inventory Plugin: 2 Pending Migrations").

## 3. Self-Healing Enforcement (The "Fix" Button)

1.  **Manual Trigger Requirement:**
    * Automatic schema updates on startup (`synchronize: true`) are **strictly prohibited** in production environments to prevent accidental data loss.
    * Heals must be triggered explicitly by an Administrator via the UI ("Fix Configuration" button) or DevOps via CLI.

2.  **CLI Parity:**
    * The logic executed by the UI button must be identical to the CLI command `npm run db:heal`.
    * This ensures the database can be fixed even if the Web UI is inaccessible.

3.  **The Healing Script:**
    * **Scope:** The script runs all pending migrations in the correct dependency order.
    * **Normalization:** If data normalization is required (e.g., populating a new `UUID` column), it must be handled inside the migration logic, not a separate loose script.

## 4. Safety & Auditing

1.  **Transactional Safety:**
    * The Healing process **must run inside a Database Transaction**.
    * If any part of the migration fails, the entire batch **must roll back** to the pre-heal state.

2.  **Audit Log:**
    * Execution of the Heal script is a generic audit event.
    * **Log Data:** `AdminID`, `Timestamp`, `MigrationsRun` (List of filenames), and `Result` (Success/Fail).