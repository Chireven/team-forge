import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@team-forge/shared/data-access';
import { UsersController } from './users.controller';
import { DataAccessModule } from '@team-forge/shared/data-access';

@Module({
    imports: [
        DataAccessModule,
        TypeOrmModule.forFeature([User])
    ],
    controllers: [UsersController],
})
export class UsersModule { }
