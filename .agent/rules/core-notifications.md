---
trigger: always_on
---

# NOTIFICATION & ALERT SYSTEM RULES
# This file governs how the application communicates status to the user.

## 1. Visual Stacking (The "God Layer")

1.  **Z-Index Supremacy:**
    * The Notification Container **must reside at the Application Root**.
    * **Token:** Use a global design token `Z_INDEX_TOAST = 9999`.
    * **Prohibition:** No other component (Modals, Dropdowns) may exceed this value.

2.  **Positioning Strategy:**
    * Notifications must use `position: fixed`.
    * Default location: **Top-Right** or **Bottom-Right** (configurable via User Settings).

## 2. Interaction & Accessibility

1.  **Auto-Dismissal Logic:**
    * **Success/Info:** Auto-dismiss after 5 seconds.
    * **Error/Warning:** **Must persist** until manually dismissed by the user.

2.  **Accessibility (A11y):**
    * **Live Regions:** Notifications must use `role="alert"` (for errors) or `role="status"`.
    * **Focus Management:** Notifications must *not* steal focus unless they are critical system-wide alerts.

## 3. Architecture (The "Toast Provider")

1.  **Global Service:**
    * Notifications must be triggered via a **Global Hook** (e.g., `useToast()`).
    * **Prohibition:** Local components cannot render their own "Alert Boxes." They must dispatch a toast request to the Shell.

2.  **Stacking Context:**
    * The Toast Container must sit *above* any global Overlay/Scrim (e.g., above the "Loading Spinner").