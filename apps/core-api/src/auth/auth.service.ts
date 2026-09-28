import {
  Injectable,
  UnauthorizedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { verifyCredentials } from '@supabase/server/core';
import { readEnvironment } from '../config/environment';
@Injectable()
export class AuthService {
  private readonly config = readEnvironment();
  async verify(token: string) {
    const { data, error } = await verifyCredentials(
      { token, apikey: null },
      {
        auth: 'user',
        issuer: `${this.config.SUPABASE_URL}/auth/v1`,
        env: {
          url: this.config.SUPABASE_URL,
          publishableKeys: {
            default: this.config.SUPABASE_PUBLISHABLE_KEY,
          },
          jwks: new URL(
            this.config.SUPABASE_JWKS_URL ??
              `${this.config.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
          ),
        },
      },
    );
    if (error?.status && error.status >= 500)
      throw new ServiceUnavailableException(
        'Authentication is temporarily unavailable',
      );
    if (error || !data.userClaims?.email)
      throw new UnauthorizedException(
        'Your session has expired. Please sign in again.',
      );
    const metadata = data.userClaims.userMetadata;
    return {
      id: data.userClaims.id,
      email: data.userClaims.email,
      name:
        metadata && typeof metadata.name === 'string'
          ? metadata.name.slice(0, 100)
          : null,
    };
  }
}
