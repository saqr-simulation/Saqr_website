import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CourseStatus } from '@prisma/client';
import { AuthGuard, type AuthenticatedRequest } from '../auth/auth.guard';
import { CoursesService } from './courses.service';
class CourseParams {
  @IsString() @MaxLength(100) @Matches(/^[a-z0-9-]+$/) slug!: string;
}
class CourseIdParams {
  @IsString() @MaxLength(100) @Matches(/^[A-Za-z0-9_-]+$/) courseId!: string;
}
class CreateCourseDto {
  @IsString() @MinLength(2) @MaxLength(100) title!: string;
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-z0-9-]+$/)
  slug!: string;
  @IsString() @MinLength(10) @MaxLength(5000) description!: string;
  @IsOptional() @IsEnum(CourseStatus) status?: CourseStatus;
}
class UpdateCourseDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(100) title?: string;
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-z0-9-]+$/)
  slug?: string;
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description?: string;
  @IsOptional() @IsEnum(CourseStatus) status?: CourseStatus;
}
@ApiTags('Courses')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(
    @Inject(CoursesService) private readonly courses: CoursesService,
  ) {}
  @Get() list(@Req() request: AuthenticatedRequest) {
    return this.courses.list(request.identity);
  }
  @Post() create(
    @Req() request: AuthenticatedRequest,
    @Body() body: CreateCourseDto,
  ) {
    return this.courses.create(request.identity, body);
  }
  @Patch(':courseId') update(
    @Req() request: AuthenticatedRequest,
    @Param() params: CourseIdParams,
    @Body() body: UpdateCourseDto,
  ) {
    return this.courses.update(request.identity, params.courseId, body);
  }
  @Delete(':courseId') @HttpCode(204) archive(
    @Req() request: AuthenticatedRequest,
    @Param() params: CourseIdParams,
  ) {
    return this.courses.archive(request.identity, params.courseId);
  }
  @Get(':slug') detail(
    @Req() request: AuthenticatedRequest,
    @Param() params: CourseParams,
  ) {
    return this.courses.detail(params.slug, request.identity);
  }
}
