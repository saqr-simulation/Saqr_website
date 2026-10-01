# SAQR | Drone Pilot Platform

Week 1 foundation for professional drone education, starting with agriculture. Two Next.js applications share a design system and connect to a modular NestJS API. Supabase owns authentication; Prisma owns platform data. FastAPI is an independent health-only AI boundary.

## Quick start

Requires Node.js 22+, pnpm 10.32.1, PostgreSQL 17 (or Docker), and a Supabase project. Python 3.11+ is needed only for the independent AI service.

```sh
npm install --global pnpm@10.32.1
pnpm install
```

Copy the per-app examples before starting (PowerShell):

```powershell
Copy-Item apps/web/.env.example apps/web/.env.local
Copy-Item apps/platform/.env.example apps/platform/.env.local
Copy-Item apps/core-api/.env.example apps/core-api/.env
```

Fill the Supabase URL and public anon/publishable key in both platform and Core API files. Configure email confirmation as described in [local development](docs/local-development.md).

```sh
docker compose -f infrastructure/compose.yaml up -d
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

| Application                    | Address                      |
| ------------------------------ | ---------------------------- |
| Public website                 | http://localhost:3000        |
| Student platform               | http://localhost:3001        |
| Core API                       | http://localhost:4000        |
| Swagger                        | http://localhost:4000/docs   |
| AI service, separately started | http://localhost:8000/health |

For a website/auth-screen preview without external services: `pnpm dev --filter=@saqr/web --filter=@saqr/platform`. Accounts and protected pages require Supabase; there is deliberately no authentication bypass.

## Commands

```sh
pnpm dev          # TypeScript applications together
pnpm build        # Production builds, including Prisma client
pnpm lint
pnpm typecheck
pnpm test         # API authorization boundary tests
pnpm format
node scripts/smoke.mjs # HTTP checks against running Next.js applications
```

## Included

- Eight public pages, responsive navigation, interactive 3D drone and agriculture-focused visual identity.
- Pilot waitlist, SAQR Cup interest and institutional demo forms with persistent inquiries and referral sharing.
- Shared Tailwind/shadcn-style Radix components, forms, overlays, states and cards.
- Supabase registration, login, email confirmation, session refresh, logout and protected student routes.
- Dashboard, sample course catalog/outline, lesson workspace and pilot profile.
- Explicit placeholders for assessments, certificates and AI; no invented functioning capabilities.
- Twelve Prisma models, SQL migrations, deterministic sample curriculum and database-only demo student.
- NestJS verified bearer-token guard, user synchronization, protected catalog, health/readiness and OpenAPI.
- Private Supabase Storage provisioning SQL and independent FastAPI health endpoint.

## Status and next step

Build, lint, strict TypeScript and authorization checks have passed. Both Next.js applications start from the root command. See [verification](docs/verification.md) for the exact evidence and remaining checks.

**The full Week 1 acceptance flow is not yet certified:** live Supabase credentials, PostgreSQL and Python are not configured in the implementation environment. Browser visual QA also needs a connected browser. Configure those services, run the end-to-end checklist, then begin Week 2 lessons and persistent progress.

## Documentation

- [Architecture and decisions](docs/architecture.md)
- [Local development and authentication setup](docs/local-development.md)
- [Environment variables](docs/environment.md)
- [Verification and remaining work](docs/verification.md)
- [Website inquiries and launch scope](docs/website-inquiries.md)
