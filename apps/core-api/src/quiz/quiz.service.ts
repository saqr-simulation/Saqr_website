import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';
type Identity = { id: string; email: string; name: string | null };
@Injectable()
export class QuizService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(UsersService) private readonly users: UsersService,
  ) {}
  async detail(identity: Identity, quizId: string) {
    await this.authorize(identity, quizId);
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        passScore: true,
        moduleId: true,
        questions: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            prompt: true,
            type: true,
            options: true,
            position: true,
          },
        },
        attempts: {
          where: { userId: identity.id, submittedAt: { not: null } },
          orderBy: { submittedAt: 'desc' },
          take: 1,
          select: { id: true, score: true, submittedAt: true },
        },
      },
    });
    if (!quiz) throw new NotFoundException('Quiz not found.');
    const { attempts, ...data } = quiz;
    return {
      ...data,
      previousResult: attempts[0]
        ? { ...attempts[0], passed: (attempts[0].score ?? 0) >= quiz.passScore }
        : null,
    };
  }
  async submit(
    identity: Identity,
    quizId: string,
    answers: { questionId: string; optionIndex: number }[],
  ) {
    await this.authorize(identity, quizId);
    return this.prisma.$transaction(async (tx) => {
      const quiz = await tx.quiz.findUnique({
        where: { id: quizId },
        select: {
          id: true,
          passScore: true,
          questions: {
            orderBy: { position: 'asc' },
            select: { id: true, options: true, answerIndex: true },
          },
        },
      });
      if (!quiz) throw new NotFoundException('Quiz not found.');
      if (quiz.questions.length === 0)
        throw new ConflictException('This quiz has no questions.');
      const answerMap = new Map<string, number>();
      for (const answer of answers) {
        if (answerMap.has(answer.questionId))
          throw new BadRequestException(
            'Each question may be answered only once.',
          );
        answerMap.set(answer.questionId, answer.optionIndex);
      }
      if (
        answerMap.size !== quiz.questions.length ||
        quiz.questions.some((question) => !answerMap.has(question.id))
      )
        throw new BadRequestException(
          'Submit exactly one answer for every quiz question.',
        );
      let correctAnswers = 0;
      for (const question of quiz.questions) {
        const options = question.options;
        if (
          !Array.isArray(options) ||
          !options.every((option) => typeof option === 'string')
        )
          throw new ConflictException('Quiz question options are invalid.');
        const optionIndex = answerMap.get(question.id)!;
        if (optionIndex >= options.length)
          throw new BadRequestException(
            `Answer for question ${question.id} is outside the available options.`,
          );
        if (optionIndex === question.answerIndex) correctAnswers += 1;
      }
      const score = Math.round((correctAnswers / quiz.questions.length) * 100);
      const submittedAt = new Date();
      const attempt = await tx.quizAttempt.create({
        data: { userId: identity.id, quizId, answers, score, submittedAt },
        select: { id: true, score: true, startedAt: true, submittedAt: true },
      });
      return {
        ...attempt,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        passScore: quiz.passScore,
        passed: score >= quiz.passScore,
      };
    });
  }
  async attempts(identity: Identity, quizId: string) {
    await this.authorize(identity, quizId);
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: { passScore: true },
    });
    if (!quiz) throw new NotFoundException('Quiz not found.');
    const attempts = await this.prisma.quizAttempt.findMany({
      where: { userId: identity.id, quizId, submittedAt: { not: null } },
      orderBy: { submittedAt: 'desc' },
      select: { id: true, score: true, startedAt: true, submittedAt: true },
    });
    return attempts.map((attempt) => ({
      ...attempt,
      passed: (attempt.score ?? 0) >= quiz.passScore,
    }));
  }
  private async authorize(identity: Identity, quizId: string) {
    await this.users.sync(identity);
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        module: {
          select: {
            course: {
              select: {
                status: true,
                enrollments: {
                  where: { userId: identity.id },
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });
    if (!quiz || quiz.module.course.status !== 'PUBLISHED')
      throw new NotFoundException('Quiz not found.');
    if (!quiz.module.course.enrollments[0])
      throw new ForbiddenException('Enroll in this course to access the quiz.');
  }
}
