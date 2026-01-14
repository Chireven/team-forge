Act as a Senior React Developer. We are completing Phase 9 by integrating the Availability Report into the UI.

**Context:**
We have created the `AvailabilityGrid` component, and we need to display it on the existing `TeamDetailPage`.

**Directive:**
Update `libs/team-manager/src/lib/pages/team-detail/team-detail.page.tsx`.

**Task 1: Improve Layout (Tabs)**
If the page is not already using Tabs, refactor the main content area to use a Tab system (e.g., "Members", "Capacity").

- **Tab 1 "Members":** Keep the existing Member List / Add Member functionality here.
- **Tab 2 "Capacity":** This will house our new report.

**Task 2: Embed the Report**
Inside the "Capacity" tab (or a new section below the member list):

1.  Import `AvailabilityGrid` from its component file.
2.  Render `<AvailabilityGrid teamId={id} />`.
    - _Note:_ Ensure `id` is passed correctly from the `useParams()` hook.
    - _UI Polish:_ Add a section title like "Two-Week Team Availability" if it helps context.

**Constraint:**
Ensure the layout handles the width of the grid gracefully (e.g., `overflow-x-auto` if the table is wide) so it doesn't break the page layout on smaller screens.
