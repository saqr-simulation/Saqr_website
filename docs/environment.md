# Environment configuration

The root `.env.example` is an inventory, not an automatically loaded shared file. Next.js reads each application's `.env.local`; Core API/Prisma read `apps/core-api/.env`. Copy examples once and keep them out of source control. Turborepo tracks environment inputs to avoid stale builds.

| App      | Variable                        | Requirement                                              |
| -------- | ------------------------------- | -------------------------------------------------------- |
| web      | `NEXT_PUBLIC_PLATFORM_URL`      | Valid absolute platform URL; defaults to local port 3001 |
| web      | `CONTACT_EMAIL`                 | Optional verified email; enables the contact action      |
| platform | `NEXT_PUBLIC_SUPABASE_URL`      | Required valid project URL for authentication            |
| platform | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required public anon/publishable key                     |
| platform | `NEXT_PUBLIC_WEB_URL`           | Public website URL; defaults to local port 3000          |
| platform | `CORE_API_URL`                  | Server-side API base URL, local port 4000                |
| core-api | `DATABASE_URL`                  | Required PostgreSQL connection URL                       |
| core-api | `DIRECT_URL`                    | Session-mode PostgreSQL URL used for Prisma migrations   |
| core-api | `SUPABASE_URL`                  | Required same Supabase project as platform               |
| core-api | `SUPABASE_PUBLISHABLE_KEY`      | Required public key for Supabase server configuration    |
| core-api | `SUPABASE_JWKS_URL`             | Optional JWKS override; derived from URL when omitted    |
| core-api | `PLATFORM_URL`                  | Exact allowed CORS origin; defaults to port 3001         |
| core-api | `PORT`                          | Integer 1–65535; defaults to 4000                        |

Supabase publishable keys are intentionally browser-safe. A Supabase secret key is not consumed by the Core API's user-authentication flow. Never commit it or prefix it with `NEXT_PUBLIC_`.

Core API uses Zod and fails fast on invalid configuration; messages list variable names without printing values. The platform deliberately renders a setup notice when auth configuration is missing and refuses protected access. Public links are validated. API connection errors produce a sync notice rather than fake account data.

Public Next.js variables are embedded at build time. Rebuild for production domain/key changes. Configure actual SAQR contact details before presenting a publicly launched site.
