'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { supabaseServer } from '../../lib/supabase/server';
export type AuthState = { error?: string; message?: string };
const credentials = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(128),
});
export async function signIn(
  _previous: AuthState,
  form: FormData,
): Promise<AuthState> {
  const parsed = credentials.safeParse({
    email: form.get('email'),
    password: form.get('password'),
  });
  if (!parsed.success)
    return {
      error: 'Enter a valid email and a password of at least 8 characters.',
    };
  const supabase = await supabaseServer();
  if (!supabase)
    return {
      error:
        'Sign-in is not configured yet. Add the Supabase environment variables to enable accounts.',
    };
  try {
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error)
      return {
        error:
          'We couldn’t sign you in. Check your email and password, and confirm your email if required.',
      };
  } catch {
    return {
      error: 'The authentication service is unavailable. Please try again.',
    };
  }
  redirect('/dashboard');
}
export async function register(
  _previous: AuthState,
  form: FormData,
): Promise<AuthState> {
  const parsed = credentials
    .extend({ name: z.string().trim().min(2).max(100) })
    .safeParse({
      email: form.get('email'),
      password: form.get('password'),
      name: form.get('name'),
    });
  if (!parsed.success)
    return {
      error:
        'Enter your name, a valid email, and a password of 8–128 characters.',
    };
  const supabase = await supabaseServer();
  if (!supabase)
    return {
      error:
        'Registration is not configured yet. Add the Supabase environment variables to enable accounts.',
    };
  try {
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { data: { name: parsed.data.name } },
    });
    if (error)
      return {
        error:
          'We couldn’t create your account. Try again, or sign in if you already have an account.',
      };
    if (!data.session)
      return {
        message:
          'Check your email to confirm your account, then return here to sign in.',
      };
  } catch {
    return {
      error: 'The authentication service is unavailable. Please try again.',
    };
  }
  redirect('/dashboard');
}
export async function logout(): Promise<AuthState> {
  const supabase = await supabaseServer();
  try {
    if (supabase) {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) return { error: 'Sign-out failed. Please try again.' };
    }
  } catch {
    return { error: 'Sign-out failed. Please try again.' };
  }
  redirect('/login');
}
