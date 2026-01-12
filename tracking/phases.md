# PHASE IMPLEMENTATION INDEX (AI MEMORY)

**Purpose:** This file acts as a pointer to the "Source of Truth" for completed architectural phases. The `phase_##.setup.md` files contain the granular implementation details, file paths, and design decisions for that specific chunk of work.

## 📂 Phase 02: Identity & Infrastructure
**File:** `tracking/phase_02.setup.md`
**Scope:** Foundation, Database, Authentication.
**Critical Implementations:**
- **Database:** MS SQL Server (Docker), TypeORM Config.
- **Auth Backend:** `AuthService`, `JwtStrategy`, `Argon2` hashing.
- **Auth Frontend:** `SetupPage` (Wizard), `LoginPage`, `ProtectedRoute`.
- **Entities:** `User` entity (UUID, Email, PasswordHash).

## 📂 Phase 03: Shell Layout & Navigation
**File:** `tracking/phase_03.setup.md`
**Scope:** UI Structure, Theming, Extensibility hooks.
**Critical Implementations:**
- **Theme Engine:** `ThemeProvider`, `tokens.ts` (Design Tokens), CSS Variables.
- **Navigation:** `NavigationContext` (Registry for Plugins to inject menu items).
- **Layout:** `DashboardLayout` (Fixed Sidebar, Sticky Topbar, Outlet).

## 📂 Phase 04: Core Services (The Nervous System)
**File:** `tracking/phase_04.setup.md`
**Scope:** Communication, Security, User Feedback.
**Critical Implementations:**
- **Event Bus:** `GlobalEventBus` (RxJS Subject), `EventEnvelope` (Traceability).
- **RBAC:** 
    - BE: `PermissionsGuard`, `@RequirePermission`.
    - FE: `PermissionContext`, `<Restricted>` component.
- **Notifications:** `ToastProvider`, `useToast`, Z-Index 9999 (God Layer).

## 🔮 Phase 05: The First Plugin (Planned)
**Scope:** Module Federation, Remote Loading.
**Key Components:**
- `task-board` (Remote App).
- Plugin Loading/Mounting Logic in Shell.
