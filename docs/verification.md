# Week 1 verification

## Passed in the implementation environment

- Dependency installation and checked-in pnpm lockfile.
- `pnpm build`: public Next.js site, platform Next.js app and NestJS production output.
- `pnpm typecheck`: strict application types and shared imports.
- `pnpm lint`: ESLint without errors.
- `pnpm test`: four authorization tests covering malformed headers, rejected tokens and verified identity attachment.
- Prisma schema validation and SQL generation from an empty database schema.
- Root `pnpm dev` starts both Next.js applications. The API runner starts but refuses missing required environment configuration, as intended.
- `node scripts/smoke.mjs`: five public routes and two auth pages return successfully; nine student route paths require authentication; unknown public route returns 404.

App Router may return a streamed redirect with HTTP 200. Smoke checks verify the redirect payload and lack of dashboard content, not just the status code.

## Not verified / needed for full acceptance

1. **Supabase:** no live project credentials were supplied. Registration, confirmation, login, refresh and logout have been implemented but not exercised against a real project.
2. **PostgreSQL:** no server or Docker executable was available. The SQL migration was generated and schema validated, but migration deployment, seeding, readiness and authenticated API queries were not run against a live database.
3. **FastAPI:** the available `python` command is a nonworking Windows Store alias. The health implementation and test exist, but neither could be executed.
4. **Browser QA:** the browser runtime reported no available browsers. Desktop/mobile appearance, keyboard interactions and browser console checks remain unverified. Responsive styles alone do not constitute visual acceptance.
5. **Contact:** a real inbox was not supplied. Configure `CONTACT_EMAIL` before a public presentation needing the contact action.

## Live acceptance checklist

- [ ] Configure per-app env files, start PostgreSQL and deploy migrations.
- [ ] Run the seed twice; verify one demo student, one course, five modules and twenty lessons, without duplicates.
- [ ] Start all TypeScript applications with `pnpm dev`.
- [ ] Verify `/health` and `/health/ready` on port 4000 and `/docs` OpenAPI.
- [ ] Visit the website and follow Start Training to registration.
- [ ] Register an inbox you control; test confirmation if enabled and immediate session if disabled in a development project.
- [ ] Confirm dashboard identity is real, learning metrics are labeled demo, and the API sync notice disappears.
- [ ] Refresh the dashboard and reopen it in a new tab to check session handling.
- [ ] Verify invalid login, expired confirmation, API outage and logout feedback.
- [ ] Log out and verify every protected route requires sign-in, including direct lesson URLs.
- [ ] Call `/users/me` without a token and with an invalid token: both must return 401.
- [ ] Call `/users/me` with the legitimate session token and verify the database user remains STUDENT regardless of editable metadata.
- [ ] Verify course catalog responses omit quiz answers and protected lesson bodies.
- [ ] Start FastAPI and run its health test; verify `GET /health` returns 200.
- [ ] Review at 1440px, 1024px, 768px and 390px: no page overflow, usable mobile navigation and readable cards.
- [ ] Check keyboard focus, forms, dialog/dropdown behavior, loading/error states and browser console.

Full Week 1 sign-off remains pending these checks. Week 2 should implement authenticated enrollment, real lesson content, saved progress and assessments only after this foundation is verified with its services.
