Act as a Senior NestJS/TypeORM Architect. We are entering Phase 9: Work Management Core.

**Objective:**
We need to model the "Demand" side of the system to calculate availability.

**Task 1: Create `Project` Entity**
Location: `libs/api/work-core/src/lib/entities/project.entity.ts` (Create module if needed)

- `id`: UUID.
- `name`: String.
- `teamId`: UUID (Relation to Team).
- `status`: Enum (ACTIVE, ARCHIVED).

**Task 2: Create `Task` Entity**
Location: `libs/api/work-core/src/lib/entities/task.entity.ts`

- `id`: UUID.
- `title`: String.
- `assigneeId`: UUID (Relation to User, Nullable).
- `projectId`: UUID (Relation to Project).
- `status`: Enum (TODO, IN_PROGRESS, DONE).
- **Crucial for Reporting:**
  - `startDate`: DateTime.
  - `dueDate`: DateTime.
  - `estimatedHours`: Float (default 0).

**Task 3: Update Relations**

- Update `Team` to have OneToMany `projects`.
- Update `User` to have OneToMany `assignedTasks`.

**Task 4: Register Module**

- Ensure `WorkCoreModule` is created and imported into the `AppModule`.
