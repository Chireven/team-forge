---
trigger: always_on
---


## User Interface and Experience (UI/UX) Rules

### 1. Component Composition and Consistency

1.  **Component Library Mandate:** All user interface elements **must be composed exclusively** of components from the centralized, version-controlled **Component Library**. Direct use of native, unstyled HTML elements for complex UI controls is prohibited unless they are explicitly wrapped and styled by a library component.
2.  **Visual Hierarchy:** A clear **visual hierarchy must be maintained** on every screen. The most important information or actionable items must be the most prominent, utilizing size, color (theme tokens), and placement to guide the user's eye.
3.  **Layout Consistency:** Key navigational elements (e.g., main header, primary sidebar, global search) **must maintain a consistent position and behavior** across all major routes of the application to minimize cognitive load.

### 2. User Feedback and Accessibility

1.  **Form Validation UX:** All client-side form validation errors **must be presented to the user immediately upon field blur (loss of focus)**, or upon a failed submission attempt. Error messages must be displayed **in close proximity** to the invalid input field. The primary submit button must be disabled until required fields are valid.
2.  **Affordance and Interaction:** All interactive elements **must clearly communicate their state** (e.g., hover, focus, disabled). Disabled elements must be rendered in a low-contrast state and must **not** respond to mouse or keyboard input.
3.  **Loading States & Feedback:** Every network request or data fetching operation that takes longer than **300ms** must display an explicit, non-blocking **loading indicator** (e.g., a skeleton loader or spinner). User actions that succeed must provide temporary, dismissible confirmation (e.g., a toast notification or confirmation message).

### 3. Responsiveness and Device Agnosticism

1.  **Mobile-First Design:** All components and layouts **must be designed and implemented with a mobile-first approach**. Layouts must scale up gracefully from the smallest supported viewport using the theme's centralized breakpoint tokens.
2.  **Click Target Size:** All touch targets (buttons, links, form labels) **must meet the minimum accessible size requirements** (e.g., a minimum touch area of **48x48 pixels**) to ensure usability on touch devices.