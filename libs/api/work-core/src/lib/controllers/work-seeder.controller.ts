import { Controller, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { WorkSeederService } from '../services/work-seeder.service';

@ApiTags('Work Seed')
@Controller('work/seed')
export class WorkSeederController {
  constructor(private readonly workSeederService: WorkSeederService) {}

  @Post('foundation')
  @ApiOperation({ summary: 'Seed database with users and teams (Foundation)' })
  async seedFoundation() {
    return this.workSeederService.seedFoundation();
  }

  @Post()
  @ApiOperation({ summary: 'Seed database with projects and tasks (Work)' })
  @ApiQuery({ name: 'teamName', required: false, description: 'Specific team to seed data for' })
  async seed(@Query('teamName') teamName?: string) {
    return this.workSeederService.seedData(teamName);
  }
}
