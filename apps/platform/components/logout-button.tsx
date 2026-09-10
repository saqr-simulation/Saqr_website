'use client';
import { useActionState } from 'react';
import { logout } from '../app/auth/actions';
export function LogoutButton() {
  const [state, action, pending] = useActionState(logout, {});
  return (
    <form action={action}>
      <button className="button button-ghost" disabled={pending}>
        {pending ? 'Signing out…' : 'Log out'}
      </button>
      {state.error && <span role="alert">{state.error}</span>}
    </form>
  );
}
