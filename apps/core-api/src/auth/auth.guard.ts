import {
  Inject,
  Injectable,
  UnauthorizedException,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
export interface AuthenticatedRequest extends Request {
  identity: { id: string; email: string; name: string | null };
}
export function bearerToken(header: string | undefined): string {
  const match = header?.match(/^Bearer ([^\s]+)$/i);
  if (!match?.[1])
    throw new UnauthorizedException('Please sign in to continue.');
  return match[1];
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private readonly auth: Pick<AuthService, 'verify'>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    request.identity = await this.auth.verify(
      bearerToken(request.headers.authorization),
    );
    return true;
  }
}
