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
import { ModulesService } from './modules.service';

class CourseParams {
  @IsString() @MaxLength(100) @Matches(/^[A-Za-z0-9_-]+$/) courseId!: string;
}
class ModuleParams {
  @IsString() @MaxLength(100) @Matches(/^[A-Za-z0-9_-]+$/) moduleId!: string;
}
class CreateModuleDto {
  @IsString() @MinLength(2) @MaxLength(150) title!: string;
  @IsInt() @Min(1) @Max(1000) position!: number;
}
class UpdateModuleDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(150) title?: string;
  @IsOptional() @IsInt() @Min(1) @Max(1000) position?: number;
}

@ApiTags('Modules')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class ModulesController {
  constructor(
    @Inject(ModulesService) private readonly modules: ModulesService,
  ) {}
  @Post('courses/:courseId/modules') create(
    @Req() request: AuthenticatedRequest,
    @Param() params: CourseParams,
    @Body() body: CreateModuleDto,
  ) {
    return this.modules.create(request.identity, params.courseId, body);
  }
  @Get('modules/:moduleId') detail(@Param() params: ModuleParams) {
    return this.modules.detail(params.moduleId);
  }
  @Patch('modules/:moduleId') update(
    @Req() request: AuthenticatedRequest,
    @Param() params: ModuleParams,
    @Body() body: UpdateModuleDto,
  ) {
    return this.modules.update(request.identity, params.moduleId, body);
  }
  @Delete('modules/:moduleId') @HttpCode(204) remove(
    @Req() request: AuthenticatedRequest,
    @Param() params: ModuleParams,
  ) {
    return this.modules.remove(request.identity, params.moduleId);
  }
}
