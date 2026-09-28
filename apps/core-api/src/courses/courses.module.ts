import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [AuthModule, UsersModule],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
