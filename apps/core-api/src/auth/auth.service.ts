import {
  Injectable,
  UnauthorizedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { readEnvironment } from '../config/environment';
@Injectable()
export class AuthService {
  private readonly config = readEnvironment();
  private readonly supabase = createClient(
    this.config.SUPABASE_URL,
    this.config.SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  async verify(token: string) {
    const { data, error } = await this.supabase.auth.getUser(token);
    if (error && error.status && error.status >= 500)
      throw new ServiceUnavailableException(
        'Authentication is temporarily unavailable',
      );
    if (error || !data.user?.email)
      throw new UnauthorizedException(
        'Your session has expired. Please sign in again.',
      );
    return {
      id: data.user.id,
      email: data.user.email,
      name:
        typeof data.user.user_metadata.name === 'string'
          ? data.user.user_metadata.name.slice(0, 100)
          : null,
    };
  }
}
