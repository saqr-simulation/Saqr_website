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
import { LessonType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { AuthGuard, type AuthenticatedRequest } from '../auth/auth.guard';
import { LessonsService } from './lessons.service';
class ModuleParams {
  @IsString() @MaxLength(100) @Matches(/^[A-Za-z0-9_-]+$/) moduleId!: string;
}
class LessonParams {
  @IsString() @MaxLength(100) @Matches(/^[A-Za-z0-9_-]+$/) lessonId!: string;
}
class CreateLessonDto {
  @IsString() @MinLength(2) @MaxLength(150) title!: string;
  @IsInt() @Min(1) @Max(1000) position!: number;
  @IsOptional() @IsEnum(LessonType) type?: LessonType;
  @IsOptional() @IsString() @MaxLength(100000) content?: string;
}
class UpdateLessonDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(150) title?: string;
  @IsOptional() @IsInt() @Min(1) @Max(1000) position?: number;
  @IsOptional() @IsEnum(LessonType) type?: LessonType;
  @IsOptional() @IsString() @MaxLength(100000) content?: string | null;
}
@ApiTags('Lessons')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class LessonsController {
  constructor(
    @Inject(LessonsService) private readonly lessons: LessonsService,
  ) {}
  @Post('modules/:moduleId/lessons') create(
    @Req() request: AuthenticatedRequest,
    @Param() params: ModuleParams,
    @Body() body: CreateLessonDto,
  ) {
    return this.lessons.create(request.identity, params.moduleId, body);
  }
  @Get('lessons/:lessonId') detail(
    @Req() request: AuthenticatedRequest,
    @Param() params: LessonParams,
  ) {
    return this.lessons.detail(request.identity, params.lessonId);
  }
  @Patch('lessons/:lessonId') update(
    @Req() request: AuthenticatedRequest,
    @Param() params: LessonParams,
    @Body() body: UpdateLessonDto,
  ) {
    return this.lessons.update(request.identity, params.lessonId, body);
  }
  @Delete('lessons/:lessonId') @HttpCode(204) remove(
    @Req() request: AuthenticatedRequest,
    @Param() params: LessonParams,
  ) {
    return this.lessons.remove(request.identity, params.lessonId);
  }
}
