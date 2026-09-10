import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
@Injectable()
export class CoursesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  list() {
    return this.prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, slug: true, title: true, description: true },
      orderBy: { title: 'asc' },
    });
  }
  async detail(slug: string) {
    const course = await this.prisma.course.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        modules: {
          orderBy: { position: 'asc' },
          select: {
            id: true,
            title: true,
            position: true,
            lessons: {
              orderBy: { position: 'asc' },
              select: { id: true, title: true, position: true, type: true },
            },
          },
        },
      },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
}
