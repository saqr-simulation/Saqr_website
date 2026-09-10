import { Button, Logo, Navigation } from '@saqr/ui';
import { platformUrl } from '../lib/config';
const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Training', '/training'],
  ['Agriculture', '/agriculture'],
  ['Why SAQR', '/#why-saqr'],
  ['Contact', '/contact'],
];
function Links() {
  return (
    <Navigation>
      {links.map(([label, href]) => (
        <a key={href} href={href}>
          {label}
        </a>
      ))}
    </Navigation>
  );
}
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header container">
        <a href="/" aria-label="SAQR home">
          <Logo />
        </a>
        <Links />
        <div className="header-actions">
          <a className="login-link" href={platformUrl('/login')}>
            Login
          </a>
          <Button asChild>
            <a href={platformUrl()}>
              Start Training <span aria-hidden="true">↗</span>
            </a>
          </Button>
          <details className="mobile-menu">
            <summary>Menu</summary>
            <Links />
          </details>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer container">
        <a href="/" aria-label="SAQR home">
          <Logo />
        </a>
        <span>New perspectives. Grounded in purpose.</span>
        <div className="flex gap-5">
          <a href="/contact">Contact & partnerships</a>
          <a href={platformUrl('/login')}>Pilot login ↗</a>
        </div>
        <span>© {new Date().getFullYear()} SAQR</span>
      </footer>
    </>
  );
}
