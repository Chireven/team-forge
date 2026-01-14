Continuing Phase 8. The `TeamMember` entity is created. Now implement the Service logic.

**Directive:**
Update the `TeamsService` in `libs/api/team-core`.

**Step 1: Create DTOs**
Create `AddTeamMemberDto` (using class-validator):

- `userId`: UUID, IsNotEmpty.
- `role`: IsOptional, IsEnum (LEAD/MEMBER).
- `allocationPercent`: IsOptional, IsInt, Min(0), Max(100).

**Step 2: Service Methods**
Inject the `TeamMember` repository and implement:

1.  `addMember(teamId: string, dto: AddTeamMemberDto)`:
    - Logic: Check if Team exists -> Check if User exists -> Check if `TeamMember` already exists (gracefully handle the Unique constraint or pre-check).
    - Action: Save and return the new member.

2.  `removeMember(teamId: string, userId: string)`:
    - Logic: Find the record where `teamId` AND `userId` match.
    - Action: Delete. Throw `NotFoundException` if the user isn't on the team.

3.  `getMembers(teamId: string)`:
    - Logic: Find all `TeamMember` records for this team.
    - Action: Join the `user` relation so we receive the User's name and avatar in the response.
