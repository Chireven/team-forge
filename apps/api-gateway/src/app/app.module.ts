import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataAccessModule } from '@team-forge/shared/data-access';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DataAccessModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
