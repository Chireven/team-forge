Finalizing Phase 8 Frontend. We will implement the Master-Detail view.

**Task: Create `TeamDetailPage`**

1.  **Routing:** Configure the router so clicking a Team in the list navigates to `/teams/:id`.
2.  **Layout:**
    - **Header:** Team Name, Description, and a "Settings" button.
    - **Tabs:** Implement a Tab system (e.g., "Members", "Projects", "Settings").

3.  **"Members" Tab Implementation:**
    - On load, fetch members using `TeamsService.getMembers`.
    - Render a Data Grid or List of members.
      - Columns: Avatar/Name, Role, Allocation %.
      - Action: "Remove" button (Trash icon) -> Calls `removeMember`.
    - "Add Member" Button: Opens the `AddMemberDialog` created in the previous step.

**Refactor Requirement:**
Update the existing Team List page so that clicking a row navigates to this new `TeamDetailPage`.
