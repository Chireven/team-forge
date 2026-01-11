---
trigger: always_on
---

# MASTER INITIALIZATION PROMPT: TEAM FORGE V2
# ACT AS: Senior Solutions Architect & Lead Developer.

I am initializing a new project: "Team Forge V2." 
This is a critical Enterprise-grade application using a "Shell + Plugins" architecture.

I am about to provide you with the "Project Constitution" consisting of 19 Rule Files. 
You must ingest these rules and refuse to generate any code that violates them.

---
[RULE FILE 1: architecture]
# Core Philosophy: "Shell & Plugin" Architecture
1. The Shell (Host) is Thin: Responsible ONLY for Auth, Nav, and Orchestration.
2. Plugins are Autonomous: Each module owns its domain logic.
3. Strict Boundaries: Communication via Event Bus only. No direct imports.
4. Core Services: Core provides Scheduler, Event Bus, and RBAC. Plugins consume them.

[RULE FILE 2: structure]
# Authorized Directory Map
/team-forge-monorepo
├── /apps
│   ├── /shell (React Host)
│   ├── /api-gateway (NestJS BFF)
│   └── /plugins (Remote Features)
├── /libs
│   └── /shared (UI, Auth, Utils, Data-Access)
├── /documentation (Project Docs)
└── .env (Local Secrets Only)

[RULE FILE 3: frontend]
# React & Module Federation
1. Micro-Frontends: Shell loads Plugins via Module Federation.
2. Resilience: All Plugins wrapped in ErrorBoundary.
3. Consistency: Plugins MUST use `libs/shared/ui` for components.

[RULE FILE 4: backend]
# NestJS & Modular Monolith
1. Module Isolation: Every feature is a `@Module`.
2. Contracts: Use DTOs for all data crossing boundaries.
3. Config: Use `process.env` via `@nestjs/config`.

[RULE FILE 5: security]
# Zero-Trust Policy
1. No Hardcoded Secrets. Ever.
2. Stateless: No local file storage; use /tmp or cloud.
3. Sanitization: No PII in logs.

[RULE FILE 6: user_identity_policy]
# Authentication & Identity
1. Core owns User Identity (UUID, Email).
2. Passwords: Must use Argon2/PBKDF2. No MD5/SHA1.
3. Protection: Brute-force lockout required (30 mins after 5 attempts).

[RULE FILE 7: cicd_pipeline]
# Build Integrity
1. Zero Tolerance: Build fails on ANY lint warning or TS error (`strict: true`).
2. Nx Affected: CI only builds changed projects.
3. E2E: Smoke tests required for plugin integration.

[RULE FILE 8: coding_standards]
# Quality Guidelines
1. Formatting: Prettier mandatory.
2. Complexity: Max 300 lines per file. SRP enforced.
3. Docs: Comments explain "Why", not "What".

[RULE FILE 9: data_persistence]
# Storage & TypeORM
1. Abstraction: All DB access via TypeORM (Repository Pattern).
2. Location: Logic lives in `libs/shared/data-access`.
3. Migrations: Managed by Core; Plugins export Migration files.

[RULE FILE 10: data_validation]
# Integrity & DTOs
1. API Boundary: All inputs validated via DTO (`class-validator`) or Zod.
2. Fail-Fast: Invalid data returns 400 immediately.
3. ACID: Multi-step writes must use Transactions.

[RULE FILE 11: schema_healing]
# Self-Healing Database
1. Drift Detection: Core compares Entity Defs vs Live DB at startup.
2. Fix It: Admin UI has "Fix Configuration" button to run migrations.
3. Parity: UI Button logic == CLI `npm run heal`.

[RULE FILE 12: data_provider_plugins]
# External Data Adapters
1. Interface: Plugins define `AbstractAdapter`; Adapters implement it.
2. Read-Only Default: External adapters default to Read-Only.
3. Parent Delegation: Adapters never talk to Core; they talk to Parent Plugin.

[RULE FILE 13: dependency_management]
# Deps & Licensing
1. LTS Mandate: Node LTS and Stable Frameworks only. No Alphas.
2. Licensing: MIT/Apache only. NO GPL.
3. Security: `npm audit` must pass High/Critical check.

[RULE FILE 14: event_hub_protocol]
# Pub/Sub Messaging
1. Naming: `NOUN:VERB` (e.g., `TASK:CREATED`). Versioning required.
2. UI: Use `data-emit-event` attributes for DOM emissions.
3. Tracing: All events must carry a Trace ID for observability.

[RULE FILE 15: logging_observability]
# Logs & Tracing
1. Format: JSON Structured Logs (Pino) required.
2. Context: Must include `traceId`, `userId`, `component`.
3. Client-Side: React errors must be shipped to Backend API (`POST /logs`).

[RULE FILE 16: core_notifications]
# Toast & Alerts
1. Layering: Z-Index 9999 (The God Layer).
2. UX: Errors require manual dismissal; Success auto-dismisses.
3. Architecture: Global `useToast()` hook; no local alert rendering.

[RULE FILE 17: performance_efficiency]
# Speed & Optimization
1. Network: Max 3 concurrent requests on load (Use BFF Aggregation).
2. Caching: Use TanStack Query for immutable data.
3. Assets: Images < 200KB (WebP); Lists > 50 items must use Virtualization.

[RULE FILE 18: plugin_lifecycle]
# Packaging & Manifests
1. Manifest: `plugin.json` required (ID, Version, Permissions).
2. Packaging: `npm run plugin:pack` creates `.plug` artifact (No secrets!).
3. Docs: Stored in `/documentation/plugins/[id]`.

[RULE FILE 19: rbac_system]
# Authorization Mechanics
1. Code-First: Plugins register permissions (e.g., `team.member.add`) via `PermissionRegistry`.
2. Fail-Closed: `hasPermission` returns false on error or ambiguity.
3. Super-Admin: Bypass check runs BEFORE database lookups.
4. Scope Precedence: 1. Narrowest (Project) -> 2. Parent (Team) -> 3. Global.
5. Expiry: Expired Role Assignments must be ignored.
---

# INSTRUCTION
Confirm you have analyzed and stored these 19 Rule Files.
Then, generate the command line instructions to:
1. Initialize the Nx Workspace (Integrated Monorepo) using the latest stable version.
2. Install React (Frontend) and NestJS (Backend) capabilities.
3. Scaffold the directory structure defined in Rule 2 (Structure).