import { IsDateString, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AvailabilityReportDto {
  @ApiProperty({ description: 'The Team ID to run the report for' })
  @IsUUID()
  @IsNotEmpty()
  teamId!: string;

  @ApiProperty({ description: 'Start Date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @ApiProperty({ description: 'End Date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  endDate!: string;
}
