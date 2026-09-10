import { cache } from 'react';
import { redirect } from 'next/navigation';
import { supabaseServer } from './supabase/server';
import { getProfile } from '@saqr/api-client';
export const requireStudent = cache(async () => {
  const supabase = await supabaseServer();
  if (!supabase) redirect('/login?setup=required');
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect('/login');
  const user = data.user;
  const name =
    typeof user.user_metadata.name === 'string'
      ? user.user_metadata.name
      : user.email?.split('@')[0] || 'Pilot';
  let profileStatus: 'connected' | 'unavailable' = 'unavailable';
  let profileName: string | null = null;
  const session = await supabase.auth.getSession();
  if (process.env.CORE_API_URL && session.data.session) {
    try {
      const profile = await getProfile(
        process.env.CORE_API_URL,
        session.data.session.access_token,
      );
      profileName = profile.name;
      profileStatus = 'connected';
    } catch {
      /* Authenticated identity remains usable while the API is unavailable. */
    }
  }
  return {
    id: user.id,
    email: user.email || '',
    name: profileName || name,
    profileStatus,
  };
});
