Act as a NestJS Developer. We need to enhance the Availability Report to support a "Drill Down" view.

**Context:**
Currently, `ReportsService.getAvailability` returns a simple sum of hours per day.
We need to change the response structure to include the specific tasks.

**Task 1: Update Response Interface**
The JSON structure for a specific day should now look like this:

```typescript
interface DailyData {
  totalHours: number;
  tasks: {
    id: string;
    title: string;
    project: { name: string };
    estimatedHours: number;
    dueDate: Date;
    status: string;
  }[];
}
```
