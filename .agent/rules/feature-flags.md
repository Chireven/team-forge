---
trigger: always_on
---

## 🚩 Feature Flag & Toggle Rules

### 1. Architecture
1.  **Core Service:** The Core must provide a `FeatureFlagService` accessible to both Backend (NestJS) and Frontend (React).
2.  **Granularity:** Flags must support three levels of targeting:
    * **Global:** On/Off for everyone.
    * **Role-Based:** Visible only to "Admins" (for testing).
    * **Percentage:** Gradual rollout (e.g., "10% of users").

### 2. Plugin Integration
1.  **Kill Switches:** Every Plugin must automatically register a "Master Toggle" (e.g., `plugin.inventory.enabled`) upon installation. If this flag is false, the Shell **must not load** the plugin's bundle.
2.  **Safe Failure:** If a feature requires a flag and the flag service is unreachable, it **must default to OFF** (Fail-Safe).