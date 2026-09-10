import type { StudentProfile } from '@saqr/types';
export async function getProfile(
  baseUrl: string,
  accessToken: string,
): Promise<StudentProfile> {
  const response = await fetch(`${baseUrl}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok)
    throw new Error(
      'Your platform profile is temporarily unavailable. Please try again.',
    );
  return response.json() as Promise<StudentProfile>;
}
