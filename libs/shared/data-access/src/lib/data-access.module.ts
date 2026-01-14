import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { SchemaService } from './services/schema.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const host = config.get('DB_HOST') || 'localhost';
                const port = parseInt(config.get('DB_PORT') || '1433', 10);
                const username = config.get('DB_USER') || 'sa';
                const password = config.get('DB_PASSWORD') || config.get('SA_PASSWORD') || config.get('MSSQL_SA_PASSWORD') || 'YourStrong!Passw0rd';
                const database = config.get('DB_NAME') || 'master';

                return {
                    type: 'mssql',
                    host,
                    port,
                    username,
                    password,
                    database,
                    autoLoadEntities: true,
                    synchronize: true,
                    options: {
                        encrypt: false,
                        trustServerCertificate: true,
                    },
                };
            },
        }),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [SchemaService],
    exports: [TypeOrmModule, SchemaService],
})
export class DataAccessModule { }
