'use client';
import { ErrorState } from '@saqr/ui';
export default function Error({ reset }: { reset: () => void }) {
  return <ErrorState retry={reset} />;
}
