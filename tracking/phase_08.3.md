Finalizing Phase 8 Backend. Expose the service logic via `TeamsController`.

**Directive:**
Update `libs/api/team-core/src/lib/controllers/teams.controller.ts`.

**Endpoints:**

1.  `POST /:id/members`
    - Body: `AddTeamMemberDto`
    - Guard: `@RequirePermission('team.manage')`
    - Returns: The created TeamMember object.

2.  `DELETE /:id/members/:userId`
    - Params: `id` (teamId), `userId` (userId)
    - Guard: `@RequirePermission('team.manage')`
    - Returns: Void/Success status.

3.  `GET /:id/members`
    - Params: `id` (teamId)
    - Guard: `@RequirePermission('team.view')`
    - Returns: Array of TeamMembers (including the nested User profile).

**Verification Requirement:**
Ensure standard NestJS `ParseUUIDPipe` is used on all ID parameters to prevent 500 errors on invalid UUID strings.
