import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString, Matches, MaxLength } from 'class-validator';
import { AuthGuard } from '../auth/auth.guard';
import { CoursesService } from './courses.service';
class CourseParams {
  @IsString() @MaxLength(100) @Matches(/^[a-z0-9-]+$/) slug!: string;
}
@ApiTags('Courses')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(
    @Inject(CoursesService) private readonly courses: CoursesService,
  ) {}
  @Get() list() {
    return this.courses.list();
  }
  @Get(':slug') detail(@Param() params: CourseParams) {
    return this.courses.detail(params.slug);
  }
}
