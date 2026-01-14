import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TeamsService } from './teams.service';
import { CreateTeamDto, AddTeamMemberDto } from './dtos/team.dto';
import { RequirePermission } from '@team-forge/shared/auth-server';
import { PermissionsGuard } from '@team-forge/shared/auth-server';

@ApiTags('Teams')
@ApiBearerAuth()
@Controller('teams')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class TeamsController {
    constructor(private teamsService: TeamsService) { }

    @Post()
    @RequirePermission('team.create')
    @ApiOperation({ summary: 'Create a new team' })
    @ApiResponse({ status: 201, description: 'Team created' })
    createTeam(@Body() dto: CreateTeamDto) {
        return this.teamsService.createTeam(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all teams' })
    listTeams() {
        return this.teamsService.listTeams();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get team details' })
    getTeam(@Param('id', ParseUUIDPipe) id: string) {
        return this.teamsService.getTeam(id);
    }

    @Get(':id/members')
    @RequirePermission('team.view')
    @ApiOperation({ summary: 'List team members' })
    getMembers(@Param('id', ParseUUIDPipe) id: string) {
        return this.teamsService.getMembers(id);
    }

    @Post(':id/members')
    @RequirePermission('team.manage')
    @ApiOperation({ summary: 'Add a member to a team' })
    addMember(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AddTeamMemberDto) {
        return this.teamsService.addMember(id, dto);
    }

    @Delete(':id/members/:userId')
    @RequirePermission('team.manage')
    @ApiOperation({ summary: 'Remove a member from a team' })
    removeMember(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('userId', ParseUUIDPipe) userId: string
    ) {
        return this.teamsService.removeMember(id, userId);
    }
}
