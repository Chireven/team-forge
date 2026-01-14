Continuing with the `team-manager` plugin. We need UI components to handle the "Add Member" flow.

**Task 1: Create `UserSelect` Component**
Create a component that allows searching/selecting a user from the global user list.

- Fetch the list of Users from the `UsersService`.
- Render a dropdown (or Autocomplete).
- Display the User's name and Avatar (if available).

**Task 2: Create `AddMemberDialog` Component**
Create a Modal/Dialog component using `libs/shared/ui`:

- **Inputs:**
  - `UserSelect` component (from Task 1).
  - `Role` dropdown (Lead / Member).
  - `Allocation` slider or number input (0-100).
- **Actions:**
  - "Cancel": Closes modal.
  - "Add": Calls `TeamsService.addMember` and triggers a refresh callback on success.

**Style Constraint:**
Use the existing design system tokens from `libs/shared/ui` for spacing and colors.
