import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';
type Identity = { id: string; email: string; name: string | null };
@Injectable()
export class ProgressService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(UsersService) private readonly users: UsersService,
  ) {}
  async complete(identity: Identity, lessonId: string) {
    await this.users.sync(identity);
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        module: {
          select: { courseId: true, course: { select: { status: true } } },
        },
      },
    });
    if (!lesson || lesson.module.course.status !== 'PUBLISHED')
      throw new NotFoundException('Lesson not found.');
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: identity.id,
          courseId: lesson.module.courseId,
        },
      },
      select: { id: true },
    });
    if (!enrollment)
      throw new NotFoundException('Enrollment not found for this lesson.');
    await this.prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId },
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId,
        completedAt: new Date(),
      },
      update: {},
    });
    return this.recalculate(identity.id, lesson.module.courseId);
  }
  async course(identity: Identity, courseId: string) {
    await this.users.sync(identity);
    return this.recalculate(identity.id, courseId);
  }
  private async recalculate(userId: string, courseId: string) {
    return this.prisma.$transaction(async (tx) => {
      const enrollment = await tx.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
        select: {
          id: true,
          enrolledAt: true,
          completedAt: true,
          course: {
            select: {
              id: true,
              slug: true,
              title: true,
              modules: { select: { lessons: { select: { id: true } } } },
            },
          },
          progress: {
            where: {
              completedAt: { not: null },
              lesson: { module: { courseId } },
            },
            select: { lessonId: true, completedAt: true },
          },
        },
      });
      if (!enrollment) throw new NotFoundException('Enrollment not found.');
      const lessonIds = enrollment.course.modules.flatMap((module) =>
        module.lessons.map((lesson) => lesson.id),
      );
      const completed = new Map(
        enrollment.progress.map((item) => [item.lessonId, item.completedAt]),
      );
      const completedLessons = lessonIds.filter((id) =>
        completed.has(id),
      ).length;
      const totalLessons = lessonIds.length;
      const progressPercent =
        totalLessons === 0
          ? 0
          : Math.round((completedLessons / totalLessons) * 100);
      const completedAt =
        totalLessons > 0 && completedLessons === totalLessons
          ? (enrollment.completedAt ?? new Date())
          : null;
      if (completedAt?.getTime() !== enrollment.completedAt?.getTime())
        await tx.enrollment.update({
          where: { id: enrollment.id },
          data: { completedAt },
        });
      return {
        enrollmentId: enrollment.id,
        course: {
          id: enrollment.course.id,
          slug: enrollment.course.slug,
          title: enrollment.course.title,
        },
        enrolledAt: enrollment.enrolledAt,
        completedAt,
        completedLessons,
        totalLessons,
        progressPercent,
        lessons: lessonIds.map((lessonId) => ({
          lessonId,
          completedAt: completed.get(lessonId) ?? null,
        })),
      };
    });
  }
}
