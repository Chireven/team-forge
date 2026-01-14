import { IsString, IsOptional, IsEnum, IsUUID, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TeamRole } from '../entities/team-member.entity';

export class CreateTeamDto {
    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;
}

export class AddTeamMemberDto {
    @ApiProperty()
    @IsUUID()
    userId!: string;

    @ApiProperty({ enum: TeamRole, default: TeamRole.MEMBER })
    @IsEnum(TeamRole)
    @IsOptional()
    role: TeamRole = TeamRole.MEMBER;

    @ApiProperty({ required: false, default: 0 })
    @IsInt()
    @Min(0)
    @Max(100)
    @IsOptional()
    allocationPercent?: number = 0;
}
