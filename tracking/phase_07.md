# PHASE 7: TEAM CORE & RESOURCE MANAGEMENT
# ACT AS: Senior Database Architect & Full-Stack Developer.

We are implementing the core business domain: **Team & Resource Management**.
The goal is to allow Managers to create Teams and assign Users (Resources) to them.
Critically, we must support a **Many-to-Many** relationship (Users can belong to multiple teams) to support future features like On-Call scheduling.

# 1. ARCHITECTURAL REQUIREMENTS

A. DATABASE SCHEMA (TypeORM in `libs/team-core/api`)
   - Create a new library: `libs/team-core/api`.
   - **Entity 1: `Team`**
     - `id` (UUID), `name` (String, Unique), `description` (String), `createdAt`.
   - **Entity 2: `TeamMember`** (The Join Table)
     - `id` (UUID), `teamId` (FK), `userId` (FK to Core User), `role` (Enum: 'LEAD', 'MEMBER').
     - **Future-Proofing:** Add `availabilityStatus` (Enum: 'ACTIVE', 'AWAY').
   - **Relationships:**
     - A Team has many Members.
     - A Member links to one User.

B. BACKEND API (NestJS)
   - **Module:** `TeamCoreModule` (Import into `api-gateway`).
   - **Controller:** `TeamsController`
     - `POST /api/teams`: Create a team.
     - `GET /api/teams`: List teams (include member count).
     - `POST /api/teams/:id/members`: Add a user to a team.
     - `DELETE /api/teams/:id/members/:userId`: Remove a user.
   - **Security:**
     - Creating Teams requires `team.create`.
     - Assigning Members requires `team.manage` (or being the Team Lead).

C. FRONTEND (Remote Plugin)
   - **Create Remote:** `apps/plugins/team-manager`.
   - **Port:** Run on `4202`.
   - **Navigation:** Register "Teams" under the "Organization" section.
   - **Views:**
     1. **Team List:** Cards showing Team Name + Member Count.
     2. **Team Details:** A view to add/remove users from that specific team.

# 2. EXECUTION STEPS

Generate the commands and code to:
1.  Scaffold the `libs/team-core/api` library.
2.  Create the `Team` and `TeamMember` entities with correct Foreign Keys.
3.  Implement the Service methods to handle the relationships (Add/Remove Member).
4.  Scaffold the `apps/plugins/team-manager` remote.
5.  Implement the UI to Create a Team and Assign Users (using a dropdown of existing users).