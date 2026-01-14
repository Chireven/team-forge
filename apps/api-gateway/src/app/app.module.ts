import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import * as crypto from 'crypto';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchemaController } from './system/schema.controller';
import { DataAccessModule } from '@team-forge/shared/data-access';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeamCoreApiModule } from '@team-forge/team-core-api';
import { WorkCoreModule } from '@team-forge/work-core-api';

@Module({
  imports: [
    DataAccessModule,
    AuthModule,
    UsersModule,
    TeamCoreApiModule,
    WorkCoreModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production' ? {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            translateTime: "SYS:standard",
          },
        } : undefined,
        autoLogging: true,
        genReqId: (req) => req.headers['x-request-id'] || crypto.randomUUID(),
      },
    }),
  ],
  controllers: [AppController, SchemaController],
  providers: [AppService],
})
export class AppModule { }
