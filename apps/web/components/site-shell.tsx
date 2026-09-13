import { Button, Logo, Navigation } from '@saqr/ui';
import { platformUrl } from '../lib/config';
const links = [
  ['Home', '/'],
  ['Training', '/training'],
  ['Agriculture', '/agriculture'],
  ['Platform', '/#platform'],
  ['About', '/about'],
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
      <div className="header-bg">
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
      </div>
      <main id="main">{children}</main>
      <footer className="site-footer container">
        <a href="/" aria-label="SAQR home">
          <Logo />
        </a>
        <span>New perspectives. Grounded in purpose.</span>
        <div className="flex gap-5">
          <a href="/training">Training</a>
          <a href="/agriculture">Agriculture</a>
          <a href="/#platform">Platform</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
        <span>© {new Date().getFullYear()} SAQR</span>
      </footer>
    </>
  );
}
