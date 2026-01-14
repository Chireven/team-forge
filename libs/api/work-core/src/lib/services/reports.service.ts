import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember } from '@team-forge/team-core-api';
import { Task } from '../entities/task.entity';
import { AvailabilityReportDto } from '../dtos/availability-report.dto';
import { User } from '@team-forge/shared/data-access';

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

    const userMap = new Map<string, { userId: string; userName: string; dailyLoad: Record<string, number> }>();
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
    // Sum estimatedHours by assignee and CAST(dueDate AS DATE)
    const rawData = await this.taskRepo
      .createQueryBuilder('task')
      .select('task.assigneeId', 'userId')
      // Note: CAST(dueDate as DATE) is standard SQL. 
      // For MS SQL (default provider mentioned in docs), CAST(dueDate AS DATE) works.
      .addSelect('CAST(task.dueDate AS DATE)', 'date')
      .addSelect('SUM(task.estimatedHours)', 'totalHours')
      .where('task.assigneeId IN (:...userIds)', { userIds })
      .andWhere('task.dueDate BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('task.assigneeId')
      .addGroupBy('CAST(task.dueDate AS DATE)')
      .getRawMany();

    // 3. Map Data to Response
    for (const row of rawData) {
        const userId = row.userId;
        const dateKey = row.date instanceof Date 
            ? row.date.toISOString().split('T')[0] 
            : new Date(row.date).toISOString().split('T')[0];
            
        const hours = parseFloat(row.totalHours);

        const userEntry = userMap.get(userId);
        if (userEntry) {
            userEntry.dailyLoad[dateKey] = hours;
        }
    }

    return Array.from(userMap.values());
  }
}
