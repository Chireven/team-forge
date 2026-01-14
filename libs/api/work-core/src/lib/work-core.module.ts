import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { WorkSeederService } from './services/work-seeder.service';
import { WorkSeederController } from './controllers/work-seeder.controller';
import { ReportsService } from './services/reports.service';
import { ReportsController } from './controllers/reports.controller';
import { TeamMember } from '@team-forge/team-core-api';
import { User } from '@team-forge/shared/data-access';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task, TeamMember, User])],
  controllers: [WorkSeederController, ReportsController],
  providers: [WorkSeederService, ReportsService],
  exports: [TypeOrmModule],
})
export class WorkCoreModule {}
