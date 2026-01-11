---
trigger: always_on
---

## 🌐 Internationalization (i18n) Rules

### 1. No Hardcoded Strings
1.  **Strict Prohibition:** Usage of raw string literals in JSX (e.g., `<h1>Welcome</h1>`) is **strictly prohibited**.
2.  **Translation Keys:** Developers must use translation keys (e.g., `t('dashboard.welcome_message')`).

### 2. Namespace Strategy
1.  **Plugin Isolation:** Each plugin must ship its own `en.json` translation file.
2.  **Namespace Injection:** The Shell must dynamically load and merge these files into the global i18n instance under a unique namespace (e.g., `plugin_inventory:item_name`). This prevents key collisions.