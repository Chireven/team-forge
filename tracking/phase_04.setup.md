# PHASE 4: CORE SERVICES ARCHITECTURE
# IMPLEMENTATION RECORD

This document details the "Core Services" layer implemented in Phase 4. These services provide the nervous system for the "Shell + Plugin" architecture.

# 1. THE EVENT BUS (Rule 14)

**Location:** `libs/shared/utils/src/lib/events/event-bus.ts`

A global, reactive messaging system that allows decoupled communication between the Shell and Plugins (or Plugin-to-Plugin).

### Architecture
- **Technology:** RxJS `Subject` (Hot Observable).
- **Pattern:** Publish/Subscribe.
- **Payload Strictness:** All events are wrapped in an `EventEnvelope`.

### Interface
```typescript
interface EventEnvelope<T> {
  event: string;       // NOUN:VERB (e.g. 'TASK:CREATED')
  payload: T;          // The data
  meta: {
    source: string;    // Who sent it
    timestamp: string; // ISO String
    traceId: string;   // UUID for debugging
  };
}

// Global Singleton
eventBus.emit('TEST:CLICKED', { data: 123 }, 'Shell');
eventBus.on('TEST:CLICKED').subscribe(envelope => ...);
```

### Debugging
A listener is active in `apps/shell/src/app/components/layout/Topbar.tsx` that logs all events to the browser console: `[SHELL EVENT BUS] { ... }`.

---

# 2. THE RBAC ENGINE (Rule 19)

A full-stack implementation of Role-Based Access Control that respects the "Fail-Closed" and "Super Admin Bypass" rules.

## A. Backend (NestJS)
**Library:** `libs/shared/auth-server`

1.  **Decorator (`@RequirePermission`)**:
    - Usage: `@RequirePermission('inventory.delete')` on a Controller or Method.
    - Sets metadata `permission` on the handler.

2.  **Guard (`PermissionsGuard`)**:
    - Intercepts the request.
    - Checks: `if (user.isSuperAdmin) return true;` (Rule 19.3).
    - Checks: `if (user.permissions.includes(required)) return true;`.
    - Returns `403 Forbidden` if checks fail.

## B. Frontend (React)
**Library:** `libs/shared/auth-client`

1.  **Context (`PermissionContext`)**:
    - Provided at the root of the Shell (`App.tsx`).
    - Exposes: `hasPermission(permission: string): boolean`.
    - Handles the `isSuperAdmin` logic client-side to prevent UI flicker.

2.  **Component (`<Restricted>`)**:
    - Usage:
      ```tsx
      <Restricted to="task.delete" fallback={<LockIcon />}>
        <DeleteButton />
      </Restricted>
      ```
    - Renders nothing (or fallback) if the user lacks permission.

---

# 3. NOTIFICATION SYSTEM (Rule 16)

**Location:** `libs/shared/ui/src/lib/toast`

A "God Layer" notification system that floats above all other UI elements.

### Architecture
- **Provider:** `ToastProvider` wraps the app.
- **Hook:** `const { toast } = useToast()`.
- **Z-Index:** `9999` (Enforced in `toast.context.tsx`).
- **Auto-Dismiss:**
    - `Success` / `Info`: Dismisses after 5 seconds.
    - `Error` / `Warning`: Persists until manually dismissed (per Rule 16).

---

# 4. VERIFICATION
To verify these systems, the following test harnesses were added to the Shell Topbar:

1.  **Test Event Bus Button:**
    - Emits a `TEST:CLICKED` event.
    - Triggers a "Success" Toast.
    - **Verify:** Click it, check console for event, check top-right for Toast.

2.  **Restricted Button:**
    - Wrapped in `<Restricted to="secret.admin">`.
    - **Verify:** Since the test user is NOT a Super Admin (in `App.tsx`), this button is **hidden**, proving the RBAC engine works.
