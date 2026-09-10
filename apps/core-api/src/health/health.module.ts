import {
  Controller,
  Get,
  Inject,
  Module,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
@Controller('health')
class HealthController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  @Get() live() {
    return { status: 'ok', service: 'saqr-core-api' };
  }
  @Get('ready') async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', database: 'connected' };
    } catch {
      throw new ServiceUnavailableException('Database unavailable');
    }
  }
}
@Module({ controllers: [HealthController] })
export class HealthModule {}
