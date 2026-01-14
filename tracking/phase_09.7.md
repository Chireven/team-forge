Act as a UI Engineer. We need to fix the styling of the `TaskDrilldownDialog` in `libs/team-manager`.

**Context:**
Currently, the task list is unstyled, causing text to run together (e.g., "4hTODODue").
We need to format each task as a clean "Card" or "Row."

**Directive:**
Update the `TaskDrilldownDialog` component.

**UI Specifications:**

1.  **The Modal Container:**
    - Use a fixed width (e.g., `max-w-md`) and center it.
    - Add a semi-transparent backdrop if not already present.
    - Header: "Tasks for {Date}" in bold, large text (`text-lg font-bold mb-4`).

2.  **The Task List (Scrollable Area):**
    - Wrap the list in a `div` with `max-h-96 overflow-y-auto` so it doesn't break the screen height.
    - Add `space-y-3` to separate items.

3.  **The Task Item (The Fix):**
    - Render each task in a `div` with: `bg-white p-3 rounded-lg border border-gray-200 shadow-sm`.
    - **Top Row:** Flexbox.
      - Left: Task Title (`font-medium`).
      - Right: Project Name Badge (`text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded`).
    - **Bottom Row:** Flexbox (`mt-2 text-sm text-gray-500`).
      - Left: Status (Color code: Green for DONE, Blue for IN_PROGRESS).
      - Right: Estimated Hours (`font-bold text-gray-900`).

4.  **The Close Button:**
    - Style it as a proper button at the bottom right: `bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700`.
