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
const selection = {
  id: true,
  courseId: true,
  title: true,
  position: true,
  lessons: {
    orderBy: { position: 'asc' as const },
    select: { id: true, title: true, position: true, type: true },
  },
  quiz: { select: { id: true, title: true, passScore: true } },
};
@Injectable()
export class ModulesService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(UsersService) private readonly users: UsersService,
  ) {}
  async detail(moduleId: string) {
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      select: { ...selection, course: { select: { status: true } } },
    });
    if (!module || module.course.status !== 'PUBLISHED')
      throw new NotFoundException('Module not found.');
    return {
      id: module.id,
      courseId: module.courseId,
      title: module.title,
      position: module.position,
      lessons: module.lessons,
      quiz: module.quiz,
    };
  }
  async create(
    identity: Identity,
    courseId: string,
    data: { title: string; position: number },
  ) {
    await this.users.requireAuthor(identity);
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });
    if (!course) throw new NotFoundException('Course not found.');
    try {
      return await this.prisma.module.create({
        data: { ...data, courseId },
        select: selection,
      });
    } catch (error) {
      this.conflict(error);
    }
  }
  async update(
    identity: Identity,
    moduleId: string,
    data: { title?: string; position?: number },
  ) {
    await this.users.requireAuthor(identity);
    await this.require(moduleId);
    try {
      return await this.prisma.module.update({
        where: { id: moduleId },
        data,
        select: selection,
      });
    } catch (error) {
      this.conflict(error);
    }
  }
  async remove(identity: Identity, moduleId: string) {
    await this.users.requireAuthor(identity);
    await this.require(moduleId);
    await this.prisma.module.delete({ where: { id: moduleId } });
  }
  private async require(id: string) {
    if (
      !(await this.prisma.module.findUnique({
        where: { id },
        select: { id: true },
      }))
    )
      throw new NotFoundException('Module not found.');
  }
  private conflict(error: unknown): never {
    if ((error as Prisma.PrismaClientKnownRequestError)?.code === 'P2002')
      throw new ConflictException(
        'A module already uses this position in the course.',
      );
    throw error;
  }
}
