Act as a Senior React Developer. We need to explicitly scaffold the UI for the Team Manager plugin because the files are currently missing.

**Directive: Create the following file structure in `libs/team-manager/src/lib/` and implement the code.**

### 1. Create Components

**File:** `components/user-select/user-select.tsx`

- **Logic:** Fetch users from `UsersService`.
- **UI:** A dropdown/combobox that displays User Name and Avatar. Return the selected `userId`.

**File:** `components/add-member-dialog/add-member-dialog.tsx`

- **Props:** `isOpen`, `onClose`, `onAdd(userId, role, allocation)`.
- **UI:**
  - Render `UserSelect` (from above).
  - Render Role dropdown (LEAD, MEMBER).
  - Render Allocation Input (Number 0-100).
  - Buttons: "Cancel", "Add".

### 2. Create the Page

**File:** `pages/team-detail/team-detail.page.tsx`

- **Routing:** Use `useParams()` to get the `id` from the URL.
- **Logic:**
  - Fetch Team Details and Members on load.
  - Handle "Add Member" (call API, then refresh list).
  - Handle "Remove Member" (call API, then refresh list).
- **UI:**
  - Header: Team Name.
  - Main Content: A list/table of members (Avatar, Name, Role, Allocation).
  - Action: "Add Member" button (opens the Dialog).

### 3. Wire the Routes (Crucial)

**File:** `lib.routes.tsx` (or `team-manager.routes.tsx`)

- Import `TeamDetailPage`.
- Add the route: `{ path: ':id', element: <TeamDetailPage /> }`.

### 4. Update the Entry Point

**File:** `pages/team-list/team-list.page.tsx` (Your existing list)

- Update the list items/table rows.
- **Action:** Make the Team Name a clickable `Link` pointing to `/teams/${team.id}` OR add a "Manage" button that navigates there.

**Output:** Provide the full code for these 4 files.
