import { sitePath } from '../lib/site-path';
import { Button, Logo, Navigation } from '@saqr/ui';
import { platformAvailable } from '../lib/site-path';
import { platformUrl } from '../lib/config';
const links: [string, string][] = [
  ['Home', '/'],
  ['About', '/about'],
  ['Training', '/training'],
  ['Agriculture', '/agriculture'],
  ['SAQR Cup', '/saqr-cup'],
  ['Why SAQR', '/#why-saqr'],
  ['Contact', '/contact'],
];
const footerLinks: [string, string][] = [
  ['Agriculture', '/agriculture'],
  ['Training', '/training'],
  ['The SAQR Cup 2026', '/saqr-cup'],
  ['Early Access Waitlist', '/waitlist'],
  ['About', '/about'],
  ['Contact', '/contact'],
];
function Links({ includeActions = false }: { includeActions?: boolean }) {
  return (
    <Navigation>
      {links.map(([label, href]) => (
        <a key={href} href={sitePath(href)}>
          {label}
        </a>
      ))}
      {includeActions && (
        <>
          <a href={sitePath('/demo')}>Request Demo</a>
          <a href={sitePath('/waitlist')}>Join Waitlist</a>
          {platformAvailable && (
            <a href={platformUrl('/login')}>Pilot Login ↗</a>
          )}
        </>
      )}
    </Navigation>
  );
}
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <a className="announcement-band" href={sitePath('/saqr-cup')}>
        <span className="announcement-badge">COMING UP</span>
        <span>
          SAQR Cup 2026 · Practice for a sponsored pilot certification
          opportunity worth 5,000+ DH.
        </span>
        <strong>Pre-register →</strong>
      </a>
      <div className="site-header-band dark-surface">
        <header className="site-header container">
          <a href={sitePath('/')} aria-label="SAQR home">
            <Logo />
          </a>
          <Links />
          <div className="header-actions">
            {platformAvailable && (
              <a className="login-link" href={platformUrl('/login')}>
                Login
              </a>
            )}
            <a className="demo-link" href={sitePath('/demo')}>
              Request Demo
            </a>
            <Button asChild>
              <a href={sitePath('/waitlist')}>
                Join Waitlist <span aria-hidden="true">↗</span>
              </a>
            </Button>
            <details className="mobile-menu">
              <summary>Menu</summary>
              <Links includeActions />
            </details>
          </div>
        </header>
      </div>
      <main id="main">{children}</main>
      <footer className="footer-band dark-surface">
        <div className="site-footer container">
          <div className="footer-brand">
            <a href={sitePath('/')} aria-label="SAQR home">
              <Logo />
            </a>
            <p className="footer-tagline">
              Crash here, succeed there.
              <br />
              Simulation platform for drone operations.
            </p>
            <span className="morocco-badge">
              <svg
                width="28"
                height="18"
                viewBox="0 0 32 20"
                role="img"
                aria-label="Moroccan flag"
              >
                <rect width="32" height="20" rx="2" fill="#c1272d" />
                <path
                  d="M16 4 19.53 14.85 10.29 8.15 21.71 8.15 12.47 14.85Z"
                  fill="none"
                  stroke="#006233"
                  strokeWidth="1.1"
                />
              </svg>{' '}
              Built &amp; Hosted in Morocco
            </span>
          </div>
          <nav aria-label="Footer navigation" className="footer-navigation">
            <p className="eyebrow">QUICK LINKS</p>
            <div className="footer-links">
              {footerLinks.map(([label, href]) => (
                <a key={href} href={sitePath(href)}>
                  {label}
                </a>
              ))}
            </div>
          </nav>
        </div>
        <p className="container footer-note">
          © 2026 SAQR Technologies. All rights reserved. SAQR simulation
          certificates validate operational proficiency and simulator flight
          hours. Formal regulatory flight licenses must be obtained through
          accredited civil aviation authorities (DGAC).
        </p>
      </footer>
    </>
  );
}
