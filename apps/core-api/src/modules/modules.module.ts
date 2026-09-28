import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
@Module({
  imports: [AuthModule, UsersModule],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}
