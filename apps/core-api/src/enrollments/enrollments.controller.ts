import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString, Matches, MaxLength } from 'class-validator';
import { AuthGuard, type AuthenticatedRequest } from '../auth/auth.guard';
import { EnrollmentsService } from './enrollments.service';
class CourseParams {
  @IsString() @MaxLength(100) @Matches(/^[A-Za-z0-9_-]+$/) courseId!: string;
}
@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    @Inject(EnrollmentsService)
    private readonly enrollments: EnrollmentsService,
  ) {}
  @Get('me') list(@Req() request: AuthenticatedRequest) {
    return this.enrollments.list(request.identity);
  }
  @Post('courses/:courseId') enroll(
    @Req() request: AuthenticatedRequest,
    @Param() params: CourseParams,
  ) {
    return this.enrollments.enroll(request.identity, params.courseId);
  }
  @Get('courses/:courseId') detail(
    @Req() request: AuthenticatedRequest,
    @Param() params: CourseParams,
  ) {
    return this.enrollments.detail(request.identity, params.courseId);
  }
}
