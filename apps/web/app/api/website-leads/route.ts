import { z } from 'zod';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json(
      { message: 'Please submit this form from the SAQR website.' },
      { status: 403 },
    );
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json(
      { message: 'Invalid submission format.' },
      { status: 415 },
    );
  }
  const raw = await request.text();
  if (raw.length > 12_000)
    return Response.json(
      { message: 'Submission is too large.' },
      { status: 413 },
    );
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ message: 'Invalid submission.' }, { status: 400 });
  }
  const base = z
    .url()
    .safeParse(process.env.CORE_API_URL || 'http://localhost:4000');
  if (!base.success)
    return Response.json(
      {
        message:
          'Registration is temporarily unavailable. Please try again later.',
      },
      { status: 503 },
    );
  try {
    const result = await fetch(new URL('/website-leads', base.data), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    });
    if (!result.ok) {
      const status = [400, 429].includes(result.status) ? result.status : 503;
      const message =
        status === 400
          ? 'Please check your details and complete the required fields.'
          : status === 429
            ? 'Too many requests. Please wait a minute and try again.'
            : 'Registration is temporarily unavailable. We could not confirm your submission. Please try again later.';
      return Response.json({ message }, { status });
    }
    const saved = await result.json();
    return Response.json({
      accepted: true,
      referralCode: saved.referralCode,
      position: saved.position,
    });
  } catch {
    return Response.json(
      {
        message:
          'We could not confirm your submission. Please try again; duplicate registrations will not create a second entry.',
      },
      { status: 503 },
    );
  }
}
