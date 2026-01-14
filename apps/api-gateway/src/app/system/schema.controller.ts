import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SchemaService, SchemaStatus } from '@team-forge/shared/data-access';
import { RequirePermission, PermissionsGuard } from '@team-forge/shared/auth-server';

@ApiTags('System')
@ApiBearerAuth()
@UseGuards(PermissionsGuard)
@Controller('system/schema')
export class SchemaController {
    constructor(private schemaService: SchemaService) { }

    @Get('status')
    @RequirePermission('system.audit')
    @ApiOperation({ summary: 'Check database schema health and drift' })
    @ApiResponse({ status: 200, description: 'Schema health status returned' })
    async getStatus(): Promise<SchemaStatus> {
        return this.schemaService.checkHealth();
    }

    @Post('heal')
    @RequirePermission('system.admin')
    @ApiOperation({ summary: 'Trigger manual schema healing (run migrations)' })
    @ApiResponse({ status: 200, description: 'Healing process completed' })
    async heal() {
        return this.schemaService.heal();
    }
}
