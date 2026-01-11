---
trigger: always_on
---

# Frontend Guidelines: React & Module Federation

When generating frontend code, assume a "Micro-Frontend" architecture:

1.  **The Host (Shell):**
    * Manages the root routing table.
    * Manages the global `AuthContext` and `ThemeContext`.
    * Dynamically loads Remotes (Plugins).

2.  **The Remotes (Plugins):**
    * Must be wrapped in an `ErrorBoundary` to prevent crashing the Shell.
    * Must not include global CSS resets or hardcoded layout dimensions (must fit 100% width/height of their container).
    * Must use the Shared UI Library for common components (Buttons, Inputs) to maintain visual consistency.

3.  **State Management:**
    * Global state (User, Theme) lives in the Shell.
    * Plugin-specific state lives strictly within the Plugin.