export interface DailyLoad {
  [date: string]: number; // "YYYY-MM-DD": hours
}

export interface UserAvailability {
  userId: string;
  userName: string;
  avatarUrl?: string; // Optional
  dailyLoad: DailyLoad;
}
