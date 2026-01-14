Act as a Senior React/TypeScript Developer. We are working on the `team-manager` remote plugin.

**Context:**
The Backend now exposes endpoints to manage Team Members. We need to consume them.

**Task 1: Define Interfaces**
Create or update `libs/shared/data-access/src/lib/types/team.types.ts` (or the equivalent types file in the plugin):

1.  `TeamMember`: Should match the backend entity (id, allocationPercent, role, user: User, teamId).
2.  `AddTeamMemberRequest`: { userId: string, role: string, allocationPercent: number }.

**Task 2: Update the API Service**
Update the `TeamsService` (frontend data service):

1.  `getMembers(teamId: string)`: Returns `Promise<TeamMember[]>`.
2.  `addMember(teamId: string, payload: AddTeamMemberRequest)`: Returns `Promise<TeamMember>`.
3.  `removeMember(teamId: string, userId: string)`: Returns `Promise<void>`.

**Constraint:**
Ensure you are using the shared `HttpClient` or `Axios` instance that handles the Bearer Token injection automatically.
