import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Project, ProjectStatus } from '../entities/project.entity';
import { Task, TaskStatus } from '../entities/task.entity';
import { Team, TeamMember, TeamRole } from '@team-forge/team-core-api'; // Generic access via DataSource
import { User } from '@team-forge/shared/data-access'; // Generic access via DataSource

@Injectable()
export class WorkSeederService {
  private readonly logger = new Logger(WorkSeederService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
  ) {}

  async seedFoundation() {
    this.logger.log('Starting Foundation Seed (Users & Teams)...');

    const userRepo = this.dataSource.getRepository(User);
    const teamRepo = this.dataSource.getRepository(Team);
    const memberRepo = this.dataSource.getRepository(TeamMember);

    // 1. Create Users
    const usersData = [
      { email: 'alice@teamforge.com', passwordHash: 'password', isSuperAdmin: true },
      { email: 'bob@teamforge.com', passwordHash: 'password', isSuperAdmin: false },
      { email: 'charlie@teamforge.com', passwordHash: 'password', isSuperAdmin: false },
      { email: 'dave@teamforge.com', passwordHash: 'password', isSuperAdmin: false },
      { email: 'eve@teamforge.com', passwordHash: 'password', isSuperAdmin: false },
    ];

    const createdUsers: User[] = [];

    for (const uData of usersData) {
      let user = await userRepo.findOne({ where: { email: uData.email } });
      if (!user) {
        user = userRepo.create(uData);
        await userRepo.save(user);
        this.logger.log(`Created User: ${user.email}`);
      }
      createdUsers.push(user);
    }

    // 2. Create Team
    let team = await teamRepo.findOne({ where: { name: 'Engineering' } });
    if (!team) {
      team = teamRepo.create({
        name: 'Engineering',
        description: 'Core Engineering Team',
      });
      await teamRepo.save(team);
      this.logger.log(`Created Team: ${team.name}`);
    }

    // 3. Assign Users to Team
    for (const user of createdUsers) {
      const existingMember = await memberRepo.findOne({ where: { teamId: team.id, userId: user.id } });
      if (!existingMember) {
        const member = memberRepo.create({
          teamId: team.id,
          userId: user.id,
          role: TeamRole.MEMBER,
        });
        await memberRepo.save(member);
        this.logger.log(`Assigned User ${user.email} to Team ${team.name}`);
      }
    }

    return {
      message: 'Foundation Seed Complete',
      users: createdUsers.length,
      team: team.name,
    };
  }

  async seedData(teamName?: string) {
    this.logger.log(`Starting Work Management Seed... Target Team: ${teamName || 'Default (Engineering/Any)'}`);

    // 1. Find the target team
    const teamRepo = this.dataSource.getRepository(Team);
    
    let team: Team | null = null;
    
    if (teamName) {
       team = await teamRepo.findOne({
        where: { name: teamName },
        relations: ['members', 'members.user']
      });
      if (!team) {
        return { message: `Team '${teamName}' not found.` };
      }
    } else {
      // Default to Engineering
      team = await teamRepo.findOne({
        where: { name: 'Engineering' },
        relations: ['members', 'members.user']
      });
    }

    if (!team) {
      this.logger.warn('Engineering team not found. Looking for any available team...');
      team = await teamRepo.findOne({
        where: {}, 
        relations: ['members', 'members.user']
      });
    }

    if (!team) {
      this.logger.warn('No teams found. Skipping seed.');
      return { message: 'No teams found. Please create a team first.' };
    }

    // 2. Filter Members
    const members = team.members || [];
    // Ensure we only get members with valid users
    const users = members
        .map(m => m.user)
        .filter(u => !!u);

    this.logger.log(`Seeding for Team: ${team.name} (ID: ${team.id})`);
    this.logger.log(`Found ${members.length} members, ${users.length} valid users linked.`);

    if (users.length === 0) {
      this.logger.warn(`Team '${team.name}' has no users linked to it. Skipping seed.`);
      return { message: `Team '${team.name}' has no users. Please add members first.` };
    }

    // 3. Create Projects
    const projectsData = [
      { name: 'Website Redesign', teamId: team.id, status: ProjectStatus.ACTIVE },
      { name: 'Mobile App', teamId: team.id, status: ProjectStatus.ACTIVE },
    ];

    const savedProjects: Project[] = [];

    for (const pData of projectsData) {
      let project = await this.projectRepo.findOne({ where: { name: pData.name, teamId: team.id } });
      if (!project) {
        project = this.projectRepo.create(pData);
        await this.projectRepo.save(project);
        this.logger.log(`Created Project: ${project.name}`);
      }
      savedProjects.push(project);
    }

    // 4. Create Tasks
    const tasksToCreate: Task[] = [];
    const today = new Date();

    // Loop next 14 days
    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);

      for (const user of users) {
        // 1-2 tasks per day per user
        const dailyTaskCount = Math.floor(Math.random() * 2) + 1; 

        for (let i = 0; i < dailyTaskCount; i++) {
          const project = savedProjects[Math.floor(Math.random() * savedProjects.length)];
          const estimatedHours = Math.floor(Math.random() * 5) + 2; // 2 to 6
          const status = Math.random() > 0.5 ? TaskStatus.IN_PROGRESS : TaskStatus.TODO;

          const task = this.taskRepo.create({
            title: `Task for ${user.email?.split('@')[0]} - ${currentDate.toISOString().split('T')[0]} (${i + 1})`,
            projectId: project.id,
            assigneeId: user.id,
            status: status,
            estimatedHours: estimatedHours,
            startDate: currentDate,
            dueDate: currentDate,
          });
          
          tasksToCreate.push(task);
        }
      }
    }

    await this.taskRepo.save(tasksToCreate);
    this.logger.log(`Created ${tasksToCreate.length} tasks for ${users.length} users.`);

    return { 
      message: 'Seed complete', 
      team: team.name, 
      userCount: users.length,
      projects: savedProjects.length, 
      tasksCreated: tasksToCreate.length 
    };
  }
}
