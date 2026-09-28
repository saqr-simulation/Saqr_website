import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { LessonType, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';
type Identity = { id: string; email: string; name: string | null };
const selection = {
  id: true,
  moduleId: true,
  title: true,
  position: true,
  type: true,
  content: true,
};
@Injectable()
export class LessonsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(UsersService) private readonly users: UsersService,
  ) {}
  async detail(identity: Identity, lessonId: string) {
    await this.users.sync(identity);
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        ...selection,
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
        progress: {
          where: { enrollment: { userId: identity.id } },
          select: { completedAt: true },
        },
      },
    });
    if (!lesson || lesson.module.course.status !== 'PUBLISHED')
      throw new NotFoundException('Lesson not found.');
    if (!lesson.module.course.enrollments[0])
      throw new ForbiddenException(
        'Enroll in this course to access the lesson.',
      );
    return {
      id: lesson.id,
      moduleId: lesson.moduleId,
      title: lesson.title,
      position: lesson.position,
      type: lesson.type,
      content: lesson.content,
      completedAt: lesson.progress[0]?.completedAt ?? null,
    };
  }
  async create(
    identity: Identity,
    moduleId: string,
    data: {
      title: string;
      position: number;
      type?: LessonType;
      content?: string;
    },
  ) {
    await this.users.requireAuthor(identity);
    if (
      !(await this.prisma.module.findUnique({
        where: { id: moduleId },
        select: { id: true },
      }))
    )
      throw new NotFoundException('Module not found.');
    try {
      return await this.prisma.lesson.create({
        data: { ...data, moduleId },
        select: selection,
      });
    } catch (error) {
      this.conflict(error);
    }
  }
  async update(
    identity: Identity,
    lessonId: string,
    data: {
      title?: string;
      position?: number;
      type?: LessonType;
      content?: string | null;
    },
  ) {
    await this.users.requireAuthor(identity);
    await this.require(lessonId);
    try {
      return await this.prisma.lesson.update({
        where: { id: lessonId },
        data,
        select: selection,
      });
    } catch (error) {
      this.conflict(error);
    }
  }
  async remove(identity: Identity, lessonId: string) {
    await this.users.requireAuthor(identity);
    await this.require(lessonId);
    await this.prisma.lesson.delete({ where: { id: lessonId } });
  }
  private async require(id: string) {
    if (
      !(await this.prisma.lesson.findUnique({
        where: { id },
        select: { id: true },
      }))
    )
      throw new NotFoundException('Lesson not found.');
  }
  private conflict(error: unknown): never {
    if ((error as Prisma.PrismaClientKnownRequestError)?.code === 'P2002')
      throw new ConflictException(
        'A lesson already uses this position in the module.',
      );
    throw error;
  }
}
