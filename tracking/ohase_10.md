Act as a NestJS Security Architect. We are implementing Phase 10: Work Item CRUD.

**Context:**
We have `Task` and `Project` entities. Currently, we only have reporting endpoints.
We need secure endpoints to Create, Update, and Delete tasks.

**Directive:**
Update `libs/api/work-core/src/lib/controllers/work.controller.ts` (create if missing) and the corresponding Service.

**Task 1: Define DTOs**
Create `CreateTaskDto` and `UpdateTaskDto` (mapped types):

- `title`: String (Required).
- `projectId`: UUID (Required for Create).
- `assigneeId`: UUID (Optional - to assign to a user).
- `estimatedHours`: Number (Min 0).
- `dueDate`: DateString (ISO 8601).
- `status`: Enum (TODO, IN_PROGRESS, DONE).

**Task 2: Implement Controller Endpoints**

1.  `POST /work/tasks`
    - Guard: `@RequirePermission('work.manage')`
    - Action: Create task.
2.  `PATCH /work/tasks/:id`
    - Guard: `@RequirePermission('work.manage')`
    - Action: Update fields.
3.  `DELETE /work/tasks/:id`
    - Guard: `@RequirePermission('work.manage')`
    - Action: Soft Delete (or Hard Delete).

**Task 3: Service Logic**

- Ensure that when assigning a task (`assigneeId`), you verify the User exists.
- Ensure `dueDate` is saved correctly.

**Output:** Provide the full Controller and Service methods.
