---
trigger: always_on
---

# PLUGIN LIFECYCLE & DISTRIBUTION PROTOCOL
# This file governs how plugins are identified, packaged, and installed.

## 1. Plugin Identity & Manifest

1.  **Directory Mandate:**
    * Every plugin must reside in its own folder within `apps/plugins/` (e.g., `apps/plugins/task-board`).
    * **Structure:** It must contain a valid `plugin.json` manifest at its root.

2.  **The Manifest (`plugin.json`):**
    * **Required Fields:** `id` (Reverse DNS: `com.company.taskboard`), `version`, `name`, `entryPoint`, and `permissions` (array of required permission strings).
    * **Integrity:** The application must refuse to load any plugin with a missing or malformed manifest.

3.  **Isolation:**
    * Plugins must not rely on global variables.
    * **Host API:** Access to Core services (Logging, EventBus) must occur via the injected `HostAPI` provider, not by importing Core files directly.

## 2. Packaging & Distribution (`.plug`)

1.  **The Packing Script:**
    * **Command:** `npm run plugin:pack --name=task-board`
    * **Output:** A compressed artifact with the custom extension **`.plug`**.

2.  **Artifact Contents:**
    * **Inclusions:** Compiled JS bundles, `plugin.json`, and static assets (images/css).
    * **Strict Exclusions:** The script **must strictly exclude** source maps, environment variables (`.env`), secrets, and raw source code.
    * **Validation:** The script must validate `plugin.json` before compressing.

3.  **Dynamic Loading:**
    * The Host Application must support loading these `.plug` files (likely via unzip-and-serve or blob loading) at runtime.
    * Plugins should only be fetched when the user accesses their specific Route to preserve initial load speed.

## 3. Documentation

1.  **Documentation Location:**
    * Plugin-specific documentation must be stored in `documentation/plugins/[plugin-id]/`.
    * **Live Updates:** Documentation updates must be committed in the same Pull Request as the code changes.
    * **Readme:** Every plugin folder must contain a `README.md` summarizing its Manifest details.

## 4. Security Integration

1.  **Permission Registration:**
    * The `plugin.json` must declare all RBAC permissions the plugin introduces (e.g., `taskboard.admin`).
    * **Admin UI:** The Core must read this list and automatically generate checkboxes in the User Management screen.

2.  **Delegated Configuration:**
    * The Host must provide a "Settings" frame. The Plugin exposes a Settings Component.
    * The Host renders the Plugin's Settings Component *inside* the safe frame to allow Admins to configure the plugin (e.g., "Set Jira URL").