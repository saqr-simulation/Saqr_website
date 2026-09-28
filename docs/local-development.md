# Local development

## Prerequisites

Install Node.js 22+, pnpm 10.32.1 and PostgreSQL 17 or Docker Desktop. FastAPI needs a real Python 3.11+ installation; the Windows Store execution alias is not a Python runtime.

Run everything from the repository root. Do not copy real credentials into documentation or source files.

1. `pnpm install`
2. Copy per-app environment examples as shown in the README.
3. Configure Supabase Auth below.
4. Start PostgreSQL: `docker compose -f infrastructure/compose.yaml up -d` (or use an existing database).
5. Run `pnpm db:generate`, `pnpm db:migrate`, then `pnpm db:seed`.
6. Run `pnpm dev`.

The database password in Compose is only for the loopback-bound local container. Use independent credentials for hosted environments. `db:migrate` deploys the checked-in SQL migration. When making future schema changes, use `pnpm --filter @saqr/core-api exec prisma migrate dev --name descriptive_name` against a development database, then review the SQL.

## Supabase Auth

Create or select your project. Put the project URL and public publishable key in `apps/platform/.env.local`; use the matching values under `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in `apps/core-api/.env`. The Core API verifies bearer JWTs locally with the project's JWKS and does not need a secret key for user authentication.

Set the Auth Site URL to `http://localhost:3001` and allow the local platform domain in the project's redirect configuration. For production use `https://app.saqr.com`.

Keep email confirmation enabled for realistic testing. In the confirmation email template, use the Supabase token-hash flow:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email"
  >Confirm your SAQR account</a
>
```

The route accepts only email confirmation, verifies the token with Supabase and redirects to a fixed dashboard path. Invalid or expired links lead to a dedicated recovery page. The registration screen tells the user to check email when Supabase does not immediately return a session. If confirmation is disabled in a development project, registration signs in immediately.

Test with an email inbox you control. The database seed is deliberately not a login identity. Configure rate limits, email delivery and any password policy in Supabase; the form requires at least 8 characters and surfaces friendly errors.

## Storage

Run `infrastructure/supabase-storage.sql` in your Supabase SQL editor when provisioning the project. It creates a private bucket. No browser upload policies or functioning document routes are part of Week 1.

## Independent AI service

```powershell
python -m venv apps/ai-service/.venv
& apps/ai-service/.venv/Scripts/Activate.ps1
python -m pip install -e "./apps/ai-service[test]"
python -m uvicorn app.main:app --app-dir apps/ai-service --reload --port 8000
```

In another activated shell: `python -m pytest apps/ai-service/tests`.

## Checks

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
node scripts/smoke.mjs
```

Run HTTP smoke checks while the Next.js apps are running. These are unauthenticated checks; they cannot certify a successful sign-in. Use the manual checklist in `docs/verification.md` for the live account flow.

## Common problems

- **Core API configuration error:** verify the required values in its `.env`. Startup fails rather than inventing credentials. Node watch waits for source changes; restart after changing environment files.
- **Database connection failure:** ensure PostgreSQL is listening and the URL is correct, then deploy migrations.
- **Profile sync notice:** the user is authenticated but NestJS/database access is unavailable. Start the API and refresh.
- **Prisma engine download failure:** the first generation may need access to `binaries.prisma.sh`.
- **No pnpm command:** install pnpm or use `npx --yes pnpm@10.32.1` for the root commands.
- **Registration has no immediate session:** confirm the email. This is expected with email confirmation enabled.
- **Contact action absent:** set a verified `CONTACT_EMAIL` before building the public site.
