import 'reflect-metadata';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { ExecutionContext } from '@nestjs/common';
import { AuthGuard, bearerToken } from './auth.guard';
test('rejects missing, malformed and ambiguous authorization headers', () => {
  for (const header of [
    undefined,
    '',
    'Basic abc',
    'Bearer',
    'Bearer a b',
    'Bearer a\nb',
  ])
    assert.throws(() => bearerToken(header));
});
test('accepts a single bearer token with case-insensitive scheme', () => {
  assert.equal(bearerToken('Bearer abc.def.xyz'), 'abc.def.xyz');
  assert.equal(bearerToken('bearer token'), 'token');
});
test('guard rejects unverified tokens without attaching identity', async () => {
  const request: { headers: { authorization: string }; identity?: unknown } = {
    headers: { authorization: 'Bearer forged' },
  };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  const guard = new AuthGuard({
    verify: async () => {
      throw new Error('Invalid token');
    },
  });
  await assert.rejects(() => guard.canActivate(context));
  assert.equal(request.identity, undefined);
});
test('guard uses only the verified server identity', async () => {
  const request: { headers: { authorization: string }; identity?: unknown } = {
    headers: { authorization: 'Bearer verified' },
  };
  const identity = {
    id: 'verified-id',
    email: 'pilot@example.invalid',
    name: 'Pilot',
  };
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  const guard = new AuthGuard({
    verify: async (token) => {
      assert.equal(token, 'verified');
      return identity;
    },
  });
  assert.equal(await guard.canActivate(context), true);
  assert.deepEqual(request.identity, identity);
});
