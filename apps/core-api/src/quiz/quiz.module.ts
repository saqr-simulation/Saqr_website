import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
@Module({
  imports: [AuthModule, UsersModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
