# Public website inquiries

The existing public site includes `/saqr-cup`, `/waitlist` and `/demo`. The
navigation, homepage announcement, Cup teaser and audience calls to action link
to these pages. Existing platform registration, login and course links remain.

## Submission flow

The forms send JSON to the same-origin Next.js route `/api/website-leads`. This
route forwards to the existing NestJS Core API at `POST /website-leads`, using
server-only `CORE_API_URL` (defaults to `http://localhost:4000`). Browser clients
do not need new database credentials or authentication to express interest.

The API validates each form, requires consent and saves a `WebsiteLead` record
in the existing PostgreSQL database. The additive migration is
`202610010001_website_leads`. Row-level security is enabled without public read
policies; inquiry data is accessed through the existing privileged API database
connection. There is no public endpoint to list inquiries.

Run `pnpm --filter @saqr/core-api db:migrate` in each deployment environment,
then restart/deploy the API and website together. Run the existing Core API
build before deploying. `CORE_API_URL` must point to the API in that environment.

## Forms

- Waitlist: identity, goals and hardware profiling in three validated steps.
  Back navigation preserves values for the current page session.
- Cup: contact details, region, affiliation, available setup and experience.
- Demo: institutional contact, organization type, trainee count, infrastructure
  and optional role/objectives.

Submission is idempotent per normalized email and inquiry kind. Retries preserve
the original profile and registration position. An error never displays a
success screen. Forms include a honeypot; the API uses a bounded per-process
request limit. Production edge protection should account for traffic from the
website proxy and multiple API instances.

For a new waitlist registration, a browser-generated UUID is stored as the
referral code. Only a request presenting that code receives the registration
position and referral link, avoiding disclosure through a duplicate email.
Referral codes from existing waitlist registrations are recorded on new signups;
self-referrals and unrelated inquiry codes are ignored. Sharing links support
copy, WhatsApp and LinkedIn. Referrals do not reorder the queue or promise rewards.
Position is the number of earlier/current waitlist records at signup, not a live
leaderboard. Reloading a page clears form state; it does not recover private
registration data using email alone.

## Launch scope

Forms save inquiries; they do not send email/WhatsApp messages, schedule calendar
appointments, provide simulator downloads or run a tournament scoring system.
The team can review inquiries in the database and follow up manually. Tournament
rules, eligibility, dates, certification sponsorship and operating partners remain
planned until confirmed. The public copy describes these limits explicitly.

Verification includes API tests for required fields, consent, duplicate privacy,
referrals and failed saves. `scripts/smoke.mjs` includes all eight public pages.
