import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportsService } from '../services/reports.service';
import { AvailabilityReportDto } from '../dtos/availability-report.dto';

@ApiTags('Work Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('availability')
  @ApiOperation({ summary: 'Get team availability heatmap' })
  async getAvailability(@Query(new ValidationPipe({ transform: true })) query: AvailabilityReportDto) {
    return this.reportsService.getAvailability(query);
  }
}
