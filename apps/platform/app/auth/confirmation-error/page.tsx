import { EmptyState, Button } from '@saqr/ui';
export default function ConfirmationError() {
  return (
    <main className="container section">
      <EmptyState
        title="This confirmation link has expired"
        description="Try signing in if you already confirmed your account. Otherwise, register again to request a new confirmation email."
      />
      <div className="hero-actions">
        <Button asChild>
          <a href="/login">Sign in</a>
        </Button>
        <Button variant="secondary" asChild>
          <a href="/register">Register</a>
        </Button>
      </div>
    </main>
  );
}
