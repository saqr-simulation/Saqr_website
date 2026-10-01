import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  Inject,
  Module,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';

@ApiTags('Website inquiries')
@Controller('website-leads')
export class LeadsController {
  private readonly requests = new Map<
    string,
    { count: number; expires: number }
  >();
  constructor(@Inject(LeadsService) private readonly leads: LeadsService) {}

  @Post()
  submit(@Body() body: unknown, @Req() request: Request) {
    const now = Date.now();
    for (const [key, value] of this.requests)
      if (value.expires <= now) this.requests.delete(key);
    const key = request.ip || 'unknown';
    const entry = this.requests.get(key) || { count: 0, expires: now + 60_000 };
    if (entry.count >= 20 || this.requests.size >= 5000)
      throw new HttpException(
        'Too many requests. Please try again later.',
        429,
      );
    entry.count += 1;
    this.requests.set(key, entry);
    if (!body || typeof body !== 'object')
      throw new BadRequestException('Invalid submission.');
    return this.leads.submit(body);
  }
}

@Module({ controllers: [LeadsController], providers: [LeadsService] })
export class LeadsModule {}
