import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'mssql',
                host: process.env['DB_HOST'] || 'localhost',
                port: parseInt(process.env['DB_PORT'] || '1433', 10),
                username: process.env['DB_USER'] || 'sa',
                password: process.env['MSSQL_SA_PASSWORD'] || 'YourStrong!Passw0rd',
                database: process.env['DB_NAME'] || 'master', // Default to master or create specific DB
                entities: [User],
                synchronize: true, // Auto-create schema (DEV ONLY - Disable in Prod)
                options: {
                    encrypt: false, // For local docker usage often needed
                    trustServerCertificate: true,
                },
            }),
        }),
        TypeOrmModule.forFeature([User]),
    ],
    exports: [TypeOrmModule],
})
export class DataAccessModule { }
