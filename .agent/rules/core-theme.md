---
trigger: always_on
---

# THEME ENGINE & UI STYLING PROTOCOL
# This file governs visual consistency across the Shell and all Plugins.

## 1. Architecture: The "Consumer" Model

1.  **Single Source of Truth:**
    * The **Shell** is the *only* application allowed to instantiate the `ThemeProvider`.
    * **Plugins** must treat the Theme as an injected dependency (via React Context).
    * **Prohibition:** Plugins must **never** include their own `<ThemeProvider>` or global CSS resets.

2.  **Dual Mode (Light/Dark):**
    * The Shell manages the toggle state.
    * Plugins must use **Semantic Tokens** (e.g., `colors.background.surface`) which automatically resolve to the correct hex code based on the active mode.

## 2. Token-Based Design System

1.  **Semantic Mandate:**
    * **Strict Prohibition:** Hardcoded hex values (e.g., `#FFFFFF`, `#000`) are banned in component code.
    * **Usage:** Developers must use tokens: `tokens.color.text.primary` or `tokens.spacing.m`.
    * **WCAG Compliance:** The Token Palette must guarantee **WCAG 2.1 AA** contrast ratios for all standard text/background pairs.

2.  **Typography & Spacing:**
    * **Scale:** Spacing is a multiplier of 4px (e.g., `space(2)` = 8px).
    * **Typography:** Font sizes and weights are defined in the `libs/shared/ui` theme object. Plugins must not import custom fonts; they inherit the Shell's font stack.

## 3. Responsive & Motion

1.  **Breakpoints:**
    * Media queries must use named tokens: `media.up('md')`.
    * **Ad-hoc pixel values** (e.g., `@media (min-width: 732px)`) are prohibited.

2.  **Reduced Motion:**
    * All animations must respect `prefers-reduced-motion`.
    * Transitions must use the theme's standard `duration` and `easing` tokens.