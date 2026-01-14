Act as a Senior NestJS/TypeORM Architect. We are beginning Phase 8 of Team Forge.

**Context:**
We need to link `Team` and `User` entities. We are NOT using a generic `@ManyToMany` decorator. We require an explicit Junction Entity to store metadata (Role and Allocation).

**Directive:**
Create the `TeamMember` entity in `libs/api/team-core/src/lib/entities/team-member.entity.ts`.

**Specifications:**

1.  **Columns:**
    - `id`: UUID (Primary Key).
    - `allocationPercent`: Integer (default: 100).
    - `role`: Enum ('LEAD', 'MEMBER') (default: 'MEMBER').
    - `joinedAt`: CreateDateColumn.
    - `userId`: UUID (Column).
    - `teamId`: UUID (Column).

2.  **Relations:**
    - `user`: Many-to-One -> User Entity.
    - `team`: Many-to-One -> Team Entity.

3.  **Constraints (Crucial):**
    - Add a `@Unique` constraint on `['teamId', 'userId']` to ensure a user cannot be added to the same team twice.

4.  **Updates:**
    - Update `User` entity: Add One-to-Many relation to `TeamMember`.
    - Update `Team` entity: Add One-to-Many relation to `TeamMember`.

5.  **Module Registration:**
    - Ensure `TeamMember` is registered in the `TypeOrmModule.forFeature([])` array within `TeamCoreModule`.

---

---
