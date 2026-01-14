import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between } from 'typeorm';
import { TeamMember } from '@team-forge/team-core-api';
import { Task } from '../entities/task.entity';
import { AvailabilityReportDto } from '../dtos/availability-report.dto';
import { User } from '@team-forge/shared/data-access';

export interface DailyData {
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

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(TeamMember)
    private readonly memberRepo: Repository<TeamMember>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
  ) {}

  async getAvailability(query: AvailabilityReportDto) {
    const { teamId, startDate, endDate } = query;

    // 1. Find all Users in the Team
    // We need user names, so we join the User entity
    const members = await this.memberRepo.find({
      where: { teamId },
      relations: ['user'],
    });

    if (!members.length) {
      return [];
    }

    const userMap = new Map<
      string,
      {
        userId: string;
        userName: string;
        dailyLoad: Record<string, DailyData>;
      }
    >();
    const userIds: string[] = [];

    for (const m of members) {
      if (m.user) {
        // Use user.email as name fallback if we don't have a display name column (Checking User entity... currently only email/password)
        // User entity mainly has email. Let's use Email for now or "User {id}"
        const userName = m.user.email || 'Unknown User';
        userMap.set(m.user.id, {
          userId: m.user.id,
          userName: userName,
          dailyLoad: {},
        });
        userIds.push(m.user.id);
      }
    }

    if (userIds.length === 0) {
      return [];
    }

    // 2. Aggregate Tasks
    // Fetch full tasks to include details
    // Note: We need to convert string dates to Date objects for querying if needed,
    // but TypeORM usually handles string comparisons for dates fine if format is standard.
    // However, to be safe with 'Between', strict types are better.
    // Assuming startDate/endDate are YYYY-MM-DD
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Adjust end date to capture the full day?
    // If the input is just '2023-01-01', new Date('2023-01-01') is midnight.
    // To include the whole day of endDate, we might want to set it to end of day
    // or assume the caller handles it. The previous code passed raw strings.
    // Let's assume raw strings are fine for T-SQL/Postgres, but 'Between' with Date objects is safer for TypeORM across drivers.
    // Let's stick to the raw strings first to match previous behavior logic,
    // but previous behavior was raw SQL.
    // `Between` in TypeORM usually needs compatible types.
    // Let's strict cast them to Date.
    end.setHours(23, 59, 59, 999);

    const tasks = await this.taskRepo.find({
      where: {
        assigneeId: In(userIds),
        dueDate: Between(start, end),
      },
      relations: ['project'],
    });

    // 3. Map Data to Response
    for (const task of tasks) {
      if (!task.dueDate || !task.assigneeId) continue;

      const dateKey = task.dueDate.toISOString().split('T')[0];
      const userEntry = userMap.get(task.assigneeId);

      if (userEntry) {
        if (!userEntry.dailyLoad[dateKey]) {
          userEntry.dailyLoad[dateKey] = {
            totalHours: 0,
            tasks: [],
          };
        }

        const dayData = userEntry.dailyLoad[dateKey];
        dayData.totalHours += task.estimatedHours;
        dayData.tasks.push({
          id: task.id,
          title: task.title,
          project: { name: task.project?.name || 'Unknown Project' },
          estimatedHours: task.estimatedHours,
          dueDate: task.dueDate,
          status: task.status,
        });
      }
    }

    return Array.from(userMap.values());
  }
}
