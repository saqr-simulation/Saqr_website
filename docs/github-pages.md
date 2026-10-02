# Public website on GitHub Pages

The workflow in `.github/workflows/pages.yml` builds only `apps/web` and
uploads only `apps/web/out`. The student platform, Core API, and AI service
are not deployed.

1. Push these changes to `master` (the repository's default branch).
2. Open the repository's **Settings → Pages**, and select **GitHub Actions**
   as the build source.
3. Open **Actions → Deploy public website to GitHub Pages** and run the workflow,
   or push another commit to `master`.

The expected address is https://saqr-simulation.github.io/Saqr_website/.
The workflow reads the Pages base path so links and assets work under the
repository path, or at the root when a custom domain is configured.

Optional repository variables under **Settings → Secrets and variables → Actions → Variables**:

- `CONTACT_EMAIL`: a verified inbox for the Contact page's email action.
- `NEXT_PUBLIC_PLATFORM_URL`: a separately hosted student platform URL.
  Leave empty to hide login links and direct platform calls to the waitlist.
- `NEXT_PUBLIC_WEBSITE_LEADS_URL`: a hosted POST endpoint compatible with the
  website's JSON submissions and `{ accepted: true, referralCode?, position? }`
  responses. It must allow requests from your Pages origin through CORS.
  GitHub Pages cannot run the website's server-side form route; without this
  variable, submissions display an availability message and are not saved.

To verify locally from the repository root in PowerShell:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/Saqr_website'
node scripts/build-pages.mjs
```

The script builds an isolated copy without local env files or server API routes.
Normal `pnpm --filter @saqr/web build` and local development retain the form API.
No backend credentials are required for the static build. Public variables are
embedded in the generated website; never put secrets in them.
