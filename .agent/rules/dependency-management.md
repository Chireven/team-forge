---
trigger: always_on
---

# DEPENDENCY MANAGEMENT & SECURITY PROTOCOL
# This file governs the selection, maintenance, and security of third-party packages.

## 1. Version Selection (The "LTS" Mandate)

1.  **LTS or Nothing:**
    * **Node.js Runtime:** Must strictly use the Active LTS version (e.g., Iron/Hydrogen). Current/Feature releases are prohibited.
    * **Frameworks:** React, NestJS, and Nx must be pinned to their latest stable major versions.
    * **Constraint:** The AI Assistant must not suggest libraries that are in Alpha/Beta/RC states unless specifically requested for a prototype.

2.  **Latest Stable Patch:**
    * Dependencies should be kept at the latest *Patch* version (`1.2.x`) to ensure bug fixes are applied.
    * **Lockfile:** `package-lock.json` must be committed and respected. CI/CD must run `npm ci` (Clean Install), not `npm install`.

## 2. Security & Vulnerabilities

1.  **Automated Auditing:**
    * **CI Gate:** The build pipeline must run `npm audit` (or `nx audit`).
    * **Severity Threshold:** The build **must fail** if any vulnerability of **High** or **Critical** severity is detected.
    * **Resolution:** Patches for High/Critical CVEs must be applied within 7 days.

2.  **Proactive EOL Management:**
    * Dependencies must be upgraded at least 90 days before their End-of-Life date.
    * The project cannot rely on "Abandonedware" (libraries with no updates in >12 months).

## 3. Licensing (Legal Safety)

1.  **Banned Licenses:**
    * **STRICT PROHIBITION:** Do not use packages with **GPL** (v2/v3), **AGPL**, or other "Viral" Copyleft licenses.
    * **Approved:** MIT, Apache 2.0, BSD-3-Clause, ISC.

2.  **License Scanning:**
    * The CI pipeline must include a license check step (e.g., using `license-checker`) to verify compliance before merging.

## 4. Production Isolation**
1.  **DevDependencies:**
    * Build tools, testing libraries (Jest/Cypress), and generators must be listed in `devDependencies`.
    * The production Docker image must be built using `--only=production` to ensure these tools are not deployed.