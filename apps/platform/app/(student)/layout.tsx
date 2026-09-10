import { Avatar, Logo, Sidebar } from '@saqr/ui';
import { requireStudent } from '../../lib/session';
import { PlatformNav } from '../../components/platform-nav';
import { LogoutButton } from '../../components/logout-button';
export const dynamic = 'force-dynamic';
export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const student = await requireStudent();
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Sidebar>
        <Logo />
        <PlatformNav />
        <div className="sidebar-bottom">
          <p>YOUR NEXT HORIZON</p>
          <strong className="text-saqr">Agriculture</strong>
          <p className="mt-2">
            Professional skills.
            <br />
            Purposeful progress.
          </p>
        </div>
      </Sidebar>
      <div className="app-main">
        <header className="app-topbar">
          <span className="topbar-path">SAQR PLATFORM / PILOT WORKSPACE</span>
          <div className="user-menu">
            <Avatar name={student.name} />
            <span className="user-name">{student.name}</span>
            <LogoutButton />
          </div>
        </header>
        <main id="main" className="app-content">
          {student.profileStatus === 'unavailable' && (
            <div className="notice" role="status">
              You’re signed in. Profile synchronization is temporarily
              unavailable while the Core API is offline.
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
