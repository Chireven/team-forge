---
trigger: always_on
---

# CODING STANDARDS & QUALITY GUIDELINES
# This file governs the style, structure, and documentation of the codebase.

## 1. Code Style & Formatting

1.  **Automated Formatting:**
    * All code must be formatted using **Prettier**.
    * The AI must run the formatter on generated code before presenting it.
    * **Constraint:** No "nitpicky" manual formatting debates. If Prettier accepts it, it is valid.

2.  **Naming Conventions:**
    * **Variables/Functions:** camelCase (e.g., `getUserData`).
    * **Classes/Components:** PascalCase (e.g., `UserProfile`).
    * **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`).
    * **Filenames:** kebab-case (e.g., `user-profile.component.tsx`).

3.  **Documentation (The "Why"):**
    * Public APIs and complex algorithms **must include JSDoc/TSDoc**.
    * **Rule:** Comments must explain *intent* ("Why we filter this list"), not implementation ("Loop through list").
    * **Self-Documenting Code:** Prefer descriptive variable names over comments. `const daysUntilExpiration` is better than `const d // days left`.

## 2. Complexity & Granularity

1.  **The "300 Line" Rule:**
    * No single file should exceed **300 lines** of executable code.
    * If a file approaches this limit, it must be refactored into smaller sub-modules or utility functions.

2.  **Single Responsibility Principle (SRP):**
    * Functions should do one thing.
    * React Components should render one logical piece of UI.
    * *Example:* A `UserCard` component should not also contain the logic for fetching the user from the API. Move the fetch logic to a Hook or Service.

3.  **Cyclomatic Complexity:**
    * Avoid deeply nested logic (if/else inside loops).
    * Use "Early Returns" to flatten code structure.

## 3. Modern JavaScript/TypeScript Practices

1.  **Immutability:**
    * Prefer `const` over `let`. Never use `var`.
    * Use spread operators (`...`) and array methods (`map`, `filter`) instead of mutating loops where possible.

2.  **Async/Await:**
    * Always use `async/await` syntax instead of raw `.then()` chains.
    * All async actions must be wrapped in `try/catch` blocks or handled by a global error boundary.