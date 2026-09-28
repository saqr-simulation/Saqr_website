import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { UsersService } from '../users/users.service';
type Identity = { id: string; email: string; name: string | null };
const enrollmentSelect = {
  id: true,
  enrolledAt: true,
  completedAt: true,
  course: {
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      modules: { select: { lessons: { select: { id: true } } } },
    },
  },
  progress: {
    where: { completedAt: { not: null } },
    select: { lessonId: true, completedAt: true },
  },
};
@Injectable()
export class EnrollmentsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(UsersService) private readonly users: UsersService,
  ) {}
  async list(identity: Identity) {
    await this.users.sync(identity);
    const rows = await this.prisma.enrollment.findMany({
      where: { userId: identity.id },
      select: enrollmentSelect,
      orderBy: { enrolledAt: 'desc' },
    });
    return rows.map((row) => this.summary(row));
  }
  async detail(identity: Identity, courseId: string) {
    await this.users.sync(identity);
    const row = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: identity.id, courseId } },
      select: enrollmentSelect,
    });
    if (!row) throw new NotFoundException('Enrollment not found.');
    return this.summary(row);
  }
  async enroll(identity: Identity, courseId: string) {
    await this.users.sync(identity);
    const course = await this.prisma.course.findFirst({
      where: { id: courseId, status: 'PUBLISHED' },
      select: { id: true },
    });
    if (!course) throw new NotFoundException('Published course not found.');
    try {
      const row = await this.prisma.enrollment.create({
        data: { userId: identity.id, courseId },
        select: enrollmentSelect,
      });
      return this.summary(row);
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError)?.code === 'P2002')
        throw new ConflictException('You are already enrolled in this course.');
      throw error;
    }
  }
  private summary(row: {
    id: string;
    enrolledAt: Date;
    completedAt: Date | null;
    course: {
      id: string;
      slug: string;
      title: string;
      description: string;
      modules: { lessons: { id: string }[] }[];
    };
    progress: { lessonId: string; completedAt: Date | null }[];
  }) {
    const totalLessons = row.course.modules.reduce(
      (sum, module) => sum + module.lessons.length,
      0,
    );
    const completedLessons = new Set(row.progress.map((item) => item.lessonId))
      .size;
    return {
      id: row.id,
      enrolledAt: row.enrolledAt,
      completedAt: row.completedAt,
      course: {
        id: row.course.id,
        slug: row.course.slug,
        title: row.course.title,
        description: row.course.description,
      },
      completedLessons,
      totalLessons,
      progressPercent:
        totalLessons === 0
          ? 0
          : Math.round((completedLessons / totalLessons) * 100),
    };
  }
}
