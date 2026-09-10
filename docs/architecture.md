# Architecture

## Repository inspection

The workspace was empty at implementation start. There was no source, repository metadata, hosting configuration or existing component system to preserve. The supplied product brief defined the architecture.

## Boundaries

```text
apps/web       Next.js public discovery site       www.saqr.com
apps/platform  Next.js authenticated learning app  app.saqr.com
apps/core-api  NestJS REST API                     api.saqr.com
apps/ai-service FastAPI health-only boundary        internal service

packages/ui          Shared React/Tailwind/Radix components
packages/types       Transport types and explicitly named demo fixtures
packages/api-client  Server-compatible authenticated API transport
packages/config      Strict TypeScript configuration
infrastructure       PostgreSQL compose and private Storage provisioning
```

## Decisions

1. Two Next.js applications reflect the future domain boundaries without adding tenant routing or a gateway.
2. One modular NestJS API contains Auth, Users, Courses, Modules, Lessons, Enrollments, Progress, Quiz, Certificates, Documents and Health. Only Week 1 use cases have controllers. Empty modules intentionally reserve ownership rather than exposing pretend endpoints.
3. Supabase owns passwords and sessions. The platform uses server actions and SSR cookies, with proxy refresh. Protected layouts independently call `getUser`; no browser-provided user ID or unverified JWT payload establishes identity.
4. NestJS verifies each bearer token with Supabase Auth. This is intentionally simpler than maintaining custom JWT algorithms/JWKS caching and also works with legacy project signing keys. Database roles are assigned server-side; user metadata only supplies a display name. `GET /users/me` upserts a verified identity without changing its role.
5. Prisma 6 is pinned by the lockfile for the established PostgreSQL client workflow. Do not migrate to Prisma 7 without reviewing its configuration and driver-adapter changes. UUID user IDs match Supabase IDs, but no cross-database foreign key is assumed.
6. Course/module/lesson ordering, unique enrollment, per-enrollment lesson progress, quiz attempts and certificate uniqueness are modeled. Week 2 writes must verify that a lesson belongs to the enrollment's course; the Week 1 schema alone does not enforce that cross-table rule. Completed history should use course archival, not arbitrary deletion.
7. Supabase Storage uses a private `course-resources` bucket. There are no permissive browser object policies. Future API endpoints authorize role/enrollment before issuing short-lived signed URLs; service keys never enter frontend configuration.
8. Demo learning fixtures are deterministic and explicitly labeled. Authenticated identity is real. The database demo student is not a Supabase account and cannot log in. The seed never resets existing user roles or creates credentials.
9. FastAPI only exposes health. No RAG, LLM calls, ingestion jobs, workers or extra microservices are introduced in Week 1.
10. Radix primitives and shadcn-style components with CVA provide accessible dialog/dropdown behavior. CSS design tokens and shared responsive layouts keep the brand consistent without a large UI dependency stack.

## Data and request flow

The platform verifies the current user, then sends the access token server-to-server to `/users/me`. API unavailability yields an explicit sync notice; it never substitutes a fake identity. Dashboard learning data is still isolated demo data, regardless of API availability.

Catalog API endpoints only expose published course metadata and lesson outlines. They do not expose lesson bodies, quiz answers, private documents or student progress. Future protected lesson reads and all mutations must enforce enrollment and role checks before querying content.

## AI direction, Week 3

Instructor upload → authorized NestJS route → private Storage → ingestion request → FastAPI extraction/chunking/embeddings → PostgreSQL + pgvector.

Student question → Next.js → NestJS identity and enrollment checks → FastAPI retrieval → provider adapter → grounded response with sources.

The browser must not call protected AI endpoints directly. Add authenticated service-to-service requests, document scope filters and provider configuration when the feature is implemented.

## Production work before launch

Configure HTTPS domains, exact Supabase redirects, production secrets, backups and monitoring. Add application-specific abuse limits, enrollment authorization and storage access tests as those endpoints ship. Certificates describe SAQR training completion, not a regulatory drone license.

## References

- [Next.js installation and runtime requirements](https://nextjs.org/docs/app/getting-started/installation)
- [Supabase SSR authentication](https://supabase.com/docs/guides/auth/server-side)
- [Supabase server clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Prisma 6 data sources](https://docs.prisma.io/docs/orm/v6/prisma-schema/overview/data-sources)
