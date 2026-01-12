# PHASE 5: THE FIRST PLUGIN (USER ADMIN & FEDERATION)
# ACT AS: Senior Solutions Architect & Lead Developer.

We are ready to validate the architecture by building the first "Remote Plugin": **User Management**.
This requires upgrading the Shell to support **Module Federation** and creating the new Remote app.

# 1. ARCHITECTURAL REQUIREMENTS

A. BACKEND EXPANSION (NestJS)
   - We need endpoints to manage the users created in Phase 2.
   - Update `AuthModule` (or create `UsersModule`):
     - `GET /api/users`: List all users (DTO: `id`, `email`, `isSuperAdmin`, `createdAt`).
     - `DELETE /api/users/:id`: Remove a user.
   - **Security:** Protect these endpoints with `@UseGuards(JwtAuthGuard)` and `@RequirePermission('user.admin')`.

B. FRONTEND INFRASTRUCTURE (Module Federation)
   - **Convert Shell:** If not already configured, convert `apps/shell` to a **Module Federation Host**.
   - **Create Remote:** Generate a new React application: `apps/plugins/user-admin`.
     - Configuration: It must be a **Module Federation Remote**.
     - Port: Run this plugin on port `4201`.

C. PLUGIN IMPLEMENTATION (Rule 21 & 3)
   - **Feature:** A data table listing all users.
     - Columns: Email, Role (Super Admin), Actions (Delete).
   - **Permissions:** Register `user.admin` permission.
   - **Nav Registration:** Use the `NavigationService` (Phase 3) to inject a "Users" link into the "Settings" section of the Shell Sidebar.

# 2. INTEGRATION LOGIC

A. THE "WIRING"
   - Configure `module-federation.config.js` (or `vite.config.ts`) in the Shell to load `user-admin` from `http://localhost:4201`.
   - In `apps/shell`, add a Route that renders the Remote Component.

B. SHARED LIBRARIES (Rule 3)
   - Ensure the Plugin imports UI components (Buttons, Cards) from `libs/shared/ui`. It MUST NOT implement its own basic UI controls.
   - Ensure the Plugin shares `react`, `react-dom`, and `react-router-dom` with the Shell (Singleton mode) to prevent "Duplicate React" errors.

# 3. EXECUTION STEPS

Generate the commands and code to:
1.  Implement the Backend `UsersController` and endpoints.
2.  Convert/Configure the Workspace for Module Federation (Host + Remote).
3.  Scaffold the `user-admin` plugin.
4.  Implement the "User List" component using the Shared UI lib.
5.  **Critical:** Show the exact config changes needed in `apps/shell/module-federation.config.js` to load this new remote.