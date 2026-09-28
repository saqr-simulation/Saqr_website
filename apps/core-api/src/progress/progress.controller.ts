import {
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString, Matches, MaxLength } from 'class-validator';
import { AuthGuard, type AuthenticatedRequest } from '../auth/auth.guard';
import { ProgressService } from './progress.service';
class LessonParams {
  @IsString() @MaxLength(100) @Matches(/^[A-Za-z0-9_-]+$/) lessonId!: string;
}
class CourseParams {
  @IsString() @MaxLength(100) @Matches(/^[A-Za-z0-9_-]+$/) courseId!: string;
}
@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(
    @Inject(ProgressService) private readonly progress: ProgressService,
  ) {}
  @Post('lessons/:lessonId/complete') @HttpCode(200) complete(
    @Req() request: AuthenticatedRequest,
    @Param() params: LessonParams,
  ) {
    return this.progress.complete(request.identity, params.lessonId);
  }
  @Get('courses/:courseId') course(
    @Req() request: AuthenticatedRequest,
    @Param() params: CourseParams,
  ) {
    return this.progress.course(request.identity, params.courseId);
  }
}
