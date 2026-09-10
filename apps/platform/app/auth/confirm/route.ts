import { type NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabase/server';
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token_hash');
  const supabase = await supabaseServer();
  if (token && supabase) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });
    if (!error)
      return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.redirect(
    new URL('/auth/confirmation-error', request.url),
  );
}
