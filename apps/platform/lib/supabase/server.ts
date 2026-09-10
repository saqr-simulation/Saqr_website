import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { authConfig } from '../env';
export async function supabaseServer() {
  const config = authConfig();
  if (!config) return null;
  const cookieStore = await cookies();
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (entries) => {
        try {
          entries.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          /* Server components cannot write cookies; proxy refreshes them. */
        }
      },
    },
  });
}
