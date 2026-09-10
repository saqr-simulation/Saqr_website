import { Inject, Injectable } from '@nestjs/common';
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
}
