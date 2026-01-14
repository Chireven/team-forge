Act as a Senior React Developer. We need to consume the new Availability Report API.

**Task 1: Define Interfaces**
Create `libs/shared/data-access/src/lib/types/report.types.ts`:

```typescript
export interface DailyLoad {
  [date: string]: number; // "YYYY-MM-DD": hours
}

export interface UserAvailability {
  userId: string;
  userName: string;
  avatarUrl?: string; // Optional
  dailyLoad: DailyLoad;
}
```
