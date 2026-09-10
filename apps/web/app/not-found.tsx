import { EmptyState } from '@saqr/ui';
export default function NotFound() {
  return (
    <main className="container section">
      <EmptyState
        title="Flight path not found"
        description="This page is unavailable. Return home to continue."
      />
      <a className="button" href="/">
        Return home
      </a>
    </main>
  );
}
