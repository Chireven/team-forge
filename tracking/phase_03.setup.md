# PHASE 3: SHELL LAYOUT & NAVIGATION ENGINE
# ACT AS: Senior Solutions Architect & Lead Developer.

Phase 2 (Auth) is complete. We now need to build the "Shell UI" and the "Navigation Infrastructure."
Refer to Rules 1 (Thin Shell), 20 (Theme System), and 21 (UI Standards).

# 1. ARCHITECTURAL REQUIREMENTS

A. THEME ENGINE (Rule 20)
   - Implement the `ThemeProvider` in `apps/shell`.
   - Create a `theme.ts` in `libs/shared/ui` defining your Tokens (Colors, Spacing, Breakpoints).
   - **Mandate:** Define distinct `light` and `dark` palettes.
   - **Toggle:** Add a global state manager for the active theme mode.

B. NAVIGATION REGISTRY (Rule 1 & 2)
   - The Shell MUST NOT hardcode menu items for plugins.
   - Create a `NavigationService` (or Context) in `libs/shared/utils`.
   - **Interface:**
     ```typescript
     interface NavItem {
       id: string;
       label: string;
       path: string;
       icon?: string;
       permission?: string; // For RBAC visibility
       section: 'main' | 'settings' | 'user';
     }
     ```
   - Expose a method `registerNavItem(item: NavItem)` for future plugins to use.

# 2. UI IMPLEMENTATION (Layout Strategy)

A. THE MAIN LAYOUT COMPONENT
   - Create a `DashboardLayout` component that wraps authenticated routes.
   - **Zones:**
     1. **Sidebar (Left):** Fixed width (e.g., 260px). Renders items from the `NavigationRegistry`. Collapsible on mobile.
     2. **Top Bar (Header):** Sticky. Contains:
        - Breadcrumbs (Auto-generated from route).
        - Theme Toggle (Sun/Moon icon).
        - User Dropdown (Avatar + Logout button).
     3. **Main Content:** The `<Outlet />` container. Must have proper padding and scrolling behavior.

B. COMPONENTS
   - Use `libs/shared/ui` to build the `Sidebar`, `Topbar`, and `UserMenu`.
   - **Styling:** strict usage of Theme Tokens (No hex codes!).

# 3. EXECUTION STEPS

Generate the code to:
1.  Define the `Theme` tokens and set up the Provider.
2.  Build the `DashboardLayout` with the Sidebar/Topbar structure.
3.  Implement the `NavigationService` (Context).
4.  Wire up the `UserMenu` to the existing `AuthService` (Logout functionality).
5.  Update `app.tsx` to wrap the authenticated routes in this new Layout.