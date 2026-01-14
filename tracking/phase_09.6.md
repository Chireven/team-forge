### Prompt 9.4: Frontend Drill-Down UI

_Goal: Create a "Task List" modal that appears when you click a busy day._

Act as a React/UI Developer. We are implementing the "Drill Down" interaction for the Availability Grid.

**Context:**
The API now returns a list of tasks for each day. We want to view them.

**Task 1: Update Types**
Update `report.types.ts` to match the new Backend response (`DailyData` contains `tasks[]`).

**Task 2: Create `TaskDrilldownDialog`**
Create a new component in `libs/team-manager/src/lib/components/task-drilldown`:

- **Props:** `isOpen`, `onClose`, `date`, `user`, `tasks`.
- **UI:**
  - Header: "{User}'s Tasks for {Date}"
  - Body: A clean list of items.
    - **Row Layout:**
      - Left: Task Title (Bold) + Project Name (Small/Gray).
      - Right: Hours Badge (e.g., "4h") + Status Badge.
  - Footer: "Close" button.

**Task 3: Wire it Up (`AvailabilityGrid`)**

1.  Add state to track the `selectedCell` (contains user, date, and task list).
2.  Update `AvailabilityCell`:
    - Make it clickable (`cursor-pointer`).
    - `onClick`: Fire a handler to open the Dialog with the cell's data.
    - _Visual Cue:_ Add a hover effect (e.g., `hover:ring-2`) to show it's interactive.
3.  Render the `TaskDrilldownDialog` conditionally when a cell is clicked.
