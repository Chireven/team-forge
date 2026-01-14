import { IsString, IsNotEmpty, IsUUID, IsOptional, IsNumber, Min, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement Login Feature' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'uuid-of-project' })
  @IsUUID()
  @IsNotEmpty()
  projectId!: string;

  @ApiProperty({ example: 'uuid-of-user', required: false })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @ApiProperty({ example: 4.5, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedHours?: number;

  @ApiProperty({ example: '2023-12-31T23:59:59Z', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.TODO })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
