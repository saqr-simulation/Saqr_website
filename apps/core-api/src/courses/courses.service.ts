import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CourseStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';

type Identity = { id: string; email: string; name: string | null };
const outline = {
  id: true,
  slug: true,
  title: true,
  description: true,
  modules: {
    orderBy: { position: 'asc' as const },
    select: {
      id: true,
      title: true,
      position: true,
      lessons: {
        orderBy: { position: 'asc' as const },
        select: { id: true, title: true, position: true, type: true },
      },
      quiz: {
        select: {
          id: true,
          title: true,
          passScore: true,
          _count: { select: { questions: true } },
        },
      },
    },
  },
};

@Injectable()
export class CoursesService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(UsersService) private readonly users: UsersService,
  ) {}

  async list(identity: Identity) {
    await this.users.sync(identity);
    const courses = await this.prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        ...outline,
        enrollments: {
          where: { userId: identity.id },
          select: {
            id: true,
            enrolledAt: true,
            completedAt: true,
            progress: {
              where: { completedAt: { not: null } },
              select: { lessonId: true },
            },
          },
        },
      },
      orderBy: { title: 'asc' },
    });
    return courses.map(({ enrollments, ...course }) => ({
      ...course,
      enrollment: enrollments[0]
        ? this.enrollmentSummary(course, enrollments[0])
        : null,
    }));
  }

  async detail(slug: string, identity: Identity) {
    await this.users.sync(identity);
    const course = await this.prisma.course.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: {
        ...outline,
        enrollments: {
          where: { userId: identity.id },
          select: {
            id: true,
            enrolledAt: true,
            completedAt: true,
            progress: {
              where: { completedAt: { not: null } },
              select: { lessonId: true, completedAt: true },
            },
          },
        },
      },
    });
    if (!course) throw new NotFoundException('Course not found.');
    const { enrollments, ...data } = course;
    return {
      ...data,
      enrollment: enrollments[0]
        ? this.enrollmentSummary(data, enrollments[0])
        : null,
    };
  }

  async create(
    identity: Identity,
    data: {
      title: string;
      slug: string;
      description: string;
      status?: CourseStatus;
    },
  ) {
    await this.users.requireAuthor(identity);
    try {
      return await this.prisma.course.create({ data, select: outline });
    } catch (error) {
      this.rethrowConflict(error, 'A course with this slug already exists.');
    }
  }

  async update(
    identity: Identity,
    courseId: string,
    data: {
      title?: string;
      slug?: string;
      description?: string;
      status?: CourseStatus;
    },
  ) {
    await this.users.requireAuthor(identity);
    await this.requireCourse(courseId);
    try {
      return await this.prisma.course.update({
        where: { id: courseId },
        data,
        select: outline,
      });
    } catch (error) {
      this.rethrowConflict(error, 'A course with this slug already exists.');
    }
  }

  async archive(identity: Identity, courseId: string) {
    await this.users.requireAuthor(identity);
    await this.requireCourse(courseId);
    await this.prisma.course.update({
      where: { id: courseId },
      data: { status: 'ARCHIVED' },
    });
  }

  private async requireCourse(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!course) throw new NotFoundException('Course not found.');
  }

  private enrollmentSummary(
    course: { modules: { lessons: { id: string }[] }[] },
    enrollment: {
      id: string;
      enrolledAt: Date;
      completedAt: Date | null;
      progress: { lessonId: string }[];
    },
  ) {
    const totalLessons = course.modules.reduce(
      (sum, module) => sum + module.lessons.length,
      0,
    );
    const completedLessons = new Set(
      enrollment.progress.map((item) => item.lessonId),
    ).size;
    return {
      id: enrollment.id,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
      completedLessons,
      totalLessons,
      progressPercent:
        totalLessons === 0
          ? 0
          : Math.round((completedLessons / totalLessons) * 100),
    };
  }

  private rethrowConflict(error: unknown, message: string): never {
    if ((error as Prisma.PrismaClientKnownRequestError)?.code === 'P2002')
      throw new ConflictException(message);
    throw error;
  }
}
