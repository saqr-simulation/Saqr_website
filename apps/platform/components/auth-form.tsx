'use client';
import { useActionState } from 'react';
import { Button, FormField, Input } from '@saqr/ui';
import { register, signIn, type AuthState } from '../app/auth/actions';
export function AuthForm({
  mode,
  configured,
}: {
  mode: 'login' | 'register';
  configured: boolean;
}) {
  const isRegister = mode === 'register';
  const [state, action, pending] = useActionState<AuthState, FormData>(
    isRegister ? register : signIn,
    {},
  );
  return (
    <form action={action} className="auth-form">
      <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
      <h1>{isRegister ? 'Become a SAQR pilot.' : 'Welcome back, pilot.'}</h1>
      <p className="muted">
        {isRegister
          ? 'Create your account and begin your training journey.'
          : 'Sign in to continue building your skills.'}
      </p>
      {!configured && (
        <div className="notice">
          Account setup is pending. Configure Supabase to enable registration
          and login.
        </div>
      )}
      {state.error && (
        <div className="notice error-notice" role="alert">
          {state.error}
        </div>
      )}
      {state.message && (
        <div className="notice" role="status">
          {state.message} <a href="/login">Go to sign in →</a>
        </div>
      )}
      {isRegister && (
        <FormField id="name" label="Full name">
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            minLength={2}
            maxLength={100}
            required
            disabled={pending}
          />
        </FormField>
      )}
      <FormField id="email" label="Email address">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          maxLength={254}
          required
          disabled={pending}
        />
      </FormField>
      <FormField
        id="password"
        label="Password"
        hint={isRegister ? 'Use at least 8 characters.' : undefined}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          minLength={8}
          maxLength={128}
          required
          disabled={pending}
          aria-describedby={isRegister ? 'password-hint' : undefined}
        />
      </FormField>
      <Button type="submit" disabled={pending || !configured}>
        {pending
          ? 'Please wait…'
          : isRegister
            ? 'Create your account ↗'
            : 'Sign in ↗'}
      </Button>
      <p className="auth-switch">
        {isRegister ? 'Already have an account?' : 'New to SAQR?'}{' '}
        <a href={isRegister ? '/login' : '/register'}>
          {isRegister ? 'Sign in' : 'Start your journey'}
        </a>
      </p>
      <p className="legal-note">
        Week 1 preview. Course metrics are demonstration data. No payment is
        required.
      </p>
    </form>
  );
}
