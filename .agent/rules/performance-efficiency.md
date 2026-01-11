---
trigger: always_on
---

# PERFORMANCE & EFFICIENCY STANDARDS
# This file governs application speed, resource usage, and network discipline.

## 1. Network & Data Strategy

1.  **Server-Centric Processing (BFF Pattern):**
    * **Mandate:** Heavy business logic and data aggregation must occur in the **NestJS API Gateway (BFF)**, not the React Client.
    * **Goal:** The Client should receive "Ready-to-Render" data. It should not be joining arrays or filtering massive datasets.

2.  **Strict Network Budgets:**
    * **Initial Load:** Max **3 concurrent API calls**. (Use the BFF to aggregate initial data into a single payload).
    * **Route Transition:** Max **5 concurrent calls**.
    * **Prohibition:** "Waterfall" requests (Component A loads, *then* Component B loads) are prohibited. Data requirements must be hoisted to the Route level.

3.  **Client-Side Caching:**
    * **Technology:** Use **TanStack Query** (or equivalent) for server state management.
    * **Rule:** Static data (e.g., Dropdown options, User Profile) **must be cached**. Re-fetching immutable data on every route change is prohibited.

## 2. Rendering & Assets

1.  **Image Optimization:**
    * **Format:** WebP or AVIF required for all static assets.
    * **Size Cap:** No single image file may exceed **200KB** without a waiver.
    * **Responsive:** Use `srcset` to serve smaller images to mobile devices.

2.  **Code Splitting (Lazy Loading):**
    * **Route Level:** All top-level Routes must be lazy-loaded (`React.lazy`).
    * **Component Level:** Heavy components (Charts, Maps, Rich Text Editors) must be dynamically imported only when they enter the viewport.

3.  **Render Economy:**
    * **Memoization:** Complex functional components must use `React.memo` to prevent re-renders when parent state changes unrelatedly.
    * **Virtualization:** Lists exceeding 50 items **must use Windowing/Virtualization** (e.g., `react-window`). Rendering 1,000 DOM nodes is prohibited.

## 3. Load Metrics (The Budget)

1.  **Time-to-Interactive (TTI):**
    * **Target:** Under **3.0 seconds** on Simulated 4G.
    * **Largest Contentful Paint (LCP):** Under **2.5 seconds**.

2.  **Non-Blocking Critical Path:**
    * Critical CSS must be inlined or loaded first.
    * Analytics, Chat Widgets, and non-essential scripts must be deferred using `async` or `defer`.