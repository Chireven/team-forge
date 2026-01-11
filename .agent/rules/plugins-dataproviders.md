---
trigger: always_on
---

# DATA PROVIDER PLUGIN (DPP) PROTOCOL
# This file governs "Nested Plugins" that act as adapters for external data sources.

## 1. Architecture: The "Parent & Adapter" Model

1.  **Interface Mandate (The Contract):**
    * The Parent Plugin (e.g., `TaskManagement`) must define an **Abstract Base Class** (e.g., `AbstractTaskAdapter`).
    * All Data Provider Plugins (DPPs) **must implement this abstract class**.
    * **Constraint:** DPPs are interchangeable. The Parent Plugin must work seamlessly regardless of which adapter is active.

2.  **The "Local Default" Rule:**
    * Every Parent Plugin must ship with a **"Local Native" DPP** bundled by default.
    * This default adapter connects to the application's core database. It cannot be disabled or uninstalled, ensuring the feature always works "out of the box."

3.  **Strict Delegation:**
    * **Proxy Rule:** DPPs are prohibited from speaking directly to the Core Application (Event Hub, RBAC).
    * They must pass data back to the **Parent Plugin**, which then decides how to interact with the rest of the system.
    * *Reasoning:* Prevents "Spaghetti Architecture" where a sub-plugin bypasses the main logic.

## 2. Security: "Read-First" Policy

1.  **Default to Read-Only:**
    * When a new DPP (e.g., Jira Adapter) is installed, it **must default to Read-Only mode**.
    * It can fetch data, but it is physically blocked from sending `POST/PUT/DELETE` commands to the external source until explicitly authorized.

2.  **Explicit Write Authorization:**
    * "Write Mode" cannot be enabled via a simple toggle.
    * **UX Mandate:** The Administrator must confirm via a dedicated modal: *"I authorize this plugin to modify data on the external service."*

3.  **Credential Isolation (Secrets):**
    * API Keys and OAuth Tokens for external services **must be encrypted at rest**.
    * **Prohibition:** Never store plain-text API keys in the database configuration table. Use the project's encryption utility (`libs/shared/utils/encryption`).

## 3. Configuration & UX

1.  **Unified Config Interface:**
    * The Parent Plugin renders the Settings Page. It detects which DPP is active and renders that DPP's specific form fields (e.g., "Jira URL" vs "GitHub Repo Name") dynamically.
    * **Validation:** The Settings Page must validate connection credentials (ping the external API) before allowing the user to Save.

2.  **Usage Transparency:**
    * The UI must visibly indicate the Source and Mode.
    * *Example Badge:* `[Source: JIRA] [Mode: READ-ONLY]` displayed near the page title.