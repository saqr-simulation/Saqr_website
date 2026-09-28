import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import type { Role } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
@Injectable()
export class UsersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  profile(identity: { id: string; email: string; name: string | null }) {
    return this.prisma.user.upsert({
      where: { id: identity.id },
      create: identity,
      update: { email: identity.email, name: identity.name },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  sync(identity: { id: string; email: string; name: string | null }) {
    return this.prisma.user.upsert({
      where: { id: identity.id },
      create: identity,
      update: { email: identity.email, name: identity.name },
      select: { id: true, role: true },
    });
  }

  async requireAuthor(identity: {
    id: string;
    email: string;
    name: string | null;
  }) {
    const user = await this.sync(identity);
    const allowed: Role[] = ['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'];
    if (!allowed.includes(user.role))
      throw new ForbiddenException('Course author permissions are required.');
    return user;
  }
}
