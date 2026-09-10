import 'dotenv/config';
import { z } from 'zod';
const schema = z.object({
  DATABASE_URL: z.url(),
  SUPABASE_URL: z.url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  PLATFORM_URL: z.url().default('http://localhost:3001'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
});
export function readEnvironment() {
  const result = schema.safeParse(process.env);
  if (!result.success)
    throw new Error(
      `Invalid Core API configuration: ${result.error.issues.map((issue) => issue.path.join('.')).join(', ')}. See apps/core-api/.env.example.`,
    );
  return result.data;
}
