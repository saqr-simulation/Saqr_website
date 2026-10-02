import { sitePath, platformAvailable } from './site-path';
import { z } from 'zod';
export function platformUrl(path = '/register') {
  if (!platformAvailable) return sitePath('/waitlist/');
  const base = z
    .url()
    .parse(process.env.NEXT_PUBLIC_PLATFORM_URL || 'http://localhost:3001');
  return new URL(path, base).toString();
}
