export interface DailyTask {
    id: string;
    title: string;
    project: { name: string };
    estimatedHours: number;
    dueDate: Date;
    status: string;
}

export interface DailyData {
  totalHours: number;
  tasks: DailyTask[];
}

export interface UserAvailability {
  userId: string;
  userName: string;
  avatarUrl?: string; // Optional
  dailyLoad: Record<string, DailyData>;
}
