import { Controller, Get, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard, RequirePermission } from '@team-forge/shared/auth-server';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@team-forge/shared/data-access';
import { Repository } from 'typeorm';

@Controller('users')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class UsersController {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) { }

    @Get()
    @RequirePermission('user.admin')
    async findAll() {
        const users = await this.usersRepository.find({
            select: ['id', 'email', 'isSuperAdmin', 'createdAt'] // Exclude passwordHash
        });
        return { data: users };
    }

    @Delete(':id')
    @RequirePermission('user.admin')
    async remove(@Param('id') id: string) {
        await this.usersRepository.delete(id);
        return { data: { success: true } };
    }
}
