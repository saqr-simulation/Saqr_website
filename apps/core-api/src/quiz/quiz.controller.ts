import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { AuthGuard, type AuthenticatedRequest } from '../auth/auth.guard';
import { QuizService } from './quiz.service';
class QuizParams {
  @IsString() @MaxLength(100) @Matches(/^[A-Za-z0-9_-]+$/) quizId!: string;
}
class AnswerDto {
  @IsString() @MaxLength(100) @Matches(/^[A-Za-z0-9_-]+$/) questionId!: string;
  @IsInt() @Min(0) @Max(1000) optionIndex!: number;
}
class SubmitQuizDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers!: AnswerDto[];
}
@ApiTags('Quiz')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('quizzes')
export class QuizController {
  constructor(@Inject(QuizService) private readonly quiz: QuizService) {}
  @Get(':quizId') detail(
    @Req() request: AuthenticatedRequest,
    @Param() params: QuizParams,
  ) {
    return this.quiz.detail(request.identity, params.quizId);
  }
  @Post(':quizId/attempts') submit(
    @Req() request: AuthenticatedRequest,
    @Param() params: QuizParams,
    @Body() body: SubmitQuizDto,
  ) {
    return this.quiz.submit(request.identity, params.quizId, body.answers);
  }
  @Get(':quizId/attempts') attempts(
    @Req() request: AuthenticatedRequest,
    @Param() params: QuizParams,
  ) {
    return this.quiz.attempts(request.identity, params.quizId);
  }
}
