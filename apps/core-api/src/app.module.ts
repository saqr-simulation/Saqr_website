import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { LessonsModule } from './lessons/lessons.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { ProgressModule } from './progress/progress.module';
import { QuizModule } from './quiz/quiz.module';
import { CertificatesModule } from './certificates/certificates.module';
import { DocumentsModule } from './documents/documents.module';
import { HealthModule } from './health/health.module';
import { LeadsModule } from './leads/leads.module';
@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    ModulesModule,
    LessonsModule,
    EnrollmentsModule,
    ProgressModule,
    QuizModule,
    CertificatesModule,
    DocumentsModule,
    HealthModule,
    LeadsModule,
  ],
})
export class AppModule {}
