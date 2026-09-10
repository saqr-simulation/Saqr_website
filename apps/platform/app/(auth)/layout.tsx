import { FieldVisual, Logo } from '@saqr/ui';
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="auth-shell">
      <section className="auth-story">
        <a
          href={process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}
          aria-label="SAQR home"
        >
          <Logo />
        </a>
        <div>
          <p className="eyebrow">
            PURPOSE ON THE GROUND. POSSIBILITY IN THE SKY.
          </p>
          <h2>
            A new perspective.
            <br />A professional future.
          </h2>
          <p className="muted">
            Build the knowledge to make every flight count. Starting with
            agriculture.
          </p>
          <FieldVisual compact />
        </div>
        <p className="muted text-sm">
          Professional learning. Real-world ambition.
        </p>
      </section>
      <section className="auth-panel">{children}</section>
    </main>
  );
}
